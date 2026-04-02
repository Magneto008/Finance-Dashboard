# Finance Dashboard

A React + TypeScript personal finance dashboard for tracking income and expenses, visualizing trends, filtering data, and exporting reports.

## Setup Instructions

### Prerequisites
- Node.js 20+ (recommended)
- npm 10+

### Install and run
```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

### Other scripts
```bash
npm run build   # Type-check + production build
npm run preview # Preview built app locally
npm run lint    # Run ESLint
```

## Overview of Approach

- Feature-first structure: code is organized by domain (`dashboard`, `transactions`, `insights`) with shared UI/components/utilities.
- Central app state: a React Context + `useReducer` handles transactions, role (`admin`/`viewer`), and advanced filter groups.
- Browser persistence:
  - Transactions are stored in IndexedDB (`FinanceDashboardDB`).
  - Theme preference is persisted in IndexedDB (`FinanceDashboardPreferences`).
  - Active tab state is persisted in `localStorage`.
- Data flow:
  - App boots by loading transactions from IndexedDB.
  - If empty, mock transactions are seeded.
  - All charts, summaries, and insight cards are derived from current state.
- UI stack:
  - Tailwind CSS + shadcn/ui components for layout and controls.
  - Recharts for balance trend and expense breakdown charts.

## Features Explained

### 1) Dashboard
- Summary cards show total balance, income, and expenses.
- Charts include:
  - Running balance over time (area chart).
  - Expense split by category (pie chart).

### 2) Transactions
- Add transactions (admin role only).
- Search with natural-language date support (e.g. "last week", "February") using `chrono-node`.
- Filter by type, sort by multiple fields, and toggle sort direction.
- Transaction table with badges and formatted currency values.

### 3) Advanced Filtering
- Supports grouped conditions for complex queries.
- Logic model:
  - Conditions inside a group use `AND` or `OR`.
  - Groups are combined with `OR`.

### 4) Insights
- Displays derived metrics such as:
  - Top expense category
  - Savings rate
  - Month-over-month expense delta
  - Average expense size
  - Total income/expenses
  - Net balance and latest activity

### 5) Export
- Export currently filtered transactions to:
  - JSON
  - CSV
  - Excel (`.xlsx`)

### 6) UX and Preferences
- Light, dark, and system theme support.
- Sticky header and responsive tabbed layout.
- Role switcher (`admin` / `viewer`) with UI-level permission behavior.
