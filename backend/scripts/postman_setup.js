const WORKSPACE_ID = process.env.POSTMAN_WORKSPACE_ID || "";
const API_KEY = process.env.POSTMAN_API_KEY || "";
const HEADERS = { "X-API-Key": API_KEY, "Content-Type": "application/json" };

async function run() {
  try {
    const getRes = await fetch(`https://api.postman.com/collections?workspace=${WORKSPACE_ID}`, { headers: HEADERS });
    const getJson = await getRes.json();
    for (const c of getJson.collections || []) {
      await fetch(`https://api.postman.com/collections/${c.uid}`, { method: 'DELETE', headers: HEADERS });
    }

    const cVars = [
      { key: "baseUrl", value: "http://localhost:5001", type: "string" },
      { key: "accessToken", value: "", type: "string" }
    ];
    
    const collections = [
      {
        info: { name: "Public", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
        variable: cVars,
        item: [
          { name: "Base Welcome", request: { method: "GET", url: { raw: "{{baseUrl}}/", host: ["{{baseUrl}}"], path: [""] } } },
          { name: "Health Check", request: { method: "GET", url: { raw: "{{baseUrl}}/health", host: ["{{baseUrl}}"], path: ["health"] } } }
        ]
      },
      {
        info: { name: "Auth", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
        variable: cVars,
        item: [
          {
            name: "Register",
            event: [{ listen: "test", script: { exec: ["var res = pm.response.json();", "if(res.data && res.data.accessToken) pm.globals.set('accessToken', res.data.accessToken);"], type: "text/javascript" } }],
            request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: "{\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}" }, url: { raw: "{{baseUrl}}/api/v1/auth/register", host: ["{{baseUrl}}"], path: ["api", "v1", "auth", "register"] } }
          },
          {
            name: "Login",
            event: [{ listen: "test", script: { exec: ["var res = pm.response.json();", "if(res.data && res.data.accessToken) pm.globals.set('accessToken', res.data.accessToken);"], type: "text/javascript" } }],
            request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: "{\"email\":\"test@example.com\",\"password\":\"password123\"}" }, url: { raw: "{{baseUrl}}/api/v1/auth/login", host: ["{{baseUrl}}"], path: ["api", "v1", "auth", "login"] } }
          }
        ]
      },
      {
        info: { name: "Users", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
        variable: cVars,
        item: [
          { name: "Get Profile", request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{accessToken}}" }], url: { raw: "{{baseUrl}}/api/v1/users/me", host: ["{{baseUrl}}"], path: ["api", "v1", "users", "me"] } } },
          { name: "Update Profile", request: { method: "PUT", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{accessToken}}" }], body: { mode: "raw", raw: "{\"businessName\":\"My Business\"}" }, url: { raw: "{{baseUrl}}/api/v1/users/me", host: ["{{baseUrl}}"], path: ["api", "v1", "users", "me"] } } }
        ]
      },
      {
        info: { name: "Clients", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
        variable: cVars,
        item: [
          { name: "Create Client", request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{accessToken}}" }], body: { mode: "raw", raw: "{\"name\":\"Client A\",\"email\":\"client@a.com\"}" }, url: { raw: "{{baseUrl}}/api/v1/clients", host: ["{{baseUrl}}"], path: ["api", "v1", "clients"] } } },
          { name: "Get All Clients", request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{accessToken}}" }], url: { raw: "{{baseUrl}}/api/v1/clients", host: ["{{baseUrl}}"], path: ["api", "v1", "clients"] } } }
        ]
      },
      {
        info: { name: "Items", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
        variable: cVars,
        item: [
          { name: "Create Item", request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{accessToken}}" }], body: { mode: "raw", raw: "{\"name\":\"Web Dev\",\"price\":50000}" }, url: { raw: "{{baseUrl}}/api/v1/items", host: ["{{baseUrl}}"], path: ["api", "v1", "items"] } } },
          { name: "Get All Items", request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{accessToken}}" }], url: { raw: "{{baseUrl}}/api/v1/items", host: ["{{baseUrl}}"], path: ["api", "v1", "items"] } } }
        ]
      },
      {
        info: { name: "Invoices", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
        variable: cVars,
        item: [
          { name: "Create Invoice", request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{accessToken}}" }], body: { mode: "raw", raw: "{\"clientId\":\"ID\",\"items\":[],\"subtotal\":0,\"total\":0,\"issueDate\":\"2026-05-13\",\"dueDate\":\"2026-05-20\"}" }, url: { raw: "{{baseUrl}}/api/v1/invoices", host: ["{{baseUrl}}"], path: ["api", "v1", "invoices"] } } },
          { name: "Get All Invoices", request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{accessToken}}" }], url: { raw: "{{baseUrl}}/api/v1/invoices", host: ["{{baseUrl}}"], path: ["api", "v1", "invoices"] } } }
        ]
      },
      {
        info: { name: "Payments", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
        variable: cVars,
        item: [
          { name: "Record Payment", request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{accessToken}}" }], body: { mode: "raw", raw: "{\"invoiceId\":\"ID\",\"amount\":50000,\"method\":\"bank_transfer\"}" }, url: { raw: "{{baseUrl}}/api/v1/payments", host: ["{{baseUrl}}"], path: ["api", "v1", "payments"] } } },
          { name: "Get All Payments", request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{accessToken}}" }], url: { raw: "{{baseUrl}}/api/v1/payments", host: ["{{baseUrl}}"], path: ["api", "v1", "payments"] } } }
        ]
      },
      {
        info: { name: "Analytics", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
        variable: cVars,
        item: [
          { name: "Get Dashboard Stats", request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{accessToken}}" }], url: { raw: "{{baseUrl}}/api/v1/analytics/dashboard", host: ["{{baseUrl}}"], path: ["api", "v1", "analytics", "dashboard"] } } }
        ]
      }
    ];

    for (const c of collections) {
      await fetch(`https://api.postman.com/collections?workspace=${WORKSPACE_ID}`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ collection: c })
      });
    }
    console.log("Success");
  } catch (err) {
    console.error(err);
  }
}

run();
