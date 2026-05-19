import nodemailer from "nodemailer"
import { getVerificationEmailHtml, getPasswordResetEmailHtml } from "./email-templates"

const domain = process.env.NEXTAUTH_URL || "http://localhost:3000"

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/verify-email?token=${token}`

  console.log("\n=========================================================================")
  console.log("✉️  [EMAIL SERVICE] - GENERATED VERIFICATION LINK")
  console.log(`👤  To:      ${email}`)
  console.log(`🔗  Link:    ${confirmLink}`)
  console.log("=========================================================================\n")

  // Check if SMTP is configured
  const hasSMTP = process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SMTP_PASSWORD !== "YOUR_GMAIL_APP_PASSWORD_HERE";

  if (!hasSMTP) {
    console.warn("⚠️  [EMAIL SERVICE] - SMTP credentials not configured. Email NOT sent.");
    console.warn("👉 Please set SMTP_USER and SMTP_PASSWORD in .env.local to send real emails.");
    return { success: false, error: "SMTP credentials not configured", confirmLink }
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"SecureGate" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email address",
      html: getVerificationEmailHtml(confirmLink),
    })

    console.log("✅ [EMAIL SERVICE] - Verification email sent successfully!")
    return { success: true, confirmLink }
  } catch (error: any) {
    console.error("❌ [EMAIL SERVICE] - Nodemailer SMTP Error:", error)
    return { success: false, error: error.message || "SMTP error", confirmLink }
  }
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/reset-password?token=${token}`

  console.log("\n=========================================================================")
  console.log("✉️  [EMAIL SERVICE] - GENERATED PASSWORD RESET LINK")
  console.log(`👤  To:      ${email}`)
  console.log(`🔗  Link:    ${resetLink}`)
  console.log("=========================================================================\n")

  // Check if SMTP is configured
  const hasSMTP = process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SMTP_PASSWORD !== "YOUR_GMAIL_APP_PASSWORD_HERE";

  if (!hasSMTP) {
    console.warn("⚠️  [EMAIL SERVICE] - SMTP credentials not configured. Email NOT sent.");
    console.warn("👉 Please set SMTP_USER and SMTP_PASSWORD in .env.local to send real emails.");
    return { success: false, error: "SMTP credentials not configured", resetLink }
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"SecureGate" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset your password",
      html: getPasswordResetEmailHtml(resetLink),
    })

    console.log("✅ [EMAIL SERVICE] - Password reset email sent successfully!")
    return { success: true, resetLink }
  } catch (error: any) {
    console.error("❌ [EMAIL SERVICE] - Nodemailer SMTP Error:", error)
    return { success: false, error: error.message || "SMTP error", resetLink }
  }
}

