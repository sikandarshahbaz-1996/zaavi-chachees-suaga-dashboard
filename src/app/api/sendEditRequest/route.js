import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const { text } = await request.json();

    // Base Zapier URL.
    const baseZapierUrl = "https://hooks.zapier.com/hooks/catch/";
    
    // Get the path (e.g., "21981676/20gh56z/") from the environment.
    const zapierHookPath = process.env.ZAPIER_HOOK_PATH;
    if (!zapierHookPath) {
      throw new Error("Zapier hook path is not defined in the environment");
    }

    // Build the full URL.
    const zapierHookUrl = `${baseZapierUrl}${zapierHookPath}`;

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
