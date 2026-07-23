# Real Problems

Internal dashboard for managing projects, reports, and team data.

## Tech Stack

- **React 19** + **TypeScript 6**
- **Vite 8** (build tool)
- **React Router v7** (routing + loaders)
- **Axios** (HTTP client)
- **Recharts** (charts — lazy-loaded)
- **CSS Modules** (scoped styles)

## Quick Start

```bash
npm install
cp .env.example .env        # configure API URL
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command           | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start dev server with HMR          |
| `npm run build`   | Type-check + build for production  |
| `npm run preview` | Preview production build locally   |
| `npm run lint`    | Run Oxlint                         |

## Project Structure

```
src/
├── main.tsx             Entry point + router config
├── api.ts               Axios instance with auth interceptor
├── index.css            Global styles
├── components/          Reusable UI (layout, sidebar, toast, etc.)
└── pages/               One file per route
```

## Onboarding

### Adding a new page

1. Create `src/pages/MyPage.tsx` and export a default component.
2. Import it and add a route inside `MainLayout`'s `children` in `src/main.tsx`.
3. (Optional) Add a menu link in `src/components/Sidebar/Menu.tsx`.

See `GUIDE.md` for detailed instructions with examples.

### Code conventions

- **CSS Modules** — every component gets `X.module.css`, imported as `styles`.
- **One component per file** — pages in `pages/`, shared UI in `components/`.
- **No inline comments** — code should be self-documenting.
- **No emoji in code** — except in menu icons.
- **Lazy-load heavy pages** — use `React.lazy()` for pages with large dependencies (charts, tables).

### Auth flow

- Login stores JWT in `localStorage` under `token`.
- API calls attach `Authorization: Bearer <token>` via Axios interceptor.
- Route loaders call `/userinfo` to validate the token; on failure, redirect to `/login`.
- Logout removes the token and redirects.
