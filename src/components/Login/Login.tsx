import { useState } from 'react'
import api from '../../api'
import type { ToastType } from '../Toast'
import Toast from '../Toast'
import styles from './Login.module.css'
import { useNavigate } from 'react-router-dom'
export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const { data } = await api.post('/login', { username, password })
      setToast({ type: 'success', message: 'Login successful' })
      localStorage.setItem('token', data.token)
      navigate('/');
    } catch (err) {
      setUsername('')
      setPassword('')
      setToast({ type: 'error', message: 'Invalid username or password' })
    }
  }

  return (
    <div className={styles.container} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80)' }}>
      <div className={styles.overlay} />
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className={styles.button} type="submit">Login</button>
        </form>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  )
}