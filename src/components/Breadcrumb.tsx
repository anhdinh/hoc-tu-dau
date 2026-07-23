import { Link, useLocation } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

function formatLabel(seg: string): string {
  return seg
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function Breadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav className={styles.breadcrumb}>
      <Link to="/" className={styles.link}>Home</Link>
      {segments.map((seg, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/')
        const isLast = i === segments.length - 1

        return (
          <span key={path}>
            <span className={styles.sep}>/</span>
            {isLast ? (
              <span className={styles.current}>{formatLabel(seg)}</span>
            ) : (
              <Link to={path} className={styles.link}>{formatLabel(seg)}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
