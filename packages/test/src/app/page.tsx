"use client";

import { MegoWalletButton, Web3MegoClientProvider } from "@megotickets/wallet";
import { Web3Provider } from "@megotickets/core"
import { BuyTicketProvider } from "@megotickets/payments";
import { MegoPreview } from "../components/status/MegoPreview";

//import "./globals.css";

export default function Home() {
  return (
    <div>
      <h1>@megotickets/wallet</h1>
      <Web3Provider>
        {/* @ts-ignore */}
        <Web3MegoClientProvider>
          {/* @ts-ignore */}
          <BuyTicketProvider>
            <MegoWalletButton
              /* providerConfiguration={{
                appleProvider: false,
                googleProvider: false,
                emailProvider: false,
                walletConnectProvider: false,
              }} */
              forceChainId={0}
              customStyle={{
                /* megoWalletIconStyle: {
                  stroke: 'black',
                }, */
                modalStyle: {
                  /* headerStyle: {
                    backgroundColor: 'red',
                    borderRadius: '10px',
                  }, */
                  /* bodyStyle: {
                    background: 'linear-gradient(to right, #000000,rgb(109, 21, 21))',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }, */
                  /* buttonStyle: {
                    backgroundColor: 'purple',
                    borderRadius: '10px',
                    border: '1px solid #000',
                    boxShadow: '0 0 10px 0 rgba(33, 7, 179, 0.5)',
                  }, */
                }
                /* megoWalletContainerStyle: {
                  border: '3px solid purple',
                  color: 'purple',
                }, */
                /* megoWalletPosition: 'center', */
                /* customButtonOverrideComponent: {
                  appleButton: <button>Apple</button>,
                  googleButton: <button>Google</button>,
                  emailButton: <button>Email</button>,
                  walletConnectButton: <button>WalletConnect</button>,
                } */
              }}
            />
            <div className="mt-10">
              <MegoPreview />
            </div>
          </BuyTicketProvider>
        </Web3MegoClientProvider>
      </Web3Provider>
    </div>
  );
}
