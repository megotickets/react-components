import { obtainNfts } from '@/utils/BuyTicketUtils';
import { useAccount } from '@megotickets/core';
import React, { useEffect, useMemo, useState } from 'react';
import { MyTicket } from './MyTicket';
import "../css/pay.css";
import { useLanguage } from '@megotickets/core';
import { getLoginDataInfo } from '@/utils/LoginUtils';
interface TicketUserNFTProps {
  // This component is a placeholder for now, so we'll keep the props minimal
  userId?: string;
  eventIdentifier: string;
}

export const TicketUserNFT: React.FC<TicketUserNFTProps> = ({ userId, eventIdentifier }) => {
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
    <div className="ticket-block-container">
      <div style={{ marginBottom: '1rem' }}>
        <p className="ticket-block-title font-satoshi">{t('myTickets', 'payments')}</p>
      </div>

      <div className="ticket-user-nft-container">
        {owneds.length > 0 ? (
          owneds.map((nft) => (
            <MyTicket
              key={nft.tokenId}
              tokenId={nft.tokenId}
              image={nft?.metadata?.image}
            />
          ))
        ) : (
            <p className="font-satoshi" style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>{t('noTicketsAvailableYet', 'payments')}</p>
        )}
      </div>
    </div>
  );
};