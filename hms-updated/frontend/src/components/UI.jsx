/* ─────────────────────────────────────────────────────────────────
   Shared UI Components
   Import individually:  import { Button, Modal } from '../components/UI'
───────────────────────────────────────────────────────────────── */

// ── Button ──────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', disabled, onClick, type = 'button', style = {} }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: 'none', borderRadius: 8, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'opacity .15s, background .15s',
    ...size === 'sm' ? { padding: '6px 12px', fontSize: 13 }
      : size === 'lg' ? { padding: '12px 24px', fontSize: 16 }
      : { padding: '9px 18px', fontSize: 14 },
    ...variant === 'primary'  ? { background: '#2563eb', color: '#fff' }
      : variant === 'success' ? { background: '#16a34a', color: '#fff' }
      : variant === 'danger'  ? { background: '#dc2626', color: '#fff' }
      : variant === 'warning' ? { background: '#d97706', color: '#fff' }
      : variant === 'ghost'   ? { background: 'transparent', color: '#2563eb', border: '1.5px solid #2563eb' }
      : { background: '#e2e8f0', color: '#1e293b' },
    ...style,
  }
  return <button type={type} style={base} disabled={disabled} onClick={onClick}>{children}</button>
}

// ── Input ────────────────────────────────────────────────────────
export function Input({ label, error, style = {}, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>}
      <input
        style={{
          padding: '9px 12px', border: `1.5px solid ${error ? '#dc2626' : '#d1d5db'}`,
          borderRadius: 8, fontSize: 14, outline: 'none',
          background: '#fff', color: '#1e293b',
          transition: 'border-color .15s',
        }}
        {...props}
      />
      {error && <span style={{ fontSize: 12, color: '#dc2626' }}>{error}</span>}
    </div>
  )
}

// ── Select ───────────────────────────────────────────────────────
export function Select({ label, children, error, style = {}, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>}
      <select
        style={{
          padding: '9px 12px', border: `1.5px solid ${error ? '#dc2626' : '#d1d5db'}`,
          borderRadius: 8, fontSize: 14, background: '#fff', color: '#1e293b', outline: 'none',
        }}
        {...props}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: 12, color: '#dc2626' }}>{error}</span>}
    </div>
  )
}

// ── Modal ────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 480 }) {
  if (!open) return null
  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={{ ...modalStyles.box, width }} onClick={e => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={modalStyles.closeBtn}>✕</button>
        </div>
        <div style={{ padding: '20px 24px 24px' }}>{children}</div>
      </div>
    </div>
  )
}

const modalStyles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  box: {
    background: '#fff', borderRadius: 14,
    boxShadow: '0 8px 40px rgba(0,0,0,.18)', overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 24px', borderBottom: '1px solid #e5e7eb',
  },
  closeBtn: {
    background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#6b7280',
  },
}

// ── Badge ────────────────────────────────────────────────────────
export function Badge({ label, color = 'blue' }) {
  const colors = {
    blue:   { bg: '#dbeafe', text: '#1d4ed8' },
    green:  { bg: '#dcfce7', text: '#15803d' },
    red:    { bg: '#fee2e2', text: '#b91c1c' },
    yellow: { bg: '#fef9c3', text: '#a16207' },
    gray:   { bg: '#f1f5f9', text: '#475569' },
  }
  const c = colors[color] || colors.blue
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: '3px 10px', borderRadius: 99,
      fontSize: 12, fontWeight: 600,
    }}>
      {label}
    </span>
  )
}

// ── Spinner ──────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{
        width: 36, height: 36, border: '3px solid #e2e8f0',
        borderTopColor: '#2563eb', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Alert ────────────────────────────────────────────────────────
export function Alert({ type = 'error', message }) {
  if (!message) return null
  const map = {
    error:   { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b', icon: '⚠️' },
    success: { bg: '#dcfce7', border: '#86efac', text: '#166534', icon: '✅' },
    info:    { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af', icon: 'ℹ️' },
  }
  const s = map[type]
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, color: s.text,
      padding: '10px 14px', borderRadius: 8, fontSize: 14,
      display: 'flex', gap: 8, alignItems: 'center',
    }}>
      <span>{s.icon}</span> {message}
    </div>
  )
}

// ── StatCard ─────────────────────────────────────────────────────
export function StatCard({ icon, label, value, color = '#2563eb' }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '20px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,.07)',
      borderLeft: `4px solid ${color}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 28, fontWeight: 700, color }}>{value}</p>
      </div>
      <span style={{ fontSize: 36 }}>{icon}</span>
    </div>
  )
}

// ── PageHeader ───────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ── Table ────────────────────────────────────────────────────────
export function Table({ columns, data, emptyMessage = 'No records found.' }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            {columns.map((col) => (
              <th key={col.key} style={{
                padding: '11px 14px', textAlign: 'left',
                fontWeight: 600, color: '#374151', whiteSpace: 'nowrap',
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : data.map((row, i) => (
            <tr key={row.id ?? i} style={{
              borderBottom: '1px solid #f1f5f9',
              background: i % 2 === 0 ? '#fff' : '#fafafa',
              transition: 'background .1s',
            }}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '11px 14px', color: '#374151' }}>
                  {col.render ? col.render(row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Card ─────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,.07)',
      overflow: 'hidden', ...style,
    }}>
      {children}
    </div>
  )
}
