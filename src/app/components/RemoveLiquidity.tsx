'use client';

import { Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { formatUnits } from 'viem/utils';
import { useAccount } from 'wagmi';
import Alerts from './Alerts';
import { StyledTextField } from './styled/StyledTextField';
import TokenAmountRow from './TokenAmountRow';
import { DefaultDecimals } from '../constants';
import { ContractContext } from '../contexts/ContractContext';
import { TokenContext } from '../contexts/TokenContext';
import {
  getUserBaseTokenLiquidity,
  removeLiquidity,
} from '../methods/RemoveLiquidity';
import { Chains } from '../types';

function RemoveLiquidity() {
  const { contracts } = useContext(ContractContext);
  const { baseTokenDecimals } = useContext(TokenContext);

  const account = useAccount();
  const [baseTokenAmt, setBaseTokenAmt] = useState<string>('');
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [userBaseLiquidity, setUserBaseLiquidity] = useState<string>('');

  useEffect(() => {
    const getUserBaseLiq = async () => {
      const userBaseLiq = await getUserBaseTokenLiquidity(
        contracts,
        account.address!
      );

      setUserBaseLiquidity(
        formatUnits(userBaseLiq as bigint, baseTokenDecimals || DefaultDecimals)
      );
    };

    try {
      getUserBaseLiq();
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  }, [account.address, baseTokenDecimals, contracts, success]);

  const baseTokenAmountChanged = async (value: string) => {
    let valueToSet = value;

    // Not letting user set more value than the user has provided
    if (parseFloat(value) > parseFloat(userBaseLiquidity)) {
      valueToSet = userBaseLiquidity;
    }

    setBaseTokenAmt(valueToSet);
  };

  const removeLiquidityClicked = async () => {
    try {
      setError('');
      setSuccess('');
      setDisableBtn(true);

      const [hash, _receipt] = await removeLiquidity(
        contracts,
        account.chain?.name as Chains,
        userBaseLiquidity,
        baseTokenAmt,
        baseTokenDecimals
      );

      setSuccess(`Success! Tx hash: ${hash}`);
      setDisableBtn(false);
    } catch (e) {
      console.error(e);
      setError(e.message);
      setDisableBtn(false);
    }
  };

  return (
    <div className='content-container'>
      <Alerts error={error} loading={disableBtn} success={success} />

      <TokenAmountRow
        onClickCallback={() => baseTokenAmountChanged(userBaseLiquidity)}
        title={`${userBaseLiquidity} Base token(s) provided`}
      />

      <StyledTextField
        focused
        fullWidth
        id='base-liquidity'
        label='Base token liquidity provided'
        required
        onChange={(e) => baseTokenAmountChanged(e.target.value)}
        type='number'
        value={baseTokenAmt}
        variant='outlined'
      />

      <Button
        className='action-button'
        disabled={disableBtn}
        fullWidth
        onClick={removeLiquidityClicked}
        variant='contained'
      >
        Remove Liquidity
      </Button>
    </div>
  );
}

export default RemoveLiquidity;
