# @megotickets/payments

Payment processing components for MegoTickets React components library.

## Installation

```bash
npm install @megotickets/payments
```

## Usage

```tsx
import { Ticket, MegoBuyTicketModal, BuyTicketForm } from '@megotickets/payments';

function PaymentPage() {
  return (
    <div>
      <Ticket 
        ticketId="your-ticket-id" 
        googleMapsApiKey="your-google-maps-api-key"
      />
      <MegoBuyTicketModal>
        <BuyTicketForm />
      </MegoBuyTicketModal>
    </div>
  );
}
```

## Components

- `Ticket` - Ticket display component with Google Maps integration
- `MegoBuyTicketModal` - Main ticket purchase modal
- `BuyTicketForm` - Ticket purchase form
- `BuyTicketWithCrypto` - Cryptocurrency payment component
- `BuyTicketWithStripe` - Stripe payment component
- `MyTicket` - User's ticket management component

### Ticket Component Props

- `ticketId` (string, required) - The ID of the ticket to display
- `googleMapsApiKey` (string, optional) - Google Maps API key for location display
- `showOnlyButton` (boolean, optional) - Show only the claim/buy button
- `overrideButton` (ReactNode, optional) - Custom button to override the default
- `onTicketLoad` (function, optional) - Callback when ticket data is loaded
- `metadataConfig` (array, optional) - Configuration for metadata fields
- `shareEmail` (object, optional) - Email sharing configuration
- `redirectUrl` (string, optional) - URL to redirect after actions

## License

MIT
