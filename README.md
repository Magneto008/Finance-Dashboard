# Finance Dashboard

React + TypeScript dashboard for tracking income/expenses, filtering transactions, viewing insights, and exporting reports.

## Features Overview

- [x] **Dashboard Overview:** Summary cards, Recharts Area chart (balance trend), and Recharts Pie chart (spending breakdown).
- [x] **Transactions Section:** Full data table with mock data, column sorting, type filtering, and advanced natural-language date search.
- [x] **Insights Section:** Dynamic calculation of Savings Rate, Monthly Comparisons, and Top Expenses.
- [x] **Role-Based UI:** Simulated `admin` (can add transactions) vs `viewer` (read-only) modes.
- [x] **State Management:** Extensively modeled with React state and Context.
- [x] **Optional Enhancements:** Includes Dark Mode, Data Persistence (IndexedDB), Multi-format Export (CSV, JSON, Excel), and Advanced Filtering (Chrono-node natural language search).

## Setup

### Prerequisites
- Node.js 20+
- npm 10+

### Run locally
```bash
npm install
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`).

### Scripts
```bash
npm run lint
npm run build
npm run preview
```

## Project Structure (Current)

- `src/app`: app shell, providers, context
- `src/features/dashboard`: summary + charts
- `src/features/transactions`: table, form, export, DB helpers
- `src/features/filters`: advanced filter UI + filter logic
- `src/features/insights`: insight cards + metrics calculation logic
- `src/shared`: cross-feature types

## Data Flow

- App loads transactions from IndexedDB (`FinanceDashboardDB`).
- If DB is empty, mock transactions are seeded.
- Filters and search are applied in memory.
- Dashboard and Insights are derived from current transaction state.

## Transactions: Natural-Language Search

- Search uses `chrono-node` to parse date-like terms.
- Works with terms like `last week`, `yesterday`, `February`, `2023`, `last year`.
- Parsing behavior:
- If input resolves to a date range, transactions inside the range match.
- If input resolves to a specific date parts (year/month/day), those parts are matched.
- Non-date matching still works on `id`, `date`, `category`, `type`, and `amount` text.
- Search is combined with type filter + sorting + pagination.

## Advanced Filter Logic

- Filters are organized in groups.
- Inside each group, rules use either `AND` (match all) or `OR` (match any).
- Across groups, evaluation uses `OR`.
- If no filter rules exist, all transactions are returned.

## Insights: How Values Are Calculated

- `Top Expense Category`: category with highest summed expense amount.
- `Savings Rate`: `((totalIncome - totalExpense) / totalIncome) * 100`.
- `Monthly Comparison`: percent delta between latest month expense and previous month expense.
- `Avg Transaction Size`: average of expense transaction amounts.
- `Total Income`: sum of all `income` transactions.
- `Total Expenses`: sum of all `expense` transactions.
- `Net Balance`: `totalIncome - totalExpense`.
- `Activity Log`: total transaction count + latest transaction date.

## Dashboard Charts

- Balance History (area chart): running balance over time by date.
- Expense Breakdown (pie chart): expense totals grouped by category.

## Export

- Export filtered transactions to:
- JSON (`transactions.json`)
- CSV (`transactions.csv`)
- Excel (`transactions.xlsx`)

## Roles and UX

- `admin`: can add transactions.
- `viewer`: read-only.
- Theme modes: `light`, `dark`, `system`.
- Active tab and some UI preferences are persisted locally.
