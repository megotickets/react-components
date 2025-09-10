import { obtainNfts } from '@/utils/BuyTicketUtils';
import { useAccount } from '@megotickets/core';
import React, { useEffect, useMemo, useState } from 'react';
import { MyTicket } from './MyTicket';
import "../css/pay.css";
import { useLanguage } from '@megotickets/core';
import { getLoginDataInfo } from '@/utils/LoginUtils';
import { TicketCustomStyle } from '../interfaces/TicketCustomStyle';
interface TicketUserNFTProps {
  // This component is a placeholder for now, so we'll keep the props minimal
  userId?: string;
  eventIdentifier: string;
  customStyle?: TicketCustomStyle;
}

export const TicketUserNFT: React.FC<TicketUserNFTProps> = ({ userId, eventIdentifier, customStyle }) => {
  const { t } = useLanguage()
  const { address } = useAccount();
  const [owneds, setOwneds] = useState<any[]>([]);
  let count = 0;

  const userAddress = getLoginDataInfo()?.loggedAs || ""

  //Check userNfts
  const obtainUserNfts = async () => {
    if (userAddress) {
      const nfts = await obtainNfts(eventIdentifier, userAddress);
      setOwneds(nfts?.owned || []);
    }
  }

  useEffect(() => {
    if (count === 0) {
      obtainUserNfts();
      count++;
    }
  }, [address, userAddress]);

  return (
    <div 
      className="ticket-block-container"
      style={{
        backgroundColor: customStyle?.userNFTBackgroundColor,
        ...customStyle?.userNFTContainerStyle
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <p 
          className="ticket-block-title font-satoshi"
          style={{
            color: customStyle?.titleTextColor || customStyle?.primaryTextColor
          }}
        >
          {t('myTickets', 'payments')}
        </p>
      </div>

      <div 
        className="ticket-user-nft-container"
        style={customStyle?.nftContainerStyle}
      >
        {owneds.length > 0 ? (
          owneds.map((nft) => (
            <MyTicket
              nft={nft}
              key={nft.tokenId}
              tokenId={nft.tokenId}
              image={nft?.metadata?.image}
              customStyle={customStyle}
            />
          ))
        ) : (
            <p 
              className="font-satoshi" 
              style={{ 
                color: customStyle?.secondaryTextColor || '#9CA3AF', 
                fontSize: '0.875rem' 
              }}
            >
              {t('noTicketsAvailableYet', 'payments')}
            </p>
        )}
      </div>
    </div>
  );
};