import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      token: "demo-token",
      user: {
        email,
        isAdmin: email === "admin@gmail.com"
      }
    });

  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
