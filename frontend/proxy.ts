import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/history', '/run-quiz', '/create'];
const authRoutes = ['/login', '/register'];

const hasAuthCookies = (request: NextRequest) =>
  Boolean(
    request.cookies.get('sessionId')?.value &&
    request.cookies.get('accessToken')?.value,
  );

const matchesRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasAuthCookies(request);

  const isProtectedRoute = protectedRoutes.some(route =>
    matchesRoute(pathname, route),
  );

  const isAuthRoute = authRoutes.some(route => matchesRoute(pathname, route));

  if (isProtectedRoute && !authenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && authenticated) {
    return NextResponse.redirect(new URL('/quizzes', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/history/:path*',
    '/run-quiz/:path*',
    '/create/:path*',
    '/login',
    '/register',
  ],
};
