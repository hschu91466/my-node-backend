// backend/routes/email.js
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Create transporter with Hostinger SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g., "smtp.hostinger.com"
      port: process.env.EMAIL_PORT, // e.g., 465 or 587
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER, // your Hostinger email
        pass: process.env.EMAIL_PASS, // your email password
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, // must be your Hostinger email
      to: process.env.EMAIL_USER, // same email or another Hostinger account
      subject: `New message from ${name}`,
      text: message,
      html: `<p><b>Name:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Message:</b> ${message}</p>`,
    });

    console.log("Email sent: ", info.messageId); // logs messageId on success
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

export default router;
