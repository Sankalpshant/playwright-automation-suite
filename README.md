# Playwright Automation Suite

QA automation portfolio project. Playwright + JS test suite using Page Object Model, a Postman API collection, and manual bug reports — built to demonstrate functional, negative, boundary, and API testing skills.

## What's covered

**UI Tests (32 tests total)** — [SauceDemo](https://www.saucedemo.com) + [The Internet](https://the-internet.herokuapp.com)
- `tests/login.spec.js` — valid/invalid auth, locked-out user, empty fields, SQL-injection-style input, whitespace handling
- `tests/inventory.spec.js` — product listing, cart state, sort ordering (price asc/desc, alphabetical)
- `tests/checkout.spec.js` — full purchase flow, form validation, order total calculation
- `tests/edge-cases.spec.js` — JS alerts (confirm/prompt), dynamic AJAX loading, file upload, hover states

**API Tests** — `postman/API-Test-Collection.postman_collection.json`
Tested against [ReqRes](https://reqres.in): auth (positive/negative), full CRUD (create/read/update/delete), pagination, schema validation, response time assertions.

**Bug Reports** — `bug-reports/`
3 markdown bug reports following a standard template: steps to reproduce, expected vs actual, severity/priority, reproduction rate.

## Architecture

Uses the **Page Object Model** — each page (`LoginPage`, `InventoryPage`, `CheckoutPage`) encapsulates its own selectors and actions in `/pages`, so tests read like plain English and don't break every time a selector changes.

## Running locally

```bash
npm install
npx playwright install --with-deps chromium
npm test              # run all tests headless
npm run test:headed   # run with browser visible
npm run report        # view the HTML report after a run
```

## CI/CD

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs the full suite on every push/PR to `main` and uploads the HTML report as a build artifact. See the Actions tab for run history.

## Postman collection

Import `postman/API-Test-Collection.postman_collection.json` directly into Postman (File → Import) to run the API test suite.

---
Built by [Sankalp Shant](https://github.com/Sankalpshant) as part of QA portfolio development.
 
