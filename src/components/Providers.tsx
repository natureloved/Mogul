"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

// Initialize once at module level — NOT inside the component
// This prevents "onMount is not a function" errors
const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  // Use a placeholder ID during build if the real one is missing
  // to prevent the PrivyProvider from crashing the Next.js static generation.
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clp_placeholder_id";

  return (
    <PrivyProvider
      appId={appId}
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
