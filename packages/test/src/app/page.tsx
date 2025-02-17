"use client";

import { Web3Provider, MegoWalletButton, Web3MegoClientProvider } from "@megotickets/wallet";
import "@megotickets/wallet/dist/index.css";
//import "./globals.css";

export default function Home() {
  return (
    <div>
      <h1>@megotickets/wallet</h1>
      <Web3Provider>
        <Web3MegoClientProvider>
          <MegoWalletButton
            customStyle={{
              modalStyle: {
                headerStyle: {
                  backgroundColor: 'red',
                  borderRadius: '10px',
                },
                bodyStyle: {
                  background: 'linear-gradient(to right, #000000,rgb(109, 21, 21))',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                },
                buttonStyle: {
                  backgroundColor: 'purple',
                  borderRadius: '10px',
                  border: '1px solid #000',
                  boxShadow: '0 0 10px 0 rgba(33, 7, 179, 0.5)',
                },
              },
              connectButtonStyle: {
                backgroundColor: 'purple',
                borderRadius: '10px',
                border: '1px solid #000',
                boxShadow: '0 0 10px 0 rgba(33, 7, 179, 0.5)',
              },
            }}
            /* customButtonOverrideComponent={{
              appleButton: <button>Apple</button>,
              googleButton: <button>Google</button>,
              emailButton: <button>Email</button>,
              walletConnectButton: <button>WalletConnect</button>,
            }} */
            customMegoWalletIconContainerStyle={{
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'center',
              borderRadius: '10px',
              padding: '10px',
            }}
          />
        </Web3MegoClientProvider>
      </Web3Provider>
    </div>
  );
}
