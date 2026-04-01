import Anthropic from "@anthropic-ai/sdk";
import { TokenIntelligence } from "./bags";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

console.log("ANTHROPIC KEY:", process.env.ANTHROPIC_API_KEY ? "✅ Loaded" : "❌ Missing");

export type PostStyle = "hype" | "milestone" | "holder-appreciation" | "call-to-action" | "status-update";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Smart Fallback Engine - Manually calculates insights if API is down or Key is restricted.
 */
function getSmartFallback(tokenData: TokenIntelligence, type: 'INSIGHT' | 'COACH' | 'POST', style?: PostStyle) {
  const { totalFees, feeVelocity, growthScore, lastActivityDays } = tokenData;

  if (type === 'INSIGHT') {
    if (growthScore > 80) return `🚀 ALPHA: With a Growth Score of ${growthScore}/100 and ${totalFees} SOL in fees, this token is in a major breakout phase. High community velocity detected.`;
    if (feeVelocity > 10) return `📈 MOMENTUM: Fee velocity is surging (${feeVelocity} SOL). Traders are actively accumulating despite the ${lastActivityDays}d age.`;
    return `📊 STABLE: Token is maintaining consistent activity. Focus on increasing fee velocity to hit the next growth milestone.`;
  }

  if (type === 'COACH') {
    return `1️⃣ Engage Top Holders: With ${totalFees} SOL generated, you have a solid whale base. Reach out to them.\n2️⃣ Boost Velocity: Current 7d velocity is ${feeVelocity} SOL. Host a raid or share milestones to drive trade volume.\n3️⃣ Maintain Activity: Your last activity was ${lastActivityDays} days ago - consistent updates are key for a ${growthScore} Growth Score.`;
  }

  if (type === 'POST') {
    if (style === 'hype') return `🔥 $MOGUL IS ACCENDING! 🔥\n\n- Growth Score: ${growthScore}/100 📈\n- Total Volume Surging 🌊\n\nThe community knows where the alpha is. Join the movement on @BagsApp 🚀💎\n\n#Solana #Bags #Mogul`;
    return `🏆 Milestone Hit! $MOGUL just reached ${totalFees} SOL in fees. The growth is unstoppable. 💎🙌 Join the top ${growthScore}% on @BagsApp! #Solana #Mogul`;
  }

  return "Analyzing token metrics...";
}

export async function getCoachAdvice(tokenData: TokenIntelligence, userMessage: string, history: Message[]) {
  try {
    const contextMessage = `Token Data Context:
Total Fees: ${tokenData.totalFees}
Fee Velocity (7d): ${tokenData.feeVelocity}
Last Activity: ${tokenData.lastActivityDays} days ago
Growth Score: ${tokenData.growthScore}/100

User Message: ${userMessage}`;

    const recentHistory = history.slice(-6);
    const systemPrompt = "You are Mogul — an AI advisor for Bags.fm token creators on Solana. Give sharp, data-driven, actionable advice. Max 3 recommendations. No fluff. Only reference real data provided. Max response: 3 short paragraphs or bullet points. DO NOT use markdown bolding (**) or any asterisks in your response.";

    const messages: Anthropic.MessageParam[] = [
      ...recentHistory.map(m => ({ role: m.role, content: m.content }) as Anthropic.MessageParam),
      { role: "user", content: contextMessage }
    ];

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 600,
      system: systemPrompt,
      messages: messages
    });

    if (response.content[0].type === "text") return response.content[0].text;
    return getSmartFallback(tokenData, 'COACH');
  } catch (error) {
    console.error("COACH API ERROR, using local fallback:", error);
    return getSmartFallback(tokenData, 'COACH');
  }
}

export async function generatePost(tokenData: TokenIntelligence, style: PostStyle, customContext?: string) {
  try {
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
      model: "claude-3-haiku-20240307",
      max_tokens: 400,
      system: "You generate high-conversion crypto social media content. No generic fluff. Be sharp, aggressive, and data-focused.",
      messages: [{ role: "user", content: prompt }]
    });

    if (response.content[0].type === "text") return response.content[0].text;
    return getSmartFallback(tokenData, 'POST', style);
  } catch (error) {
    console.error("POST GEN API ERROR, using local fallback:", error);
    return getSmartFallback(tokenData, 'POST', style);
  }
}

export async function getDashboardInsight(tokenData: TokenIntelligence) {
  try {
    const prompt = `Analyze this Bags.fm token data and provide ONE punchy, high-intelligence ALPHA insight. 
Total Fees: ${tokenData.totalFees}
Fee Velocity: ${tokenData.feeVelocity}
Growth Score: ${tokenData.growthScore}/100
Activity: ${tokenData.lastActivityDays} days active

Task: Tell the creator exactly what this data means for their token's future in 1-2 sharp sentences. No generic advice. Be specific to the numbers.`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 150,
      system: "You are a master on-chain analyst. You provide sharp, cynical, and highly accurate token intelligence.",
      messages: [{ role: "user", content: prompt }]
    });

    if (response.content[0].type === "text") return response.content[0].text;
    return getSmartFallback(tokenData, 'INSIGHT');
  } catch (error) {
    console.error("DASHBOARD INSIGHT API ERROR, using local fallback:", error);
    return getSmartFallback(tokenData, 'INSIGHT');
  }
}
