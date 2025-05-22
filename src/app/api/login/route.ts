// app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch('https://0a35-103-206-131-194.ngrok-free.app/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
          }
        }
      `,
      variables: {
        email: body.email,
        password: body.password,
      },
    }),
  });

  const data = await res.json();
  const token = data?.data?.login?.token;

  if (!token) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return response;
}
