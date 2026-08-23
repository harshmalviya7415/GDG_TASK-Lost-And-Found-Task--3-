const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db");
const itemRoutes = require("./routes/itemRoutes");
const workflowRoutes = require("./routes/workflowRoutes");
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://gdg-task-lost-and-found-task-3.vercel.app"
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Pre-connect database on startup
connectDb().catch((err) => console.error("Initial database connection error:", err.message));

// Middleware to ensure database connection is ready
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    res.status(500).json({
      error: "Database connection failed. If you are hosting on Vercel, make sure that 0.0.0.0/0 (allow all IPs) is whitelisted in your MongoDB Atlas Network Access settings.",
      details: error.message
    });
  }
});

app.use("/api/items", itemRoutes);
app.use("/api/workflows", workflowRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", async (req, res) => {
  res.send("backend is running");
});

const PORT = process.env.PORT || 1500;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Started at ${PORT}`);
});
