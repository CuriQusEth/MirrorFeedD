import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createConfig, http, WagmiProvider, useAccount, useConnect, useDisconnect } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, metaMask, safe } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    injected({ shimDisconnect: false }),
    metaMask(),
    safe(),
  ],
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MockSIWEProvider>
          {children}
        </MockSIWEProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Minimal SIWE mock for AI Studio environment
interface SIWEContextType {
  isSignedIn: boolean;
  address?: string;
  signIn: () => Promise<void>;
  signOut: () => void;
}

const SIWEContext = createContext<SIWEContextType>({
  isSignedIn: false,
  signIn: async () => {},
  signOut: () => {},
});

export const useSIWE = () => useContext(SIWEContext);

function MockSIWEProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!isConnected) {
      setIsSignedIn(false);
    } else {
      setIsSignedIn(true); // Auto sign-in if wallet is already connected
    }
  }, [isConnected]);

  const signIn = async () => {
    try {
      if (!isConnected) {
        // Find a suitable connector, defaulting to the first one
        const connector = connectors.find(c => c.id === 'injected' || c.id === 'metaMask') || connectors[0];
        if (connector) {
          await connectAsync({ connector });
        } else {
          throw new Error('No wallet connector found.');
        }
      }
      // Mock SIWE verification delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSignedIn(true);
    } catch (err) {
      console.error('Sign-in error:', err);
    }
  };

  const signOut = () => {
    disconnect();
    setIsSignedIn(false);
  };

  return (
    <SIWEContext.Provider value={{ isSignedIn, address, signIn, signOut }}>
      {children}
    </SIWEContext.Provider>
  );
}
