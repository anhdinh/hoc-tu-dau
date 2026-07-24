import { useEffect, useState } from 'react'
import api from '@/services/api'
import Modal from '@/components/Modal'
import ConfirmPopup from '@/components/ConfirmPopup'
import { useToast } from '@/stores/toastStore'

type Video = {
  id: string
  title: string
  url: string
  free: boolean
  sortOrder: number
  description?: string
  catalogId?: string
  catalog?: { id: string; name: string }
  createdAt: string
}

type Catalog = { id: string; name: string }

const emptyForm = { title: '', url: '', description: '', free: false, sortOrder: 0, catalogId: '' }

function SkeletonRow() {
  const td: React.CSSProperties = { padding: '10px 12px' }
  const bar: React.CSSProperties = { height: 14, background: '#e5e4e7', borderRadius: 4, width: '60%' }
  return (
    <tr style={{ borderBottom: '1px solid #e5e4e7' }}>
      <td style={td}><div style={{ ...bar, width: '50%' }} /></td>
      <td style={td}><div style={{ ...bar, width: '40%' }} /></td>
      <td style={td}><div style={{ ...bar, width: '30%' }} /></td>
      <td style={td}><div style={{ width: 16, height: 16, background: '#e5e4e7', borderRadius: '50%' }} /></td>
      <td style={td}><div style={{ width: 24, height: 14, background: '#e5e4e7', borderRadius: 4 }} /></td>
      <td style={td}><div style={{ ...bar, width: '35%' }} /></td>
      <td style={td}><div style={{ width: 60, height: 14, background: '#e5e4e7', borderRadius: 4 }} /></td>
    </tr>
  )
}

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const toast = useToast()

  function load() {
    setLoading(true)
    Promise.all([
      api.get('/videos').then(({ data }) => setVideos(data.content ?? data)),
      api.get('/catalogs').then(({ data }) => setCatalogs(data)),
    ]).catch(() => toast.add('error', 'Failed to load videos'))
     .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function openCreate() {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(v: Video) {
    setForm({
      title: v.title,
      url: v.url,
      description: v.description || '',
      free: v.free,
      sortOrder: v.sortOrder ?? 0,
      catalogId: v.catalog?.id || '',
    })
    setEditing(v.id)
    setShowForm(true)
  }

  async function handleSave() {
    const payload = { ...form, sortOrder: Number(form.sortOrder) }
    try {
      if (editing) {
        await api.put(`/videos/${editing}`, payload)
        toast.add('success', 'Video updated')
      } else {
        await api.post('/videos', payload)
        toast.add('success', 'Video created')
      }
      setShowForm(false)
      load()
    } catch {
      toast.add('error', 'Failed to save video')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await api.delete(`/videos/${deleteId}`)
      toast.add('success', 'Video deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.add('error', 'Failed to delete video')
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
        <h2 style={{ margin: 0 }}>Video Management</h2>
        <button onClick={openCreate} style={{ padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>+ Add Video</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
            <th style={th}>Title</th><th style={th}>URL</th><th style={th}>Catalog</th><th style={th}>Free</th><th style={th}>Order</th><th style={th}>Created</th><th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : videos.length === 0
              ? <tr><td colSpan={7} style={{ ...td, textAlign: 'center', color: '#9ca3af' }}>No videos found</td></tr>
              : videos.map((v) => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #e5e4e7' }}>
                    <td style={td}>{v.title}</td>
                    <td style={{ ...td, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.url}</td>
                    <td style={td}>{v.catalog?.name || '—'}</td>
                    <td style={td}><span style={{ color: v.free ? '#16a34a' : '#6b6375' }}>{v.free ? '✓' : '—'}</span></td>
                    <td style={td}>{v.sortOrder ?? 0}</td>
                    <td style={td}>{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td style={td}>
                      <button onClick={() => openEdit(v)} style={{ ...btn, background: '#e0e7ff', color: '#4f46e5' }}>Edit</button>
                      <button onClick={() => setDeleteId(v.id)} style={{ ...btn, background: '#fee2e2', color: '#dc2626' }}>Delete</button>
                    </td>
                  </tr>
                ))}
        </tbody>
      </table>

      <Modal open={showForm} title={editing ? 'Edit Video' : 'Create Video'} onClose={() => setShowForm(false)}>
        <label style={firstLabel}>Title *</label>
        <input style={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <label style={label}>URL *</label>
        <input style={input} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <label style={label}>Description</label>
        <textarea style={{ ...input, minHeight: 60, resize: 'vertical' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label style={label}>Catalog</label>
        <select style={input} value={form.catalogId} onChange={(e) => setForm({ ...form, catalogId: e.target.value })}>
          <option value="">— None —</option>
          {catalogs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={form.free} onChange={(e) => setForm({ ...form, free: e.target.checked })} /> Free
          </label>
          <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            Sort Order
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: +e.target.value })} style={{ width: 60, padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} />
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '8px 16px', border: 'none', borderRadius: 6, background: '#4f46e5', color: '#fff', cursor: 'pointer', fontSize: 14 }}>Save</button>
        </div>
      </Modal>

      {deleteId && (
        <ConfirmPopup
          message="Delete this video? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
