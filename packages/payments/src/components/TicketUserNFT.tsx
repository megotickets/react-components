import { obtainNfts } from '@/utils/BuyTicketUtils';
import { useAccount } from '@megotickets/core';
import React, { useEffect, useState } from 'react';
import { MyTicket } from './MyTicket';
import "../css/pay.css";
interface TicketUserNFTProps {
  // This component is a placeholder for now, so we'll keep the props minimal
  userId?: string;
  eventIdentifier: string;
}

export const TicketUserNFT: React.FC<TicketUserNFTProps> = ({ userId, eventIdentifier }) => {

  const { address } = useAccount();
  const [owneds, setOwneds] = useState<any[]>([]);
  let count = 0;

  //Check userNfts
  const obtainUserNfts = async () => {
    if (address) {
      const nfts = await obtainNfts(eventIdentifier, address);
      setOwneds(nfts?.owned || []);
    }
  }

  useEffect(() => {
    if (count === 0) {
      obtainUserNfts();
      count++;
    }
  }, [address]);

  return (
    <div className="ticket-block-container">
      <div style={{ marginBottom: '1rem' }}>
        <p className="ticket-block-title">My Tickets</p>
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
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>No tickets available yet</p>
        )}
      </div>
    </div>
  );
};