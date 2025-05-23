// // src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const isRoot = req.nextUrl.pathname === '/';

  if (isRoot && !token) {
    return NextResponse.redirect(new URL('/adminlogin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'], 
};
