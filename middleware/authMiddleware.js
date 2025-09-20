import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  console.log("Incoming token:", token); // ✅ Add this

  if (!token) {
    console.warn("❌ No token found in cookies or headers");
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded); // ✅ Add this
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
