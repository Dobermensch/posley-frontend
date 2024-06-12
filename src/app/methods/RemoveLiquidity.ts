import { parseUnits } from 'viem/utils';
import { readContract, writeContract } from 'wagmi/actions';
import { config } from '@/wagmi';
import { getConnection } from './helpers';
import OracleAmm from '../abis/OracleAMM.json';
import { MockGoldPriceID, MockUSDCPriceID } from '../constants';
import { Address, Chains, ContractsAddresses } from '../types';

export const getUserBaseTokenLiquidity = async (
  contracts: ContractsAddresses,
  address: Address
) => {
  const result = await readContract(config, {
    abi: OracleAmm.abi,
    address: contracts.OracleAmmAddress,
    functionName: 'baseLiquidityProvided',
    args: [address],
  });

  return result;
};

export const removeLiquidity = async (
  contracts: ContractsAddresses,
  chain: Chains,
  userBaseLiquidity: string,
  baseTokenAmount: string,
  baseTokenDecimals: number
) => {
  const floatBaseTokenAmount = parseFloat(baseTokenAmount);

  if (!baseTokenAmount || !floatBaseTokenAmount) {
    throw new Error('Please enter a non zero amount of tokens!');
  }

  if (floatBaseTokenAmount < 0) {
    throw new Error('Please enter a positive amount!');
  }

  if (floatBaseTokenAmount > parseFloat(userBaseLiquidity)) {
    throw new Error(
      'Please enter an amount less than or equal to your provided base token liquidity!'
    );
  }

  const connection = getConnection(chain);

  const updateData = await connection.getPriceFeedsUpdateData([
    MockGoldPriceID,
    MockUSDCPriceID,
  ]);

  const result = await writeContract(config, {
    abi: OracleAmm.abi,
    functionName: 'removeLiquidity',
    address: contracts.OracleAmmAddress,
    args: [parseUnits(baseTokenAmount, baseTokenDecimals), updateData],
  });

  return result;
};
