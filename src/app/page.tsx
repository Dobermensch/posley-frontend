'use client';

import Button from '@mui/material/Button';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import './page.css';
import MainContent from './components/MainContent';

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

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
      </div>

      {account && account.chain?.name && <MainContent />}
    </>
  );
}

export default App;
