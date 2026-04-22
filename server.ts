import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

app.use(cors());
app.use(express.json());

// MongoDB connection
let MONGODB_URI = process.env.MONGODB_URI;
let dbConnectionError = "";

if (MONGODB_URI && MONGODB_URI.startsWith('mongodb+srv://')) {
  try {
    const [prefix, rest] = MONGODB_URI.split('mongodb+srv://');
    const atIndices = [];
    for (let i = 0; i < rest.length; i++) {
      if (rest[i] === '@') atIndices.push(i);
    }
    // if there are multiple @, the last one is the host separator
    if (atIndices.length > 1) {
      const lastAtIndex = atIndices[atIndices.length - 1];
      const credentials = rest.substring(0, lastAtIndex);
      const hostInfo = rest.substring(lastAtIndex);
      
      const colonIndex = credentials.indexOf(':');
      if (colonIndex !== -1) {
        const user = credentials.substring(0, colonIndex);
        let pass = credentials.substring(colonIndex + 1);
        pass = decodeURIComponent(pass); // decode just in case they partially encoded
        MONGODB_URI = 'mongodb+srv://' + encodeURIComponent(user) + ':' + encodeURIComponent(pass) + hostInfo;
      }
    }
  } catch (err) {
    console.error("Failed to parse MongoDB URI", err);
  }
}

let connectionPromise: Promise<any> | null = null;

// Disable Mongoose buffering to prevent Vercel 10s timeouts 
// when the MongoDB connection fails (e.g. un-whitelisted IP)
mongoose.set('bufferCommands', false);

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  
  if (!MONGODB_URI) {
    dbConnectionError = "MONGODB_URI is extremely missing in your environment variables. Please add it to your Netlify/Vercel settings.";
    console.warn("⚠️ MONGODB_URI is not defined in environment variables. Data will not be saved to MongoDB.");
    return;
  }
  
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000, // Fail fast in serverless
      connectTimeoutMS: 4000, // Abort TCP connection attempts fast
      socketTimeoutMS: 4000,
    }).then((m) => {
      console.log("Connected to MongoDB successfully!");
      dbConnectionError = "";
      return m;
    }).catch((err: any) => {
      console.error("MongoDB connection error:", err.message);
      if (err.message.includes("IP that isn't whitelisted") || err.message.includes("ENOTFOUND")) {
         dbConnectionError = "MongoDB Atlas Network Access issue. Please ensure your IP whitelist includes 0.0.0.0/0 (Allow Access From Anywhere).";
         console.warn("⚠️ Please go to your MongoDB Atlas dashboard -> Network Access -> Add IP Address, and choose 'Allow Access From Anywhere' (0.0.0.0/0)");
      } else {
         dbConnectionError = "Failed to connect to MongoDB: " + err.message;
      }
      connectionPromise = null;
      return null;
    });
  }
  
  await connectionPromise;
}

// Automatically initiate connection on startup
connectDB();

app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    await connectDB();
  }
  next();
});

// Mongoose Models
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: String,
  phone: String,
  address: String
});
const User = (mongoose.models.User as any) || mongoose.model('User', UserSchema);

const OrderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  totalAmount: Number,
  status: String,
  shippingInfo: Object,
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now }
});
const Order = (mongoose.models.Order as any) || mongoose.model('Order', OrderSchema);

const WishlistSchema = new mongoose.Schema({
  userId: String,
  productIds: [String]
});
const Wishlist = (mongoose.models.Wishlist as any) || mongoose.model('Wishlist', WishlistSchema);

// --- APIs ---

// Auth

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  // We'll pass the dynamic redirect URI from the client
);

app.get('/api/auth/google/url', (req, res) => {
  const { redirectUri } = req.query;
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: "GOOGLE_CLIENT_ID not configured" });
  }
  const url = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    redirect_uri: typeof redirectUri === 'string' ? redirectUri : undefined
  });
  res.json({ url });
});

app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
  const { code, state } = req.query; // we pass redirect URL via state if needed, or rely on URL
  const redirectUri = req.query.redirectUri || (req.headers.referer ? new URL('/auth/callback', req.headers.referer).toString() : '');
  
  try {
    // If not exchanging token server-side, we can just pass the code to the parent window
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', code: '${code}' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (err: any) {
    res.send(`<html><body><p>OAuth Error: ${err.message}</p></body></html>`);
  }
});

app.post('/api/auth/google/verify', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: dbConnectionError || "DB not connected" });
  try {
    const { code, redirectUri } = req.body;
    const { tokens } = await googleClient.getToken({ code, redirect_uri: redirectUri });
    googleClient.setCredentials(tokens);
    
    // Get user info
    const oauth2 = googleClient.request({ url: 'https://www.googleapis.com/oauth2/v2/userinfo' });
    const userInfo = (await oauth2).data as any;
    
    const email = userInfo.email;
    const displayName = userInfo.name;
    
    // Find or create user
    let user = await User.findOne({ email });
    const userId = user ? user.userId : new mongoose.Types.ObjectId().toString();
    
    if (!user) {
      // random password for oauth users
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), salt);
      user = new User({ email, password: hashedPassword, displayName, userId });
      await user.save();
    }
    
    const token = jwt.sign({ id: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { uid: user.userId, email: user.email, displayName: user.displayName, isAdmin: user.email === 'harshgupta07h@gmail.com' } });
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ error: "Google verification failed: " + error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: dbConnectionError || "DB not connected" });
  try {
    const { email: rawEmail, password, displayName } = req.body;
    if (!rawEmail || !password) return res.status(400).json({ error: "Email and password are required" });
    const email = rawEmail.toLowerCase();
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const userId = new mongoose.Types.ObjectId().toString();
    user = new User({ email, password: hashedPassword, displayName, userId });
    await user.save();
    
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { uid: userId, email, displayName, isAdmin: email === 'harshgupta07h@gmail.com' } });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: dbConnectionError || "DB not connected" });
  try {
    const { email: rawEmail, password } = req.body;
    if (!rawEmail || !password) return res.status(400).json({ error: "Email and password are required" });
    const email = rawEmail.toLowerCase();
    let user = await User.findOne({ email });
    
    // Special Override for Admin to prevent lockout if Google Auth was used originally
    if (email === 'harshgupta07h@gmail.com' && password === 'Admin@123') {
      if (!user) {
        const userId = new mongoose.Types.ObjectId().toString();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ email, password: hashedPassword, displayName: 'Admin', userId });
        await user.save();
      }
      const token = jwt.sign({ id: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { uid: user.userId, email: user.email, displayName: user.displayName, isAdmin: true } });
    }
    
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ id: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { uid: user.userId, email: user.email, displayName: user.displayName, isAdmin: user.email === 'harshgupta07h@gmail.com' } });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.get('/api/auth/me', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: dbConnectionError || "DB not connected" });
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });
    
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ userId: decoded.id });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({ user: { uid: user.userId, email: user.email, displayName: user.displayName, isAdmin: user.email === 'harshgupta07h@gmail.com' } });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Users
app.get('/api/users/:userId', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: "DB not connected" });
  try {
    const user = await User.findOne({ userId: req.params.userId });
    res.json(user || {});
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

app.post('/api/users/:userId', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: "DB not connected" });
  try {
    const { displayName, phone, address } = req.body;
    let user = await User.findOne({ userId: req.params.userId });
    if (user) {
      if (displayName !== undefined) user.displayName = displayName;
      if (phone !== undefined) user.phone = phone;
      if (address !== undefined) user.address = address;
      await user.save();
    } else {
      user = new User({ userId: req.params.userId, displayName, phone, address });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to save user profile" });
  }
});

// Wishlist
app.get('/api/wishlist/:userId', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: "DB not connected" });
  try {
    const wl = await Wishlist.findOne({ userId: req.params.userId });
    res.json(wl ? wl.productIds : []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

app.post('/api/wishlist/:userId', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: "DB not connected" });
  try {
    const { productIds } = req.body;
    let wl = await Wishlist.findOne({ userId: req.params.userId });
    if (wl) {
      wl.productIds = productIds;
      await wl.save();
    } else {
      wl = new Wishlist({ userId: req.params.userId, productIds });
      await wl.save();
    }
    res.json(wl.productIds);
  } catch (error) {
    res.status(500).json({ error: "Failed to save wishlist" });
  }
});

// Orders
app.get('/api/orders/:userId', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: "DB not connected" });
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get('/api/admin/orders', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: "DB not connected" });
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
});

app.post('/api/orders', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: "DB not connected" });
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.put('/api/orders/:orderId/status', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: "DB not connected" });
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

app.delete('/api/orders/:orderId', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: "DB not connected" });
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamically import vite safely
    const viteModule = await import('vite');
    const createViteServer = viteModule.createServer;
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL && !process.env.NETLIFY && !process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL && !process.env.NETLIFY && !process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  startServer();
}

export default app;
