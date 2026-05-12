import { NextResponse } from "next/server";
import { signOut } from "@/lib/auth/helpers";

/**
 * POST /admin/logout
 * Signs out the current user and redirects to the login page.
 * Called via a form with method="post" action="/admin/logout".
 */
export async function POST() {
  await signOut();
  return NextResponse.redirect(
    new URL("/admin/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
    { status: 303 },
  );
}
