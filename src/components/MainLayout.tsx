import { Outlet, useNavigation } from 'react-router-dom'
import Sidebar from './Sidebar/Sidebar'
import Breadcrumb from './Breadcrumb'
import ToastContainer from './ToastContainer'
import { ThemeProvider } from './ThemeProvider'
import { UserProvider } from '@/contexts/UserContext'
import styles from './MainLayout.module.css'

export default function MainLayout() {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  return (
    <ThemeProvider>
    <UserProvider>
    <ToastContainer />
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.content}>
        <div className={styles.banner} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80)' }}>
          <div className={styles.bannerOverlay} />
          <div className={styles.bannerText}>
            <h1 className={styles.bannerTitle}>Real Problems</h1>
            <p className={styles.bannerSlogan}>Solutions for real-world problems</p>
          </div>
        </div>
        <Breadcrumb />
        <div className={styles.pageContent}>
          {isLoading ? (
            <div className={styles.spinner}>
              <div className={styles.spinnerCircle} />
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
    </UserProvider>
    </ThemeProvider>
  )
}
