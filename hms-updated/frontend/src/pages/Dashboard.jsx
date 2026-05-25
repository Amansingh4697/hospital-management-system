import { useEffect, useState } from 'react'
import Layout from '../layouts/Layout'
import { getDashboardStats, getDoctors, getPatients, getAppointments } from '../services/index'
import { StatCard, Card, Spinner, Badge } from '../components/UI'

// Simple SVG bar chart — no extra dependency needed
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1)
  const W = 420, H = 180, barW = 50, gap = 30
  const totalW = data.length * (barW + gap) - gap
  const offsetX = (W - totalW) / 2

  return (
    <svg viewBox={`0 0 ${W} ${H + 40}`} style={{ width: '100%', maxWidth: W }}>
      {data.map((d, i) => {
        const barH = Math.max((d.value / max) * H, 4)
        const x = offsetX + i * (barW + gap)
        const y = H - barH
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={barH} rx={6} fill={d.color} opacity={0.85} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={d.color}>
              {d.value}
            </text>
            <text x={x + barW / 2} y={H + 18} textAnchor="middle" fontSize={12} fill="#64748b">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Dashboard() {
  const [stats, setStats]           = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([getDashboardStats(), getAppointments()])
      .then(([s, a]) => {
        setStats(s.data)
        setAppointments(a.data.slice(-5).reverse())
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Layout><Spinner /></Layout>

  const chartData = [
    { label: 'Doctors',     value: stats?.totalDoctors      ?? 0, color: '#2563eb' },
    { label: 'Patients',    value: stats?.totalPatients     ?? 0, color: '#16a34a' },
    { label: 'Scheduled',   value: stats?.scheduledAppointments ?? 0, color: '#d97706' },
    { label: 'Completed',   value: stats?.completedAppointments ?? 0, color: '#7c3aed' },
  ]

  return (
    <Layout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 2 }}>Overview of hospital activity</p>
      </div>

      {/* Stat Cards */}
      <div style={styles.grid4}>
        <StatCard icon="👨‍⚕️" label="Total Doctors"       value={stats?.totalDoctors ?? 0}      color="#2563eb" />
        <StatCard icon="🧑‍🤝‍🧑" label="Total Patients"      value={stats?.totalPatients ?? 0}     color="#16a34a" />
        <StatCard icon="📅" label="Total Appointments"   value={stats?.totalAppointments ?? 0}  color="#d97706" />
        <StatCard icon="✅" label="Completed"            value={stats?.completedAppointments ?? 0} color="#7c3aed" />
      </div>

      {/* Chart + Recent Appointments */}
      <div style={styles.grid2}>
        <Card style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>📊 Hospital Analytics</h3>
          <BarChart data={chartData} />
        </Card>

        <Card style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>🕒 Recent Appointments</h3>
          {appointments.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 14 }}>No appointments yet.</p>
          ) : appointments.map(a => (
            <div key={a.id} style={styles.apptRow}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{a.patient?.name ?? '—'}</p>
                <p style={{ fontSize: 12, color: '#64748b' }}>Dr. {a.doctor?.name ?? '—'} · {a.appointmentDate}</p>
              </div>
              <Badge
                label={a.status}
                color={a.status === 'COMPLETED' ? 'green' : a.status === 'CANCELLED' ? 'red' : 'yellow'}
              />
            </div>
          ))}
        </Card>
      </div>
    </Layout>
  )
}

const styles = {
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  apptRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderBottom: '1px solid #f1f5f9',
  },
}
