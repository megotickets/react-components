import React, { useMemo } from 'react';
import { useBuyTicketContext } from "../context/BuyTicketContext"
import { useAccount, useLanguage } from "@megotickets/core";
import AppleWalletIcon from './icons/AppleWalletIcon';
import GoogleWalletIcon from './icons/GoogleWalletIcon';
import QrCodeIcon from './icons/QrCodeIcon';
import "../css/pay.css";

export const BuyTicketClaim: React.FC = () => {
    const { claimData, redirectUrl, amountOfTicket } = useBuyTicketContext()
    const { t } = useLanguage()

    const downloadQrCode = (base64: string) => {
        const link = document.createElement('a');
        link.href = base64;
        link.download = 'qr-code.png';
        link.click();
    }

    if (redirectUrl) {
        window.location.href = redirectUrl;
        return null;
    }

    return (
        <div className="payment-stepper-container">
            <p style={{ color: 'white', marginBottom: '1rem' }} className="font-satoshi">
                {amountOfTicket > 1 ? t('yourTicketsAreReady', 'payments') : t('yourTicketIsReady', 'payments')}
            </p>

            <div className="claimScrollArea">
                {claimData?.map((claim: any, index: number) => (
                    <div key={index} style={{ 
                        flex: '0 0 100%',
                        scrollSnapAlign: 'start',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        {claim?.qr && (
                            <div className="mb-6 mt-6 bg-white p-2 inline-block rounded-lg shadow-md">
                                <img
                                    src={claim.qr}
                                    alt="QR Code Ticket"
                                    className="w-40 h-40 object-contain"
                                />
                            </div>
                        )}
                        <button
                            className={`mego-modal-button mego-apple font-satoshi`}
                            style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', cursor: claimData?.qr ? 'pointer' : 'not-allowed', opacity: claimData?.qr ? 1 : 0.5 }}
                            onClick={() => downloadQrCode(claim.qr)}
                            disabled={!claim?.qr?.qr}>
                            <QrCodeIcon height={50} width={50} style={{ marginRight: '0.5rem' }} />
                            {t('downloadQRCode', 'payments')}
                        </button>
                        <button
                            className={`mego-modal-button mego-apple font-satoshi`}
                            style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                            onClick={() => window.open('https://tickets-api.mego.tools' + claim.appleWalletUrl, '_blank')}>
                            <AppleWalletIcon height={50} width={50} style={{ marginRight: '0.5rem' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
                                <p className="font-satoshi">{t('addto', 'payments')}</p>
                                <p className="font-satoshi">{t('appleWallet', 'payments')}</p>
                            </div>
                        </button>
                        <button
                            className={`mego-modal-button mego-apple font-satoshi`}
                            style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                            onClick={() => window.open(claimData.googleWalletUrl, '_blank')}>
                            <GoogleWalletIcon height={50} width={50} style={{ marginRight: '0.5rem' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
                                <p className="font-satoshi">{t('addto', 'payments')}</p>
                                <p className="font-satoshi">{t('googleWallet', 'payments')}</p>
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}