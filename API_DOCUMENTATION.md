# Invoizmo API Documentation

Welcome to the **Invoizmo API Documentation**. This guide provides all the information you need to build with Invoizmo.

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
   - [Auth](#auth)
   - [Users](#users)
   - [Clients](#clients)
   - [Invoices](#invoices)
   - [Items](#items)
   - [Payments](#payments)
5. [Status Codes](#status-codes)
6. [Error Handling](#error-handling)
7. [Rate Limits](#rate-limits)
8. [Changelog](#changelog)

---

## Overview

**Base URL (Development):** `http://localhost:5000/api/v1`

**Base URL (Production):** `https://api.invoizmo.com/api/v1`

All API requests and responses are in **JSON** format.

---

## Getting Started

To get started with Invoizmo API, you'll need:
1. Node.js (Active LTS version)
2. MongoDB Atlas or local MongoDB instance
3. API keys and environment variables set up

### Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/invoizmo_dev
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=your_smtp_api_key
EMAIL_FROM=invoices@invoizmo.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PASSWORD_RESET_SECRET=your_reset_secret
PASSWORD_RESET_EXPIRES_IN=1h
SENTRY_DSN=https://your_sentry_dsn_here
PUBLIC_INVOICE_BASE_URL=http://localhost:3000/invoice
```

---

## Authentication

### Authentication Flow

Invoizmo uses **JWT (JSON Web Tokens)** for authentication with access and refresh tokens.

1. **Access Token**: Short-lived token (15 minutes) sent in the `Authorization: Bearer <token>` header
2. **Refresh Token**: Long-lived token (7 days) stored in an HTTP-only, secure cookie

### Example Request with Authentication

```bash
curl -X GET "http://localhost:5000/api/v1/users/me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## API Endpoints

### Auth

#### Register User

Registers a new user account.

- **URL**: `POST /auth/register`
- **Auth required**: No
- **Content-Type**: `application/json`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User's email address |
| `password` | string | Yes | Password (min 8 characters) |
| `firstName` | string | Yes | User's first name |
| `lastName` | string | Yes | User's last name |

**Example Request:**

```bash
curl -X POST "http://localhost:5000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "Str0ng!Pass",
    "firstName": "Jane",
    "lastName": "Doe"
  }'
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "email": "jane@example.com",
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400 Bad Request):**

| Scenario | Error Code | Description |
|----------|------------|-------------|
| Email already in use | `EMAIL_IN_USE` | The provided email is already registered |
| Invalid email | `VALIDATION_ERROR` | Email format is invalid |
| Password too short | `VALIDATION_ERROR` | Password must be at least 8 characters |

```json
{
  "success": false,
  "error": "EMAIL_IN_USE"
}
```

---

#### Login User

Authenticates a user and returns access and refresh tokens.

- **URL**: `POST /auth/login`
- **Auth required**: No
- **Content-Type**: `application/json`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User's email address |
| `password` | string | Yes | User's password |

**Example Request:**

```bash
curl -X POST "http://localhost:5000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "Str0ng!Pass"
  }'
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "email": "jane@example.com",
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

| Scenario | Status Code | Error Code | Description |
|----------|-------------|------------|-------------|
| Invalid email/password | 401 | `INVALID_CREDENTIALS` | Email or password is incorrect |
| Account locked | 401 | `ACCOUNT_LOCKED` | Account is locked due to too many failed login attempts (5 attempts → 15 min lock) |

```json
{
  "success": false,
  "error": "INVALID_CREDENTIALS"
}
```

---

### Users

#### Get Current User

Retrieves the authenticated user's profile.

- **URL**: `GET /users/me`
- **Auth required**: Yes
- **Content-Type**: `application/json`

**Example Request:**

```bash
curl -X GET "http://localhost:5000/api/v1/users/me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "plan": "free",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Update Current User

Updates the authenticated user's profile.

- **URL**: `PATCH /users/me`
- **Auth required**: Yes
- **Content-Type**: `application/json`

---

#### Change Password

Changes the authenticated user's password.

- **URL**: `PATCH /users/me/change-password`
- **Auth required**: Yes
- **Content-Type**: `application/json`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `currentPassword` | string | Yes | Current password |
| `newPassword` | string | Yes | New password (min 6 characters) |

---

#### Upload Logo

Uploads a business logo for the user.

- **URL**: `POST /users/me/logo`
- **Auth required**: Yes
- **Content-Type**: `multipart/form-data`

**Form Data:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `logo` | file | Yes | Image file (max 5MB) |

---

### Clients

#### Create Client

- **URL**: `POST /clients`
- **Auth required**: Yes

---

#### Get All Clients

- **URL**: `GET /clients`
- **Auth required**: Yes

---

#### Get Client by ID

- **URL**: `GET /clients/:id`
- **Auth required**: Yes

---

#### Update Client

- **URL**: `PATCH /clients/:id`
- **Auth required**: Yes

---

#### Delete Client (Soft Delete)

- **URL**: `DELETE /clients/:id`
- **Auth required**: Yes

---

#### Get Trashed Clients

- **URL**: `GET /clients/trash`
- **Auth required**: Yes

---

#### Restore Client

- **URL**: `PATCH /clients/:id/restore`
- **Auth required**: Yes

---

### Invoices

#### Get Next Invoice Number

- **URL**: `GET /invoices/next-number`
- **Auth required**: Yes

---

#### Create Invoice

- **URL**: `POST /invoices`
- **Auth required**: Yes

---

#### Get All Invoices

- **URL**: `GET /invoices`
- **Auth required**: Yes
- **Query Parameters**:
  - `q`: Search by invoice number or client name
  - `status`: Filter by status (draft, sent, paid, overdue)

---

#### Get Invoice by ID

- **URL**: `GET /invoices/:id`
- **Auth required**: Yes

---

#### Update Invoice

- **URL**: `PATCH /invoices/:id`
- **Auth required**: Yes

---

#### Update Invoice Status

- **URL**: `PATCH /invoices/:id/status`
- **Auth required**: Yes

---

#### Get Invoice Preview

- **URL**: `GET /invoices/:id/preview`
- **Auth required**: Yes

---

#### Get Invoice PDF

- **URL**: `GET /invoices/:id/pdf`
- **Auth required**: Yes

---

#### Delete Invoice (Soft Delete)

- **URL**: `DELETE /invoices/:id`
- **Auth required**: Yes

---

#### Get Trashed Invoices

- **URL**: `GET /invoices/trash`
- **Auth required**: Yes

---

#### Restore Invoice

- **URL**: `PATCH /invoices/:id/restore`
- **Auth required**: Yes

---

### Items

#### Create Item

- **URL**: `POST /items`
- **Auth required**: Yes

---

#### Get All Items

- **URL**: `GET /items`
- **Auth required**: Yes

---

#### Get Item by ID

- **URL**: `GET /items/:id`
- **Auth required**: Yes

---

#### Update Item

- **URL**: `PATCH /items/:id`
- **Auth required**: Yes

---

#### Delete Item (Soft Delete)

- **URL**: `DELETE /items/:id`
- **Auth required**: Yes

---

#### Get Trashed Items

- **URL**: `GET /items/trash`
- **Auth required**: Yes

---

#### Restore Item

- **URL**: `PATCH /items/:id/restore`
- **Auth required**: Yes

---

### Payments

#### Record Payment

- **URL**: `POST /payments`
- **Auth required**: Yes

---

#### Get All Payments

- **URL**: `GET /payments`
- **Auth required**: Yes

---

#### Get Payment by ID

- **URL**: `GET /payments/:id`
- **Auth required**: Yes

---

#### Delete Payment (Soft Delete)

- **URL**: `DELETE /payments/:id`
- **Auth required**: Yes

---

#### Get Trashed Payments

- **URL**: `GET /payments/trash`
- **Auth required**: Yes

---

#### Restore Payment

- **URL**: `PATCH /payments/:id/restore`
- **Auth required**: Yes

---

### Subscriptions

#### Get Subscription

- **URL**: `GET /subscriptions`
- **Auth required**: Yes

---

#### Update Plan (Upgrade/Downgrade)

- **URL**: `PATCH /subscriptions/plan`
- **Auth required**: Yes

---

#### Cancel Subscription

- **URL**: `POST /subscriptions/cancel`
- **Auth required**: Yes

---

## Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Request was successful |
| 201 | Resource was created successfully |
| 400 | Invalid request parameters |
| 401 | Missing or invalid authentication |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict with existing resource |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Error Handling

All error responses follow this structure:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "fields": {
    "fieldName": "Specific error for this field"
  }
}
```

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `UNAUTHORIZED` | Missing or invalid authentication token |
| `INVALID_TOKEN` | Token is invalid or expired |
| `FORBIDDEN` | Insufficient permissions to access this resource |
| `NOT_FOUND` | Requested resource was not found |
| `VALIDATION_ERROR` | Request validation failed (check fields for details) |
| `EMAIL_IN_USE` | Email is already registered |
| `ACCOUNT_LOCKED` | Account is locked due to failed login attempts |
| `PLAN_LIMIT_REACHED` | User has exceeded their plan limits |

---

## Rate Limits

Invoizmo API has rate limits to prevent abuse:

| Endpoint Group | Rate Limit |
|----------------|-------------|
| Auth endpoints (`/auth/*`) | 10 requests per minute per IP |
| All other endpoints | 100 requests per minute per IP |

When a rate limit is exceeded, you'll receive a `429 Too Many Requests` response with a `Retry-After` header indicating how many seconds to wait before retrying.

---

## Changelog

### v1.1.0 (2026-05-15)
- Fixed subscription plan upgrade validation error
- Added automatic tax calculation for invoices
- Added missing invoice endpoints:
  - GET /invoices/next-number
  - PATCH /invoices/:id/status
  - GET /invoices/:id/preview
  - GET /invoices/:id/pdf
  - GET /invoices/trash
  - PATCH /invoices/:id/restore
- Added user endpoints:
  - PATCH /users/me/change-password
  - POST /users/me/logo (logo upload with Cloudinary)
- Added trash endpoints for clients, items, and payments
- Added file upload support using multer
- Added search and status filtering to GET /invoices

### v1.0.0 (2026-05-13)
- Initial release
- Added user authentication (register, login)
- Added core models: User, Client, Invoice, Item, Payment
- Added supporting models: Notification, Expense, AuditLog, Subscription

---

## Documentation Update Rule

**Important Rule:** Whenever you make changes to the API, you **MUST**:

1. Update this `API_DOCUMENTATION.md` file immediately
2. Add an entry to the [Changelog](#changelog) section with:
   - Version number
   - Date of change
   - Description of changes
3. Update affected endpoint documentation
4. Test the changes to ensure documentation accuracy

---

## Need Help?

For additional help or questions, please refer to the project's PRD or open an issue in the repository.
