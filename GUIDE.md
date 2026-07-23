# Project Guide

## Directory Structure

```
src/
├── main.tsx                 # Entry point + Router config
├── index.css                # Global styles (body, #root, headings)
├── api.ts                   # Axios instance + auth interceptor
├── assets/                  # Static images (hero.png, svg icons)
│
├── components/              # Reusable UI components
│   ├── MainLayout.tsx       # Layout: sidebar | banner > breadcrumb > Outlet
│   ├── MainLayout.module.css
│   ├── Breadcrumb.tsx       # Dynamic breadcrumb from URL path
│   ├── Breadcrumb.module.css
│   ├── ConfirmPopup.tsx     # "Are you sure?" dialog
│   ├── ErrorPage.tsx        # Error boundary UI (crash / 404)
│   ├── Toast.tsx            # Auto-dismiss notification (top-right)
│   ├── Login/
│   │   ├── Login.tsx
│   │   └── Login.module.css
│   └── Sidebar/
│       ├── Sidebar.tsx       # Collapsible sidebar + mobile overlay
│       ├── Sidebar.module.css
│       ├── UserInfo.tsx      # Avatar + name + email
│       └── Menu.tsx          # Navigation links
│
└── pages/                    # One file per route
    ├── Dashboard.tsx          # /  — charts (lazy-loaded)
    ├── Settings.tsx           # /settings
    ├── Profile.tsx            # /profile
    ├── Messages.tsx           # /messages — layout with <Outlet/>
    ├── MessagesList.tsx       # /messages — index route
    ├── MessagesEdit.tsx       # /messages/edit
    └── Reports.tsx            # /reports
```

## Component Tree (render hierarchy)

```
<RouterProvider>
 ├── /login
 │   └── <Login/>                    (no sidebar, no layout)
 │
 └── MainLayout route                 (has sidebar + banner)
     ├── <Sidebar/>
     │   ├── <UserInfo/>              (avatar, name, email)
     │   ├── <Menu/>                  (Dashboard, Settings, ...)
     │   └── Logout button
     ├── Banner                        (image + overlay + text)
     ├── <Breadcrumb/>                 (Home / Messages / Edit)
     └── <Outlet/>                     (page content)
         ├── Dashboard   → /           (lazy-loaded with recharts)
         ├── Settings    → /settings
         ├── Profile     → /profile
         └── MessagesLayout  → /messages
             ├── <Outlet/>
             │   ├── MessagesList  → /messages      (index)
             │   └── MessagesEdit  → /messages/edit
```

## How to Add a New Page

### 1. Create a page component

Create `src/pages/MyPage.tsx`:

```tsx
export default function MyPage() {
  return <h2>My Page</h2>
}
```

### 2. Register the route in `src/main.tsx`

Import the component:

```tsx
import MyPage from './pages/MyPage'
```

Add the route inside `MainLayout`'s `children` array:

```tsx
children: [
  { path: '/', element: (...) },
  { path: '/my-page', element: <MyPage /> },       // ← add here
  { path: '/settings', element: <Settings /> },
  // ...
]
```

### 3. Add a menu link (optional)

Edit `src/components/Sidebar/Menu.tsx`:

```tsx
const menuItems = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'My Page', path: '/my-page', icon: '✨' },  // ← add here
  // ...
]
```

### 4. Add a breadcrumb label (optional)

If the path segment doesn't look right when capitalized, you don't need to do anything — `Breadcrumb.tsx` automatically formats path segments (dashes → spaces, capitalize each word). `/my-page` automatically shows as `My Page`.

---

### Create a nested route (page with children)

Example: `/users` with `/users/add` and `/users/:id/edit`.

**1. Layout** — `src/pages/Users.tsx`:

```tsx
import { Outlet } from 'react-router-dom'
export default function Users() {
  return <Outlet />
}
```

**2. Pages** — `UsersList.tsx`, `UsersAdd.tsx`, `UserEdit.tsx`.

**3. Router** in `main.tsx`:

```tsx
{ path: '/users', element: <Users />, children: [
  { index: true, element: <UsersList /> },
  { path: 'add', element: <UsersAdd /> },
  { path: ':id/edit', element: <UserEdit /> },
]}
```

### Key Rules

- Pages go in `src/pages/` — one component per file.
- Shared/reusable UI goes in `src/components/` — group related files in subdirectories with CSS Modules.
- Use CSS Modules (`*.module.css`) — import as `import styles from './X.module.css'`.
- New routes go inside `MainLayout`'s `children` — unless the page needs no sidebar (like `/login`).
- To lazy-load a page (recommended for heavy pages with charts), use `React.lazy()` in `main.tsx`.
