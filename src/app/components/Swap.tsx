'use client';

import Button from '@mui/material/Button';
import { useContext, useState } from 'react';
import { useAccount } from 'wagmi';
import Alerts from './Alerts';
import { StyledSwapIcon } from './styled/StyledSwapIcon';
import { StyledTextField } from './styled/StyledTextField';
import TokenAmountRow from './TokenAmountRow';
import { ContractContext } from '../contexts/ContractContext';
import { TokenContext } from '../contexts/TokenContext';
import { calculateBuyTokenAmount, swap } from '../methods/Swap';
import { Chains, Tokens } from '../types';

function Swap() {
  const { contracts } = useContext(ContractContext);
  const { baseTokenDecimals, userBaseTokenBalance, userQuoteTokenBalance } =
    useContext(TokenContext);

  const account = useAccount();
  const [baseTokenAmt, setBaseTokenAmt] = useState<string>('');
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSellBase, setIsSellBase] = useState<boolean>(true);
  const [quoteTokenAmt, setQuoteTokenAmt] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const sellTokenAmountChanged = async (value: string) => {
    try {
      let valueToSet = value;
      let buyTokenAmount = '0';

      // Not letting user set more value than the user has
      const balanceToCompareAgainst = isSellBase
        ? userBaseTokenBalance
        : userQuoteTokenBalance;
      if (parseFloat(value) > parseFloat(balanceToCompareAgainst)) {
        valueToSet = userBaseTokenBalance;
      }

      if (isSellBase) {
        setBaseTokenAmt(valueToSet);
      } else {
        setQuoteTokenAmt(valueToSet);
      }

      if (valueToSet) {
        const result = await calculateBuyTokenAmount(
          contracts,
          isSellBase,
          valueToSet
        );

        buyTokenAmount = result.buyTokenAmount.toString();
      }

      if (isSellBase) {
        setQuoteTokenAmt(buyTokenAmount);
      } else {
        setBaseTokenAmt(buyTokenAmount);
      }
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  const rowTitle = (sellRow: boolean) => {
    let balance;
    let token;

    if (sellRow) {
      balance = isSellBase ? userBaseTokenBalance : userQuoteTokenBalance;
      token = isSellBase ? Tokens.Base : Tokens.Quote;
    } else {
      balance = isSellBase ? userQuoteTokenBalance : userBaseTokenBalance;
      token = isSellBase ? Tokens.Quote : Tokens.Base;
    }

    return `${balance} ${token} token(s)`;
  };

  const swapClicked = async () => {
    try {
      setDisableBtn(true);
      setSuccess('');
      setError('');

      const [hash, _receipt] = await swap(
        contracts,
        account.chain?.name as Chains,
        isSellBase,
        isSellBase ? baseTokenAmt : quoteTokenAmt,
        isSellBase ? quoteTokenAmt : baseTokenAmt,
        isSellBase ? userBaseTokenBalance : userQuoteTokenBalance,
        baseTokenDecimals
      );

      setSuccess(`Success! Tx hash: ${hash}`);
      setDisableBtn(false);
    } catch (e) {
      console.error(e);
      setDisableBtn(false);
      setError(e.message);
    }
  };

  return (
    <div className='content-container'>
      <Alerts error={error} loading={disableBtn} success={success} />

      <TokenAmountRow
        onClickCallback={() =>
          sellTokenAmountChanged(
            isSellBase ? userBaseTokenBalance : userQuoteTokenBalance
          )
        }
        title={rowTitle(true)}
      />

      <StyledTextField
        focused
        fullWidth
        id='sell-token-amount'
        label={`${isSellBase ? Tokens.Base : Tokens.Quote} token amount`}
        required
        onChange={(e) => sellTokenAmountChanged(e.target.value)}
        type='number'
        value={isSellBase ? baseTokenAmt : quoteTokenAmt}
        variant='outlined'
      />

      <StyledSwapIcon
        className='icon'
        onClick={() => setIsSellBase(!isSellBase)}
      />

      <TokenAmountRow title={rowTitle(false)} />

      <StyledTextField
        disabled
        focused
        fullWidth
        id='buy-token-amount'
        label={`Equivalent ${isSellBase ? Tokens.Quote : Tokens.Base} token amount`}
        required
        type='number'
        value={isSellBase ? quoteTokenAmt : baseTokenAmt}
        variant='outlined'
      />

      <Button
        className='action-button'
        disabled={disableBtn}
        fullWidth
        onClick={swapClicked}
        variant='contained'
      >
        Swap
      </Button>
    </div>
  );
}

export default Swap;
