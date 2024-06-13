import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { Abi } from 'viem';
import MockGold from './abis/MockGold.json';
import MockPyth from './abis/MockPyth.json';
import MockUSDC from './abis/MockUSDC.json';
import OracleAMM from './abis/OracleAMM.json';
import { ContractsType } from './types';

export const Contracts: ContractsType = {
  Hardhat: undefined,
  Sepolia: {
    MockGoldAddress: '0x0313f7d09C54A9cA9D8bC475B06FB0feBE7c53Db',
    MockPythAddress: '0x7DF359822AfFf1d01dD0e724816b4958Bf9e4512',
    MockUSDCAddress: '0xF6E478F2d438021516B5BDA60984C59E0d7534D0',
    OracleAmmAddress: '0x9A3Bf547A67B129fE93ed5a9F54EaaB9CaCf0664',
  },
};
export const DefaultDecimals = 18;
export const MockGoldAbi = MockGold.abi as Abi;
export const MockGoldPriceID =
  '0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f6';
export const MockPythAbi = MockPyth.abi as Abi;
export const MockPythConnection = {
  getPriceFeedsUpdateData: function (_: string[]) {
    return [];
  },
};
export const MockUSDCAbi = MockUSDC.abi as Abi;
export const MockUSDCPriceID =
  '0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f5';
export const OracleAmmAbi = OracleAMM.abi as Abi;
export const PythConnection = new EvmPriceServiceConnection(
  'https://hermes.pyth.network'
);
