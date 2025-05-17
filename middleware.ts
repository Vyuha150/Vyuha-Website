import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode"; // Fix import for jwtDecode

export function middleware(req: Request) {
  // Define routes that do not require authentication
  const publicRoutes = [
    "/projects/:path*",
    "/events/:path*",
    "/club-partner/:path*",
    "/origin/:path*",
    "/membership/:path*",
    "/podcast-partner/:path*",
    "/career/:path*",
    "/organizations/:path*",
    "/organization/:path*",
    "/courses/:path*",
    "/features/:path*",
    "/join/:path*",
    "/forum/:path*",
    "/mentorship/:path*",
    "/opportunities/:path*",
  ];

  // Check if the current request matches any public route
  const url = new URL(req.url);
  const isPublicRoute = publicRoutes.some((route) =>
    new RegExp(route.replace(":path*", ".*")).test(url.pathname)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get cookies from the request headers
  const cookies = req.headers.get("cookie") || "";
  const token = cookies
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];

  if (!token) {
    // No token found, redirect to sign-in page
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  try {
    // Decode the token to check its validity
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (decodedToken.exp < currentTime) {
      // Token has expired, redirect to sign-in page
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }
  } catch (error) {
    // If the token is invalid, redirect to the sign-in page
    console.error("Invalid token:", error);
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  // If the token is valid, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/quiz/:path*", "/resources/:path*"],
};
