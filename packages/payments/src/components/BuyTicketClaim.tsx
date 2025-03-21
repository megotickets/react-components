import React from 'react';
import { useBuyTicketContext } from "../context/BuyTicketContext"
import { useAccount } from "@megotickets/core";
import AppleWalletIcon from './icons/AppleWalletIcon';
import GoogleWalletIcon from './icons/GoogleWalletIcon';
import QrCodeIcon from './icons/QrCodeIcon';

export const BuyTicketClaim: React.FC = () => {

    const { claimData } = useBuyTicketContext()
    const { address } = useAccount()

    const downloadQrCode = (base64: string) => {
        const link = document.createElement('a');
        link.href = base64;
        link.download = 'qr-code.png';
        link.click();
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start', height: '100%' }}>
            <h1>Buy Ticket Claim</h1>
            <p>Congratulations!</p>
            <p>Your ticket is ready!</p>
            <p>sent to: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            <button
                className={`mego-modal-button mego-apple`}
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                onClick={() => {
                    downloadQrCode(claimData.qr.qr)
                }}>
                <QrCodeIcon height={50} width={50} style={{ marginRight: '0.5rem' }} />
                Download QR Code
            </button>
            <button
                className={`mego-modal-button mego-apple`}
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                onClick={() => {
                    window.open('https://tickets-api.mego.tools' + claimData.appleWalletUrl, '_blank')
                }}>
                <AppleWalletIcon height={50} width={50} style={{ marginRight: '0.5rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
                    <p>Add to</p>
                    <p>APPLE WALLET</p>
                </div>
            </button>
            <button
                className={`mego-modal-button mego-apple`}
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                onClick={() => {
                    window.open(claimData.googleWalletUrl, '_blank')
                }}>
                <GoogleWalletIcon height={50} width={50} style={{ marginRight: '0.5rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
                    <p>Add to</p>
                    <p>GOOGLE WALLET</p>
                </div>
            </button>
        </div>
    )
}