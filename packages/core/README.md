# @megotickets/core

Core components and utilities for MegoTickets React components library.

## Installation

```bash
npm install @megotickets/core
```

## Usage

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

## Components

- `MegoButton` - Customizable button component
- `Loader` - Loading spinner component
- `CustomizationProvider` - Theme and customization context provider
- `LanguageSelector` - Language selection component
- `MegoPopup` - Popup/modal component
- `Web3ClientProvider` - Web3 client context provider

## License

MIT
