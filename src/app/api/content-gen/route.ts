import { NextResponse } from "next/server";
import { getTokenIntelligence } from "@/lib/bags";
import { generatePost, PostStyle } from "@/lib/claude";

const VALID_STYLES: PostStyle[] = ["hype", "milestone", "holder-appreciation", "call-to-action", "status-update"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tokenMint, style, customContext } = body;

    if (!tokenMint || !style || !VALID_STYLES.includes(style)) {
      return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 });
    }

    const tokenData = await getTokenIntelligence(tokenMint);
    const post = await generatePost(tokenData, style as PostStyle, customContext);

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("CONTENT GEN API ERROR:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate content";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
