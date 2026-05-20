import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

if (process.env.NODE_ENV === "production") {
  console.log("NextAuth environment check:", {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    DATABASE_URL: !!process.env.DATABASE_URL,
  })
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
