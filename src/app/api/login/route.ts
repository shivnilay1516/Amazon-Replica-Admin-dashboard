
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch('https://0737-103-206-131-194.ngrok-free.app/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation Mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          staff {
            id
            username
            email
            name
            contactNo
            roles
            roleId
            roleName
            status
            updateByStaff
          }
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

   const response = new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
     },
  });

  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  

  return response;
}
