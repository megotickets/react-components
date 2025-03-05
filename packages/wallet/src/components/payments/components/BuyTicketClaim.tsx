import React from 'react';
import { useBuyTicketContext } from "../context/BuyTicketContext"
import { useAccount } from 'wagmi';

export const BuyTicketClaim: React.FC = () => {

    const { claimData } = useBuyTicketContext()
    const { address } = useAccount()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start', height: '100%' }}>
            <h1>Buy Ticket Claim</h1>
            <p>Congratulations!</p>
            <p>Your ticket is ready!</p>
            <p>sent to: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            <button onClick={() => {
                window.open(claimData.qr, '_blank')
            }}>
                Download QR Code
            </button>
            <button onClick={() => {
                window.open(claimData.appleWalletUrl, '_blank')
            }}>
                Add to Apple Wallet
            </button>
            <button onClick={() => {
                window.open(claimData.googleWalletUrl, '_blank')
            }}>
                Add to Google Wallet
            </button>
        </div>
    )
}