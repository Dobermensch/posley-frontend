import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { ContractsType } from './types';

export const Contracts: ContractsType = {
  Ethereum: undefined,
  Hardhat: undefined,
  Sepolia: undefined,
};
export const DefaultDecimals = 18;
export const MockGoldPriceID =
  '0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f6';
export const MockPythConnection = {
  getPriceFeedsUpdateData: function (_: string[]) {
    return [];
  },
};
export const MockUSDCPriceID =
  '0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f5';
export const PythConnection = new EvmPriceServiceConnection(
  'https://xc-testnet.pyth.network'
);
