// Middleware for authentication
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/landing', '/auth/signup', '/auth/login', '/'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (!token && !isPublicRoute) {
    // Redirect to login if no token and accessing protected route
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && (pathname === '/auth/login' || pathname === '/auth/signup')) {
    // Redirect to dashboard if logged in and accessing auth pages
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
