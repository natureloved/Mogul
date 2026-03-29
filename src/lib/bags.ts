export interface ClaimEvent {
  timestamp?: string | number | Date;
  amount?: number;
  [key: string]: unknown;
}

export interface TokenIntelligence {
  feeVelocity: number;
  lastActivityDays: number;
  growthScore: number;
  totalFees: number;
  creators: Record<string, unknown>[];
  claimEvents: ClaimEvent[];
}

const BASE_URL = "https://public-api-v2.bags.fm/api/v1";

const getHeaders = () => {
  return {
    "x-api-key": process.env.BAGS_API_KEY || "",
    "Content-Type": "application/json",
  };
};

export async function getTokenLifetimeFees(tokenMint: string) {
  const url = new URL(`${BASE_URL}/token-launch/lifetime-fees`);
  url.searchParams.set("tokenMint", tokenMint);
  const response = await fetch(url.toString(), { headers: getHeaders() });
  if (!response.ok) return { totalFees: 0 };
  return response.json();
}

export async function getTokenCreators(tokenMint: string) {
  const url = new URL(`${BASE_URL}/token-launch/creators`);
  url.searchParams.set("tokenMint", tokenMint);
  const response = await fetch(url.toString(), { headers: getHeaders() });
  if (!response.ok) return { creators: [] };
  return response.json();
}

export async function getTokenClaimEvents(tokenMint: string) {
  const url = new URL(`${BASE_URL}/token-launch/claim-events`);
  url.searchParams.set("tokenMint", tokenMint);
  const response = await fetch(url.toString(), { headers: getHeaders() });
  if (!response.ok) return { events: [] };
  return response.json();
}

export async function getTokenIntelligence(tokenMint: string): Promise<TokenIntelligence> {
  const [feesData, creatorsData, claimsData] = await Promise.all([
    getTokenLifetimeFees(tokenMint),
    getTokenCreators(tokenMint),
    getTokenClaimEvents(tokenMint),
  ]);

  const totalFees = feesData?.totalFees || 0;
  const creators = creatorsData?.creators || [];
  const claimEvents = claimsData?.events || [];

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  let feeVelocity = 0;
  let mostRecentClaimTimestamp = 0;

  for (const event of claimEvents) {
    const ts = new Date(event.timestamp || 0).getTime();
    if (ts > sevenDaysAgo) {
      feeVelocity += (event.amount || 0);
    }
    if (ts > mostRecentClaimTimestamp) {
      mostRecentClaimTimestamp = ts;
    }
  }

  const lastActivityDays = mostRecentClaimTimestamp > 0
    ? Math.max(0, Math.floor((now - mostRecentClaimTimestamp) / (24 * 60 * 60 * 1000)))
    : -1;

  let recencyScore = 0;
  if (lastActivityDays === -1) {
    recencyScore = 0;
  } else if (lastActivityDays <= 1) {
    recencyScore = 1;
  } else if (lastActivityDays <= 7) {
    recencyScore = 0.8;
  } else if (lastActivityDays <= 30) {
    recencyScore = 0.5;
  } else {
    recencyScore = 0.1;
  }

  const normalizedFees = Math.min(totalFees / 10000, 1);
  const normalizedVelocity = Math.min(feeVelocity / 1000, 1);

  const growthScore = Math.floor(
    (normalizedFees * 30) +
    (normalizedVelocity * 40) +
    (recencyScore * 30)
  );

  return {
    feeVelocity,
    lastActivityDays,
    growthScore: Math.min(100, Math.max(0, growthScore)),
    totalFees,
    creators,
    claimEvents
  };
}
