import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  console.log(token);
  const protectedRoutes = [
    "/dashboard",
    "/customerlist",
    "/tablebooking",
    "/customerlist/customerprofile/id",
    "/customerlist",
    "/itemlist",
    "/category",
    "/paymentlist",
    "/orderlist",
    "/adminside"
  ];

  // Check if the current route is a protected route
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!token) {
      // Redirect to login page if token is invalid or doesn't exist
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Continue with the request if the token is valid or the route is not protected
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/adminside",
    "/dashboard",
    "/customerlist/customerprofile/id",
    "/customerlist",
    "/tablebooking",
    "/itemlist",
    "/category",
    "/paymentlist",
    "/orderlist",
  ],
};
