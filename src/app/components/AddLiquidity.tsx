'use client';

import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useContext, useState } from 'react';
import { useAccount } from 'wagmi';
import Alerts from './Alerts';
import { StyledTextField } from './styled/StyledTextField';
import TokenAmountRow from './TokenAmountRow';
import { ContractContext } from '../contexts/ContractContext';
import { TokenContext } from '../contexts/TokenContext';
import {
  addLiquidity,
  calculateQuoteTokenAmount,
} from '../methods/AddLiquidity';
import { Chains } from '../types';

function AddLiquidity() {
  const { contracts } = useContext(ContractContext);
  const {
    baseTokenDecimals,
    quoteTokenDecimals,
    userBaseTokenBalance,
    userQuoteTokenBalance,
  } = useContext(TokenContext);

  const account = useAccount();
  const [baseTokenAmt, setBaseTokenAmt] = useState<string>('');
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [quoteTokenAmt, setQuoteTokenAmt] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const baseTokenAmountChanged = async (value: string) => {
    try {
      let valueToSet = value;
      let qTokenAmount = '0';

      // Not letting user set more value than the user has
      if (parseFloat(value) > parseFloat(userBaseTokenBalance)) {
        valueToSet = userBaseTokenBalance;
      }

      setBaseTokenAmt(valueToSet);

      if (valueToSet) {
        const { quoteTokenAmount: calculatedQuoteTokenAmount } =
          await calculateQuoteTokenAmount(contracts, valueToSet);

        qTokenAmount = calculatedQuoteTokenAmount.toString();
      }

      setQuoteTokenAmt(qTokenAmount);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  const addLiquidityClicked = async () => {
    try {
      setSuccess('');
      setDisableBtn(true);

      const result = await addLiquidity(
        account.address!,
        account.chain?.name as Chains,
        contracts,
        userBaseTokenBalance,
        userQuoteTokenBalance,
        baseTokenAmt,
        baseTokenDecimals,
        quoteTokenAmt,
        quoteTokenDecimals
      );

      setSuccess(`Success! Tx hash: ${result}`);
      setDisableBtn(false);
    } catch (e) {
      console.error(e);
      setDisableBtn(false);
      setError(e.message);
    }
  };

  return (
    <div className='content-container'>
      <Alerts error={error} success={success} />

      <TokenAmountRow
        onClickCallback={() => baseTokenAmountChanged(userBaseTokenBalance)}
        title={`${userBaseTokenBalance} Base token(s)`}
      />

      <StyledTextField
        focused
        fullWidth
        id='base-amount'
        label='Base token amount'
        required
        onChange={(e) => baseTokenAmountChanged(e.target.value)}
        type='number'
        value={baseTokenAmt}
        variant='outlined'
      />

      <AddIcon className='icon' />

      <TokenAmountRow title={`${userQuoteTokenBalance} Quote token(s)`} />

      <StyledTextField
        disabled
        focused
        fullWidth
        id='quote-amount'
        label='Equivalent Quote token amount'
        required
        type='number'
        value={quoteTokenAmt}
        variant='outlined'
      />

      <Button
        className='action-button'
        disabled={disableBtn}
        fullWidth
        onClick={addLiquidityClicked}
        variant='contained'
      >
        Add Liquidity
      </Button>
    </div>
  );
}

export default AddLiquidity;
