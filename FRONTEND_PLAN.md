# Invoizmo Frontend Implementation Plan

## 🎨 Theme System First!

App-level dark mode with customizable color themes is the foundation.

---

## Table of Contents

1. [Directory Structure](#1-directory-structure)
2. [Theme System Architecture](#2-theme-system-architecture)
3. [Tech Stack & Dependencies](#3-tech-stack--dependencies)
4. [Implementation Phases](#4-implementation-phases)
5. [Color Themes](#5-color-themes)
6. [Settings Page Design](#6-settings-page-design)

---

## 1. Directory Structure

```
invoizmo/
├── frontend/
│   ├── public/
│   │   ├── invoizmo.png              # Main logo
│   │   └── favicon.ico
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout with theme provider
│   │   │   ├── globals.css            # CSS variables + theme definitions
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx         # Protected layout with sidebar
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── invoices/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── preview/page.tsx
│   │   │   │   ├── clients/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── items/page.tsx
│   │   │   │   ├── payments/page.tsx
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   └── settings/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── branding/page.tsx
│   │   │   │       ├── appearance/page.tsx  # Theme settings
│   │   │   │       └── account/page.tsx
│   │   │   └── invoice/[publicId]/page.tsx
│   │   ├── lib/
│   │   │   ├── env.ts
│   │   │   ├── api/
│   │   │   │   ├── client.ts
│   │   │   │   └── refreshClient.ts
│   │   │   ├── theme/
│   │   │   │   ├── themes.ts          # Pre-defined color themes
│   │   │   │   ├── types.ts           # Theme type definitions
│   │   │   │   └── utils.ts           # Theme utility functions
│   │   │   └── utils.ts
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx
│   │   │   └── tokenStore.ts
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Dropdown.tsx
│   │   │   │   ├── Tooltip.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Switch.tsx
│   │   │   │   ├── Slider.tsx
│   │   │   │   └── ColorPicker.tsx    # Custom color picker
│   │   │   ├── theme/
│   │   │   │   ├── ThemeProvider.tsx   # Main theme provider
│   │   │   │   ├── ThemeToggle.tsx     # Light/Dark/System toggle
│   │   │   │   ├── ColorThemeSelector.tsx
│   │   │   │   └── CustomThemeEditor.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Topbar.tsx
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   └── Logo.tsx            # Uses invoizmo.png
│   │   │   ├── invoice/
│   │   │   │   ├── InvoiceForm.tsx
│   │   │   │   ├── LineItemsTable.tsx
│   │   │   │   ├── InvoicePreview.tsx
│   │   │   │   ├── InvoiceStatusBadge.tsx
│   │   │   │   └── InvoiceTemplateSelector.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── RevenueChart.tsx
│   │   │   │   ├── InvoiceStatusChart.tsx
│   │   │   │   └── RecentInvoices.tsx
│   │   │   ├── RequireAuth.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── features/
│   │   │   ├── invoices/api.ts
│   │   │   ├── clients/api.ts
│   │   │   ├── items/api.ts
│   │   │   ├── payments/api.ts
│   │   │   ├── analytics/api.ts
│   │   │   └── users/api.ts
│   │   └── hooks/
│   │       ├── useTheme.ts
│   │       └── useLocalStorage.ts
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
```

---

## 2. Theme System Architecture

### CSS Variables Approach (App-Level)

```css
/* globals.css */

/* Base CSS Variables - Light Mode */
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(222.2 84% 4.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(222.2 84% 4.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(222.2 84% 4.9%);
  
  /* Theme-specific will be set by data-theme */
  --primary: hsl(222.2 47.4% 11.2%);
  --primary-foreground: hsl(210 40% 98%);
  --secondary: hsl(210 40% 96.1%);
  --secondary-foreground: hsl(222.2 47.4% 11.2%);
  --muted: hsl(210 40% 96.1%);
  --muted-foreground: hsl(215.4 16.3% 46.9%);
  --accent: hsl(210 40% 96.1%);
  --accent-foreground: hsl(222.2 47.4% 11.2%);
  
  --destructive: hsl(0 84.2% 60.2%);
  --destructive-foreground: hsl(210 40% 98%);
  --border: hsl(214.3 31.8% 91.4%);
  --input: hsl(214.3 31.8% 91.4%);
  --ring: hsl(222.2 84% 4.9%);
  --radius: 0.5rem;
}

/* Dark Mode Overrides */
.dark {
  --background: hsl(222.2 84% 4.9%);
  --foreground: hsl(210 40% 98%);
  --card: hsl(222.2 84% 4.9%);
  --card-foreground: hsl(210 40% 98%);
  --popover: hsl(222.2 84% 4.9%);
  --popover-foreground: hsl(210 40% 98%);
  --secondary: hsl(217.2 32.6% 17.5%);
  --secondary-foreground: hsl(210 40% 98%);
  --muted: hsl(217.2 32.6% 17.5%);
  --muted-foreground: hsl(215 20.2% 65.1%);
  --accent: hsl(217.2 32.6% 17.5%);
  --accent-foreground: hsl(210 40% 98%);
  --destructive: hsl(0 62.8% 30.6%);
  --destructive-foreground: hsl(210 40% 98%);
  --border: hsl(217.2 32.6% 17.5%);
  --input: hsl(217.2 32.6% 17.5%);
  --ring: hsl(212.7 26.8% 83.9%);
}

/* Color Theme Variations (data-theme attribute) */
[data-theme="slate"] {
  --primary: hsl(222.2 47.4% 11.2%);
  --primary-foreground: hsl(210 40% 98%);
  --ring: hsl(222.2 84% 4.9%);
}

[data-theme="blue"] {
  --primary: hsl(221.2 83.2% 53.3%);
  --primary-foreground: hsl(210 40% 98%);
  --ring: hsl(221.2 83.2% 53.3%);
}

[data-theme="purple"] {
  --primary: hsl(262.1 83.3% 57.8%);
  --primary-foreground: hsl(210 40% 98%);
  --ring: hsl(262.1 83.3% 57.8%);
}

[data-theme="emerald"] {
  --primary: hsl(160.1 84.1% 39.4%);
  --primary-foreground: hsl(210 40% 98%);
  --ring: hsl(160.1 84.1% 39.4%);
}

[data-theme="rose"] {
  --primary: hsl(346.8 77.2% 49.8%);
  --primary-foreground: hsl(210 40% 98%);
  --ring: hsl(346.8 77.2% 49.8%);
}

[data-theme="amber"] {
  --primary: hsl(37.3 92.1% 50.2%);
  --primary-foreground: hsl(210 40% 98%);
  --ring: hsl(37.3 92.1% 50.2%);
}

[data-theme="cyan"] {
  --primary: hsl(180 94.3% 32.9%);
  --primary-foreground: hsl(210 40% 98%);
  --ring: hsl(180 94.3% 32.9%);
}

[data-theme="violet"] {
  --primary: hsl(258.3 89.5% 66.3%);
  --primary-foreground: hsl(210 40% 98%);
  --ring: hsl(258.3 89.5% 66.3%);
}
```

### Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

---

## 3. Tech Stack & Dependencies

### Frontend Dependencies

| Package | Purpose | Notes |
|---------|---------|-------|
| `next` | Next.js 14+ with App Router | Latest stable |
| `react` | React 19 | |
| `typescript` | TypeScript | Strict mode |
| `tailwindcss` | CSS framework | v4 |
| `tailwindcss-animate` | Animations | |
| `@tanstack/react-query` | Server state | |
| `axios` | HTTP client | |
| `react-hook-form` | Forms | |
| `zod` | Validation | |
| `recharts` | Charts | |
| `lucide-react` | Icons | |
| `clsx` | Class merging | |
| `tailwind-merge` | Class merging | |
| `framer-motion` | Animations (optional) | |
| `react-colorful` | Color picker | |

### Installation Order

```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint
npm install @tanstack/react-query axios react-hook-form zod recharts lucide-react clsx tailwind-merge react-colorful
npm install -D tailwindcss-animate @types/node
```

---

## 4. Implementation Phases

### Phase 1: Foundation & Theme System (Highest Priority)

**Goal:** Get theme system working end-to-end

1. **Setup Next.js project**
   - Initialize Next.js with TypeScript + Tailwind
   - Configure `tsconfig.json`
   - Setup `.env.example`

2. **Implement theme system**
   - Create `globals.css` with CSS variables
   - Configure `tailwind.config.ts`
   - Create `ThemeProvider.tsx`
   - Create `useTheme.ts` hook
   - Create theme utility functions in `lib/theme/`

3. **Build core UI components**
   - `Logo.tsx` (uses invoizmo.png)
   - `ThemeToggle.tsx` (Light/Dark/System)
   - `ColorThemeSelector.tsx`
   - `Button.tsx`
   - `Card.tsx`
   - `Input.tsx`

4. **Test theme system**
   - Create test page to verify theme switching
   - Verify localStorage persistence
   - Verify sync with user preferences

### Phase 2: Auth & Layout

1. **Auth system**
   - `AuthProvider.tsx`
   - `tokenStore.ts`
   - `RequireAuth.tsx`
   - API client setup

2. **Layout components**
   - `Sidebar.tsx`
   - `Topbar.tsx` (with theme toggle)
   - Dashboard layout

3. **Auth pages**
   - Login page
   - Register page

### Phase 3: Settings & Theme Customization

1. **Settings pages**
   - Settings main page
   - `/settings/appearance` - Theme settings
   - `/settings/branding` - Business branding
   - `/settings/account` - Account settings

2. **Theme customization UI**
   - Light/Dark/System toggle
   - Pre-defined color theme selector
   - Custom color picker
   - Preview of changes

### Phase 4: Core Features

1. Dashboard
2. Invoices (list, create, edit, preview)
3. Clients
4. Items
5. Payments
6. Analytics

---

## 5. Color Themes

### Pre-defined Themes

| Theme | Primary Color | Description |
|-------|---------------|-------------|
| `slate` | #1e293b | Default dark professional |
| `blue` | #3b82f6 | Trustworthy blue |
| `purple` | #8b5cf6 | Creative purple |
| `emerald` | #10b981 | Fresh green |
| `rose` | #f43f5e | Bold red |
| `amber` | #f59e0b | Warm orange |
| `cyan` | #06b6d4 | Techy cyan |
| `violet` | #8b5cf6 | Soft violet |

### Custom Theme Structure

```typescript
interface CustomThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
}
```

---

## 6. Settings Page Design

### `/settings/appearance` - Theme Settings Page

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ←  Settings                    [Logo]          User ▾  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Appearance                                                │
│  ───────────────────────────────────────────────────────  │
│                                                           │
│  Theme Mode                                               │
│  [ Light ] [ Dark ] [ System ]                          │
│                                                           │
│  Color Theme                                              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │██████│ │██████│ │██████│ │██████│                  │
│  │Slate │ │Blue  │ │Purple│ │Emerald│ ...             │
│  └──────┘ └──────┘ └──────┘ └──────┘                  │
│                                                           │
│  Custom Colors [Switch: Off]                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Primary: [🟦 #3b82f6]                          │  │
│  │ Secondary: [⬜ #f1f5f9]                         │  │
│  │ Accent: [🟨 #f59e0b]                            │  │
│  │ ... (11 color pickers total)                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  [ Reset to Default ]                          [ Save ]  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Topbar with Theme Toggle

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]                   Dashboard          [🌙] [🔔] [User ▾] │
└─────────────────────────────────────────────────────────────────┘
```

---

## Logo Usage

Place `invoizmo.png` in:
- `/frontend/public/invoizmo.png`

Use it in:
- `Logo.tsx` component
- Login/Register pages
- Sidebar
- Public invoice page

---

## Persistence Strategy

1. **Local Storage** - Instant theme changes
2. **User Database** - Sync across devices (saved on explicit save)

Theme flow:
1. On app load → check localStorage → apply theme
2. If user is logged in → fetch user preferences → override localStorage
3. On theme change → update localStorage immediately
4. On explicit "Save" in settings → sync to backend

---

## Next Steps

1. Initialize Next.js frontend project
2. Implement theme system (Phase 1)
3. Build auth & layout (Phase 2)
4. Create settings pages with theme customization (Phase 3)
5. Implement core features (Phase 4)

