'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from '@/wagmi';
import { ContractProvider } from './contexts/ContractContext';
import { TokenProvider } from './contexts/TokenContext';

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ContractProvider>
          <TokenProvider>{props.children}</TokenProvider>
        </ContractProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
