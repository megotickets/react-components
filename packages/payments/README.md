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
      {/* Show all sections (default behavior) */}
      <Ticket 
        ticketId="your-ticket-id" 
        googleMapsApiKey="your-google-maps-api-key"
      />
      
      {/* Show only header and payment sections */}
      <Ticket 
        ticketId="your-ticket-id" 
        showHeader={true}
        showPayment={true}
        showLocation={false}
        showUserNFT={false}
      />
      
      {/* Show only the location section */}
      <Ticket 
        ticketId="your-ticket-id" 
        googleMapsApiKey="your-google-maps-api-key"
        showHeader={false}
        showPayment={false}
        showLocation={true}
        showUserNFT={false}
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

#### Display Control Props (all default to `true`)

- `showHeader` (boolean, optional) - Show/hide the ticket header section
- `showPayment` (boolean, optional) - Show/hide the payment section
- `showLocation` (boolean, optional) - Show/hide the location section
- `showUserNFT` (boolean, optional) - Show/hide the user NFT section

## License

MIT
