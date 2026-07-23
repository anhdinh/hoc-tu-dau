import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'
import ConfirmPopup from '../../components/ConfirmPopup'
import { useToast } from '../../stores/toastStore'

type Subscription = {
  memberId: string
  userId: string
  username: string
  catalogId: string
  catalogName: string
  role: string
  expiresAt: string | null
  status: string
  createdAt: string
}

export default function SubscriptionsList() {
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteCatalogId, setDeleteCatalogId] = useState<string | null>(null)
  const toast = useToast()

  function load() {
    setLoading(true)
    api.get('/admin/subscriptions')
      .then(({ data }) => setSubs(data ?? []))
      .catch(() => toast.add('error', 'Failed to load subscriptions'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleDelete() {
    if (!deleteId || !deleteCatalogId) return
    try {
      await api.delete(`/catalogs/${deleteCatalogId}/members/${deleteId}`)
      toast.add('success', 'Member removed')
      setDeleteId(null)
      setDeleteCatalogId(null)
      load()
    } catch {
      toast.add('error', 'Failed to remove member')
      setDeleteId(null)
      setDeleteCatalogId(null)
    }
  }

  const th: React.CSSProperties = { padding: '10px 12px', fontWeight: 600, color: 'var(--text)', fontSize: 13 }
  const td: React.CSSProperties = { padding: '10px 12px', color: 'var(--text-secondary)' }
  const btn: React.CSSProperties = { padding: '6px 12px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, marginRight: 6 }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Subscriptions</h2>
        <Link to="/admin/subscriptions/add" style={{ padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, textDecoration: 'none', fontSize: 14 }}>+ Subscribe</Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
            <th style={th}>User</th><th style={th}>Catalog</th><th style={th}>Role</th><th style={th}>Status</th><th style={th}>Expires</th><th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} style={{ padding: '10px 12px' }}>
                      <div style={{ height: 14, background: 'var(--border)', borderRadius: 4, width: j === 0 ? '40%' : j === 5 ? 30 : '60%' }} />
                    </td>
                  ))}
                </tr>
              ))
            : subs.length === 0
              ? <tr><td colSpan={6} style={{ ...td, textAlign: 'center' }}>No subscriptions found</td></tr>
              : subs.map((s) => (
                  <tr key={s.memberId} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={td}>{s.username}</td>
                    <td style={td}>{s.catalogName}</td>
                    <td style={td}>{s.role}</td>
                    <td style={td}>
                      <span style={{ color: s.status === 'ACTIVE' ? '#16a34a' : '#dc2626', fontSize: 12 }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={td}>{s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : 'Never'}</td>
                    <td style={td}>
                      <button onClick={() => { setDeleteId(s.userId); setDeleteCatalogId(s.catalogId) }} style={{ ...btn, background: '#fee2e2', color: '#dc2626' }}>Remove</button>
                    </td>
                  </tr>
                ))}
        </tbody>
      </table>

      {deleteId && (
        <ConfirmPopup
          message="Remove this member from the catalog?"
          confirmLabel="Remove"
          onConfirm={handleDelete}
          onCancel={() => { setDeleteId(null); setDeleteCatalogId(null) }}
        />
      )}
    </div>
  )
}
