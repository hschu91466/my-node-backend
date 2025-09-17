import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function sendTest() {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"Test Sender" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_ADD_EMAIL, // where the test goes
      subject: "✅ Hostinger SMTP Test",
      text: "This is a test email sent using Hostinger SMTP and Nodemailer!",
      html: "<h2>It works! 🎉</h2><p>This is a test email from your Node.js app.</p>",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

sendTest();
