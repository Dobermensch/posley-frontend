import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { ContractsType } from './types';

export const Contracts: ContractsType = {
  Ethereum: undefined,
  Hardhat: {
    MockGoldAddress: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
    MockPythAddress: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    MockUSDCAddress: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
    OracleAmmAddress: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
  },
  Sepolia: undefined,
};
export const DefaultDecimals = 18;
export const MockGoldPriceID =
  '0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f6';
export const MockPythConnection = {
  getPriceFeedsUpdateData: function (pairPriceIds: string[]) {
    return [];
  },
};
export const MockUSDCPriceID =
  '0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f5';
export const PythConnection = new EvmPriceServiceConnection(
  'https://xc-testnet.pyth.network'
);
