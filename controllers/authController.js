import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const { sign } = jwt;

const setTokenCookie = (res, userId) => {
  const token = sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 3600000, // 1 hour
  });
  return token;
};
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ fullName, email, password: hashedPassword });
  await user.save();

  const token = setTokenCookie(res, user._id);

  res.status(201).json({
    message: "User registered",
    user: { id: user._id, fullName: user.fullName, email: user.email },
    token,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = setTokenCookie(res, user._id);

  res.json({
    message: "Login successful",
    user: { id: user._id, fullName: user.fullName, email: user.email },
    token,
  });
};

export const getProfile = async (req, res) => {
  try {
    console.log("Cookies received:", req.cookies);
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, password, profilePic, imagePosition } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (profilePic) updateData.profilePic = profilePic;
    if (imagePosition) updateData.imagePosition = imagePosition;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Failed to update user", error: error.message });
    } else {
      console.error("Error after headers sent:", error);
    }
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.json({ message: "Logout successful" });
};
