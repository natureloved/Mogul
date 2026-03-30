import { NextResponse } from "next/server";
import { getTokenIntelligence } from "@/lib/bags";

export async function GET(request: Request) {
  console.log("BAGS KEY:", process.env.BAGS_API_KEY ? "✅ Loaded" : "❌ Missing");
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get("mint");

  if (!mint || mint.length < 32 || mint.length > 44) {
    return NextResponse.json({ success: false, error: "Invalid mint address" }, { status: 400 });
  }

  try {
    const data = await getTokenIntelligence(mint);
    if (data.isSimulated) {
      console.warn("⚠️ Providing Simulated Data for:", mint);
    } else {
      console.log("💎 Fetched Direct Data for:", mint);
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("TOKEN INTELLIGENCE FETCH ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch token data" 
    }, { status: 500 });
  }
}
