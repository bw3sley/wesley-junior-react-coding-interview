# Support Triage Dashboard

Internal dashboard for reviewing support tickets and assigning work to support agents.

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Available scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run generate-data
```

## Project overview

The dashboard helps support managers inspect incoming tickets, identify urgent issues, and route work to the right support agents.

The app includes:

- Dashboard with ticket counts and status and priority charts
- Searchable ticket list with sorting and pagination
- Ticket assignment to agents whose specialty matches the ticket category
- Searchable agent directory with sorting and pagination
- Generated mock support data
- Simulated 1.2-second API latency

## Data

Mock ticket data is generated locally into `src/data/db.json` when the app starts or builds. The generated file is ignored by Git.
Assignments update the in-memory mock API and reset when the page reloads.

To regenerate the data manually:

```bash
npm run generate-data
```

Support cases include fields such as:

- `priority`
- `status`
- `category`
- `customerTier`
- `agentId`
- `deadline`
- `description`

Agents are defined in `src/data/agents.ts` and include a specialty matching one of the support case categories.

## Tech stack

- React
- TypeScript
- Vite
- Recharts for dashboard charts
- TanStack Table for sorting and pagination
- Radix Select for mobile sort controls
- Plain CSS
- Generated mock data with Faker
