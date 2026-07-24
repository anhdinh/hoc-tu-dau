import { useEffect, useState } from 'react'
import api from '@/services/api'
import Modal from '@/components/Modal'
import ConfirmPopup from '@/components/ConfirmPopup'
import { useToast } from '@/stores/toastStore'

type Catalog = {
  id: string
  name: string
  description: string
  thumbnail: string
  createdAt: string
}

const emptyForm = { name: '', description: '', thumbnail: '' }

function SkeletonRow() {
  const td: React.CSSProperties = { padding: '10px 12px' }
  const bar: React.CSSProperties = { height: 14, background: '#e5e4e7', borderRadius: 4, width: '60%' }
  return (
    <tr style={{ borderBottom: '1px solid #e5e4e7' }}>
      <td style={td}><div style={{ width: 48, height: 32, background: '#e5e4e7', borderRadius: 4 }} /></td>
      <td style={td}><div style={{ ...bar, width: '40%' }} /></td>
      <td style={td}><div style={{ ...bar, width: '50%' }} /></td>
      <td style={td}><div style={{ ...bar, width: '35%' }} /></td>
      <td style={td}><div style={{ width: 60, height: 14, background: '#e5e4e7', borderRadius: 4 }} /></td>
    </tr>
  )
}

export default function Catalogs() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const toast = useToast()

  function load() {
    setLoading(true)
    api.get('/catalogs')
      .then(({ data }) => setCatalogs(data))
      .catch(() => toast.add('error', 'Failed to load catalogs'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function openCreate() {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(c: Catalog) {
    setForm({ name: c.name, description: c.description || '', thumbnail: c.thumbnail || '' })
    setEditing(c.id)
    setShowForm(true)
  }

  async function handleSave() {
    try {
      if (editing) {
        await api.put(`/catalogs/${editing}`, form)
        toast.add('success', 'Catalog updated')
      } else {
        await api.post('/catalogs', form)
        toast.add('success', 'Catalog created')
      }
      setShowForm(false)
      load()
    } catch {
      toast.add('error', 'Failed to save catalog')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await api.delete(`/catalogs/${deleteId}`)
      toast.add('success', 'Catalog deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.add('error', 'Failed to delete catalog')
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
        <h2 style={{ margin: 0 }}>Catalog Management</h2>
        <button onClick={openCreate} style={{ padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>+ Add Catalog</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
            <th style={th}>Thumbnail</th><th style={th}>Name</th><th style={th}>Description</th><th style={th}>Created</th><th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : catalogs.length === 0
              ? <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#9ca3af' }}>No catalogs found</td></tr>
              : catalogs.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #e5e4e7' }}>
                    <td style={td}>
                      {c.thumbnail
                        ? <img src={c.thumbnail} alt="" style={{ width: 48, height: 32, borderRadius: 4, objectFit: 'cover' }} />
                        : <span style={{ color: '#9ca3af' }}>—</span>}
                    </td>
                    <td style={{ ...td, fontWeight: 500 }}>{c.name}</td>
                    <td style={{ ...td, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description || '—'}</td>
                    <td style={td}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={td}>
                      <button onClick={() => openEdit(c)} style={{ ...btn, background: '#e0e7ff', color: '#4f46e5' }}>Edit</button>
                      <button onClick={() => setDeleteId(c.id)} style={{ ...btn, background: '#fee2e2', color: '#dc2626' }}>Delete</button>
                    </td>
                  </tr>
                ))}
        </tbody>
      </table>

      <Modal open={showForm} title={editing ? 'Edit Catalog' : 'Create Catalog'} onClose={() => setShowForm(false)}>
        <label style={firstLabel}>Name *</label>
        <input style={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label style={label}>Description</label>
        <textarea style={{ ...input, minHeight: 60, resize: 'vertical' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label style={label}>Thumbnail URL</label>
        <input style={input} value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '8px 16px', border: 'none', borderRadius: 6, background: '#4f46e5', color: '#fff', cursor: 'pointer', fontSize: 14 }}>Save</button>
        </div>
      </Modal>

      {deleteId && (
        <ConfirmPopup
          message="Delete this catalog? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
