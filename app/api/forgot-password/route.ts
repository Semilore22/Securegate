import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email },
    })

    // We still return 200 even if user not found to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: "If an account exists with that email, we've sent a reset link." }, { status: 200 })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Remove existing tokens for this email
    await db.passwordResetToken.deleteMany({
      where: { email },
    })

    await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ message: "If an account exists with that email, we've sent a reset link." }, { status: 200 })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
