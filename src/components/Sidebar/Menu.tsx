import { Link } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import styles from './Sidebar.module.css'

const menuItems = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
  { label: 'Profile', path: '/profile', icon: '👤' },
  { label: 'Messages', path: '/messages', icon: '💬' },
  { label: 'Products', path: '/products', icon: '🛒' },
  { label: 'Reports', path: '/reports', icon: '📈' },
]

const adminItems = [
  { label: 'Users', path: '/admin/users', icon: '👥' },
  { label: 'Videos', path: '/admin/videos', icon: '🎬' },
  { label: 'Catalogs', path: '/admin/catalogs', icon: '📁' },
  { label: 'Subscriptions', path: '/admin/subscriptions', icon: '🔗' },
]

export default function Menu({ collapsed }: { collapsed: boolean }) {
  const user = useUser()
  const isAdmin = user?.roles?.includes('ROLE_ADMIN')

  return (
    <nav className={styles.menu}>
      {menuItems.map((item) => (
        <Link key={item.path} to={item.path} className={styles.menuItem}>
          <span>{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </Link>
      ))}
      {isAdmin && !collapsed && <div className={styles.sectionLabel}>Admin</div>}
      {isAdmin && adminItems.map((item) => (
        <Link key={item.path} to={item.path} className={styles.menuItem}>
          <span>{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </Link>
      ))}
    </nav>
  )
}
