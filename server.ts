import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

app.use(cors());
app.use(express.json());

// MongoDB connection
let MONGODB_URI = process.env.MONGODB_URI;

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

if (!MONGODB_URI) {
  console.warn("⚠️ MONGODB_URI is not defined in environment variables. Data will not be saved to MongoDB.");
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      if (err.message.includes("IP that isn't whitelisted")) {
         console.warn("⚠️ Please go to your MongoDB Atlas dashboard -> Network Access -> Add IP Address, and choose 'Allow Access From Anywhere' (0.0.0.0/0)");
      }
    });
}

// Mongoose Models
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: String,
  phone: String,
  address: String
});
const User = mongoose.model('User', UserSchema);

const OrderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  totalAmount: Number,
  status: String,
  shippingInfo: Object,
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

const WishlistSchema = new mongoose.Schema({
  userId: String,
  productIds: [String]
});
const Wishlist = mongoose.model('Wishlist', WishlistSchema);

// --- APIs ---

// Auth
app.post('/api/auth/register', async (req, res) => {
  if (!mongoose.connection.readyState) return res.status(500).json({ error: "DB not connected. Please ensure your MongoDB Atlas Network Access is set to allow access from anywhere (0.0.0.0/0)" });
  try {
    const { email, password, displayName } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const userId = new mongoose.Types.ObjectId().toString();
    user = new User({ email, password: hashedPassword, displayName, userId });
    await user.save();
    
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { uid: userId, email, displayName } });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  if (!mongoose.connection.readyState) return res.status(500).json({ error: "DB not connected. Please ensure your MongoDB Atlas Network Access is set to allow access from anywhere (0.0.0.0/0)" });
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ id: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { uid: user.userId, email: user.email, displayName: user.displayName } });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.get('/api/auth/me', async (req, res) => {
  if (!mongoose.connection.readyState) return res.status(503).json({ error: "DB not connected" });
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });
    
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ userId: decoded.id });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({ user: { uid: user.userId, email: user.email, displayName: user.displayName } });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Users
app.get('/api/users/:userId', async (req, res) => {
  if (!mongoose.connection.readyState) return res.status(503).json({ error: "DB not connected" });
  try {
    const user = await User.findOne({ userId: req.params.userId });
    res.json(user || {});
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

app.post('/api/users/:userId', async (req, res) => {
  if (!mongoose.connection.readyState) return res.status(503).json({ error: "DB not connected" });
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
  if (!mongoose.connection.readyState) return res.status(503).json({ error: "DB not connected" });
  try {
    const wl = await Wishlist.findOne({ userId: req.params.userId });
    res.json(wl ? wl.productIds : []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

app.post('/api/wishlist/:userId', async (req, res) => {
  if (!mongoose.connection.readyState) return res.status(503).json({ error: "DB not connected" });
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
  if (!mongoose.connection.readyState) return res.status(503).json({ error: "DB not connected" });
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get('/api/admin/orders', async (req, res) => {
  if (!mongoose.connection.readyState) return res.status(503).json({ error: "DB not connected" });
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
});

app.post('/api/orders', async (req, res) => {
  if (!mongoose.connection.readyState) return res.status(503).json({ error: "DB not connected" });
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.put('/api/orders/:orderId/status', async (req, res) => {
  if (!mongoose.connection.readyState) return res.status(503).json({ error: "DB not connected" });
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

app.delete('/api/orders/:orderId', async (req, res) => {
  if (!mongoose.connection.readyState) return res.status(503).json({ error: "DB not connected" });
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
