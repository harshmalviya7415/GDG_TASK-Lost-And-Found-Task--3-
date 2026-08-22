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

app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

connectDb();

app.use("/api/items", itemRoutes);
app.use("/api/workflows", workflowRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", async (req, res) => {
  res.send("backend is running");
});

const PORT = process.env.PORT || 1500;
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
