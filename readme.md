# @megotickets/react-components

A comprehensive React components library for building Web3 ticketing applications with integrated wallet functionality and payment processing.

## 📦 Packages

This monorepo contains three main packages:

- **[@megotickets/core](./packages/core/)** - Core components and utilities
- **[@megotickets/payments](./packages/payments/)** - Payment processing components
- **[@megotickets/wallet](./packages/wallet/)** - Web3 wallet integration components

## 🚀 Installation

### Install all packages
```bash
npm install @megotickets/core @megotickets/payments @megotickets/wallet
```

### Or install individual packages
```bash
# Core components
npm install @megotickets/core

# Payment processing
npm install @megotickets/payments

# Wallet integration
npm install @megotickets/wallet
```

## 📋 Prerequisites

- React 18.0.0 or higher
- React DOM 18.0.0 or higher

## 🛠️ Usage

### Core Components

```tsx
import { MegoButton, Loader, CustomizationProvider } from '@megotickets/core';

function App() {
  return (
    <CustomizationProvider>
      <MegoButton onClick={() => console.log('Clicked!')}>
        Click me
      </MegoButton>
      <Loader />
    </CustomizationProvider>
  );
}
```

### Payment Components

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

### Wallet Components

```tsx
import { WalletButton, MegoModal } from '@megotickets/wallet';

function WalletPage() {
  return (
    <div>
      <WalletButton />
      <MegoModal />
    </div>
  );
}
```

## 🏗️ Development

### Prerequisites
- Node.js 18+
- pnpm 8+

### Setup
```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build:all

# Build individual packages
pnpm build:core
pnpm build:payments
pnpm build:mego
```

### Development Mode
```bash
# Start development server for all packages
pnpm dev

# Start individual package development
pnpm dev:core
pnpm dev:payments
pnpm dev:mego
```

## 📁 Project Structure

```
packages/
├── core/           # Core components and utilities
├── payments/       # Payment processing components
└── wallet/         # Web3 wallet integration
```

## 🔧 Configuration

### TypeScript
All packages are built with TypeScript and include type definitions.

### Styling
Components use CSS modules and styled-components for styling.

### Web3 Integration
- Supports multiple wallet providers
- Ethereum, Polygon, Arbitrum, Optimism networks
- ERC-20 token support

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- GitHub Issues: [Report bugs or request features](https://github.com/megotickets/react-components/issues)
- Documentation: [View full documentation](https://github.com/megotickets/react-components#readme)

## 🔗 Links

- [Homepage](https://github.com/megotickets/react-components#readme)
- [GitHub Repository](https://github.com/megotickets/react-components)
- [NPM Package](https://www.npmjs.com/package/@megotickets/react-components)