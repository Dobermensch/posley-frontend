'use client';

import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import { useContext, useState } from 'react';
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import { config } from '@/wagmi';
import Alerts from './Alerts';

import { MockGoldAbi, MockUSDCAbi } from '../constants';
import { ContractContext } from '../contexts/ContractContext';
import { Tokens } from '../types';

const StyledButton = styled(Button)({
  marginBottom: '10px',
});

function MintTokens() {
  const { contracts } = useContext(ContractContext);

  const [disableBaseToken, setDisableBaseToken] = useState<boolean>(false);
  const [disableQuoteToken, setDisableQuoteToken] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const mintToken = async (token: Tokens) => {
    try {
      setSuccess('');
      setError('');

      if (token === Tokens.Base) {
        setDisableBaseToken(true);
      } else {
        setDisableQuoteToken(true);
      }

      const hash = await writeContract(config, {
        abi: token === Tokens.Base ? MockGoldAbi : MockUSDCAbi,
        functionName: 'mint',
        address:
          token === Tokens.Base
            ? contracts.MockGoldAddress
            : contracts.MockUSDCAddress,
      });

      const _receipt = await waitForTransactionReceipt(config, {
        hash,
      });

      setSuccess(`Success! Tx hash: ${hash}`);
      if (token === Tokens.Base) {
        setDisableBaseToken(false);
      } else {
        setDisableQuoteToken(false);
      }
    } catch (e) {
      console.error(e);
      setError(e.message);
      if (token === Tokens.Base) {
        setDisableBaseToken(false);
      } else {
        setDisableQuoteToken(false);
      }
    }
  };

  return (
    <div className='content-container'>
      <Alerts
        error={error}
        loading={disableBaseToken || disableQuoteToken}
        success={success}
      />

      <StyledButton
        disabled={disableBaseToken}
        onClick={() => mintToken(Tokens.Base)}
        variant='contained'
      >
        Mint Base Token
      </StyledButton>
      <StyledButton
        disabled={disableQuoteToken}
        onClick={() => mintToken(Tokens.Quote)}
        variant='contained'
      >
        Mint Quote Token
      </StyledButton>
    </div>
  );
}

export default MintTokens;
