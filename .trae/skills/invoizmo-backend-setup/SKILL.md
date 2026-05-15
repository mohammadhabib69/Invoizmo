---
name: "invoizmo-backend-setup"
description: "Set up or reset Invoizmo backend models, collections, and TypeScript types. Invoke when updating database schema, adding new models, or resetting collections."
---

# Invoizmo Backend Setup Skill

## What This Skill Does

This skill helps you:
1. ✅ Create/update all Invoizmo database models in `/backend/src/models/`
2. ✅ Fix TypeScript type errors across the backend
3. ✅ Add proper indexes for performance
4. ✅ Maintain consistent data structure across models
5. ✅ Set up API endpoints with proper validation
6. ✅ Add file upload support (multer + Cloudinary)
7. ✅ Set up automatic tax calculation for invoices

## Models Included

| Model | Description |
|-------|-------------|
| `User` | User accounts, authentication, business info |
| `Client` | Client/customer management |
| `Invoice` | Invoices, line items, status tracking |
| `Item` | Reusable line-item catalog |
| `Payment` | Payment records for invoices |
| `Notification` | User notifications (invoice sent, viewed, paid) |
| `Expense` | Business expense tracking |
| `AuditLog` | Audit trail of all user actions |
| `Subscription` | User subscription/plan management |

## Key Features Added (v1.1.0)

- **Automatic Tax Calculation**: Invoices automatically calculate subtotal, tax amount, and total
- **Trash Management**: Soft delete and restore functionality for all resources
- **File Upload**: Logo upload support using multer and Cloudinary
- **Search & Filter**: Invoice search and status filtering
- **Complete Endpoint Suite**: All CRUD operations for every resource

## When to Use This Skill

- When you need to **add a new model** to the database
- When you need to **update existing models** or fix TypeScript errors
- When you need to **reset the database schema**
- When you want to **ensure consistency** across all backend models
- When you need to **add new API endpoints**

## How It Works

This skill:
1. Reads the current project structure
2. Updates/recreates all model files in `/backend/src/models/`
3. Updates TypeScript type definitions in `/backend/src/types/`
4. Updates related middleware and utilities to match new schema
5. Runs TypeScript type checking to verify everything works correctly

## Example Usage

```typescript
// After using this skill, you can use models like this:
import { User, Client, Invoice, Payment } from './models';

const user = await User.create({
  email: 'test@example.com',
  passwordHash: '...',
  firstName: 'Test',
  lastName: 'User'
});
```
