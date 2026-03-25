import { NextResponse } from "next/server";
import { getTokenIntelligence } from "@/lib/bags";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get("mint");

  if (!mint || mint.length < 32 || mint.length > 44) {
    return NextResponse.json({ success: false, error: "Invalid mint address" }, { status: 400 });
  }

  try {
    const data = await getTokenIntelligence(mint);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch token data" }, { status: 500 });
  }
}
