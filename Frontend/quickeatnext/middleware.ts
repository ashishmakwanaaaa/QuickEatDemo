import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  const cookiestore = cookies();
  const token = cookiestore.get("token")?.value || "";
  const secretKey = new TextEncoder().encode("hbuhvbevbeuivbiurjr");

  const decode = await jose.jwtVerify(token, secretKey, {
    algorithms: ["HS256"],
  });
  const role = decode.payload.isadmin;
  console.log("role", role);
  localStorage.setItem("role", `${role}`);
  if (role) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

export const config = {
  matcher: "/abcd",
};
