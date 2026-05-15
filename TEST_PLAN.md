# Invoizmo API Test Plan

## 📋 Overview
This document outlines all test scenarios for Invoizmo API endpoints.

---

## 1. Authentication Endpoints

### 1.1 POST /api/v1/auth/register
Test user registration with various scenarios.

| Test Case | Scenario | Expected Result |
|-----------|----------|-----------------|
| TC-REG-001 | Valid registration (all fields correct) | 201 Created, user added to DB |
| TC-REG-002 | Missing required field (email) | 400 Bad Request, validation error |
| TC-REG-003 | Missing required field (password) | 400 Bad Request, validation error |
| TC-REG-004 | Missing required field (firstName) | 400 Bad Request, validation error |
| TC-REG-005 | Missing required field (lastName) | 400 Bad Request, validation error |
| TC-REG-006 | Invalid email format | 400 Bad Request, validation error |
| TC-REG-007 | Password too short (less than 8 chars) | 400 Bad Request, validation error |
| TC-REG-008 | Email already in use | 409 Conflict, EMAIL_IN_USE |
| TC-REG-009 | Empty request body | 400 Bad Request |

### 1.2 POST /api/v1/auth/login
Test user login with various scenarios.

| Test Case | Scenario | Expected Result |
|-----------|----------|-----------------|
| TC-LOGIN-001 | Valid credentials | 200 OK, access token returned |
| TC-LOGIN-002 | Email not found | 401 Unauthorized, INVALID_CREDENTIALS |
| TC-LOGIN-003 | Wrong password | 401 Unauthorized, INVALID_CREDENTIALS |
| TC-LOGIN-004 | Account locked (5 failed attempts) | 401 Unauthorized, ACCOUNT_LOCKED |
| TC-LOGIN-005 | Empty request body | 400 Bad Request |
| TC-LOGIN-006 | Missing email field | 400 Bad Request, validation error |
| TC-LOGIN-007 | Missing password field | 400 Bad Request, validation error |
| TC-LOGIN-008 | Invalid email format | 400 Bad Request, validation error |

---

## 2. Test Execution Order
1. Run register tests (TC-REG-001 to TC-REG-009)
2. Run login tests (TC-LOGIN-001 to TC-LOGIN-008)
3. Verify database after each test
