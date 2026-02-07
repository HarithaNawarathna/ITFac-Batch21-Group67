# QA Automation

QA automation suite using **Playwright** (UI) and **Cucumber** (BDD), with TypeScript.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (comes with Node)

## Setup

1. **Install dependencies**

   ```bash
   cd qa-automation
   npm install
   ```

2. **Configure environment**

   Copy the example env file and set your values:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:

   - `UI_BASE_URL` – base URL of the web app (e.g. `http://localhost:8080`)
   - `API_BASE_URL` – base URL of the API (e.g. `http://localhost:8080`)
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` – admin credentials
   - `USER_USERNAME` / `USER_PASSWORD` – regular user credentials

3. **Install Playwright browsers** (for UI tests)

   ```bash
   npx playwright install
   ```

## Running tests

| Command | Description |
|--------|-------------|
| `npm run test:ui` | Run all UI (Cucumber) tests |
| `npm run test:ui:headed` | Run UI tests with browser visible |
| `npm run test:ui:login` | Run only the login UI feature |
| `npm run test:ui:login:headed` | Run login UI feature with browser visible |
| `npm run test:api` | Run all API (Cucumber) tests |
| `npm run test:api:login` | Run only the login API feature |
| `npm run test:all` | Run UI then API tests |

**Optional:** Run with a visible browser via env:

```bash
HEADED=1 npm run test:ui
```

Or set `HEADED=1` in `.env`.

## Project structure

```
qa-automation/
├── src/
│   ├── api/                    # API tests
│   │   ├── clients/            # API clients (auth, categories, …)
│   │   ├── features/           # API .feature files
│   │   ├── steps/              # API step definitions
│   │   └── support/            # API world, hooks
│   ├── config/                 # env, routes, endpoints
│   ├── shared/                 # assertions, types, utils
│   └── ui/                     # UI tests
│       ├── features/           # UI .feature files
│       ├── pages/              # Page objects
│       ├── steps/              # UI step definitions
│       └── support/            # UI world, hooks, selectors
├── cucumber.js                  # Cucumber config (UI)
├── cucumber.api.js             # Cucumber config (API)
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `UI_BASE_URL` | Yes | Base URL of the web app |
| `API_BASE_URL` | Yes | Base URL of the API |
| `ADMIN_USERNAME` | Yes | Admin login username |
| `ADMIN_PASSWORD` | Yes | Admin login password |
| `USER_USERNAME` | Yes | User login username |
| `USER_PASSWORD` | Yes | User login password |
| `HEADED` | No | Set to `1` or `true` to run UI tests in a visible browser |

## Reports

- **Allure (UI):** `npm run report:ui` (uses `./scripts/generate-ui-allure.sh`)
- **Allure (API):** `npm run report:api` (uses `./scripts/generate-api-allure.sh`)

Reports are written under `reports/allure/`.

## Using pretest-created data (category, plant, sale)

Scenarios tagged with **`@pretest`** run a Before hook that creates a parent category, a subcategory (e.g. "Mango"), a plant under that category, and one sale. Those IDs are stored in the API world and written to `src/shared/testdata/pretest-ids.json`.

### API scenarios

- **Use pretest IDs in steps:** In steps that accept a plant or sale id, pass **`"pretest"`** to use the created IDs (e.g. `plant with id "pretest" is in stock`, `Admin sells plant with id "pretest" and quantity 2`).
- **Tag:** Add **`@pretest`** to the feature or scenario so the Before hook runs and populates `createdCategoryId`, `createdPlantId`, `createdSaleId` (and writes `pretest-ids.json`).
- **World:** Step definitions resolve `"pretest"` from `this.createdPlantId` / `this.createdSaleId` or, if missing, from `readPretestIds()` (the file).

Example (see `src/api/features/sales/sales.feature`):

```gherkin
@api @auth @sales @pretest
Feature: Sales API
  Scenario: Admin can sell a plant via API
    Given Admin authenticated
    And plant with id "pretest" is in stock
    When Admin sells plant with id "pretest" and quantity 2
    Then the sales response status is 201
```

### UI scenarios

- **Load pretest IDs:** Add a step **`Given pretest data is available`** so the UI world reads `pretest-ids.json` into `this.state.pretestIds`.
- **Prerequisite:** Run API tests with `@pretest` at least once so the file exists, or run a script that creates category/plant/sale and writes the file.
- **Use in steps:** After the Given step, use `this.state.pretestIds?.plantId`, `this.state.pretestIds?.categoryId`, or `this.state.pretestIds?.saleId` in your step definitions (e.g. to build URLs or assert on specific entities).

Example:

```gherkin
Given pretest data is available
# Then in your steps you can use this.state.pretestIds.plantId, etc.
```

## Notes

- Ensure the application and API are running at the URLs set in `.env` before running tests.
- API create-category tests expect **201 Created** and clean up created categories in an After hook.
