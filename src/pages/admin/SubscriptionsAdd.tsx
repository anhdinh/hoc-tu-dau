import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import { useToast } from '../../stores/toastStore'

type Catalog = { id: string; name: string }
type User = { id: string; username: string }

export default function SubscriptionsAdd() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState({ userId: '', role: 'MEMBER', expiresAt: '', catalogIds: [] as string[] })
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/catalogs').then(({ data }) => setCatalogs(data ?? [])),
      api.get('/admin/users').then(({ data }) => setUsers((data.content ?? data)?.map((u: any) => ({ id: u.id, username: u.username })) || [])),
    ]).catch(() => toast.add('error', 'Failed to load data'))
  }, [])

  function toggleCatalog(catalogId: string) {
    setForm((prev) => ({
      ...prev,
      catalogIds: prev.catalogIds.includes(catalogId)
        ? prev.catalogIds.filter((id) => id !== catalogId)
        : [...prev.catalogIds, catalogId],
    }))
  }

  async function handleSubmit() {
    if (!form.userId || form.catalogIds.length === 0) {
      toast.add('warning', 'Select a user and at least one catalog')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/admin/subscriptions/batch', {
        userId: form.userId,
        catalogIds: form.catalogIds,
        role: form.role,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      })
      toast.add('success', 'Subscriptions created')
      navigate('/admin/subscriptions', { replace: true })
    } catch {
      toast.add('error', 'Failed to create subscriptions')
    } finally {
      setSubmitting(false)
    }
  }

  const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 4, marginTop: 12 }
  const select: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, background: 'var(--card-bg)', color: 'var(--text)', boxSizing: 'border-box' }
  const card: React.CSSProperties = { background: 'var(--card-bg)', borderRadius: 12, border: '1px solid var(--border)', padding: 24, maxWidth: 600 }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('/admin/subscriptions')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text)' }}>←</button>
        <h2 style={{ margin: 0 }}>New Subscription</h2>
      </div>

      <div style={card}>
        <label style={label}>User</label>
        <select style={select} value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })}>
          <option value="">Select user</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.username}</option>)}
        </select>

        <label style={label}>Catalogs</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
          {catalogs.map((c) => (
            <label key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer',
              padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)',
              background: form.catalogIds.includes(c.id) ? '#e0e7ff' : 'var(--card-bg)',
              color: 'var(--text)',
            }}>
              <input type="checkbox" checked={form.catalogIds.includes(c.id)} onChange={() => toggleCatalog(c.id)} style={{ accentColor: '#4f46e5' }} />
              {c.name}
            </label>
          ))}
          {catalogs.length === 0 && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No catalogs</span>}
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={label}>Role</label>
            <select style={select} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="MEMBER">MEMBER</option>
              <option value="INSTRUCTOR">INSTRUCTOR</option>
            </select>
          </div>
          <div style={{ flex: 2 }}>
            <label style={label}>Expires At (optional)</label>
            <input type="datetime-local" style={select} value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={() => navigate('/admin/subscriptions')} style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--card-bg)', color: 'var(--text)', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} style={{
            padding: '8px 24px', border: 'none', borderRadius: 6,
            background: submitting ? '#9ca3af' : '#4f46e5', color: '#fff',
            cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 14,
          }}>
            {submitting ? 'Saving...' : 'Subscribe'}
          </button>
        </div>
      </div>
    </div>
  )
}
