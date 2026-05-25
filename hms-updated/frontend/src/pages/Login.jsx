import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login, register } from '../services/index'
import { Button, Input, Alert } from '../components/UI'

export default function Login() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  const [mode, setMode]       = useState('login')   // 'login' | 'register'
  const [form, setForm]       = useState({ username: '', password: '', role: 'ADMIN' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)

    try {
      if (mode === 'login') {
        const res = await login({ username: form.username, password: form.password })
        signIn(res.data)
        navigate('/dashboard')
      } else {
        await register(form)
        setSuccess('Account created! You can now log in.')
        setMode('login')
        setForm({ ...form, password: '' })
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏥</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
            Hospital Management
          </h1>
          <p style={{ color: '#93c5fd', fontSize: 16, lineHeight: 1.6 }}>
            Manage doctors, patients and appointments from a single dashboard.
          </p>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['👨‍⚕️  Full Doctor Management', '🧑‍🤝‍🧑  Patient Records', '📅  Appointment Booking', '📊  Live Dashboard Stats'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#bfdbfe', fontSize: 15 }}>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: '#1e293b' }}>
            {mode === 'login' ? 'Welcome back 👋' : 'Create Account'}
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
            {mode === 'login' ? 'Sign in to your HMS account' : 'Register a new admin account'}
          </p>

          {error   && <div style={{ marginBottom: 14 }}><Alert type="error"   message={error} /></div>}
          {success && <div style={{ marginBottom: 14 }}><Alert type="success" message={success} /></div>}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Username"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handle}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handle}
              required
            />
            {mode === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handle}
                  style={{ padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="PATIENT">Patient</option>
                </select>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? 'Please wait…' : mode === 'login' ? '🔐 Sign In' : '🚀 Create Account'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess('') }}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
            >
              {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex', minHeight: '100vh',
  },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 48,
  },
  leftInner: { maxWidth: 400 },
  right: {
    width: 460,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 32, background: '#f8fafc',
  },
  card: {
    background: '#fff', borderRadius: 16, padding: 36,
    boxShadow: '0 4px 24px rgba(0,0,0,.09)', width: '100%',
  },
}
