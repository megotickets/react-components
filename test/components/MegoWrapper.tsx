'use client'
import { Web3Provider, WalletButton } from "@mego/components";

export default function MegoWrapper() {
    return(
        <Web3Provider>
            <WalletButton/>
        </Web3Provider>
    )
}
