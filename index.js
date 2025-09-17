// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import emailRouter from "./routes/email.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// Log every API request
app.use("/api", (req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- API ROUTES ----------
app.use("/api/email", emailRouter);

// Handle 404 for unknown API routes
app.use("/api/*", (req, res) => {
  console.warn(`⚠️  API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "API route not found" });
});

// ---------- SERVE REACT FRONTEND ----------
const frontendBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendBuildPath));

// Catch-all: serve React's index.html for non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
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
