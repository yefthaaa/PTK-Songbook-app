import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";
import { getProfileFromSupabase } from "@/lib/auth/middleware-profile";
import { canAccessAdmin, canManageUsers } from "@/lib/auth/permissions";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createSupabaseMiddlewareClient(request, response);

  // Refresh session — writes updated cookies onto `response`
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminLogoutPage = pathname === "/admin/logout";
  const isAccessDeniedPage = pathname === "/admin/akses-ditolak";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminLoginPage || isAdminLogoutPage) {
    if (isAdminLoginPage && user) {
      const profile = await getProfileFromSupabase(supabase, user.id);
      if (profile && canAccessAdmin(profile)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return response;
  }

  if (!isAdminRoute) {
    return response;
  }

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const profile = await getProfileFromSupabase(supabase, user.id);

  if (!profile) {
    const deniedUrl = new URL("/admin/akses-ditolak", request.url);
    deniedUrl.searchParams.set("reason", "profile_missing");
    return NextResponse.redirect(deniedUrl);
  }

  if (!canAccessAdmin(profile) && !isAccessDeniedPage) {
    return NextResponse.redirect(new URL("/admin/akses-ditolak", request.url));
  }

  if (pathname.startsWith("/admin/users") && !canManageUsers(profile)) {
    return NextResponse.redirect(new URL("/admin/akses-ditolak", request.url));
  }

  const isNewSong = pathname === "/admin/songs/new";
  const isEditSong = /^\/admin\/songs\/[^/]+\/edit$/.test(pathname);

  if ((isNewSong || isEditSong) && !canAccessAdmin(profile)) {
    return NextResponse.redirect(new URL("/admin/akses-ditolak", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
