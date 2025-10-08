require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const autoSeed = require("./utils/autoSeed");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { generalLimiter, authLimiter, adminLimiter } = require("./middleware/rateLimiter");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const houseRoutes = require("./routes/houseRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/payments");

const app = express();

// Connect DB and auto-seed if empty
connectDB().then(() => {
  autoSeed(); // Auto seed data if database is empty
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
})); // Security headers with CORS for images
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // Tăng limit cho upload ảnh
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from frontend assets
const path = require('path');
const assetsPath = path.join(__dirname, '../frontend/src/assets');
console.log('📁 Serving static files from:', assetsPath);

// Log all requests to /assets for debugging
app.use('/assets', (req, res, next) => {
  console.log('🖼️ Asset request:', req.url);
  next();
});

app.use('/assets', express.static(assetsPath));

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", generalLimiter, userRoutes);
app.use("/api/houses", generalLimiter, houseRoutes);
app.use("/api/bookings", generalLimiter, bookingRoutes);
app.use("/api/payments", generalLimiter, paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running...");
});

app.get("/api/test", (req, res) => {
  console.log("✅ API /api/test được gọi từ FE");
  res.json({ success: true, message: "Backend connected!" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
