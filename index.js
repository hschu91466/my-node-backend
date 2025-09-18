import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import emailRouter from "./routes/email.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- MIDDLEWARE ----------
app.use(
  cors({
    origin: "https://grammahurry.fun", // replace with your frontend URL,
    credentials: true,
  })
);
app.use(express.json());

// Log every API request
app.use("/api", (req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- COOKIES ----------
app.use(cookieParser());

// ---------- API ROUTES ----------
app.use("/api/email", emailRouter);

// Handle 404 for unknown API routes
app.use("/api/*", (req, res) => {
  console.warn(`⚠️  API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "API route not found" });
});

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack || err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
