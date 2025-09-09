# MegoTickets React Components Demo

This is a simple React application built with Vite that demonstrates the integration of MegoTickets React components:

- `@megotickets/core` - Core components and utilities
- `@megotickets/wallet` - Web3 wallet integration components  
- `@megotickets/payments` - Payment processing components

## Features

This demo showcases:

### Core Components (`@megotickets/core`)
- **Web3Provider** - Main provider for Web3 functionality
- **MegoButton** - Custom button component with loading states
- **MegoPopup** - Popup component for notifications (success, error, info)
- **LanguageSelector** - Language selection component (English/Italian)
- **useLanguage** - Hook for language management

### Wallet Components (`@megotickets/wallet`)
- **Web3MegoClientProvider** - Provider for Mego wallet client
- **MegoWalletButton** - Main wallet connection button with built-in modal
- **useWeb3Context** - Hook for accessing Web3 context and user state

### Payment Components (`@megotickets/payments`)
- **BuyTicketProvider** - Provider for ticket purchasing functionality
- **Ticket** - Component for displaying and managing tickets
- **ClaimTicketButton** - Button for claiming tickets

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the provided local URL (usually `http://localhost:5173`)

## Project Structure

```
src/
├── App.tsx          # Main application component with demo
├── App.css          # Styling for the demo
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## Usage Examples

### Basic Wallet Integration
```tsx
import { Web3Provider } from '@megotickets/core'
import { Web3MegoClientProvider, MegoWalletButton, useWeb3Context } from '@megotickets/wallet'

function App() {
  return (
    <Web3Provider>
      <Web3MegoClientProvider>
        <MegoWalletButton 
          customStyle={{
            megoWalletPosition: 'center',
            modalStyle: {
              headerStyle: { backgroundColor: '#6366f1' },
              bodyStyle: { backgroundColor: '#f8fafc' }
            }
          }}
          providerConfiguration={{
            googleProvider: true,
            appleProvider: true,
            emailProvider: true,
            walletConnectProvider: true
          }}
        />
      </Web3MegoClientProvider>
    </Web3Provider>
  )
}
```

### Payment Components
```tsx
import { BuyTicketProvider, Ticket, ClaimTicketButton, MegoMetadataInputType, ShareEmailOptions } from '@megotickets/payments'

function PaymentDemo() {
  return (
    <BuyTicketProvider>
      <Ticket 
        ticketId="your-ticket-id"
        onTicketLoad={(data) => console.log('Ticket loaded:', data)}
        metadataConfig={[
          {
            metadata: 'name',
            type: MegoMetadataInputType.TEXT,
            placeholder: { en: 'Enter your name', it: 'Inserisci il tuo nome' },
            labelTranslations: { en: 'Full Name', it: 'Nome Completo' }
          },
          {
            metadata: 'email',
            type: MegoMetadataInputType.EMAIL,
            placeholder: { en: 'Enter your email', it: 'Inserisci la tua email' },
            labelTranslations: { en: 'Email Address', it: 'Indirizzo Email' }
          }
        ]}
        shareEmail={ShareEmailOptions.OPTIONAL}
      />
      
      <ClaimTicketButton 
        eventDetails={{
          id: 'event-id',
          name: 'Event Name',
          date: '2024-12-31',
          location: 'Event Location'
        }}
        buttonText="Claim Your Ticket"
        metadataConfig={[
          {
            metadata: 'attendee_name',
            type: MegoMetadataInputType.TEXT,
            placeholder: { en: 'Your name', it: 'Il tuo nome' },
            labelTranslations: { en: 'Attendee Name', it: 'Nome Partecipante' }
          }
        ]}
      />
    </BuyTicketProvider>
  )
}
```

## Configuration

The components support various configuration options:

- **Custom Styling**: Customize modal styles, button styles, and positioning
- **Provider Configuration**: Enable/disable different authentication providers (Google, Apple, Email, WalletConnect)
- **Language Support**: Multi-language support with translations (English/Italian)
- **Metadata Configuration**: Custom form fields for ticket data collection with proper TypeScript types
- **Popup Modalities**: Success, error, and info popup notifications

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Dependencies

- React 18
- Vite
- @megotickets/core
- @megotickets/wallet  
- @megotickets/payments

## Notes

- This project uses React 18 to ensure compatibility with the MegoTickets components
- The components include Web3 functionality and require proper provider setup
- **MegoWalletButton** includes built-in modal functionality - no separate modal component needed
- **WalletConnectButton** has been removed to avoid duplicate modal containers
- All components use proper TypeScript types for better development experience
- Some components may require additional configuration for production use
- Check the individual component documentation for detailed usage instructions

## Recent Updates

- ✅ Fixed import errors and component organization
- ✅ Removed duplicate modal containers
- ✅ Corrected TypeScript types and imports
- ✅ Removed standalone WalletConnect button to prevent conflicts
- ✅ Updated component examples with proper type usage
- ✅ Added multi-language support examples

## Support

For more information about MegoTickets components, visit:
- [MegoTickets React Components Repository](https://github.com/megotickets/react-components)
- [Test Package Configuration](https://github.com/megotickets/react-components/tree/main/packages/test)