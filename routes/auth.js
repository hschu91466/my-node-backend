import { Router } from "express";
import {
  signup,
  login,
  profile,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = Router();

router.get("/check-cookie", (req, res) => {
  console.log("Cookies:", req.cookies);
  res.json({ cookies: req.cookies });
});

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

// Protected route
router.get("/profile", verifyToken, profile);

// Logout route
router.post("/logout", logout);

// Check authentication status route
router.get("/check-auth", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ authenticated: true, user });
  } catch (error) {
    res.status(500).json({
      authenticated: false,
      message: "Failed to verify authentication",
      error: error.message,
    });
  }
});

export default router;
