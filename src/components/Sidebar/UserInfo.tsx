import { useUser } from '@/contexts/UserContext'
import styles from './Sidebar.module.css'

export default function UserInfo({ collapsed }: { collapsed: boolean }) {
  const user = useUser()

  return (
    <div className={styles.userInfo}>
      {user?.avatar ? (
        <img src={user.avatar} alt="" className={styles.avatar} />
      ) : (
        <div className={styles.avatar}>
          {user?.username?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
      {!collapsed && (
        <div>
          <div className={styles.name}>{user?.username || '...'}</div>
          <div className={styles.email}>{user?.email || ''}</div>
        </div>
      )}
    </div>
  )
}
