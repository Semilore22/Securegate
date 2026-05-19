import { Resend } from "resend"
import { getVerificationEmailHtml, getPasswordResetEmailHtml } from "./email-templates"

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXTAUTH_URL || "http://localhost:3000"

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/verify-email?token=${token}`

  await resend.emails.send({
    from: "SecureGate <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email address",
    html: getVerificationEmailHtml(confirmLink),
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/reset-password?token=${token}`

  await resend.emails.send({
    from: "SecureGate <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: getPasswordResetEmailHtml(resetLink),
  })
}

