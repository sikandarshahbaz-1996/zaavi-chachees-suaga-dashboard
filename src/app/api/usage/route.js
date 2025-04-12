import { NextResponse } from "next/server";
import twilio from "twilio";

export async function GET() {
  try {
    // Retrieve environment variables and create the Twilio client.
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    // Determine date boundaries for the current month.
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // The client's phone number – adjust as necessary.
    const clientPhone = "+12899070064";

    // Fetch calls where the client's phone appears as "to" (inbound calls).
    const callsTo = await client.calls.list({
      to: clientPhone,
      startTimeAfter: firstDayOfMonth,
      startTimeBefore: firstDayOfNextMonth,
      limit: 1000,
    });

    // Fetch calls where the client's phone appears as "from" (outbound calls).
    const callsFrom = await client.calls.list({
      from: clientPhone,
      startTimeAfter: firstDayOfMonth,
      startTimeBefore: firstDayOfNextMonth,
      limit: 1000,
    });

    // Combine call details.
    const callDetails = [...callsTo, ...callsFrom];

    // Calculate the total call duration in seconds.
    let totalCallDurationSeconds = 0;
    callDetails.forEach((call) => {
      // 'duration' is returned as a string and might be null if the call hasn't completed.
      if (call.duration) {
        totalCallDurationSeconds += parseInt(call.duration, 10);
      }
    });

    // Convert total seconds to minutes.
    const totalCallDurationMinutes = totalCallDurationSeconds / 60;

    // Fetch messages where the client's phone appears as "to" (inbound texts).
    const messagesTo = await client.messages.list({
      to: clientPhone,
      dateSentAfter: firstDayOfMonth,
      dateSentBefore: firstDayOfNextMonth,
      limit: 1000,
    });

    // Fetch messages where the client's phone appears as "from" (outbound texts).
    const messagesFrom = await client.messages.list({
      from: clientPhone,
      dateSentAfter: firstDayOfMonth,
      dateSentBefore: firstDayOfNextMonth,
      limit: 1000,
    });

    // Combine text details.
    const textDetails = [...messagesTo, ...messagesFrom];

    // Build the final usage object.
    const usageData = {
      totalCalls: callDetails.length,
      totalTexts: textDetails.length,
      totalCallDurationMinutes,
      callDetails,
      textDetails,
    };

    return NextResponse.json(usageData);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
