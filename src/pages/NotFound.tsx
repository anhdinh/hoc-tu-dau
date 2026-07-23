import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', paddingTop: 80 }}>
      <h1 style={{ fontSize: 72, fontWeight: 700, margin: 0, color: '#4f46e5' }}>404</h1>
      <p style={{ fontSize: 16, color: '#6b6375', marginTop: 8 }}>Page not found</p>
      <Link to="/" style={{
        display: 'inline-block', marginTop: 24, padding: '10px 24px',
        background: '#4f46e5', color: '#fff', borderRadius: 8,
        textDecoration: 'none', fontSize: 14,
      }}>
        Back to Dashboard
      </Link>
    </div>
  )
}
