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
  isSimulated?: boolean;
}

const BASE_URL = "https://public-api-v2.bags.fm/api/v1";

const getHeaders = () => {
  return {
    "x-api-key": process.env.BAGS_API_KEY || "",
    "Content-Type": "application/json",
  };
};

export async function getTokenLifetimeFees(tokenMint: string) {
  try {
    const url = `${BASE_URL}/token-launch/lifetime-fees?tokenMint=${tokenMint}`;
    const response = await fetch(url, { headers: getHeaders(), signal: AbortSignal.timeout(5000) });
    if (!response.ok) return { totalFees: 0 };
    return response.json();
  } catch (e) {
    console.error(`Error fetching fees for ${tokenMint}:`, e);
    return { totalFees: 0 };
  }
}

export async function getTokenCreators(tokenMint: string) {
  try {
    const url = `${BASE_URL}/token-launch/creators?tokenMint=${tokenMint}`;
    const response = await fetch(url, { headers: getHeaders(), signal: AbortSignal.timeout(5000) });
    if (!response.ok) return { creators: [] };
    return response.json();
  } catch (e) {
    console.error(`Error fetching creators for ${tokenMint}:`, e);
    return { creators: [] };
  }
}

export async function getTokenClaimEvents(tokenMint: string) {
  try {
    const url = `${BASE_URL}/token-launch/claim-events?tokenMint=${tokenMint}`;
    const response = await fetch(url, { headers: getHeaders(), signal: AbortSignal.timeout(5000) });
    if (!response.ok) return { events: [] };
    return response.json();
  } catch (e) {
    console.error(`Error fetching claims for ${tokenMint}:`, e);
    return { events: [] };
  }
}

function generateMockIntelligence(tokenMint: string): TokenIntelligence {
  const seed = tokenMint.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const totalFees = 10 + random(seed) * 90;
  const lastActivityDays = Math.floor(random(seed + 1) * 14);
  const feeVelocity = totalFees / (30 + random(seed + 2) * 60);

  const mockEvents: ClaimEvent[] = Array.from({ length: 12 }).map((_, i) => ({
    timestamp: new Date(Date.now() - i * 3600000 * 24).toISOString(),
    amount: 0.1 + random(seed + i) * 2,
  }));

  const growthScore = Math.floor(
    (Math.min(totalFees / 100, 1) * 30) +
    (Math.min(feeVelocity / 2, 1) * 40) +
    ((1 - lastActivityDays / 30) * 30)
  );

  return {
    feeVelocity,
    lastActivityDays,
    growthScore: Math.min(100, Math.max(30, growthScore)),
    totalFees,
    creators: [{ name: "MogulDev", royalty: 5.5 }],
    claimEvents: mockEvents,
    isSimulated: true,
  };
}

export async function getTokenIntelligence(tokenMint: string): Promise<TokenIntelligence> {
  const hasKey = !!process.env.BAGS_API_KEY;

  if (!hasKey) {
    console.warn("BAGS_API_KEY missing - generating simulated intelligence report.");
    return generateMockIntelligence(tokenMint);
  }

  try {
    const [feesData, creatorsData, claimsData] = await Promise.all([
      getTokenLifetimeFees(tokenMint),
      getTokenCreators(tokenMint),
      getTokenClaimEvents(tokenMint),
    ]);

    const totalFees = feesData?.totalFees || 0;
    const creators = creatorsData?.creators || [];
    const claimEvents = claimsData?.events || [];

    // If we have ZERO data, the API might be failing or the token is too new
    if (totalFees === 0 && claimEvents.length === 0) {
      console.warn("API returned empty data - falling back to simulated intelligence.");
      return generateMockIntelligence(tokenMint);
    }

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
      claimEvents,
      isSimulated: false,
    };
  } catch (err) {
    console.error("TOKEN INTELLIGENCE FETCH ERROR:", err);
    return generateMockIntelligence(tokenMint);
  }
}
