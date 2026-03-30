"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

// Initialize once at module level — NOT inside the component
// This prevents "onMount is not a function" errors
const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!appId) {
    console.error("CRITICAL: NEXT_PUBLIC_PRIVY_APP_ID is missing from environment variables.");
  }

  return (
    <PrivyProvider
      appId={appId || "clp_placeholder_id"}
      config={{
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#14F195",
          walletList: ["phantom", "solflare", "backpack"],
        },
        embeddedWallets: {
          ethereum: { createOnLogin: "off" },
          solana: { createOnLogin: "off" },
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
