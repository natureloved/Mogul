import { NextResponse } from "next/server";
import { getTokenIntelligence } from "@/lib/bags";
import { getDashboardInsight } from "@/lib/claude";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get("mint");

  if (!mint || mint.length < 32 || mint.length > 44) {
    return NextResponse.json({ success: false, error: "Invalid mint address" }, { status: 400 });
  }

  try {
    const tokenData = await getTokenIntelligence(mint);
    const insight = await getDashboardInsight(tokenData);
    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error("DASHBOARD INSIGHT API ERROR:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate insight",
    }, { status: 500 });
  }
}
