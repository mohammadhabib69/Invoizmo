# Plan: Build Invoizmo Backend

## Context

You have a complete PRD (invoizmo_prd.md) for an Invoice Generator SaaS built with MERN + Next.js. The project directory is empty except for the documentation files. You want to build the **backend first**, and verify the PRD follows best practices from instruction.md.

---

## Phase 1: PRD Analysis Against instruction.md Best Practices

### ✅ Good Practices Already in PRD

| Category | Status | Notes |
|----------|--------|-------|
| **Repository Structure** | ✅ Good | Matches instruction.md structure exactly - backend/src/ with config/, middleware/, modules/, services/, utils/ |
| **Token Handling** | ✅ Good | Access (15min) in Authorization header, refresh (7d) in HttpOnly; Secure; SameSite=Strict cookie |
| **JWT Rotation** | ✅ Good | Refresh token rotation with breach detection on reuse |
| **Password Hashing** | ✅ Good | bcryptjs with cost factor ≥10 |
| **Security Middleware** | ✅ Good | helmet, cors (explicit origins), express-mongo-sanitize, express-rate-limit |
| **Response Shape** | ✅ Good | Consistent {success: true/false, data/error} format |
| **Data Model** | ✅ Good | Amounts stored in cents (no floats) |
| **Zod Validation** | ✅ Good | Env validation at startup, request body validation on routes |
| **Soft Delete** | ✅ Good | isDeleted + deletedAt pattern on models |
| **Ownership Check** | ✅ Good | assertOwnership helper mentioned |
| **Error Codes** | ✅ Good | Standardized error codes (VALIDATION_ERROR, NOT_FOUND, etc.) |
| **Health Endpoints** | ✅ Good | GET /health and GET /ready implemented |
| **Public Invoice ID** | ✅ Good | Uses nanoid (not sequential) |
| **Plan Tier Guard** | ✅ Good | Free tier limits (5 invoices, 2 clients) |

### ⚠️ Items to Verify/Improve During Implementation

| Item | Action Required |
|------|-----------------|
| **Dependency Versions** | Must NOT copy from PRD - verify each via web search + npm show |
| **Timing-Safe Compare** | Ensure crypto.timingSafeEqual() used for all token comparisons |
| **Account Lockout** | Implement 5 failed attempts → 15 min lock with TTL index |
| **Password Reset Token** | SHA-256 hash before DB storage, expires 1h |
| **Cron Jobs** | Verify node-cron schedules (08:00 UTC recurring, 09:00 UTC reminders) |
| **PDF Generation** | Puppeteer with 60s cache TTL |
| **Winston + Sentry** | Structured logging with PII redaction |
| **GDPR Endpoints** | GET /users/me/export, DELETE with confirmation text |

---

## Phase 2: Backend Implementation Plan

### Step 1: Project Setup (Files to Create)

```
backend/
├── package.json              # Verify deps with npm show + web search
├── tsconfig.json             # Strict mode
├── .gitignore
├── .env.example              # All vars from PRD section 4
├── src/
│   ├── server.ts            # Entry: DB connect → cron → listen
│   ├── app.ts               # Express app with middleware stack
│   ├── config/
│   │   ├── env.ts           # Zod validation - crash on bad config
│   │   ├── db.ts            # mongoose.connect + disconnect
│   │   └── cloudinary.ts    # Cloudinary SDK config
│   ├── middleware/
│   │   ├── requireAuth.ts   # JWT verify → attach req.user
│   │   ├── validate.ts      # Zod schema factory → 400 on failure
│   │   ├── roleGuard.ts     # Subscription-level guard (free/pro/business)
│   │   └── errorHandler.ts  # Central error → standard JSON
│   ├── modules/
│   │   ├── auth/            # Register, login, refresh, logout, forgot-password, reset-password
│   │   ├── users/           # Profile, business info, logo upload, export, delete
│   │   ├── clients/         # CRUD + soft delete
│   │   ├── items/           # Item catalog (Pro+ only)
│   │   ├── invoices/        # CRUD, send, duplicate, status, payments, PDF
│   │   ├── payments/       # Record payments
│   │   └── analytics/       # Dashboard stats
│   ├── services/
│   │   ├── email.service.ts # Nodemailer: invoice email, reminders
│   │   ├── pdf.service.ts  # PDF generation wrapper
│   │   ├── cron.service.ts # Overdue reminders + recurring invoices
│   │   └── cloudinary.service.ts
│   ├── utils/
│   │   ├── jwt.ts           # signAccess, signRefresh, verify
│   │   ├── ownershipCheck.ts# Assert resource belongs to req.user
│   │   ├── tokenCompare.ts  # crypto.timingSafeEqual wrapper
│   │   ├── invoiceNumber.ts # Auto-incremented invoice number
│   │   └── currency.ts      # Amount formatting helpers (cents)
│   └── types/
│       ├── express.d.ts     # Augment Express Request with req.user
│       └── invoice.types.ts # Shared TS types
└── postman/
    ├── collection.json
    └── environment.json
```

### Step 2: Dependencies to Verify (Web Search + npm show)

Before writing package.json, verify each:

| Package | Search Query |
|---------|--------------|
| express | "express npm latest version" + "express CVE" |
| mongoose | "mongoose npm latest version" |
| typescript | "typescript npm latest version" |
| jsonwebtoken | "jsonwebtoken npm latest version" + "jsonwebtoken CVE" |
| bcryptjs | "bcryptjs npm latest version" |
| helmet | "helmet npm latest version" + "helmet CVE" |
| cors | "cors npm latest version" |
| express-rate-limit | "express-rate-limit npm latest version" |
| express-mongo-sanitize | "express-mongo-sanitize npm latest version" |
| zod | "zod npm latest version" |
| dotenv | "dotenv npm latest version" |
| morgan | "morgan npm latest version" |
| winston | "winston npm latest version" |
| @sentry/node | "@sentry/node npm latest version" |
| nodemailer | "nodemailer npm latest version" |
| cloudinary | "cloudinary npm latest version" |
| puppeteer | "puppeteer npm latest version" |
| node-cron | "node-cron npm latest version" |
| nanoid | "nanoid npm latest version" |

### Step 3: Core Files to Implement

**Priority Order:**

1. **Config Layer**
   - `src/config/env.ts` - Zod validation of all env vars
   - `src/config/db.ts` - MongoDB connection
   - `src/config/cloudinary.ts` - Cloudinary setup

2. **Types & Utils**
   - `src/types/express.d.ts` - Extend Request with user
   - `src/utils/jwt.ts` - JWT sign/verify
   - `src/utils/tokenCompare.ts` - timingSafeEqual wrapper
   - `src/utils/ownershipCheck.ts` - assertOwnership helper
   - `src/utils/invoiceNumber.ts` - atomic increment
   - `src/utils/currency.ts` - cents to/from display

3. **Middleware**
   - `src/middleware/errorHandler.ts`
   - `src/middleware/validate.ts`
   - `src/middleware/requireAuth.ts`
   - `src/middleware/roleGuard.ts`

4. **Models (Mongoose)**
   - User, Client, Item, Invoice, Payment

5. **Modules (Routes + Controller + Service + Schema)**
   - Auth → Users → Clients → Items → Invoices → Payments → Analytics

6. **Services**
   - Email, PDF, Cron, Cloudinary

7. **Entry Point**
   - `src/app.ts` - middleware stack
   - `src/server.ts` - startup

---

## Verification

After implementation, verify:

1. **npm audit clean** - no high/critical vulnerabilities
2. **TypeScript compiles** - npx tsc --noEmit passes
3. **Server starts** - connects to MongoDB
4. **Health endpoints** - GET /health returns 200
5. **Auth flow works** - register → login → refresh → logout
6. **Postman collection runs** - all endpoints respond correctly
7. **Security middleware** - helmet headers present, CORS works, rate limits apply

---

## User Preferences Confirmed

- **Database**: MongoDB Atlas (will use placeholder in .env.example)
- **Email**: Skip for initial setup - placeholder env vars included

---

## Ready to Build

The plan is complete. I will:
1. Verify all dependencies via web search + npm show
2. Create backend/ with full structure per PRD
3. Implement all modules following instruction.md best practices
4. Create .env.example with all required vars
5. Set up Postman collection for testing

Proceeding with implementation.