import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { formatUnits } from 'viem/utils';
import { useAccount } from 'wagmi';
import { ContractContext } from './ContractContext';
import { DefaultDecimals } from '../constants';
import {
  getBaseTokenBalance,
  getQuoteTokenBalance,
  getTokensDecimals,
} from '../methods/AddLiquidity';
import { Tabs } from '../types';

interface TokenContextType {
  baseTokenDecimals: number;
  quoteTokenDecimals: number;
  reload: boolean;
  setActiveTab: (tab: Tabs) => void;
  setBaseTokenDecimals: (num: number) => void;
  setQuoteTokenDecimals: (num: number) => void;
  setReload: (val: boolean) => void;
  setUserBaseTokenBalance: (balance: string) => void;
  setUserQuoteTokenBalance: (balance: string) => void;
  tab: Tabs;
  userBaseTokenBalance: string;
  userQuoteTokenBalance: string;
}

export const TokenContext = createContext<TokenContextType>({
  baseTokenDecimals: DefaultDecimals,
  quoteTokenDecimals: DefaultDecimals,
  reload: false,
  setActiveTab: () => {},
  setBaseTokenDecimals: () => {},
  setQuoteTokenDecimals: () => {},
  setReload: () => {},
  setUserBaseTokenBalance: () => {},
  setUserQuoteTokenBalance: () => {},
  tab: Tabs.MINT_TOKENS,
  userBaseTokenBalance: '0',
  userQuoteTokenBalance: '0',
});

export const TokenProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const account = useAccount();
  const { contracts } = useContext(ContractContext);
  const [baseTokenDecimals, setBaseTokenDecimals] =
    useState<number>(DefaultDecimals);
  const [quoteTokenDecimals, setQuoteTokenDecimals] =
    useState<number>(DefaultDecimals);
  const [reload, setReload] = useState<boolean>(false);
  const [userBaseTokenBalance, setUserBaseTokenBalance] = useState<string>('');
  const [userQuoteTokenBalance, setUserQuoteTokenBalance] =
    useState<string>('');
  const [tab, setActiveTab] = useState<Tabs>(Tabs.MINT_TOKENS);

  useEffect(() => {
    const getTokenDecimalsAsync = async () => {
      const result = await getTokensDecimals(contracts);
      const [quoteDecimals, baseDecimals] = result;
      if (quoteDecimals !== 0) setQuoteTokenDecimals(quoteDecimals);
      if (baseDecimals !== 0) setBaseTokenDecimals(baseDecimals);
    };

    try {
      if (contracts && Object.keys(contracts)?.length) getTokenDecimalsAsync();
    } catch (e) {
      console.error(e);
    }
  }, [account.chain, contracts]);

  useEffect(() => {
    const getUserTokenBalances = async () => {
      const baseTokenBalanceResult = await getBaseTokenBalance(
        contracts,
        account.address!
      );
      if (baseTokenBalanceResult) {
        setUserBaseTokenBalance(
          formatUnits(baseTokenBalanceResult as bigint, baseTokenDecimals)
        );
      }

      const quoteTokenBalanceResult = await getQuoteTokenBalance(
        contracts,
        account.address!
      );
      if (quoteTokenBalanceResult) {
        setUserQuoteTokenBalance(
          formatUnits(quoteTokenBalanceResult as bigint, quoteTokenDecimals)
        );
      }
    };

    try {
      if (contracts && Object.keys(contracts)?.length) getUserTokenBalances();
    } catch (e) {
      console.error(e);
    }
  }, [
    account.address,
    baseTokenDecimals,
    contracts,
    quoteTokenDecimals,
    reload,
    tab,
  ]);

  const contextValue = {
    baseTokenDecimals,
    quoteTokenDecimals,
    reload,
    setActiveTab,
    setBaseTokenDecimals,
    setQuoteTokenDecimals,
    setReload,
    setUserBaseTokenBalance,
    setUserQuoteTokenBalance,
    tab,
    userBaseTokenBalance,
    userQuoteTokenBalance,
  };

  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  );
};
