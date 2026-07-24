import { useTheme } from '@/stores/themeStore'

export default function Settings() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  const card: React.CSSProperties = {
    background: 'var(--card-bg)', borderRadius: 12, border: '1px solid var(--border)',
    padding: 28, maxWidth: 480,
  }
  const row: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0',
  }
  const trackStyle: React.CSSProperties = {
    width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
    position: 'relative', transition: 'background 0.2s',
    background: isDark ? '#4f46e5' : '#d1d5db',
  }
  const thumbStyle: React.CSSProperties = {
    width: 20, height: 20, borderRadius: '50%', background: '#fff',
    position: 'absolute', top: 2, transition: 'left 0.2s',
    left: isDark ? 22 : 2,
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Settings</h2>
      <div style={card}>
        <h3 style={{ margin: '0 0 4px', fontSize: 16, color: 'var(--text)' }}>Appearance</h3>
        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)' }}>
          Toggle between light and dark mode
        </p>

        <div style={row}>
          <span style={{ fontSize: 14, color: 'var(--text)' }}>
            {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </span>
          <button style={trackStyle} onClick={toggle}>
            <div style={thumbStyle} />
          </button>
        </div>
      </div>
    </div>
  )
}
