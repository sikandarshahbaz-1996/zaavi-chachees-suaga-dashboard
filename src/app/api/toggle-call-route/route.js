import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumberSid = process.env.NEXT_PUBLIC_PHONE_NUMBER_SID;

const client = twilio(accountSid, authToken);

export async function POST(request) {
  try {
    const { useWebhook } = await request.json();

    const webhookUrl = "https://api.us.elevenlabs.io/twilio/inbound_call";
    const twimlBinUrl = "https://handler.twilio.com/twiml/EH73122c97d0d93c06e359d0cf3c109211";

    const newUrl = useWebhook ? webhookUrl : twimlBinUrl;

    await client.incomingPhoneNumbers(phoneNumberSid).update({
      voiceUrl: newUrl,
      voiceMethod: "POST",
    });

    return NextResponse.json({ success: true, newUrl });
  } catch (error) {
    console.error("[toggle-call-route] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
