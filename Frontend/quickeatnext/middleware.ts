import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  const cookiestore = cookies();
  console.log(cookiestore, "vcdc");
  const token = cookiestore.get("token")?.value || "";
  if (token === "") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

export const config = {
  matcher: ["/abcd"],
};
