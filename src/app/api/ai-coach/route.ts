import { NextResponse } from "next/server";
import { getTokenIntelligence } from "@/lib/bags";
import { getCoachAdvice, Message } from "@/lib/claude";

const rateLimits = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  
  const record = rateLimits.get(ip);
  if (record) {
    if (now > record.resetAt) {
      rateLimits.set(ip, { count: 1, resetAt: now + 3600 * 1000 });
    } else if (record.count >= 20) {
      return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 });
    } else {
      record.count += 1;
    }
  } else {
    rateLimits.set(ip, { count: 1, resetAt: now + 3600 * 1000 });
  }

  try {
    const body = await request.json();
    const { tokenMint, message, history } = body;

    if (!tokenMint || !message || !Array.isArray(history)) {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }

    const tokenData = await getTokenIntelligence(tokenMint);
    const advice = await getCoachAdvice(tokenData, message, history as Message[]);

    return NextResponse.json({ success: true, advice });
  } catch (error) {
    console.error("AI COACH API ERROR:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
