import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  let title = 'Something went wrong'
  let message = 'An unexpected error occurred.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    message = error.data?.message || message
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh', gap: 16,
      background: '#f5f5f5', color: '#374151',
    }}>
      <h1 style={{ fontSize: 48, fontWeight: 700, margin: 0, color: '#4f46e5' }}>
        {title}
      </h1>
      <p style={{ fontSize: 16, margin: 0 }}>{message}</p>
      <Link to="/" style={{
        padding: '10px 24px', background: '#4f46e5', color: '#fff',
        borderRadius: 8, textDecoration: 'none', fontSize: 14, marginTop: 8,
      }}>
        Back to Dashboard
      </Link>
    </div>
  )
}
