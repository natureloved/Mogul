import { Metadata } from "next";
import { getTokenIntelligence } from "@/lib/bags";
import ScoreCardClient from "./ScoreCardClient";

interface Props {
  params: { mint: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const data = await getTokenIntelligence(params.mint);
    return {
      title: `Mogul Score: ${data.growthScore}/100`,
      description: `Token Intelligence Report powered by Mogul — Lifetime Fees: ${data.totalFees.toFixed(4)} SOL · Growth Score: ${data.growthScore}/100`,
      openGraph: {
        title: `Mogul Score: ${data.growthScore}/100`,
        description: "Token Intelligence Report powered by Mogul",
        siteName: "Mogul",
      },
      twitter: {
        card: "summary_large_image",
        title: `Mogul Score: ${data.growthScore}/100`,
        description: "Token Intelligence Report powered by Mogul · Built on Bags.fm",
      },
    };
  } catch {
    return { title: "Mogul Score Card" };
  }
}

export default async function ScoreCardPage({ params }: Props) {
  const { mint } = params;

  let tokenData = null;
  let error = null;

  try {
    tokenData = await getTokenIntelligence(mint);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load token data";
  }

  return <ScoreCardClient mint={mint} tokenData={tokenData} error={error} />;
}
