import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const { text } = await request.json();

    // Your Zapier Webhook URL (replace with your actual one):
    const zapierHookUrl = "https://hooks.zapier.com/hooks/catch/21981676/20gh56z/";

    // Send the text to Zapier
    await axios.post(zapierHookUrl, { text });

    // Return success to the client
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
