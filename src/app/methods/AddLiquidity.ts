import {
  readContract,
  readContracts,
  writeContract,
  type ReadContractsReturnType,
} from '@wagmi/core';
import { maxUint256 } from 'viem';
import { formatUnits, parseUnits } from 'viem/utils';
import { config } from '@/wagmi';
import { getConnection } from './helpers';
import MockGold from '../abis/MockGold.json';
import MockPyth from '../abis/MockPyth.json';
import MockUSDC from '../abis/MockUSDC.json';
import OracleAMM from '../abis/OracleAMM.json';
import { MockGoldPriceID, MockUSDCPriceID } from '../constants';
import { Address, Chains, ContractsAddresses, PythPriceData } from '../types';

export const addLiquidity = async (
  userAddress: Address,
  chain: Chains,
  contracts: ContractsAddresses,
  userBaseTokenBalance: string,
  userQuoteTokenBalance: string,
  baseTokenAmount: string,
  baseTokenDecimals: number,
  quoteTokenAmount: string,
  quoteTokenDecimals: number
) => {
  const floatBaseTokenAmount = parseFloat(baseTokenAmount);

  if (
    !baseTokenAmount ||
    !quoteTokenAmount ||
    !floatBaseTokenAmount ||
    !parseFloat(quoteTokenAmount)
  ) {
    throw new Error('Token amounts must not be empty!');
  }

  if (floatBaseTokenAmount < 0) {
    throw new Error('Token amounts must be greater than zero');
  }

  const parsedUserBaseTokenBalance = parseUnits(
    userBaseTokenBalance,
    baseTokenDecimals
  );
  const parsedUserQuoteTokenBalance = parseUnits(
    userQuoteTokenBalance,
    quoteTokenDecimals
  );

  const parsedBaseTokenAmount = parseUnits(baseTokenAmount, baseTokenDecimals);
  const parsedQuoteTokenAmount = parseUnits(
    quoteTokenAmount,
    quoteTokenDecimals
  );

  if (parsedBaseTokenAmount > parsedUserBaseTokenBalance) {
    throw new Error("You don't have enough base tokens!");
  }

  if (parsedQuoteTokenAmount > parsedUserQuoteTokenBalance) {
    throw new Error("You don't have enough quote tokens!");
  }

  // check allowance...
  const [baseTokenAllowance, quoteTokenAllowance] = await readContracts(
    config,
    {
      contracts: [
        {
          abi: MockGold.abi,
          address: contracts.MockGoldAddress,
          functionName: 'allowance',
          args: [userAddress, contracts.OracleAmmAddress],
        },
        {
          abi: MockUSDC.abi,
          address: contracts.MockUSDCAddress,
          functionName: 'allowance',
          args: [userAddress, contracts.OracleAmmAddress],
        },
      ],
    }
  );

  if (baseTokenAllowance.status === 'success') {
    const baseAllowanceResult = baseTokenAllowance.result as bigint;

    if (
      baseAllowanceResult.toString() === '0' ||
      parsedBaseTokenAmount > baseAllowanceResult
    ) {
      await writeContract(config, {
        abi: MockGold.abi,
        address: contracts.MockGoldAddress,
        functionName: 'approve',
        args: [contracts.OracleAmmAddress, maxUint256],
      });
    }
  } else {
    throw new Error('Error during base token approval');
  }

  if (quoteTokenAllowance.status === 'success') {
    const quoteAllowanceResult = quoteTokenAllowance.result as bigint;

    if (
      quoteAllowanceResult.toString() === '0' ||
      parsedQuoteTokenAmount > quoteAllowanceResult
    ) {
      await writeContract(config, {
        abi: MockUSDC.abi,
        address: contracts.MockUSDCAddress,
        functionName: 'approve',
        args: [contracts.OracleAmmAddress, maxUint256],
      });
    }
  } else {
    throw new Error('Error during quote token approval');
  }

  const connection = getConnection(chain);

  const updateData = await connection.getPriceFeedsUpdateData([
    MockGoldPriceID,
    MockUSDCPriceID,
  ]);

  const result = await writeContract(config, {
    abi: OracleAMM.abi,
    address: contracts.OracleAmmAddress,
    functionName: 'addLiquidity',
    args: [parsedBaseTokenAmount, parsedQuoteTokenAmount, updateData],
  });

  return result;
};

export const calculateQuoteTokenAmount = async (
  contracts: ContractsAddresses,
  baseTokenAmt: string
) => {
  let baseTokenPrice: string = '0';
  let quoteTokenPrice: string = '0';
  let quoteTokenAmount;

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
      Math.abs(mockUSCDPriceData.result.expo)
    );
  }

  quoteTokenAmount =
    (parseFloat(baseTokenPrice) * parseFloat(baseTokenAmt)) /
    parseFloat(quoteTokenPrice);

  return {
    baseTokenPrice,
    quoteTokenPrice,
    quoteTokenAmount,
  };
};

export const getBaseTokenBalance = async (
  contracts: ContractsAddresses,
  address: Address
) => {
  const result = await readContract(config, {
    abi: MockGold.abi,
    address: contracts.MockGoldAddress,
    functionName: 'balanceOf',
    args: [address],
  });

  return result;
};

export const getQuoteTokenBalance = async (
  contracts: ContractsAddresses,
  address: Address
) => {
  const result = await readContract(config, {
    abi: MockUSDC.abi,
    address: contracts.MockUSDCAddress,
    functionName: 'balanceOf',
    args: [address],
  });

  return result;
};

export const getTokensDecimals = async (contracts: ContractsAddresses) => {
  type DecimalResult = {
    status: string;
    result: number;
  };

  const result = <DecimalResult[]>await readContracts(config, {
    contracts: [
      {
        abi: MockUSDC.abi,
        address: contracts.MockUSDCAddress,
        functionName: 'decimals',
      },
      {
        abi: MockGold.abi,
        address: contracts.MockGoldAddress,
        functionName: 'decimals',
      },
    ],
  });

  const decimals = [0, 0];

  if (result[0].status === 'success') {
    decimals[0] = result[0].result;
  }

  if (result[1].status === 'success') {
    decimals[1] = result[1].result;
  }

  return decimals;
};