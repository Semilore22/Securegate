import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import * as bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email },
          })

          console.log("NextAuth authorize", {
            email: credentials.email,
            userFound: !!user,
            emailVerified: user?.emailVerified ?? false,
          })

          if (!user || !user.password) {
            throw new Error("User not found")
          }

          if (!user.emailVerified) {
            throw new Error("Please verify your email to log in")
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error("Invalid credentials")
          }

          return {
            id: user.id,
            email: user.email,
          }
        } catch (error) {
          console.error("NextAuth authorize error:", error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) {
        session.user.email = token.email as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
      }
      return token
    },
  },
  debug: process.env.NEXTAUTH_DEBUG === "true",
  logger: {
    error(code, metadata) {
      console.error("NextAuth error", code, metadata)
    },
    warn(code) {
      console.warn("NextAuth warning", code)
    },
    debug(code, metadata) {
      if (process.env.NEXTAUTH_DEBUG === "true") {
        console.log("NextAuth debug", code, metadata)
      }
    },
  },
}
