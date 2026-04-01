import Anthropic from "@anthropic-ai/sdk";
import { TokenIntelligence } from "./bags";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export type PostStyle = "hype" | "milestone" | "holder-appreciation" | "call-to-action" | "status-update";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function getCoachAdvice(tokenData: TokenIntelligence, userMessage: string, history: Message[]) {
  const contextMessage = `Token Data Context:
Total Fees: ${tokenData.totalFees}
Fee Velocity (7d): ${tokenData.feeVelocity}
Last Activity: ${tokenData.lastActivityDays} days ago
Growth Score: ${tokenData.growthScore}/100

User Message: ${userMessage}`;

  const recentHistory = history.slice(-6);

  const systemPrompt = "You are Mogul — an AI advisor for Bags.fm token creators on Solana. Give sharp, data-driven, actionable advice. Max 3 recommendations. No fluff. Only reference real data provided. Max response: 3 short paragraphs or bullet points.";

  const messages: Anthropic.MessageParam[] = [
    ...recentHistory.map(m => ({ role: m.role, content: m.content }) as Anthropic.MessageParam),
    { role: "user", content: contextMessage }
  ];

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 600,
    system: systemPrompt,
    messages: messages
  });

  if (response.content[0].type === "text") {
    return response.content[0].text;
  }
  return "";
}

export async function generatePost(tokenData: TokenIntelligence, style: PostStyle, customContext?: string) {
  const prompt = `You are an elite Crypto Degens & Growth Marketer. Generate a highly viral, impressive Twitter/X post for a token based on this Bag.fm data:
Total Fees: ${tokenData.totalFees}
Growth Score: ${tokenData.growthScore}/100
Days Active: ${tokenData.lastActivityDays}

Style: ${style}
${customContext ? `Specific Detail/Hook: ${customContext}` : ""}

Requirements:
- Make it look PROFESSIONAL and ALPHA-tier.
- Reference the specific data points naturally.
- Use a mix of caps and lowercase for emphasis (DEGEN style).
- If style is "raid", make it a high-intensity call to action.
- Max 280 chars. End with $TOKEN #Solana #Bags #Mogul.`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 400,
    system: "You generate high-conversion crypto social media content. No generic fluff. Be sharp, aggressive, and data-focused.",
    messages: [{ role: "user", content: prompt }]
  });

  if (response.content[0].type === "text") {
    return response.content[0].text;
  }
  return "";
}

export async function getDashboardInsight(tokenData: TokenIntelligence) {
  const prompt = `Analyze this Bags.fm token data and provide ONE punchy, high-intelligence ALPHA insight. 
Total Fees: ${tokenData.totalFees}
Fee Velocity: ${tokenData.feeVelocity}
Growth Score: ${tokenData.growthScore}/100
Activity: ${tokenData.lastActivityDays} days active

Task: Tell the creator exactly what this data means for their token's future in 1-2 sharp sentences. No generic advice. Be specific to the numbers.`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 150,
    system: "You are a master on-chain analyst. You provide sharp, cynical, and highly accurate token intelligence.",
    messages: [{ role: "user", content: prompt }]
  });

  if (response.content[0].type === "text") {
    return response.content[0].text;
  }
  return "";
}
