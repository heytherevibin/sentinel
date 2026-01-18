import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check for the session cookie
    const session = request.cookies.get('sentinel_session');

    // Public paths that don't satisfy the protection checks
    const publicPaths = ['/login', '/api/auth', '/_next', '/static', '/favicon.ico'];

    // Check if the current path is public
    const isPublicPath = publicPaths.some(path =>
        request.nextUrl.pathname.startsWith(path) || request.nextUrl.pathname === '/grid.svg'
    );

    // If user is not authenticated and trying to access a protected route
    if (!session && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If user IS authenticated and tries to visit login, redirect to home
    if (session && request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
