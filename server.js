import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import emailRouter from "./routes/email.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

// ---------- Enable cookie parser ----------
app.use(cookieParser());

// CORS setup to allow frontend on Hostinger
app.use(
  cors({
    origin: "https://grammahurry.fun",
    credentials: true,
  })
);

//Parse JSON bodies
app.use(express.json());

// mount API routes
app.use("/api/email", emailRouter);
app.use("/api/auth", authRouter);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
