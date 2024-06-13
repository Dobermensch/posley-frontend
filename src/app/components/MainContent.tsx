'use client';

import { Button, ButtonGroup } from '@mui/material';
import { useContext } from 'react';
import AddLiquidity from './AddLiquidity';
import MintTokens from './MintTokens';
import RemoveLiquidity from './RemoveLiquidity';
import Swap from './Swap';
import { TokenContext } from '../contexts/TokenContext';
import { Tabs } from '../types';

function MainContent() {
  const { tab, setActiveTab } = useContext(TokenContext);

  return (
    <>
      <ButtonGroup
        aria-label='Basic button group'
        className='tab-bar'
        variant='outlined'
      >
        <Button
          className={tab === Tabs.SWAP ? 'active-tab' : ''}
          onClick={() => setActiveTab(Tabs.SWAP)}
        >
          Swap
        </Button>
        <Button
          className={tab === Tabs.ADD_LIQUIDITY ? 'active-tab' : ''}
          onClick={() => setActiveTab(Tabs.ADD_LIQUIDITY)}
        >
          Add Liquidity
        </Button>
        <Button
          className={tab === Tabs.REMOVE_LIQUIDITY ? 'active-tab' : ''}
          onClick={() => setActiveTab(Tabs.REMOVE_LIQUIDITY)}
        >
          Remove Liquidity
        </Button>
        <Button
          className={tab === Tabs.MINT_TOKENS ? 'active-tab' : ''}
          onClick={() => setActiveTab(Tabs.MINT_TOKENS)}
        >
          Mint Tokens
        </Button>
      </ButtonGroup>

      {tab === Tabs.SWAP && <Swap />}
      {tab === Tabs.ADD_LIQUIDITY && <AddLiquidity />}
      {tab === Tabs.REMOVE_LIQUIDITY && <RemoveLiquidity />}
      {tab === Tabs.MINT_TOKENS && <MintTokens />}
    </>
  );
}

export default MainContent;
