import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = getSupabaseMiddlewareClient(request, response);

  // Refresh session — this keeps the cookie alive between requests.
  // IMPORTANT: do not remove this call; without it the session expires silently.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // ── Admin route protection ───────────────────────────────────────────────
  // /admin/login and /admin/logout are always public.
  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminLogoutPage = pathname === "/admin/logout";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !isAdminLoginPage && !isAdminLogoutPage && !session) {
    // Unauthenticated → redirect to login, preserving the intended destination.
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user visiting /admin/login → send to dashboard.
  if (isAdminLoginPage && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT:
     * - _next/static  (Next.js static assets)
     * - _next/image   (image optimization)
     * - favicon.ico
     * - public files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
