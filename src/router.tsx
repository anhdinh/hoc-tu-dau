import { lazy, Suspense } from 'react'
import { createBrowserRouter, redirect } from 'react-router-dom'
import Login from '@/components/Login/Login'
import ErrorPage from '@/components/ErrorPage'
import MainLayout from '@/components/MainLayout'
import Settings from '@/pages/Settings'
import Profile from '@/pages/Profile'
import MessagesLayout from '@/pages/Messages'
import MessagesList from '@/pages/MessagesList'
import MessagesEdit from '@/pages/MessagesEdit'
import Reports from '@/pages/Reports'
import Products from '@/pages/Products'
import Users from '@/pages/admin/Users'
import Videos from '@/pages/admin/Videos'
import Catalogs from '@/pages/admin/Catalogs'
import SubscriptionsLayout from '@/pages/admin/Subscriptions'
import SubscriptionsList from '@/pages/admin/SubscriptionsList'
import SubscriptionsAdd from '@/pages/admin/SubscriptionsAdd'
import NotFound from '@/pages/NotFound'
import api from '@/services/api'

const Dashboard = lazy(() => import('@/pages/Dashboard'))

// ── Route loaders ──────────────────────────────────────────────────

async function rootLoader() {
  if (!localStorage.getItem('token')) return redirect('/login')
  try {
    const { data } = await api.get('/userinfo', { maxRedirects: 0 })
    return data
  } catch {
    localStorage.removeItem('token')
    return redirect('/login')
  }
}

async function loginLoader() {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    await api.get('/userinfo', { maxRedirects: 0 })
    return redirect('/')
  } catch {
    localStorage.removeItem('token')
    return null
  }
}

async function adminLoader() {
  try {
    const { data } = await api.get('/userinfo', { maxRedirects: 0 })
    if (!data.roles?.includes('ROLE_ADMIN')) return redirect('/')
    return null
  } catch {
    return redirect('/login')
  }
}

// ── Router definition ──────────────────────────────────────────────

export const router = createBrowserRouter([
  {
    path: '/login',
    loader: loginLoader,
    element: <Login />,
  },
  {
    id: 'root',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>}>
            <Dashboard />
          </Suspense>
        ),
      },
      { path: '/settings', element: <Settings /> },
      { path: '/profile', element: <Profile /> },
      {
        path: '/messages',
        element: <MessagesLayout />,
        children: [
          { index: true, element: <MessagesList /> },
          { path: 'edit', element: <MessagesEdit /> },
        ],
      },
      { path: '/reports', element: <Reports /> },
      { path: '/admin/users', loader: adminLoader, element: <Users /> },
      { path: '/admin/videos', loader: adminLoader, element: <Videos /> },
      { path: '/admin/catalogs', loader: adminLoader, element: <Catalogs /> },
      {
        path: '/admin/subscriptions',
        loader: adminLoader,
        element: <SubscriptionsLayout />,
        children: [
          { index: true, element: <SubscriptionsList /> },
          { path: 'add', element: <SubscriptionsAdd /> },
        ],
      },
      { path: '/products', element: <Products /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
