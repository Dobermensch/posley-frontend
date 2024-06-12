export type Address = `0x${string}`;

export enum Chains {
  Ethereum = 'Ethereum',
  Hardhat = 'Hardhat',
  Sepolia = 'Sepolia',
}

export interface ContractsAddresses {
  MockGoldAddress: Address;
  MockUSDCAddress: Address;
  MockPythAddress: Address;
  OracleAmmAddress: Address;
}

export interface ContractsType {
  [Chains.Ethereum]: ContractsAddresses | undefined;
  [Chains.Hardhat]: ContractsAddresses | undefined;
  [Chains.Sepolia]: ContractsAddresses | undefined;
}

export interface PythPriceData {
  result: PythPriceDataResult;
  status: string;
}

export interface PythPriceDataResult {
  conf: bigint;
  expo: number;
  price: bigint;
  publishTime: bigint;
}

export enum Tabs {
  ADD_LIQUIDITY = 'addLiquidity',
  MINT_TOKENS = 'mintTokens',
  REMOVE_LIQUIDITY = 'removeLiquidity',
  SWAP = 'swap',
}

export enum Tokens {
  Base = 'Base',
  Quote = 'Quote',
}
