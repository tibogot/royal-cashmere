# Fonts Directory

Place your custom font files (`.woff2`, `.woff`) in this directory.

## Usage

Import fonts in `app/layout.tsx` using `next/font/local`:

```typescript
import localFont from 'next/font/local';

const customFont = localFont({
  src: './fonts/YourFont-Regular.woff2',
  variable: '--font-custom',
  weight: '400',
});
```

## Recommended Format

- Use `.woff2` format for best compression and performance
- Include multiple weights/styles if needed:
  - Regular (400)
  - Bold (700)
  - Italic (400, italic)
  - etc.

