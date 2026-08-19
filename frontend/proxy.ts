import { NextRequest, NextResponse } from 'next/server';
import { serverRefreshSession } from './lib/serverApi';
import { parse } from 'cookie';

const protectedRoutes = ['/history', '/run-quiz', '/create'];
const authRoutes = ['/login', '/register'];


const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = authRoutes.some((r) => pathname.startsWith(r));
  const isPrivateRoute = protectedRoutes.some((r) => pathname.startsWith(r));

  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (!accessToken && refreshToken) {
    try {
      const res = await serverRefreshSession(
        request.headers.get("cookie") ?? ""
      );

      const setCookie = res.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        const refreshedCookies: string[] = [];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path || "/",
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            secure: true,
            sameSite: "lax" as const,
          };

          if (parsed.accessToken) {
            response.cookies.set("accessToken", parsed.accessToken, options);
            refreshedCookies.push(`accessToken=${parsed.accessToken}`);
          }

          if (parsed.refreshToken) {
            response.cookies.set("refreshToken", parsed.refreshToken, options);
            refreshedCookies.push(`refreshToken=${parsed.refreshToken}`);
          }
        }

        if (refreshedCookies.length > 0) {
          const existingCookie = requestHeaders.get("cookie");

          requestHeaders.set(
            "cookie",
            [existingCookie, ...refreshedCookies].filter(Boolean).join("; ")
          );
        }
      }
    } catch {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (!accessToken && !refreshToken && isPrivateRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
};

export default proxy;

export const config = {
  matcher: [
    '/history/:path*',
    '/run-quiz/:path*',
    '/create/:path*',
    '/login',
    '/register',
  ],
};
