import React from 'react';
import { useBuyTicketContext } from "../context/BuyTicketContext"
import { useAccount, useLanguage } from "@megotickets/core";
import AppleWalletIcon from './icons/AppleWalletIcon';
import GoogleWalletIcon from './icons/GoogleWalletIcon';
import QrCodeIcon from './icons/QrCodeIcon';
import "../css/pay.css";
export const BuyTicketClaim: React.FC = () => {

    const { claimData } = useBuyTicketContext()
    const { address } = useAccount()
    const { t } = useLanguage()

    const downloadQrCode = (base64: string) => {
        const link = document.createElement('a');
        link.href = base64;
        link.download = 'qr-code.png';
        link.click();
    }

    return (
        <div className="payment-stepper-container">
            <h1 className="font-satoshi">{t('buyTicketClaim', 'payments')}</h1>
            <p className="font-satoshi">{t('congratulations', 'payments')}</p>
            <p className="font-satoshi">{t('yourTicketIsReady', 'payments')}</p>
            <p className="font-satoshi">{t('sentTo', 'payments')}: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            <button
                className={`mego-modal-button mego-apple font-satoshi`}
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                onClick={() => {
                    downloadQrCode(claimData.qr.qr)
                }}>
                <QrCodeIcon height={50} width={50} style={{ marginRight: '0.5rem' }} />
                {t('downloadQRCode', 'payments')}
            </button>
            <button
                className={`mego-modal-button mego-apple font-satoshi`}
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                onClick={() => {
                    window.open('https://tickets-api.mego.tools' + claimData.appleWalletUrl, '_blank')
                }}>
                <AppleWalletIcon height={50} width={50} style={{ marginRight: '0.5rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
                    <p className="font-satoshi">{t('addto', 'payments')}</p>
                    <p className="font-satoshi">{t('appleWallet', 'payments')}</p>
                </div>
            </button>
            <button
                className={`mego-modal-button mego-apple font-satoshi`}
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                onClick={() => {
                    window.open(claimData.googleWalletUrl, '_blank')
                }}>
                <GoogleWalletIcon height={50} width={50} style={{ marginRight: '0.5rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
                    <p className="font-satoshi">{t('addto', 'payments')}</p>
                    <p className="font-satoshi">{t('googleWallet', 'payments')}</p>
                </div>
            </button>
        </div>
    )
}