import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import emailRouter from "./routes/email.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["http://localhost:3000", "https://grammahurry.fun"];

// ---------- MIDDLEWARE ----------

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ---------- LOGGING ----------
app.use("/api", (req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- ROUTES ----------
app.use("/api/email", emailRouter);
app.use("/api/auth", authRouter);

// ---------- SOCKET.IO ----------
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ---------- 404 HANDLER ----------
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
server.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
