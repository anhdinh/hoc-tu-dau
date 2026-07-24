import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '@/services/api'
import { useCartTotalItems, useCartTotalPrice } from '@/stores/cartStore'
import ConfirmPopup from '@/components/ConfirmPopup'
import styles from './Sidebar.module.css'
import UserInfo from './UserInfo'
import Menu from './Menu'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const navigate = useNavigate()

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function CartBadge({ collapsed }: { collapsed: boolean }) {
    const totalItems = useCartTotalItems()
    const totalPrice = useCartTotalPrice()
    return (
      <Link to="/products" className={styles.cartBadge}>
        <span>🛒</span>
        {!collapsed && (
          <span>
            Cart <strong>({totalItems})</strong>
            <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 6 }}>${totalPrice}</span>
          </span>
        )}
        {collapsed && totalItems > 0 && (
          <span className={styles.cartCount}>{totalItems}</span>
        )}
      </Link>
    )
  }

  async function handleLogout() {
    const accessToken = localStorage.getItem('token')
    try {
      await api.post('/auth/logout',
        new URLSearchParams({ accessToken: accessToken || '' }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
    } finally {
      localStorage.removeItem('token')
      setShowConfirm(false)
      navigate('/login')
    }
  }

  const show = isMobile ? mobileOpen : true

  return (
    <>
      {isMobile && (
        <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      )}
      <div className={`${styles.wrapper} ${collapsed ? styles.collapsed : ''} ${show ? styles.visible : ''}`}>
        {isMobile && (
          <div className={styles.backdrop} onClick={() => setMobileOpen(false)} />
        )}
        {!isMobile && (
          <button className={styles.toggle} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '▶' : '◀'}
          </button>
        )}
        <UserInfo collapsed={collapsed} />
        <Menu collapsed={collapsed} />
        <CartBadge collapsed={collapsed} />
        <button className={styles.logout} onClick={() => setShowConfirm(true)}>
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
        {showConfirm && (
          <ConfirmPopup
            message="Are you sure you want to log out?"
            confirmLabel="Logout"
            onConfirm={handleLogout}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </div>
    </>
  )
}
