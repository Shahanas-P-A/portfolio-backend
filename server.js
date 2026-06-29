import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
dotenv.config();

// Connect to MongoDB
connectDB();
setTimeout(() => {
  console.log("DATABASE:", mongoose.connection.name);
}, 3000);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/contact", contactRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Portfolio Backend is Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});