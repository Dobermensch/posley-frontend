import React, {
  FC,
  ReactNode,
  createContext,
  useEffect,
  useState,
} from 'react';
import { useAccount } from 'wagmi';
import { Contracts } from '../constants';
import { Chains, ContractsAddresses } from '../types';

interface ContractContextType {
  contracts: ContractsAddresses;
  changeContracts: (chain: Chains) => void;
}

export const ContractContext = createContext<ContractContextType>({
  contracts: Contracts[Chains.Hardhat]!,
  changeContracts() {},
});

export const ContractProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const account = useAccount();
  const [contracts, setContracts] = useState<ContractsAddresses>(
    Contracts[Chains.Hardhat]!
  );

  useEffect(() => {
    if (account.chain?.name) {
      changeContracts(account.chain?.name as Chains);
    }
  }, [account.chain]);

  const changeContracts = (chain: Chains) => {
    setContracts(Contracts[chain]!);
  };

  const contextValue = {
    contracts,
    changeContracts,
  };

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
};
