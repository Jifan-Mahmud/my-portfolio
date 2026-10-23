require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { connectDB } = require("./src/config/db");
const errorHandler = require("./src/middlewares/errorHandler");

// Route imports
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const skillRoutes = require("./src/routes/skillRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const experienceRoutes = require("./src/routes/experienceRoutes");
const serviceRoutes = require("./src/routes/serviceRoutes");
const testimonialRoutes = require("./src/routes/testimonialRoutes");
const certificateRoutes = require("./src/routes/certificateRoutes");
const blogRoutes = require("./src/routes/blogRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL,
  "https://my-portfolio-client-blue.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl/server requests)
      if (!origin) return callback(null, true);
      
      // Explicit allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Localhost origins with any port for development
      if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Vercel deployment preview and production domains
      if (/^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for untrusted origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Serverless-safe MongoDB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection error on request:", error);
    next(error);
  }
});

// Root health check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "B.M. Jifan Mahmud Portfolio API is running smoothly 🚀",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server after connecting to MongoDB (only for local/standalone environments, not Vercel serverless)
async function startServer() {
  try {
    await connectDB();
    if (!process.env.VERCEL) {
      app.listen(port, () => {
        console.log(`🚀 Portfolio Server is running on http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
}

startServer();

module.exports = app;