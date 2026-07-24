import { useEffect, useState } from 'react'
import api from '@/services/api'
import Modal from '@/components/Modal'
import ConfirmPopup from '@/components/ConfirmPopup'
import { useToast } from '@/stores/toastStore'

type User = {
  id: string
  username: string
  email: string
  enabled: boolean
  roles: string[]
  createdAt: string
}

const emptyForm = { username: '', email: '', password: '', enabled: true }

function SkeletonRow() {
  const td: React.CSSProperties = { padding: '10px 12px' }
  const bar: React.CSSProperties = { height: 14, background: '#e5e4e7', borderRadius: 4, width: '60%' }
  return (
    <tr style={{ borderBottom: '1px solid #e5e4e7' }}>
      <td style={td}><div style={{ ...bar, width: '40%' }} /></td>
      <td style={td}><div style={{ ...bar, width: '50%' }} /></td>
      <td style={td}><div style={{ width: 16, height: 16, background: '#e5e4e7', borderRadius: '50%' }} /></td>
      <td style={td}><div style={{ ...bar, width: '30%' }} /></td>
      <td style={td}><div style={{ ...bar, width: '35%' }} /></td>
      <td style={td}><div style={{ width: 60, height: 14, background: '#e5e4e7', borderRadius: 4 }} /></td>
    </tr>
  )
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const toast = useToast()

  function load() {
    setLoading(true)
    api.get('/admin/users')
      .then(({ data }) => setUsers(data.content ?? data))
      .catch(() => toast.add('error', 'Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function openCreate() {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(u: User) {
    setForm({ username: u.username, email: u.email, password: '', enabled: u.enabled })
    setEditing(u.id)
    setShowForm(true)
  }

  async function handleSave() {
    try {
      if (editing) {
        await api.put(`/admin/users/${editing}`, form)
        toast.add('success', 'User updated')
      } else {
        await api.post('/admin/users', form)
        toast.add('success', 'User created')
      }
      setShowForm(false)
      load()
    } catch {
      toast.add('error', 'Failed to save user')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await api.delete(`/admin/users/${deleteId}`)
      toast.add('success', 'User deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.add('error', 'Failed to delete user')
      setDeleteId(null)
    }
  }

  const th: React.CSSProperties = { padding: '10px 12px', fontWeight: 600, color: '#374151', fontSize: 13 }
  const td: React.CSSProperties = { padding: '10px 12px', color: '#6b6375' }
  const btn: React.CSSProperties = { padding: '6px 12px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, marginRight: 6 }
  const input: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }
  const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4, marginTop: 12 }
  const firstLabel: React.CSSProperties = { ...label, marginTop: 0 }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>User Management</h2>
        <button onClick={openCreate} style={{ padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>+ Add User</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
            <th style={th}>Username</th><th style={th}>Email</th><th style={th}>Enabled</th><th style={th}>Roles</th><th style={th}>Created</th><th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : users.length === 0
              ? <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: '#9ca3af' }}>No users found</td></tr>
              : users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e5e4e7' }}>
                    <td style={td}>{u.username}</td>
                    <td style={td}>{u.email}</td>
                    <td style={td}><span style={{ color: u.enabled ? '#16a34a' : '#dc2626' }}>{u.enabled ? '✓' : '✗'}</span></td>
                    <td style={td}>{u.roles?.join(', ')}</td>
                    <td style={td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={td}>
                      <button onClick={() => openEdit(u)} style={{ ...btn, background: '#e0e7ff', color: '#4f46e5' }}>Edit</button>
                      <button onClick={() => setDeleteId(u.id)} style={{ ...btn, background: '#fee2e2', color: '#dc2626' }}>Delete</button>
                    </td>
                  </tr>
                ))}
        </tbody>
      </table>

      <Modal open={showForm} title={editing ? 'Edit User' : 'Create User'} onClose={() => setShowForm(false)}>
        <label style={firstLabel}>Username</label>
        <input style={input} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <label style={label}>Email</label>
        <input style={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label style={label}>Password {editing && '(leave blank to keep)'}</label>
        <input style={input} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label style={label}>Enabled</label>
        <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '8px 16px', border: 'none', borderRadius: 6, background: '#4f46e5', color: '#fff', cursor: 'pointer', fontSize: 14 }}>Save</button>
        </div>
      </Modal>

      {deleteId && (
        <ConfirmPopup
          message="Delete this user? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
