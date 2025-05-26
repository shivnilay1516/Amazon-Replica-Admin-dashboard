import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const allowedPaths = ['/adminlogin', '/signup'];
  if (!token && !allowedPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/adminlogin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|adminlogin|signup|api).*)',
  ],
};