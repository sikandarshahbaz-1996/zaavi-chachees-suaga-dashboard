// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public access to the login page, authentication APIs, and static assets.
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/api/logout') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Check for the authentication cookie.
  const authCookie = request.cookies.get("auth");
  if (!authCookie) {
    // Redirect to the login page if not authenticated.
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except login, the auth API routes, and static assets.
    '/((?!api/login|login|api/logout|_next/static|_next/image).*)',
  ],
};
