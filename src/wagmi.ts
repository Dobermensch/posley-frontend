import { http, createConfig } from 'wagmi';
import { sepolia, hardhat } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [sepolia, hardhat],
  connectors: [injected()],
  ssr: true,
  transports: {
    [sepolia.id]: http(
      `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_SEPOLIA_API_KEY}`
    ),
    [hardhat.id]: http('http://localhost:8545'),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
