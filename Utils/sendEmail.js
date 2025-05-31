import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function sendEmail({ from, to, subject, html }) {
  try {
    await transporter.sendMail({
      from: `"Book Form Submission" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      replyTo: from,
    });
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
}
