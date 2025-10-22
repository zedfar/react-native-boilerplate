# Expo React Native Boilerplate

A comprehensive boilerplate for building React Native applications with Expo, featuring authentication, theming, and a clean architecture.

## Features

- ✅ **Expo Router** - File-based routing
- ✅ **TypeScript** - Type-safe development
- ✅ **NativeWind (Tailwind CSS)** - Utility-first styling
- ✅ **Authentication Context** - Global auth state management
- ✅ **Theme Support** - Light/Dark mode with system preference
- ✅ **Mock API Server** - JSON Server for development
- ✅ **Secure Storage** - Expo SecureStore for sensitive data
- ✅ **Path Aliases** - Clean imports with `@` prefix
- ✅ **Form Validation** - Built-in validation utilities
- ✅ **Reusable Components** - Button, Input, Card, Loading, etc.

## Project Structure

```
.
├── app
│   ├── (admin)              # Halaman & route khusus admin
│   ├── (auth)               # Halaman auth (login, register, dsb)
│   ├── (protected)          # Halaman yang membutuhkan autentikasi
│   └── _layout.tsx          # Root layout untuk Expo Router
│
├── server
│   ├── db.json              # Mock data untuk JSON Server
│   ├── middleware.js        # Custom middleware untuk API
│   └── routes.json          # Routing konfigurasi JSON Server
│
├── src
│   ├── assets               # Gambar, font, dan aset statis
│   ├── components           # Komponen UI reusable
│   ├── contexts             # Context API (Auth, Theme, dsb)
│   ├── hooks                # Custom React hooks
│   ├── services             # API service (Axios, interceptors, dll)
│   ├── theme                # Konfigurasi tema (warna, dark mode)
│   ├── types                # TypeScript type definitions
│   └── utils                # Helper functions & constants
│
├── app.json                 # Konfigurasi Expo project
├── babel.config.js          # Konfigurasi Babel
├── expo-env.d.ts            # Type definitions untuk Expo environment
├── global.css               # Global style untuk Tailwind / NativeWind
├── index.ts                 # Entry point utama aplikasi
├── LICENSE                  # Lisensi project
├── metro.config.js          # Konfigurasi Metro bundler
├── nativewind-env.d.ts      # Type support untuk NativeWind
├── package.json             # Dependency & script project
├── package-lock.json        # Lock file npm
├── README.md                # Dokumentasi project
├── structure.txt            # Struktur folder (auto-generated)
├── tailwind.config.js       # Konfigurasi TailwindCSS
└── tsconfig.json            # Konfigurasi TypeScript

```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd expo-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will start both the Expo development server and the mock API server.

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run server` - Start mock API server
- `npm run dev` - Start both Expo and API server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Configuration

### API Configuration

Edit `src/utils/constants.ts` to configure your API endpoints:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3001' : 'https://api.yourapp.com',
  TIMEOUT: 10000,
};
```

### Theme Configuration

Customize colors in `src/theme/colors.ts`:

```typescript
export const colors = {
  light: {
    primary: '#3b82f6',
    // ... other colors
  },
  dark: {
    primary: '#3b82f6',
    // ... other colors
  },
};
```

## Authentication

The boilerplate includes a complete authentication flow:

### Default Credentials

- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

### Using Authentication

```typescript
import { useAuth } from '@hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Use authentication methods
}
```

## Theming

Switch between light and dark themes:

```typescript
import { useTheme } from '@hooks/useTheme';

function MyComponent() {
  const { theme, colors, setThemeMode } = useTheme();
  
  // theme: 'light' | 'dark'
  // colors: current theme colors
  // setThemeMode: 'light' | 'dark' | 'auto'
}
```

## API Services

### Making API Calls

```typescript
import { newsService } from '@services/newsService';

// Get all news
const news = await newsService.getNews({ limit: 10 });

// Get single news item
const newsItem = await newsService.getNewsById('1');

// Create news
const newNews = await newsService.createNews({
  title: 'New Article',
  content: 'Content here',
  // ...
});
```

## Custom Hooks

### useAuth

Access authentication state and methods.

### useTheme

Access theme configuration and toggle themes.

## Components

### Button

```typescript
<Button
  title="Click Me"
  variant="primary"
  size="md"
  onPress={() => {}}
  loading={false}
  fullWidth
/>
```

### Input

```typescript
<Input
  label="Email"
  placeholder="Enter email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  secureTextEntry
/>
```

### Card

```typescript
<Card className="mb-4">
  <Text>Card content</Text>
</Card>
```

### Loading

```typescript
<Loading text="Loading..." fullScreen />
```

## Path Aliases

Use clean imports with configured path aliases:

```typescript
import { Button } from '@components/common/Button';
import { useAuth } from '@hooks/useAuth';
import { newsService } from '@services/newsService';
```

## Deployment

### Building for Production

```bash
# For Android
eas build --platform android

# For iOS
eas build --platform ios

# For both
eas build --platform all
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this boilerplate for your projects!

## Support

For issues and questions, please open an issue on GitHub.