import { formatUnits, parseUnits } from 'viem/utils';
import {
  readContracts,
  ReadContractsReturnType,
  writeContract,
} from 'wagmi/actions';
import { config } from '@/wagmi';
import { getConnection } from './helpers';
import MockPyth from '../abis/MockPyth.json';
import OracleAmm from '../abis/OracleAMM.json';
import { MockGoldPriceID, MockUSDCPriceID } from '../constants';
import { Chains, ContractsAddresses, PythPriceData } from '../types';

export const calculateBuyTokenAmount = async (
  contracts: ContractsAddresses,
  isSellBase: boolean,
  sellTokenAmount: string
) => {
  let baseTokenPrice: string = '0';
  let quoteTokenPrice: string = '0';
  let buyTokenAmount;

  const result: ReadContractsReturnType = await readContracts(config, {
    contracts: [
      {
        abi: MockPyth.abi,
        address: contracts.MockPythAddress,
        functionName: 'getPrice',
        args: [MockUSDCPriceID],
      },
      {
        abi: MockPyth.abi,
        address: contracts.MockPythAddress,
        functionName: 'getPrice',
        args: [MockGoldPriceID],
      },
    ],
  });

  const mockUSCDPriceData = result[0] as PythPriceData;
  const mockGoldPriceData = result[1] as PythPriceData;

  if (mockUSCDPriceData.status === 'success') {
    quoteTokenPrice = formatUnits(
      mockUSCDPriceData.result.price,
      Math.abs(mockUSCDPriceData.result.expo)
    );
  }

  if (mockGoldPriceData.status === 'success') {
    baseTokenPrice = formatUnits(
      mockGoldPriceData.result.price,
      Math.abs(mockGoldPriceData.result.expo)
    );
  }

  const sellTokenPrice = isSellBase ? baseTokenPrice : quoteTokenPrice;
  const buyTokenPrice = isSellBase ? quoteTokenPrice : baseTokenPrice;

  buyTokenAmount =
    (parseFloat(sellTokenPrice) * parseFloat(sellTokenAmount)) /
    parseFloat(buyTokenPrice);

  return {
    sellTokenPrice,
    buyTokenPrice,
    buyTokenAmount,
  };
};

export const swap = async (
  contracts: ContractsAddresses,
  chain: Chains,
  isSellBase: boolean,
  sellTokenAmt: string,
  buyTokemAmt: string,
  sellTokenUserBalance: string,
  baseTokenDecimals: number
) => {
  const floatSellTokenAmount = parseFloat(sellTokenAmt);

  if (!sellTokenAmt || !floatSellTokenAmount) {
    throw new Error('Please set a non-zero amount to swap!');
  }

  if (floatSellTokenAmount < 0) {
    throw new Error('Please enter a positive token amount!');
  }

  if (floatSellTokenAmount > parseFloat(sellTokenUserBalance)) {
    throw new Error('User does not have enough tokens to sell!');
  }

  const connection = getConnection(chain);

  const updateData = await connection.getPriceFeedsUpdateData([
    MockGoldPriceID,
    MockUSDCPriceID,
  ]);

  const result = await writeContract(config, {
    abi: OracleAmm.abi,
    address: contracts.OracleAmmAddress,
    functionName: 'swap',
    args: [
      !isSellBase,
      parseUnits(isSellBase ? sellTokenAmt : buyTokemAmt, baseTokenDecimals), // always in terms of base token
      updateData,
    ],
  });

  return result;
};
