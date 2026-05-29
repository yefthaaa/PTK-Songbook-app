import { NextResponse, type NextRequest } from "next/server";
import { signOut } from "@/lib/auth/helpers";

function loginRedirect(request: NextRequest) {
  return NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
}

/**
 * GET /admin/logout — untuk link langsung dari browser
 * POST /admin/logout — dari form di sidebar admin
 */
export async function GET(request: NextRequest) {
  await signOut();
  return loginRedirect(request);
}

export async function POST(request: NextRequest) {
  await signOut();
  return loginRedirect(request);
}
