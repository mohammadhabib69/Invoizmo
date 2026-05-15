# Invoizmo — Product Requirements Document (PRD)
### Invoice Generator SaaS · MERN + Next.js · Version 1.0

> **Brand:** Invoizmo
> **Industry:** Invoice Generator SaaS
> **Color Theme:** `#090909` · `#B1B6B3` · `#1F292D` · `#1D1E22` · `#707173`
> **Audience:** Development team, AI coding assistants, stakeholders
> **Purpose:** Full-stack blueprint, feature specifications, API contracts, data models, and security checklist for Invoizmo

---

## ⚠️ Version Safety Rule (Read First)

> **Never copy version numbers from this document into `package.json`.** Always web-search each dependency for its latest stable release and any active CVEs before installing.

```bash
npm show <package-name> version       # latest published
npm audit                             # installed tree
```

**For AI assistants:** Before writing any `package.json`, web-search `"<pkg> npm latest version"` and `"<pkg> CVE"` for every dependency. State what you verified. Never copy semver literals from this file.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Environment Variables](#4-environment-variables)
5. [Data Models](#5-data-models)
6. [Feature Specifications](#6-feature-specifications)
7. [Backend Architecture](#7-backend-architecture)
8. [API Documentation](#8-api-documentation)
9. [Backend Security Checklist](#9-backend-security-checklist)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Frontend Security Checklist](#11-frontend-security-checklist)
12. [UI/UX Specifications](#12-uiux-specifications)
13. [Postman & Testing Guide](#13-postman--testing-guide)
14. [Master Prompts](#14-master-prompts)
15. [CI & Git Hygiene](#15-ci--git-hygiene)

---

## 1. Executive Summary

### Product Vision

Invoizmo is a dark-themed, professional Invoice Generator SaaS that enables freelancers, agencies, and small businesses to create, send, track, and manage invoices entirely online — with a fast, clean, no-clutter experience.

### Core Value Propositions

- **Speed** — Create a professional invoice in under 60 seconds
- **Automation** — Recurring invoices, overdue reminders, and payment tracking on autopilot
- **Branding** — Customizable invoice templates with logo and color theming
- **Insight** — Revenue dashboards, payment reports, and client analytics
- **PDF Generation** — One-click, print-ready PDF export and email delivery

### Target Users

| Segment | Pain Point Solved |
|---|---|
| Freelancers | Manual invoicing, chasing payments, no professional format |
| Agencies | Recurring client billing, multi-currency, bulk PDF generation |
| Small Businesses | Overdue tracking, cash flow visibility, client management |
| Consultants | Project-based billing, time tracking, milestone invoices |

### Business Model

- **Free Tier** — 5 invoices/month, 2 clients, 1 template, basic PDF
- **Pro Tier ($12/month)** — Unlimited invoices/clients, all templates, recurring, analytics, custom branding
- **Business Tier ($29/month)** — Multi-user (up to 5), priority support, white-label PDF, API access

---

## 2. Tech Stack

> **Reminder:** Verify every package below via `npm show <pkg> version` and advisory search before use.

| Layer | Choice | Notes |
|---|---|---|
| **Runtime** | Node.js Active LTS | Search `"Node.js LTS current release"` — never pin from docs |
| **Frontend Framework** | Next.js (App Router) | SSR for public invoice views; CSR for dashboard |
| **UI Library** | React | Bundled with Next.js |
| **Styling** | Tailwind CSS | Dark theme: `#090909`, `#1F292D`, `#1D1E22` backgrounds |
| **Backend Framework** | Express | Search `npm show express version` — verify major line |
| **Language** | TypeScript | Strict mode both frontend and backend |
| **Database** | MongoDB Atlas | Cloud-hosted, IP allowlist required |
| **ODM** | Mongoose | Match driver with Atlas version |
| **Validation** | Zod | Env + request bodies + form schemas |
| **Auth** | Email/Password only | JWT access + refresh tokens |
| **JWT** | jsonwebtoken | Search + advisory check |
| **Password Hashing** | bcryptjs | Cost factor ≥ 10 |
| **Security Headers** | helmet | Tune CSP for Next.js SPA |
| **CORS** | cors | Explicit origin allowlist only |
| **Rate Limiting** | express-rate-limit | Strict on auth routes |
| **NoSQL Sanitize** | express-mongo-sanitize | Prevent injection |
| **PDF Generation** | puppeteer OR @react-pdf/renderer | Server-side PDF from invoice template HTML |
| **Email** | nodemailer | SMTP via Resend / SendGrid |
| **File Storage** | Cloudinary | Logo uploads via signed upload URL |
| **Job Scheduling** | node-cron | Overdue reminders, recurring invoice creation |
| **Logging** | winston | Structured production logs — no PII |
| **Monitoring** | @sentry/node | Error tracking, scrub sensitive data |
| **Server State** | TanStack Query | Caching + retries on frontend |
| **HTTP Client** | Axios | Interceptors for token refresh |
| **Forms** | React Hook Form + Zod | All forms validated before submit |
| **HTML Sanitize** | DOMPurify | XSS prevention for user-generated content |
| **PDF Viewer** | react-pdf OR iframe | Preview before send |
| **Charts** | Recharts | Dashboard analytics |
| **Deploy: Frontend** | Vercel | Next.js native; set env vars in dashboard |
| **Deploy: Backend** | Render / Railway | Set env vars; IP allowlist on Atlas |
| **Deploy: DB** | MongoDB Atlas | M0 free → M10 production |

**Token Lifetime Standard:**
- Access JWT: `15 minutes` — sent in `Authorization: Bearer` header
- Refresh token: `7 days` — stored in `HttpOnly; Secure; SameSite=Strict` cookie

---

## 3. Repository Structure

```
invoizmo/
├── backend/
│   ├── src/
│   │   ├── server.ts                    # Entry: DB connect → cron start → listen
│   │   ├── app.ts                       # Express app: middleware stack + route mounts
│   │   ├── config/
│   │   │   ├── env.ts                   # Zod-validated env — crash on bad config
│   │   │   ├── db.ts                    # mongoose.connect + disconnect
│   │   │   └── cloudinary.ts            # Cloudinary SDK config
│   │   ├── middleware/
│   │   │   ├── requireAuth.ts           # JWT verify → attach req.user
│   │   │   ├── validate.ts              # Zod schema factory → 400 on failure
│   │   │   ├── roleGuard.ts             # Subscription-level guard
│   │   │   └── errorHandler.ts          # Central error → standard JSON shape
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.schema.ts
│   │   │   ├── users/
│   │   │   │   ├── user.routes.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   └── user.schema.ts
│   │   │   ├── clients/
│   │   │   │   ├── client.routes.ts
│   │   │   │   ├── client.controller.ts
│   │   │   │   ├── client.service.ts
│   │   │   │   ├── client.model.ts
│   │   │   │   └── client.schema.ts
│   │   │   ├── invoices/
│   │   │   │   ├── invoice.routes.ts
│   │   │   │   ├── invoice.controller.ts
│   │   │   │   ├── invoice.service.ts
│   │   │   │   ├── invoice.model.ts
│   │   │   │   ├── invoice.schema.ts
│   │   │   │   └── invoice.pdf.ts       # Puppeteer PDF generation logic
│   │   │   ├── items/                   # Reusable line-item catalog
│   │   │   │   ├── item.routes.ts
│   │   │   │   ├── item.controller.ts
│   │   │   │   ├── item.service.ts
│   │   │   │   ├── item.model.ts
│   │   │   │   └── item.schema.ts
│   │   │   ├── payments/
│   │   │   │   ├── payment.routes.ts
│   │   │   │   ├── payment.controller.ts
│   │   │   │   ├── payment.service.ts
│   │   │   │   ├── payment.model.ts
│   │   │   │   └── payment.schema.ts
│   │   │   └── analytics/
│   │   │       ├── analytics.routes.ts
│   │   │       ├── analytics.controller.ts
│   │   │       └── analytics.service.ts
│   │   ├── services/
│   │   │   ├── email.service.ts         # Nodemailer: invoice email, reminders
│   │   │   ├── pdf.service.ts           # PDF generation wrapper
│   │   │   ├── cron.service.ts          # Overdue reminders + recurring invoices
│   │   │   └── cloudinary.service.ts    # Signed upload URL generation
│   │   ├── utils/
│   │   │   ├── jwt.ts                   # signAccess, signRefresh, verify
│   │   │   ├── ownershipCheck.ts        # Assert resource belongs to req.user
│   │   │   ├── tokenCompare.ts          # crypto.timingSafeEqual wrapper
│   │   │   ├── invoiceNumber.ts         # Auto-incremented invoice number generator
│   │   │   └── currency.ts             # Amount formatting helpers (cents)
│   │   └── types/
│   │       ├── express.d.ts             # Augment Express Request with req.user
│   │       └── invoice.types.ts         # Shared TS types
│   ├── postman/
│   │   ├── collection.json
│   │   └── environment.json
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                         # Next.js App Router
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx           # Auth-protected shell
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── invoices/
│   │   │   │   │   ├── page.tsx         # Invoice list
│   │   │   │   │   ├── new/page.tsx     # Create invoice
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx     # View/Edit invoice
│   │   │   │   │       └── preview/page.tsx
│   │   │   │   ├── clients/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── items/page.tsx       # Item catalog
│   │   │   │   ├── payments/page.tsx
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   └── settings/
│   │   │   │       ├── page.tsx         # Profile + business info
│   │   │   │       ├── branding/page.tsx
│   │   │   │       └── account/page.tsx
│   │   │   └── invoice/[publicId]/      # Public invoice view (no auth)
│   │   │       └── page.tsx
│   │   ├── lib/
│   │   │   ├── env.ts                   # VITE_* Zod validation
│   │   │   └── api/
│   │   │       ├── client.ts            # Axios base + withCredentials + interceptors
│   │   │       └── refreshClient.ts     # Separate instance — no loop
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx
│   │   │   └── tokenStore.ts            # In-memory only
│   │   ├── components/
│   │   │   ├── RequireAuth.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ui/                      # Shared design system components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Dropdown.tsx
│   │   │   │   ├── Tooltip.tsx
│   │   │   │   └── Spinner.tsx
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
│   │   │   └── layout/
│   │   │       ├── Sidebar.tsx
│   │   │       ├── Topbar.tsx
│   │   │       └── PageHeader.tsx
│   │   └── features/
│   │       ├── invoices/api.ts          # TanStack Query hooks
│   │       ├── clients/api.ts
│   │       ├── items/api.ts
│   │       ├── payments/api.ts
│   │       └── analytics/api.ts
│   ├── public/
│   │   ├── logo.svg
│   │   └── invoice-templates/           # Static template preview images
│   ├── .env.example
│   ├── .gitignore
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── docs/
    ├── PRD.md                           # This file
    └── BACKEND_PLANNING.md
```

**Rules — never break:**
- Never commit `.env`, `node_modules`, `dist/`, `.next/`
- Always commit `.env.example` with placeholder values
- TypeScript strict mode always on — no `any` without typed comment
- All amounts stored in smallest currency unit (e.g., cents) — no floating point money

---

## 4. Environment Variables

### Backend `.env.example`

```env
# ── Server ──────────────────────────────────────────────────────────────
NODE_ENV=development
PORT=5000

# ── Database ─────────────────────────────────────────────────────────────
MONGODB_URI=mongodb://localhost:27017/invoizmo_dev
# Production: mongodb+srv://<user>:<pass>@cluster.mongodb.net/invoizmo

# ── JWT ───────────────────────────────────────────────────────────────────
# Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_ACCESS_SECRET=replace_with_64_char_hex
JWT_REFRESH_SECRET=replace_with_different_64_char_hex
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── Frontend URL ──────────────────────────────────────────────────────────
CLIENT_URL=http://localhost:3000

# ── CORS ──────────────────────────────────────────────────────────────────
CORS_ORIGINS=http://localhost:3000

# ── Email (Nodemailer) ────────────────────────────────────────────────────
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=your_smtp_api_key
EMAIL_FROM=invoices@invoizmo.com

# ── Cloudinary (Logo & asset uploads) ────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Password Reset ────────────────────────────────────────────────────────
# Generate: openssl rand -hex 32
PASSWORD_RESET_SECRET=replace_with_64_char_hex
PASSWORD_RESET_EXPIRES_IN=1h

# ── Monitoring ────────────────────────────────────────────────────────────
SENTRY_DSN=https://your_sentry_dsn_here

# ── Invoice Settings ──────────────────────────────────────────────────────
PUBLIC_INVOICE_BASE_URL=http://localhost:3000/invoice
```

### Frontend `.env.example`

```env
# ── API ───────────────────────────────────────────────────────────────────
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# ── App ───────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Cloudinary (public upload preset for logo) ────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=invoizmo_logos
```

### Env Validation — Backend

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number).default('5000'),
  MONGODB_URI: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().url(),
  CORS_ORIGINS: z.string(),
  EMAIL_FROM: z.string().email(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  PASSWORD_RESET_SECRET: z.string().min(32),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  PUBLIC_INVOICE_BASE_URL: z.string().url(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid env vars:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export const env = parsed.data;
```

---

## 5. Data Models

### User

```typescript
{
  _id: ObjectId,
  email: string,                          // unique, lowercase, trimmed
  password: string,                       // bcrypt hash — never plain
  firstName: string,
  lastName: string,
  isEmailVerified: boolean,               // default false
  emailVerificationToken: string | null,
  passwordResetToken: string | null,
  passwordResetExpires: Date | null,
  refreshTokens: [{                       // hashed — supports multi-device
    tokenHash: string,
    createdAt: Date,
    expiresAt: Date,
    userAgent: string,
  }],
  failedLoginAttempts: number,            // default 0
  lockedUntil: Date | null,              // TTL: null = not locked
  plan: 'free' | 'pro' | 'business',    // default 'free'
  planExpiresAt: Date | null,
  // Business / branding info
  businessName: string | null,
  businessAddress: {
    line1: string, line2: string | null,
    city: string, state: string, zip: string, country: string
  } | null,
  businessPhone: string | null,
  businessEmail: string | null,
  businessWebsite: string | null,
  logoUrl: string | null,                // Cloudinary URL
  // Invoice defaults
  defaultCurrency: string,               // ISO 4217 e.g. "USD"
  defaultTaxRate: number,                // percentage, e.g. 15 for 15%
  defaultPaymentTerms: number,           // days until due, e.g. 30
  defaultNotes: string | null,
  invoicePrefix: string,                 // e.g. "INV" → INV-0001
  invoiceCounter: number,                // auto-incremented
  defaultTemplate: string,               // template key e.g. "classic"
  accentColor: string,                   // hex, default "#1D1E22"
  isDeleted: boolean,
  deletedAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
```

### Client

```typescript
{
  _id: ObjectId,
  userId: ObjectId,                       // owner
  name: string,                           // full name or company name
  email: string,
  phone: string | null,
  company: string | null,
  website: string | null,
  address: {
    line1: string, line2: string | null,
    city: string, state: string, zip: string, country: string
  } | null,
  taxId: string | null,                  // VAT / GST number
  currency: string,                      // ISO 4217
  notes: string | null,
  totalInvoiced: number,                 // cents, denormalized for quick display
  totalPaid: number,                     // cents, denormalized
  isDeleted: boolean,
  deletedAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
```

### Item (Reusable Line-Item Catalog)

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  name: string,
  description: string | null,
  unitPrice: number,                     // cents
  unit: string,                          // e.g. "hr", "unit", "day", "project"
  taxable: boolean,
  isDeleted: boolean,
  createdAt: Date,
  updatedAt: Date,
}
```

### Invoice

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  clientId: ObjectId,
  invoiceNumber: string,                 // e.g. "INV-0042" — unique per user
  publicId: string,                      // nanoid — for public share link
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled',
  template: string,                      // "classic" | "modern" | "minimal"
  currency: string,
  issueDate: Date,
  dueDate: Date,
  lineItems: [{
    _id: ObjectId,
    itemId: ObjectId | null,             // optional link to catalog
    name: string,
    description: string | null,
    quantity: number,
    unitPrice: number,                   // cents
    unit: string,
    taxable: boolean,
    total: number,                       // computed: qty * unitPrice in cents
  }],
  subtotal: number,                      // cents — sum of taxable + non-taxable line items
  discountType: 'percentage' | 'fixed' | null,
  discountValue: number,                 // % or cents
  discountAmount: number,                // computed discount in cents
  taxRate: number,                       // percentage
  taxAmount: number,                     // computed in cents
  total: number,                         // cents — final amount
  amountPaid: number,                    // cents — sum of recorded payments
  amountDue: number,                     // cents — total - amountPaid
  notes: string | null,
  terms: string | null,
  // Sender snapshot (captured at issue time)
  fromName: string,
  fromEmail: string,
  fromAddress: object | null,
  fromPhone: string | null,
  fromLogoUrl: string | null,
  // Recurring
  isRecurring: boolean,
  recurringInterval: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | null,
  nextRecurringDate: Date | null,
  parentInvoiceId: ObjectId | null,     // links recurring children to parent
  // Reminders
  reminderSentAt: Date | null,
  overdueReminderSentAt: Date | null,
  // Metadata
  viewedAt: Date | null,
  sentAt: Date | null,
  paidAt: Date | null,
  isDeleted: boolean,
  deletedAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
```
{ userId: 1, invoiceNumber: 1 }  — unique
{ userId: 1, status: 1 }
{ userId: 1, clientId: 1 }
{ userId: 1, dueDate: 1 }
{ publicId: 1 }                  — unique (for public link)
{ userId: 1, isDeleted: 1, createdAt: -1 }
```

### Payment

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  invoiceId: ObjectId,
  clientId: ObjectId,
  amount: number,                        // cents
  currency: string,
  paymentDate: Date,
  paymentMethod: 'bank_transfer' | 'cash' | 'cheque' | 'card' | 'paypal' | 'crypto' | 'other',
  reference: string | null,             // transaction ID or cheque number
  notes: string | null,
  isDeleted: boolean,
  createdAt: Date,
  updatedAt: Date,
}
```

---

## 6. Feature Specifications

### 6.1 Authentication

| Feature | Description | Tier |
|---|---|---|
| Register | Email + password, email verification | All |
| Login | Email/password with account lockout (5 tries → 15 min) | All |
| Forgot Password | Token emailed, expires in 1 hour | All |
| Reset Password | Token validated server-side with timing-safe compare | All |
| Refresh Token | Rotation with breach detection | All |
| Logout | Cookie cleared + DB token revoked | All |
| Sessions | View and revoke active sessions | Pro+ |

### 6.2 Dashboard

| Widget | Description | Tier |
|---|---|---|
| Total Revenue (MTD) | Sum of paid invoices this month | All |
| Outstanding Amount | Sum of sent/overdue invoice amountDue | All |
| Overdue Count | Count of overdue invoices | All |
| Invoice Count (MTD) | Total invoices created this month | All |
| Revenue Trend Chart | Monthly bar/line chart (12 months) | Pro+ |
| Invoice Status Breakdown | Donut chart by status | All |
| Top Clients | Top 5 clients by revenue | Pro+ |
| Recent Invoices | Last 5 invoices with quick actions | All |
| Quick Create Button | Jump to new invoice form | All |

### 6.3 Invoice Management

| Feature | Description | Tier |
|---|---|---|
| Create Invoice | Add client, line items, discount, tax, notes, due date | All |
| Edit Invoice (draft) | Full edit of draft invoices | All |
| View Invoice | Read-only view with PDF preview | All |
| Duplicate Invoice | Clone an invoice as new draft | All |
| Delete Invoice | Soft delete with confirmation | All |
| Filter & Search | Filter by status, client, date range; search by number | All |
| Sort | By date, amount, client, status | All |
| Pagination | 20 per page | All |
| Bulk Actions | Mark as paid, send, delete (multi-select) | Pro+ |
| Invoice Numbering | Auto-incremented with user-defined prefix (INV-0001) | All |
| Templates | Classic, Modern, Minimal | Classic: All; Rest: Pro+ |
| Custom Accent Color | Matches brand color in PDF | Pro+ |
| Logo on Invoice | Uploaded via Cloudinary | Pro+ |
| Discount | Fixed or percentage discount field | All |
| Tax | Configurable tax rate per invoice | All |
| Notes & Terms | Footer text blocks | All |
| Multi-Currency | Issue in any ISO 4217 currency | Pro+ |
| Item Catalog | Save reusable line items | Pro+ |

### 6.4 Invoice Lifecycle

```
draft → sent → viewed → paid
              ↓
           overdue (if dueDate passed and not paid)
              ↓
           cancelled (manual)
```

**State Transition Rules:**
- Only `draft` → `sent` or `cancelled` is user-triggered
- `sent` → `viewed` triggered by client opening public link
- `sent`/`viewed` → `overdue` triggered by cron if `dueDate < now` and status ≠ paid
- Any status → `paid` when `amountPaid >= total`
- `paid` invoices cannot be edited
- `cancelled` invoices cannot be re-activated

### 6.5 PDF Generation

- Server-side generation via Puppeteer (headless Chromium renders HTML template)
- Template selection: classic, modern, minimal
- Content: logo, business info, client info, line items table, totals, notes, terms, QR code (public link)
- Downloadable from dashboard
- Attached to email when sending invoice
- Cached in memory for 60s to avoid re-render on repeated download

### 6.6 Send Invoice via Email

- Compose email with custom message
- PDF attached automatically
- "View Invoice Online" button links to public invoice page
- Reply-to set to user's business email
- Triggers `status = sent`, `sentAt = now`
- Rate limited: max 20 sends per hour per user

### 6.7 Public Invoice Page

- URL: `https://app.invoizmo.com/invoice/:publicId`
- No auth required — accessible by client
- Shows invoice details, totals, payment instructions
- "Mark as Viewed" fires on first load — updates invoice status to `viewed`
- Download PDF button
- Optional: "Pay Now" button (Phase 2 — payment gateway integration)

### 6.8 Clients

| Feature | Description |
|---|---|
| Create Client | Name, email, address, currency, tax ID |
| Edit Client | All fields |
| Delete Client | Soft delete; warn if active invoices exist |
| Client Detail | Invoice history, total invoiced, total paid |
| Search | Search by name or email |

### 6.9 Payments

| Feature | Description |
|---|---|
| Record Payment | Amount, date, method, reference |
| Partial Payment | Multiple payments per invoice |
| Payment History | Per-invoice list of payments |
| Auto-status | Invoice auto-marked paid when amountPaid ≥ total |

### 6.10 Recurring Invoices (Pro+)

- User marks invoice as recurring with interval: weekly / monthly / quarterly / yearly
- `node-cron` runs daily at 08:00 UTC
- On `nextRecurringDate`, creates a new draft invoice cloned from parent
- `nextRecurringDate` advances by interval
- Parent invoice stores `isRecurring: true`, children store `parentInvoiceId`

### 6.11 Automated Reminders (Pro+)

- Cron runs daily at 09:00 UTC
- **Due Soon Reminder:** sent 3 days before `dueDate` if status = sent/viewed and `reminderSentAt` is null
- **Overdue Reminder:** sent 1 day after `dueDate` if still unpaid; sets `status = overdue`
- **Second Overdue Reminder:** sent 7 days after `dueDate` if still unpaid

### 6.12 Settings

| Setting | Description |
|---|---|
| Profile | Name, email, password change |
| Business Info | Business name, address, phone, website, email |
| Branding | Logo upload (Cloudinary), accent color picker |
| Invoice Defaults | Default currency, tax rate, payment terms, prefix, notes, template |
| Account | Data export (GDPR), delete account (confirmation text required) |

### 6.13 Analytics (Pro+)

| Metric | Description |
|---|---|
| Revenue by Month | Bar chart: 12-month rolling |
| Invoice Status Breakdown | Donut chart |
| Top Clients by Revenue | Ranked list |
| Average Invoice Value | Computed |
| Payment Speed | Average days from sent to paid |
| Overdue Rate | % of invoices becoming overdue |
| Currency Breakdown | Revenue by currency (multi-currency users) |

---

## 7. Backend Architecture

### Middleware Stack Order (app.ts)

```typescript
// Order matters — never reorder without review
// 1. Sentry request handler (first)
app.use(Sentry.Handlers.requestHandler());

// 2. Security headers
app.use(helmet());

// 3. CORS — explicit origin allowlist, never '*' with credentials
app.use(cors({
  origin: env.CORS_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// 4. Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// 5. NoSQL injection prevention
app.use(mongoSanitize());

// 6. Request logging (dev only)
if (env.NODE_ENV === 'development') app.use(morgan('dev'));

// 7. Global rate limit (100 req/min per IP)
app.use('/api', rateLimit({ windowMs: 60_000, max: 100 }));

// 8. Auth route strict limit (10 req/min per IP)
app.use('/api/v1/auth', rateLimit({ windowMs: 60_000, max: 10, skipSuccessfulRequests: true }));

// 9. Routes
app.use('/api/v1', router);

// 10. Sentry error handler
app.use(Sentry.Handlers.errorHandler());

// 11. Central error handler (always last)
app.use(errorHandler);

// Health / readiness (before rate limiters or excluded)
app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.get('/ready', async (_, res) => {
  const ok = mongoose.connection.readyState === 1;
  res.status(ok ? 200 : 503).json({ status: ok ? 'ready' : 'not ready' });
});
```

### Standard Response Shape

```typescript
// All errors:
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human readable", "fields"?: {...} } }

// All success:
{ "success": true, "data": { ... } }

// Paginated success:
{ "success": true, "data": [...], "pagination": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 } }
```

### Invoice Number Generator

```typescript
// src/utils/invoiceNumber.ts
// Atomic increment — prevents duplicate numbers under concurrent requests
export async function generateInvoiceNumber(userId: string): Promise<string> {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { invoiceCounter: 1 } },
    { new: true }
  );
  const padded = String(user.invoiceCounter).padStart(4, '0');
  return `${user.invoicePrefix}-${padded}`;
}
```

### Error Code Reference

| HTTP | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Zod failed on body/query/params |
| 400 | `INVALID_REQUEST` | Logically invalid (e.g. dueDate before issueDate) |
| 400 | `CONFIRM_TEXT_MISMATCH` | Destructive action confirmation wrong |
| 400 | `INVALID_STATUS_TRANSITION` | Trying to edit a paid invoice, etc. |
| 401 | `UNAUTHORIZED` | No token provided |
| 401 | `TOKEN_EXPIRED` | Access token expired — client should refresh |
| 401 | `TOKEN_INVALID` | Token tampered or wrong secret |
| 401 | `REFRESH_TOKEN_INVALID` | Refresh token not found or rotated |
| 401 | `EMAIL_NOT_VERIFIED` | Must verify email before accessing resources |
| 403 | `FORBIDDEN` | Authenticated but wrong plan tier |
| 403 | `PLAN_LIMIT_REACHED` | Free tier: >5 invoices or >2 clients |
| 404 | `NOT_FOUND` | Resource not found or wrong owner |
| 409 | `CONFLICT` | Duplicate (e.g. same email) |
| 409 | `INVOICE_ALREADY_PAID` | Cannot modify a paid invoice |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unhandled — check Sentry |

---

## 8. API Documentation

### Base URL

```
Development:  http://localhost:5000/api/v1
Production:   https://api.invoizmo.com/api/v1
```

---

### Auth Module

#### POST /auth/register

**Description:** Register a new user account. Sends email verification link.
**Auth required:** No

**Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "password": "Str0ng!Pass"
}
```

**Validation Rules:**
- `firstName`, `lastName`: required, 1–50 chars
- `email`: valid email, unique
- `password`: min 8 chars, must include uppercase, lowercase, number

**Response — 201 Created:**
```json
{ "success": true, "data": { "message": "Account created. Please verify your email." } }
```

**Response — 409 Conflict:**
```json
{ "success": false, "error": { "code": "CONFLICT", "message": "Email already registered" } }
```

---

#### POST /auth/login

**Description:** Authenticate user. Returns access token in JSON, sets refresh token in HttpOnly cookie.
**Auth required:** No

**Body:**
```json
{ "email": "jane@example.com", "password": "Str0ng!Pass" }
```

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>",
    "user": { "_id": "...", "firstName": "Jane", "lastName": "Doe", "email": "jane@example.com", "plan": "free" }
  }
}
```

**Response — 401:**
```json
{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "Invalid email or password" } }
```

**Business Rules:**
- 5 failed attempts → account locked 15 minutes
- Generic error — never reveal whether email exists
- Account lock countdown in `Retry-After` header

---

#### POST /auth/refresh

**Description:** Exchange refresh cookie for a new access token + rotated refresh cookie.
**Auth required:** No (uses HttpOnly cookie)

**Response — 200 OK:**
```json
{ "success": true, "data": { "accessToken": "<new_jwt>" } }
```

**Response — 401:**
```json
{ "success": false, "error": { "code": "REFRESH_TOKEN_INVALID", "message": "Invalid or expired refresh token" } }
```

**Business Rules:**
- Refresh token rotated on every use
- Reuse of old token triggers full revocation for that user (breach signal)

---

#### POST /auth/logout

**Description:** Revoke current refresh token and clear cookie.
**Auth required:** Yes

**Response — 200 OK:**
```json
{ "success": true, "data": { "message": "Logged out successfully" } }
```

---

#### POST /auth/forgot-password

**Description:** Send password reset email. Generic response regardless of whether email exists.
**Auth required:** No

**Body:**
```json
{ "email": "jane@example.com" }
```

**Response — 200 OK:**
```json
{ "success": true, "data": { "message": "If this email is registered, you will receive a reset link shortly." } }
```

---

#### POST /auth/reset-password

**Description:** Set new password using a valid reset token.
**Auth required:** No

**Body:**
```json
{ "token": "<reset_token>", "password": "NewStr0ng!Pass" }
```

**Response — 200 OK:**
```json
{ "success": true, "data": { "message": "Password reset successfully. Please log in." } }
```

**Business Rules:**
- Token validated with `crypto.timingSafeEqual()`
- Token expires after 1 hour
- All existing sessions revoked after successful reset

---

#### GET /auth/verify-email/:token

**Description:** Verify email address using link from registration email.
**Auth required:** No

**Response — 200 OK:**
```json
{ "success": true, "data": { "message": "Email verified. You can now log in." } }
```

---

### Users Module

#### GET /users/me

**Description:** Get the authenticated user's profile and business settings.
**Auth required:** Yes

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "plan": "free",
    "businessName": "Jane Design Studio",
    "defaultCurrency": "USD",
    "defaultTaxRate": 10,
    "defaultPaymentTerms": 30,
    "invoicePrefix": "INV",
    "defaultTemplate": "classic",
    "logoUrl": "https://res.cloudinary.com/...",
    "createdAt": "..."
  }
}
```

---

#### PATCH /users/me

**Description:** Update profile and business information.
**Auth required:** Yes

**Body (all optional):**
```json
{
  "firstName": "Jane",
  "businessName": "Jane Design Studio",
  "businessAddress": { "line1": "123 Main St", "city": "NYC", "state": "NY", "zip": "10001", "country": "US" },
  "defaultCurrency": "USD",
  "defaultTaxRate": 10,
  "defaultPaymentTerms": 30,
  "invoicePrefix": "INV",
  "defaultTemplate": "classic",
  "accentColor": "#1D1E22"
}
```

**Response — 200 OK:**
```json
{ "success": true, "data": { ...updatedUser } }
```

---

#### PATCH /users/me/password

**Description:** Change password (requires current password).
**Auth required:** Yes

**Body:**
```json
{ "currentPassword": "OldPass!1", "newPassword": "NewPass!2" }
```

**Response — 200 OK:**
```json
{ "success": true, "data": { "message": "Password updated successfully." } }
```

---

#### POST /users/me/logo

**Description:** Upload business logo. Returns Cloudinary URL.
**Auth required:** Yes

**Body:** `multipart/form-data` — field: `logo` (image/jpg, image/png, image/svg+xml; max 2MB)

**Response — 200 OK:**
```json
{ "success": true, "data": { "logoUrl": "https://res.cloudinary.com/..." } }
```

---

#### GET /users/me/export

**Description:** Export all user data as JSON (GDPR data portability).
**Auth required:** Yes
**Rate limited:** 1 request per 24 hours per user

**Response — 200 OK:** JSON file download with all invoices, clients, payments

---

#### DELETE /users/me

**Description:** Permanently delete account and all data.
**Auth required:** Yes

**Body:**
```json
{ "confirmText": "DELETE MY ACCOUNT" }
```

**Response — 200 OK:**
```json
{ "success": true, "data": { "message": "Account scheduled for deletion." } }
```

---

### Clients Module

#### GET /clients

**Description:** List all clients for the authenticated user.
**Auth required:** Yes

**Query Params:**
- `?page=1&limit=20`
- `?search=jane` (searches name + email)
- `?sort=name|-name|createdAt|-createdAt`

**Response — 200 OK:**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "name": "Acme Corp", "email": "billing@acme.com", "totalInvoiced": 500000, "totalPaid": 400000, "currency": "USD" }
  ],
  "pagination": { "total": 12, "page": 1, "limit": 20, "totalPages": 1 }
}
```

---

#### POST /clients

**Description:** Create a new client.
**Auth required:** Yes

**Plan Limits:**
- Free: max 2 clients total → 403 `PLAN_LIMIT_REACHED` if exceeded

**Body:**
```json
{
  "name": "Acme Corp",
  "email": "billing@acme.com",
  "phone": "+1-555-0100",
  "company": "Acme Corporation",
  "currency": "USD",
  "address": { "line1": "456 Corp Ave", "city": "LA", "state": "CA", "zip": "90001", "country": "US" }
}
```

**Response — 201 Created:**
```json
{ "success": true, "data": { "_id": "...", "name": "Acme Corp", ... } }
```

---

#### GET /clients/:id

**Description:** Get a client by ID with invoice summary.
**Auth required:** Yes

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Acme Corp",
    "totalInvoiced": 500000,
    "totalPaid": 400000,
    "recentInvoices": [...]
  }
}
```

---

#### PATCH /clients/:id

**Description:** Update client details.
**Auth required:** Yes

**Response — 200 OK:** `{ "success": true, "data": { ...updatedClient } }`

---

#### DELETE /clients/:id

**Description:** Soft-delete a client.
**Auth required:** Yes

**Business Rules:**
- If client has any non-cancelled, non-paid invoice: return 400 with `INVALID_REQUEST` and a warning message
- Response on success: `{ "success": true, "data": { "message": "Client deleted." } }`

---

### Items Module

#### GET /items

**Description:** List saved line items (catalog).
**Auth required:** Yes
**Plan:** Pro+; Free tier returns 403 `FORBIDDEN`

**Query Params:** `?page&limit&search`

**Response — 200 OK:**
```json
{ "success": true, "data": [{ "_id": "...", "name": "Web Design", "unitPrice": 15000, "unit": "hr" }] }
```

---

#### POST /items

**Description:** Save a reusable line item.
**Auth required:** Yes
**Plan:** Pro+

**Body:**
```json
{ "name": "Web Design", "description": "Frontend development", "unitPrice": 15000, "unit": "hr", "taxable": true }
```

**Response — 201 Created:** `{ "success": true, "data": { ...item } }`

---

#### PATCH /items/:id

**Auth required:** Yes | **Response — 200 OK:** updated item

#### DELETE /items/:id

**Auth required:** Yes | **Response — 200 OK:** soft deleted

---

### Invoices Module

#### GET /invoices

**Description:** List invoices with filters.
**Auth required:** Yes

**Query Params:**
- `?page=1&limit=20`
- `?status=draft|sent|viewed|paid|overdue|cancelled`
- `?clientId=<id>`
- `?search=INV-` (invoice number)
- `?from=2025-01-01&to=2025-12-31` (issueDate range)
- `?sort=-createdAt|dueDate|total`

**Response — 200 OK:**
```json
{
  "success": true,
  "data": [{
    "_id": "...", "invoiceNumber": "INV-0042", "clientId": { "name": "Acme Corp" },
    "status": "sent", "total": 250000, "amountDue": 250000,
    "issueDate": "...", "dueDate": "...", "currency": "USD"
  }],
  "pagination": { "total": 42, "page": 1, "limit": 20, "totalPages": 3 }
}
```

---

#### POST /invoices

**Description:** Create a new invoice (starts as draft).
**Auth required:** Yes

**Plan Limits:**
- Free: max 5 invoices total (all statuses, all time) → 403 `PLAN_LIMIT_REACHED`

**Body:**
```json
{
  "clientId": "<objectId>",
  "template": "classic",
  "currency": "USD",
  "issueDate": "2025-06-01",
  "dueDate": "2025-06-30",
  "lineItems": [
    { "name": "Web Design", "quantity": 10, "unitPrice": 15000, "unit": "hr", "taxable": true },
    { "name": "Hosting Setup", "quantity": 1, "unitPrice": 5000, "unit": "project", "taxable": false }
  ],
  "discountType": "percentage",
  "discountValue": 10,
  "taxRate": 10,
  "notes": "Thank you for your business!",
  "terms": "Payment due within 30 days."
}
```

**Server-Side Computation:**
- `subtotal` = sum of all `lineItem.total`
- `discountAmount` = computed from `discountType` + `discountValue`
- `taxAmount` = `taxRate` % of taxable items after discount
- `total` = `subtotal` - `discountAmount` + `taxAmount`
- `invoiceNumber` = generated atomically
- `publicId` = nanoid(12)

**Response — 201 Created:**
```json
{ "success": true, "data": { "_id": "...", "invoiceNumber": "INV-0042", "status": "draft", "total": 157500, ... } }
```

---

#### GET /invoices/:id

**Description:** Get a single invoice with client details.
**Auth required:** Yes

**Response — 200 OK:** Full invoice object with populated `clientId`

---

#### PATCH /invoices/:id

**Description:** Update a draft invoice.
**Auth required:** Yes

**Business Rules:**
- Only `status = draft` invoices can be edited
- `paid` and `cancelled` invoices → 409 `INVALID_STATUS_TRANSITION`
- Totals recomputed on every update
- `invoiceNumber` cannot be changed after creation

**Response — 200 OK:** Updated invoice

---

#### POST /invoices/:id/send

**Description:** Send invoice to client via email. Changes status to `sent`.
**Auth required:** Yes

**Body:**
```json
{
  "subject": "Invoice INV-0042 from Jane Design Studio",
  "message": "Hi, please find your invoice attached."
}
```

**Side Effects:**
- Generates PDF via Puppeteer, attaches to email
- Sends email with link: `${PUBLIC_INVOICE_BASE_URL}/${publicId}`
- Updates `status = sent`, `sentAt = now`
- Snapshot of sender business info saved to invoice

**Response — 200 OK:**
```json
{ "success": true, "data": { "message": "Invoice sent to billing@acme.com" } }
```

---

#### POST /invoices/:id/duplicate

**Description:** Clone an invoice as a new draft.
**Auth required:** Yes

**Response — 201 Created:** New draft invoice with fresh `invoiceNumber` and `publicId`

---

#### PATCH /invoices/:id/status

**Description:** Manually update invoice status (cancel, mark as sent, etc.).
**Auth required:** Yes

**Body:**
```json
{ "status": "cancelled" }
```

**Allowed manual transitions:**
- `draft` → `sent` (equivalent to "mark as sent without emailing")
- `draft` / `sent` / `viewed` / `overdue` → `cancelled`

**Response — 200 OK:** Updated invoice

---

#### DELETE /invoices/:id

**Description:** Soft-delete an invoice.
**Auth required:** Yes

**Business Rules:**
- Cannot delete `paid` invoices → 409
- Confirmation via query param: `?confirm=true`

---

#### GET /invoices/:id/pdf

**Description:** Generate and download PDF for an invoice.
**Auth required:** Yes

**Response:** `Content-Type: application/pdf` binary stream

---

#### POST /invoices/:id/payments

**Description:** Record a payment against an invoice.
**Auth required:** Yes

**Body:**
```json
{
  "amount": 100000,
  "paymentDate": "2025-06-15",
  "paymentMethod": "bank_transfer",
  "reference": "TXN-987654",
  "notes": "First instalment"
}
```

**Business Rules:**
- `amount` must be > 0 and ≤ `amountDue`
- After recording: `amountPaid` += amount; `amountDue` -= amount
- If `amountPaid >= total`: status → `paid`, `paidAt = now`
- Client `totalPaid` denormalized field updated

**Response — 201 Created:**
```json
{ "success": true, "data": { ...payment, "invoice": { "status": "paid", "amountDue": 0 } } }
```

---

#### GET /invoices/:id/payments

**Description:** List all payments for an invoice.
**Auth required:** Yes

**Response — 200 OK:**
```json
{ "success": true, "data": [{ "_id": "...", "amount": 100000, "paymentMethod": "bank_transfer", "paymentDate": "..." }] }
```

---

### Public Invoice Module (No Auth)

#### GET /public/invoices/:publicId

**Description:** View invoice details by public share link. Marks invoice as `viewed` on first access.
**Auth required:** No
**Rate limited:** 30 req/min per IP

**Response — 200 OK:** Sanitized invoice (no internal IDs except publicId, no userId)

---

#### GET /public/invoices/:publicId/pdf

**Description:** Download invoice PDF from public link.
**Auth required:** No
**Rate limited:** 10 req/min per IP

**Response:** PDF binary

---

### Analytics Module

#### GET /analytics/summary

**Description:** Dashboard summary stats.
**Auth required:** Yes
**Plan:** All (basic), Pro+ (extended)

**Query Params:** `?currency=USD` (filter by currency for multi-currency users)

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "totalRevenueMTD": 1500000,
    "totalOutstanding": 750000,
    "overdueCount": 3,
    "invoiceCountMTD": 12,
    "revenueGrowth": 15.4
  }
}
```

---

#### GET /analytics/revenue

**Description:** Monthly revenue breakdown (last 12 months).
**Auth required:** Yes
**Plan:** Pro+

**Response — 200 OK:**
```json
{
  "success": true,
  "data": [
    { "month": "2025-01", "total": 300000, "paid": 250000, "outstanding": 50000 },
    { "month": "2025-02", "total": 420000, "paid": 420000, "outstanding": 0 }
  ]
}
```

---

#### GET /analytics/top-clients

**Description:** Top 5 clients by revenue.
**Auth required:** Yes
**Plan:** Pro+

**Response — 200 OK:**
```json
{
  "success": true,
  "data": [
    { "clientId": "...", "clientName": "Acme Corp", "totalInvoiced": 500000, "totalPaid": 400000 }
  ]
}
```

---

#### GET /analytics/invoice-status

**Description:** Count of invoices by status.
**Auth required:** Yes

**Response — 200 OK:**
```json
{
  "success": true,
  "data": { "draft": 5, "sent": 8, "viewed": 3, "paid": 42, "overdue": 2, "cancelled": 1 }
}
```

---

## 9. Backend Security Checklist

### Environment & Configuration

- All secrets in `.env` — zero hardcoded in source
- `.env` and `.env.*` in `.gitignore` — only `.env.example` committed
- Env validated with Zod at startup — crash on bad config
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are different, each ≥64 chars
- `PASSWORD_RESET_SECRET` ≥ 32 chars, separate from JWT secrets
- MongoDB Atlas: restricted DB user (readWrite on app DB only — not root)
- MongoDB Atlas IP allowlist: only production server IPs + your dev IP

### Authentication

- Access tokens 15min, refresh tokens 7d
- Access token in `Authorization` header only — never in URL
- Refresh token: HttpOnly; Secure; SameSite=Strict cookie
- Refresh tokens bcrypt-hashed before storing in DB
- Refresh token rotation: new token issued on every `/auth/refresh`
- Reused refresh token → full revocation for that user
- `crypto.timingSafeEqual()` for all token and reset-token comparisons
- Account lockout: 5 failed attempts → 15 min lock (TTL index on `lockedUntil`)
- Generic auth error messages — no email enumeration

### API Security

- `helmet()` with CSP tuned for Next.js (allow Vercel CDN, Cloudinary)
- `cors()` explicit origin list — never wildcard
- `express-mongo-sanitize()` in middleware chain
- `express-rate-limit` per route (global: 100/min; auth: 10/min; email send: 20/hr; export: 1/24h)
- `express.json({ limit: '10kb' })` — no payload bloat
- Zod validation on every route accepting body/query/params
- `assertOwnership()` in every resource controller
- All queries include `userId` filter — cross-user access impossible
- `isDeleted: false` filter on all list/single queries
- Invoice `publicId` generated with `nanoid` — not sequential

### Data & Privacy

- Passwords bcrypt, cost 10+ — never stored plain
- Password reset tokens hashed (SHA-256) before DB storage
- `DELETE /users/me` requires exact confirmation text
- `GET /users/me/export` endpoint for GDPR portability
- TTL indexes: `passwordResetExpires`, `lockedUntil`, soft-deleted records
- Text search only on non-sensitive fields (invoiceNumber, clientName)
- Amount always stored in smallest currency unit (cents) — no float arithmetic
- Log redaction: no passwords, tokens, full amounts, or client email in Winston logs

### Infrastructure

- `GET /health` + `GET /ready` implemented and excluded from strict rate limits
- Winston structured logging in production
- Sentry with `beforeSend` scrubbing: strip email, name fields from error context
- `npm audit` clean before every deploy
- `npm ci` in CI — not `npm install`
- HTTPS enforced in production — HTTP redirected at load balancer
- API versioning prefix `/api/v1/` in all routes

---

## 10. Frontend Architecture

### Axios Client Setup

```typescript
// src/lib/api/client.ts
import axios from 'axios';
import { tokenStore } from '../auth/tokenStore';
import { refreshClient } from './refreshClient';

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api/v1',
  withCredentials: true,
  timeout: 10_000,
});

client.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Single-flight refresh on 401
let isRefreshing = false;
let queue: Array<{ resolve: Function; reject: Function }> = [];

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      error.response?.data?.error?.code === 'TOKEN_EXPIRED' &&
      !original._retry
    ) {
      original._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => queue.push({ resolve, reject }))
          .then(token => { original.headers.Authorization = `Bearer ${token}`; return client(original); });
      }
      isRefreshing = true;
      try {
        const { data } = await refreshClient.post('/auth/refresh');
        tokenStore.set(data.data.accessToken);
        queue.forEach(p => p.resolve(data.data.accessToken));
        queue = [];
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return client(original);
      } catch {
        queue.forEach(p => p.reject());
        queue = [];
        tokenStore.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
        queue = [];
      }
    }
    return Promise.reject(error);
  }
);
```

```typescript
// src/lib/api/refreshClient.ts — NO interceptors (prevents infinite loop)
import axios from 'axios';
export const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api/v1',
  withCredentials: true,
});
```

```typescript
// src/auth/tokenStore.ts — MEMORY ONLY, never localStorage
let _token: string | null = null;
export const tokenStore = { get: () => _token, set: (t: string) => { _token = t; }, clear: () => { _token = null; } };
```

### TanStack Query Hooks Pattern

```typescript
// src/features/invoices/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../../lib/api/client';

export const invoiceKeys = {
  all: ['invoices'] as const,
  list: (params: object) => [...invoiceKeys.all, 'list', params] as const,
  detail: (id: string) => [...invoiceKeys.all, 'detail', id] as const,
};

export function useInvoices(params: object) {
  return useQuery({
    queryKey: invoiceKeys.list(params),
    queryFn: () => client.get('/invoices', { params }).then(r => r.data),
    staleTime: 1000 * 60 * 2,
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => client.get(`/invoices/${id}`).then(r => r.data.data),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: object) => client.post('/invoices', body).then(r => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: invoiceKeys.all }),
  });
}

export function useSendInvoice(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: object) => client.post(`/invoices/${id}/send`, body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: invoiceKeys.detail(id) }),
  });
}
```

---

## 11. Frontend Security Checklist

- Access token in **memory only** — no `localStorage`, no `sessionStorage`
- Refresh token is HttpOnly cookie — JavaScript cannot read it
- Single-flight refresh queue — no duplicate refresh race conditions
- Failed refresh → clear token + redirect to `/login`
- All protected routes wrapped in `<RequireAuth>` (or Next.js middleware)
- `DOMPurify.sanitize()` on any user-generated rich text (notes, terms)
- No `dangerouslySetInnerHTML` without DOMPurify first
- URL validation before `href` or `src` — only `http:` and `https:`
- All forms validated with React Hook Form + Zod before submit
- Error boundary at root level
- No `console.log` of tokens, passwords, or PII in production
- `NEXT_PUBLIC_*` env vars validated with Zod at build time
- Loading and error states for every async operation
- File uploads (logo): type (`image/*`) + size (≤ 2MB) validated client-side
- `npm audit` clean — no high/critical issues

---

## 12. UI/UX Specifications

### Color System

| Token | Hex | Usage |
|---|---|---|
| `bg-primary` | `#090909` | App background, page root |
| `bg-surface` | `#1F292D` | Cards, panels, modals |
| `bg-elevated` | `#1D1E22` | Sidebar, dropdowns, table rows |
| `text-primary` | `#B1B6B3` | Default body text |
| `text-muted` | `#707173` | Labels, placeholders, secondary text |
| `text-white` | `#FFFFFF` | Headings, active items |
| `border` | `#1F292D` | Dividers, input borders |
| `accent` | User-configurable | Call-to-action buttons, highlights |

**Tailwind config extension:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'invoizmo': {
          'bg': '#090909',
          'surface': '#1F292D',
          'elevated': '#1D1E22',
          'muted': '#707173',
          'text': '#B1B6B3',
        }
      }
    }
  }
}
```

### Invoice Templates

| Template | Description | Tier |
|---|---|---|
| **Classic** | Clean two-column header, table layout, footer terms | Free + Pro |
| **Modern** | Full-bleed accent color header, sans-serif, bold totals | Pro+ |
| **Minimal** | Monochrome, ultra-clean, no decorative elements | Pro+ |

Each template must render identically in:
- Browser preview (InvoicePreview component)
- Puppeteer-generated PDF
- Public invoice page

### Key Pages & UX Flow

**Invoice Creation Flow:**
1. Click "New Invoice" → full-page form
2. Select client (typeahead search or "+ Add New Client" inline modal)
3. Add line items (row: name, qty, price, unit, taxable toggle; autocomplete from item catalog on Pro)
4. Set issue date, due date (date picker)
5. Toggle discount and/or tax
6. Add notes / terms
7. Select template
8. Live preview panel (desktop: side-by-side; mobile: tabbed)
9. Actions: "Save Draft" | "Preview PDF" | "Send Invoice"

**Invoice List Page:**
- Status tabs: All / Draft / Sent / Paid / Overdue
- Search bar (invoice number)
- Filter by client, date range
- Table columns: Number, Client, Issue Date, Due Date, Total, Status, Actions
- Row actions: View, Edit (draft only), Send, Download PDF, Duplicate, Delete
- Overdue invoices highlighted with amber left border

**Dashboard:**
- Stat cards row (Total Revenue MTD, Outstanding, Overdue Count, Invoices MTD)
- Revenue chart (Recharts bar chart, last 12 months)
- Recent invoices table (last 5)
- Quick action: "Create Invoice" CTA

### Responsive Breakpoints

- `sm`: 640px — mobile navigation (bottom tab bar or hamburger)
- `md`: 768px — sidebar appears collapsed
- `lg`: 1024px — sidebar expanded, two-column invoice form
- `xl`: 1280px — full dashboard layout

---

## 13. Postman & Testing Guide

### Collection Setup

1. Import `backend/postman/collection.json`
2. Import `backend/postman/environment.json`
3. Set: `baseUrl = http://localhost:5000`

### Run Order

```
1.  POST /auth/register          → creates test account
2.  GET  /auth/verify-email/:t   → verifies email (copy from email/console log)
3.  POST /auth/login             → sets refresh cookie, saves accessToken
4.  GET  /users/me               → verify auth works
5.  PATCH /users/me              → set businessName, invoicePrefix
6.  POST /clients                → create client, save clientId
7.  POST /invoices               → create invoice, save invoiceId
8.  GET  /invoices               → list invoices
9.  GET  /invoices/:id           → get single invoice
10. PATCH /invoices/:id          → edit draft
11. POST /invoices/:id/send      → send invoice (check email/logs)
12. GET  /public/invoices/:pid   → public view (no auth)
13. POST /invoices/:id/payments  → record payment
14. GET  /analytics/summary      → dashboard stats
15. POST /auth/refresh           → verify token rotation
16. POST /auth/logout            → clear session
17. GET  /users/me               → verify 401 after logout
```

### Test Script Template

```javascript
pm.test("Status 200", () => pm.response.to.have.status(200));
pm.test("success: true", () => pm.expect(pm.response.json().success).to.be.true);

const json = pm.response.json();
if (json.data?._id) pm.environment.set("resourceId", json.data._id);
if (json.data?.accessToken) {
  pm.environment.set("accessToken", json.data.accessToken);
  pm.environment.set("tokenExpiry", Date.now() + 14 * 60 * 1000);
}
```

### Test Scenarios Per Endpoint

| Test | Trigger |
|---|---|
| Happy path 200/201 | Valid request |
| Validation 400 | Missing required field |
| Auth 401 | No Authorization header |
| Token Expired 401 | Use expired access token |
| Plan Limit 403 | Exceed free tier limit |
| Wrong Owner 404 | Use another user's resource ID |
| Auth rate limit 429 | 11+ requests in 1 min on /auth routes |
| Duplicate 409 | Re-register same email |
| Invalid status 409 | Edit paid invoice |

---

## 14. Master Prompts

### 14.1 Full-Stack Bootstrap Prompt

```
Build Invoizmo — a production-ready Invoice Generator SaaS with TypeScript.

Brand: Invoizmo
Colors: #090909 (bg), #B1B6B3 (text), #1F292D (surface), #1D1E22 (elevated), #707173 (muted)

── Backend (Node.js + Express + MongoDB) ────────────────────────────────
- Before writing package.json: web search each dependency for latest stable + CVE; confirm with `npm show`
- Structure: backend/src/ with config/, middleware/, modules/, services/, utils/, types/
- Modules: auth, users, clients, items, invoices, payments, analytics
- Zod-validated env at startup — crash on bad config
- Auth: email/password only; JWT access (15min) in JSON; refresh (7d) HttpOnly Strict cookie
  Rotation + hashed refresh tokens + breach detection on reuse
  Account lockout: 5 failed → 15 min lock (TTL index)
  Password reset: token hashed SHA-256, expires 1h, timing-safe compare
- Security middleware order: Sentry, helmet, cors (explicit list), json({limit:10kb}), mongo-sanitize, rate-limit, requireAuth, validate
- assertOwnership() in every controller — 404 not 403
- crypto.timingSafeEqual() for all token comparisons
- All amounts stored in cents (integer) — never floats
- Invoice number: atomic $inc on User.invoiceCounter → "INV-0042"
- publicId: nanoid(12) for public share link (no auth required to view)
- PDF generation: Puppeteer server-side — render HTML invoice template to PDF buffer
- Email: nodemailer (SMTP) — send invoice with PDF attachment + public link
- Cron jobs (node-cron):
    Daily 08:00 UTC: generate recurring invoices
    Daily 09:00 UTC: send overdue reminders, mark status=overdue
- Plan tier guard middleware: free (5 invoices, 2 clients), pro (unlimited)
- Winston structured logging; Sentry error tracking; both scrub PII
- GET /health + GET /ready

── Frontend (Next.js App Router + React + Tailwind) ─────────────────────
- App Router with (auth) and (dashboard) route groups
- (auth): login, register, forgot-password — public
- (dashboard): all protected routes — middleware auth check
- Tailwind extended with Invoizmo color tokens (see PRD)
- Axios client with withCredentials + single-flight refresh interceptor
  Separate refreshClient (no interceptors) to prevent loops
- Access token in memory tokenStore.ts — never localStorage
- AuthProvider: bootstrap via POST /auth/refresh → GET /users/me on load
- TanStack Query for all server state; React Hook Form + Zod for all forms
- DOMPurify for any user-generated HTML in notes/terms fields
- Recharts for dashboard analytics (bar chart, donut chart)
- Invoice form: client typeahead, line items table with add/remove/reorder
- Live invoice preview panel (desktop: side-by-side; mobile: tabbed)
- Public invoice page /invoice/:publicId (no auth, SSR for SEO)
- PDF download button (calls GET /invoices/:id/pdf)
- Error boundary at root; loading + error states for all async operations

── Deliverables ─────────────────────────────────────────────────────────
1. .env.example for backend and frontend with all comments
2. Root .gitignore covering node_modules, .env*, keys, .next/, dist/
3. .cursorignore mirroring sensitive paths
4. README with setup instructions, seed command, and CI steps
5. Postman collection + environment JSON
6. tsconfig.json strict mode for both
7. Full API docs per endpoint
```

### 14.2 Invoice PDF Generation Prompt

```
Implement server-side PDF generation for Invoizmo invoices.

Stack: Node.js + TypeScript + Puppeteer (or @react-pdf/renderer as alternative)

Requirements:
- src/services/pdf.service.ts wraps generation logic
- src/modules/invoices/invoice.pdf.ts — HTML template renderer for each template (classic, modern, minimal)
- Template receives: Invoice document (all fields), user business info, client info
- Templates must render: logo (img from Cloudinary URL), from address, to address, invoice number,
  issue date, due date, line items table (name, qty, unit, price, total columns),
  subtotal, discount, tax, grand total, notes, terms, QR code pointing to public invoice URL
- PDF buffer returned from service — streamed as application/pdf response
- Cache generated PDFs in memory (Map<invoiceId, {buffer, generatedAt}>) with 60s TTL
- Invalidate cache on invoice update
- Route: GET /invoices/:id/pdf (auth required) and GET /public/invoices/:publicId/pdf (no auth)
- All currency amounts formatted with proper decimal and symbol (e.g. $1,500.00)
- Amounts computed from cents: divide by 100 before display
```

### 14.3 Security Hardening Prompt

```
Audit and harden the Invoizmo Express backend for production.

Check each of these — implement if missing:
1. express-mongo-sanitize — NoSQL injection
2. express-rate-limit — global 100/min, auth 10/min, send-invoice 20/hr, export 1/24h
3. helmet() — CSP allowing Cloudinary and Vercel domains
4. CORS explicit origin list from env — no wildcard
5. express.json({ limit: '10kb' })
6. assertOwnership() in every resource controller — 404 not 403
7. All DB queries filter by userId
8. crypto.timingSafeEqual() for reset tokens and refresh token comparison
9. Refresh tokens bcrypt-hashed in DB; rotation on use; full revocation on reuse
10. Password reset token SHA-256 hashed in DB; expires in 1h TTL index
11. Account lockout: 5 failed attempts → 15 min (TTL on lockedUntil)
12. Generic error messages on auth — no email enumeration
13. Invoice amounts always stored/computed in cents — no float arithmetic
14. publicId uses nanoid — not sequential, not MongoDB ObjectId
15. Winston + Sentry in production; both scrub email, tokens, amounts from logs
16. npm audit — fix all high/critical
17. GET /health + GET /ready; exclude from aggressive rate limits
18. GDPR: GET /users/me/export endpoint, DELETE /users/me with confirmation text
19. Plan tier guard: free tier limited to 5 invoices + 2 clients
20. Cron jobs: recurring invoice creation + overdue status update + reminder emails
```

---

## 15. CI & Git Hygiene

### `.gitignore` (Root)

```gitignore
# Dependencies
node_modules/

# Environment & secrets
.env
.env.*
!.env.example

# Build output
dist/
build/
.next/
out/
*.tsbuildinfo

# Logs
*.log
coverage/
.nyc_output/

# OS / Editor
.DS_Store
Thumbs.db

# Private keys
*.pem
*.key
id_rsa
id_ed25519
```

### `.cursorignore` (Root)

```gitignore
.env
.env.*
!.env.example
node_modules/
dist/
.next/
build/
coverage/
*.pem
*.key
```

### CI Baseline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm test --if-present
      - run: npm audit --audit-level=high

  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run build
      - run: npm audit --audit-level=high
```

### Git Workflow

- `main` — production; protected, requires PR review
- `develop` — integration branch
- Feature branches: `feature/<ticket>-<short-description>`
- Bug branches: `fix/<ticket>-<short-description>`
- Commit convention: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- Run `git status` before every push — verify no `.env` or `node_modules` listed
- `npm audit` before merging to `main`

---

*Invoizmo PRD v1.0 — This document covers processes that stay valid over time. Dependency versions are never authoritative here — always verify via `npm show` and advisory search before use.*