

// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get('token')?.value;
//   const isRoot = req.nextUrl.pathname === '/';

//   if (isRoot && !token) {
//     return NextResponse.redirect(new URL('/adminlogin', req.url));
//   }
  
// console.log("222", token)

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/'], 
// };



import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token && req.nextUrl.pathname !== '/adminlogin') {
    return NextResponse.redirect(new URL('/adminlogin', req.url));
  }

  return NextResponse.next();
}

// ✅ Protect all routes except assets and login
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|adminlogin|api).*)'],
};