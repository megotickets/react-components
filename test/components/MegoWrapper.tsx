'use client'
import { Web3Provider, WalletButton } from "@mego/components";
import '@mego/components/dist/index.css';

export default function MegoWrapper() {
    return(
        <Web3Provider>
            <WalletButton/>
        </Web3Provider>
    )
}
