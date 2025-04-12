// app/api/logout/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const response = NextResponse.json({ success: true });
  // Delete the "auth" cookie
  response.cookies.delete("auth", { path: "/" });
  return response;
}
