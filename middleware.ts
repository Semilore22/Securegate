import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // 1. Rate limiting for sign-in
  if (path === "/api/auth/callback/credentials" && req.method === "POST") {
    try {
      const { ratelimit } = await import("./lib/rate-limit")
      const ip = req.ip ?? "127.0.0.1"
      const { success, limit, reset, remaining } = await ratelimit.limit(`signin_ratelimit_${ip}`)
      
      if (!success) {
        return NextResponse.json(
          { error: "Too many login attempts. Please try again later." },
          { 
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString()
            }
          }
        )
      }
    } catch (e) {
      console.error("Sign-in rate limiting error:", e)
    }
  }

  // 2. Rate limiting for forgot password
  if (path === "/api/forgot-password") {
    try {
      const { ratelimit } = await import("./lib/rate-limit")
      const ip = req.ip ?? "127.0.0.1"
      const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`)
      
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { 
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString()
            }
          }
        )
      }
    } catch (e) {
      console.error("Rate limiting error:", e)
    }
  }

  // 3. Protect dashboard route
  if (path.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.redirect(new URL("/auth?mode=login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/forgot-password", "/api/auth/callback/credentials", "/dashboard/:path*"],
}
