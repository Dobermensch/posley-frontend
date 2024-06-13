'use client';

import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import './page.css';
import MainContent from './components/MainContent';
import { Chains } from './types';

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [isSupportedChain, setIsSupportedChain] = useState<boolean>(false);
  const [isDev, setIsDev] = useState<boolean>(false);

  useEffect(() => {
    const supportedChains = [Chains.Sepolia];
    if (process?.env?.NODE_ENV === 'development') {
      supportedChains.push(Chains.Hardhat);
      setIsDev(true);
    }

    setIsSupportedChain(
      supportedChains.includes(account.chain?.name as Chains)
    );
  }, [account.chain]);

  return (
    <>
      <div className='wallet-status-container'>
        <div>
          <div>
            status: {account.status}
            <br />
          </div>

          {account.status === 'connected' && (
            <>
              addresses: {JSON.stringify(account.addresses)}
              <br />
              chainId: {account.chainId}
              <br />
              <Button
                variant='contained'
                color='error'
                onClick={() => disconnect()}
              >
                Disconnect
              </Button>
            </>
          )}
        </div>

        {account.status !== 'connected' && (
          <div className='connect-button'>
            {connectors
              .filter((c) => c.name === 'MetaMask')
              .map((connector) => (
                <Button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  variant='contained'
                >
                  Connect
                </Button>
              ))}
            <div>{status}</div>
            <div>{error?.message}</div>
          </div>
        )}
        {account.status === 'connected' && !isSupportedChain && (
          <div>
            {`Please switch your network to ${isDev ? 'Hardhat or ' : ''} Ethereum
            Sepolia`}
          </div>
        )}
      </div>

      {account && isSupportedChain && <MainContent />}
    </>
  );
}

export default App;
