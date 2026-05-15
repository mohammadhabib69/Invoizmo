# Documentation Update Rules

## Mandatory Rule

**Whenever you make changes to the API or endpoints, you MUST update the documentation immediately.**

---

## What Triggers Documentation Update?

You MUST update documentation when:

✅ Adding a new API endpoint  
✅ Changing an existing endpoint's URL or method  
✅ Adding/removing/modifying request parameters  
✅ Changing response formats or status codes  
✅ Adding new error codes or modifying existing ones  
✅ Changing authentication requirements  
✅ Updating rate limits  
✅ Adding new models or modifying existing schemas  

---

## Step-by-Step Update Process

1. **Make your API changes first** (code changes)
2. **Update `API_DOCUMENTATION.md`**:
   - Add/modify the relevant endpoint documentation
   - Update request/response examples
   - Update status codes and error codes as needed
   - Add a new entry to the **Changelog** section
3. **Verify the changes** to ensure documentation matches the actual implementation
4. **Commit both code and documentation changes together**

---

## Changelog Format

When adding a changelog entry, use this format:

```markdown
### vX.Y.Z (YYYY-MM-DD)
- [Feature] Brief description of new feature
- [Fix] Brief description of bug fix
- [Change] Brief description of breaking change or modification
```

---

## Example

Suppose you add a new endpoint `POST /invoices` to create invoices. Here's what you do:

1. Implement the endpoint in your code
2. In `API_DOCUMENTATION.md`, add the new endpoint documentation
3. Add a changelog entry:

```markdown
### v1.1.0 (2026-05-13)
- [Feature] Added POST /invoices endpoint to create invoices
- [Feature] Added GET /invoices endpoint to list invoices
```

---

## Important Notes

- **Never commit API changes without updating documentation**
- **Documentation should be updated first or together with code changes**
- **Keep documentation concise and easy to understand**
- **Use clear examples in documentation**
