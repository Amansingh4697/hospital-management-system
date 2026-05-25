import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard',    label: 'Dashboard',    icon: '📊' },
  { to: '/doctors',      label: 'Doctors',      icon: '👨‍⚕️' },
  { to: '/patients',     label: 'Patients',     icon: '🧑‍🤝‍🧑' },
  { to: '/appointments', label: 'Appointments', icon: '📅' },
]

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { signOut(); navigate('/') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🏥 HMS</div>
        <nav style={{ flex: 1 }}>
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              ...styles.navLink,
              background: isActive ? 'rgba(255,255,255,.15)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
            })}>
              <span style={{ marginRight: 10 }}>{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
        <div style={styles.sidebarBottom}>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>
            Logged in as<br />
            <strong style={{ color: '#e2e8f0' }}>{user?.username}</strong>
            <span style={styles.badge}>{user?.role}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={styles.main}>
        {children}
      </main>
    </div>
  )
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-w)',
    background: '#1e293b',
    color: '#e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 0 20px',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    padding: '24px 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,.08)',
    marginBottom: 12,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '11px 20px',
    borderRadius: 8,
    margin: '2px 8px',
    color: '#cbd5e1',
    fontSize: 15,
    transition: 'background .15s',
  },
  sidebarBottom: {
    padding: '12px 20px 0',
    borderTop: '1px solid rgba(255,255,255,.08)',
  },
  badge: {
    marginLeft: 6,
    background: '#2563eb',
    color: '#fff',
    fontSize: 10,
    padding: '2px 6px',
    borderRadius: 99,
    fontWeight: 600,
  },
  logoutBtn: {
    marginTop: 8,
    width: '100%',
    padding: '8px 0',
    background: 'rgba(220,38,38,.2)',
    color: '#fca5a5',
    border: '1px solid rgba(220,38,38,.3)',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 600,
  },
  main: {
    marginLeft: 'var(--sidebar-w)',
    flex: 1,
    padding: 28,
    background: 'var(--bg)',
    minHeight: '100vh',
  },
}
