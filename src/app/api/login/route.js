// app/api/login/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const { username, password } = await request.json();

  const envUsername = process.env.BASIC_AUTH_USERNAME;
  const envPassword = process.env.BASIC_AUTH_PASSWORD;

  if (username === envUsername && password === envPassword) {
    const response = NextResponse.json({ success: true });
    // Set a cookie named "auth" without expiration (session cookie)
    response.cookies.set("auth", "true", {
      httpOnly: true,
      path: "/",
      // Optionally, add secure: true in production behind HTTPS
    });
    return response;
  } else {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
