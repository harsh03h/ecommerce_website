import express from 'express';
import Stripe from 'stripe';
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

// Global error handling middleware to ensure JSON responses
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// MongoDB connection
let MONGODB_URI = process.env.MONGODB_URI;
let dbConnectionError = "";

if (MONGODB_URI && MONGODB_URI.startsWith('mongodb+srv://')) {
  try {
    const [, rest] = MONGODB_URI.split('mongodb+srv://');
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

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    connectDB().then(() => next()).catch(next);
  } else {
    next();
  }
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
  paymentDetails: Object, // To store UPI Transaction ID or Stripe ID
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

app.get(['/api/auth/callback', '/api/auth/callback/'], async (req, res) => {
  const { code } = req.query; // we pass redirect URL via state if needed, or rely on URL
  
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
    
    const token = jwt.sign({ id: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { uid: user.userId, email: user.email, displayName: user.displayName, isAdmin: user.email === 'harshgupta07h@gmail.com' } });
  } catch (error: any) {
    console.error("Registration error:", error.message || error);
    res.status(500).json({ error: "Registration failed: " + (error.message || 'Unknown error') });
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
    if (!isMatch) {
      if (email === 'harshgupta07h@gmail.com') {
        return res.status(400).json({ error: "Invalid admin password. Please use 'Admin@123' if you are trying to access the admin account." });
      }
      return res.status(400).json({ error: "Invalid email or password. If you originally signed in with Google, please use the 'Continue with Google' button below." });
    }
    
    const token = jwt.sign({ id: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { uid: user.userId, email: user.email, displayName: user.displayName, isAdmin: user.email === 'harshgupta07h@gmail.com' } });
  } catch (error: any) {
    console.error("Login error:", error.message || error);
    res.status(500).json({ error: "Login failed: " + (error.message || 'Unknown error') });
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
  } catch (error: any) {
    console.error("Auth me error:", error.message || error);
    res.status(401).json({ error: "Invalid token: " + (error.message || 'Unknown error') });
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

app.get('/api/admin/orders', async (_req, res) => {
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-04-22.dahlia' as any
});

app.post('/api/create-checkout-session', async (req, res) => {
  const { orderId } = req.body;
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("Stripe is not configured. Mocking successful payment redirect for testing.");
    return res.json({ 
      id: 'mock_session_' + Date.now(), 
      url: `${req.headers.origin}/?payment_success=true&order_id=${orderId}` 
    });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Build line items
    const lineItems = order.items.map((item: any) => {
      // Find product to get name
      // We pass the price in cents
      // Wait, we need to pass a description for variants
      const description = item.variants && Object.keys(item.variants).length > 0
        ? Object.entries(item.variants).map(([k, v]) => `${k}: ${v}`).join(', ')
        : 'Store Item';

      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Product ID: ${item.productId}`, // Real product name should ideally be fetched from DB, but we only have it in UI mostly.
            description,
          },
          unit_amount: Math.round((order.totalAmount / order.items.reduce((acc: number, i: any) => acc + i.quantity, 0)) * 100), // Approximation if we don't send individual prices
        },
        quantity: item.quantity,
      };
    });

    // Actually, passing just one line item for the complete order is safer to match total exactly
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Order #${orderId}`,
              description: 'Payment for Harsh Emporium Order',
            },
            unit_amount: Math.round(order.totalAmount * 100),
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/?payment_success=true&order_id=${orderId}`,
      cancel_url: `${req.headers.origin}/?payment_cancelled=true&order_id=${orderId}`,
      client_reference_id: orderId.toString(),
    });

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error.message || error);
    res.status(500).json({ error: 'Failed to create checkout session: ' + (error.message || 'Unknown error') });
  }
});

// Create order update endpoint for successful payments
app.post('/api/orders/:orderId/verify-payment', async (req, res) => {
  try {
    // In a real app we'd verify the Stripe session using the ID from the query
    // const session = await stripe.checkout.sessions.retrieve(req.query.session_id as string);
    // if (session.payment_status === 'paid') { ... }
    
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status: 'processing', paymentMethod: 'card_paid' }, { new: true });
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to verify payment" });
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
    app.get('*all', (_req, res) => {
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
