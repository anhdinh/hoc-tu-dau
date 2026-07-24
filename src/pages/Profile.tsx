import { useUser } from '@/contexts/UserContext'

export default function Profile() {
  const user = useUser()

  if (!user) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
  }

  const card: React.CSSProperties = {
    background: '#fff', borderRadius: 12, border: '1px solid #e5e4e7',
    padding: 32, maxWidth: 500,
  }
  const row: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', padding: '10px 0',
    borderBottom: '1px solid #f3f4f6', fontSize: 14,
  }
  const label: React.CSSProperties = { color: '#6b6375', fontWeight: 500 }
  const value: React.CSSProperties = { color: '#1a1a1a' }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Profile</h2>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          {user.avatar ? (
            <img src={user.avatar} alt=""
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: '#4f46e5',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700,
            }}>
              {user.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>{user.username}</div>
            <div style={{ fontSize: 13, color: '#6b6375', marginTop: 2 }}>{user.email}</div>
          </div>
        </div>

        <div style={row}>
          <span style={label}>Username</span>
          <span style={value}>{user.username}</span>
        </div>
        <div style={row}>
          <span style={label}>Email</span>
          <span style={value}>{user.email}</span>
        </div>
        {user.gender && (
          <div style={row}>
            <span style={label}>Gender</span>
            <span style={value}>{user.gender}</span>
          </div>
        )}
        {user.dateOfBirth && (
          <div style={row}>
            <span style={label}>Date of Birth</span>
            <span style={value}>{user.dateOfBirth}</span>
          </div>
        )}
        <div style={row}>
          <span style={label}>Roles</span>
          <span style={value}>{user.roles?.join(', ') || '—'}</span>
        </div>
        <div style={row}>
          <span style={label}>Enabled</span>
          <span style={{ ...value, color: user.enabled ? '#16a34a' : '#dc2626' }}>
            {user.enabled ? 'Yes' : 'No'}
          </span>
        </div>
        {user.createdAt && (
          <div style={row}>
            <span style={label}>Member since</span>
            <span style={value}>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}
