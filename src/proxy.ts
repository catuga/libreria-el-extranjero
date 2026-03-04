import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isLoginPage = req.nextUrl.pathname === "/admin/login"

  if (isAdminRoute && !isLoginPage && !req.auth) {
    const loginUrl = new URL("/admin/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Si ya está autenticado y va al login, redirigir al dashboard
  if (isLoginPage && req.auth) {
    const dashboardUrl = new URL("/admin", req.url)
    return NextResponse.redirect(dashboardUrl)
  }
})

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
