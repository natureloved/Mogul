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
  const prompt = `Generate a Twitter/X post for my token based on the following data:
Total Fees: ${tokenData.totalFees}
Growth Score: ${tokenData.growthScore}/100
Recent Activity: ${tokenData.lastActivityDays} days ago

Style: ${style}
${customContext ? `Custom Context: ${customContext}` : ""}

Requirement: Keep it under 280 characters. End with #Solana #BagsApp`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }]
  });

  if (response.content[0].type === "text") {
    return response.content[0].text;
  }
  return "";
}

export async function getDashboardInsight(tokenData: TokenIntelligence) {
  const prompt = `Analyze this token data and provide ONE sharp insight. Max 2 sentences. The most important thing the creator should know right now.
Data:
Total Fees: ${tokenData.totalFees}
Fee Velocity: ${tokenData.feeVelocity}
Last Activity: ${tokenData.lastActivityDays} days ago
Growth Score: ${tokenData.growthScore}/100`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 100,
    messages: [{ role: "user", content: prompt }]
  });

  if (response.content[0].type === "text") {
    return response.content[0].text;
  }
  return "";
}
