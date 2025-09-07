# @megotickets/payments

Payment processing components for MegoTickets React components library.

## Installation

```bash
npm install @megotickets/payments
```

## Usage

```tsx
import { MegoBuyTicketModal, BuyTicketForm } from '@megotickets/payments';

function PaymentPage() {
  return (
    <MegoBuyTicketModal>
      <BuyTicketForm />
    </MegoBuyTicketModal>
  );
}
```

## Components

- `MegoBuyTicketModal` - Main ticket purchase modal
- `BuyTicketForm` - Ticket purchase form
- `BuyTicketWithCrypto` - Cryptocurrency payment component
- `BuyTicketWithStripe` - Stripe payment component
- `Ticket` - Ticket display component
- `MyTicket` - User's ticket management component

## License

MIT
