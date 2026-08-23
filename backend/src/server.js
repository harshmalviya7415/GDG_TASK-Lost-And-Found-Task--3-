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

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());


connectDb().catch((err) => console.error("Initial database connection error:", err.message));


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
