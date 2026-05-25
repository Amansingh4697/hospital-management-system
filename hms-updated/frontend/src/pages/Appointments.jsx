import { useEffect, useState } from 'react'
import Layout from '../layouts/Layout'
import {
  getAppointments, addAppointment, updateAppStatus, deleteAppointment,
  getDoctors, getPatients
} from '../services/index'
import { Button, Select, Modal, Table, PageHeader, Card, Spinner, Alert, Badge } from '../components/UI'

const EMPTY = { doctorId: '', patientId: '', appointmentDate: '', appointmentTime: '', notes: '' }

const STATUS_COLOR = { SCHEDULED: 'yellow', COMPLETED: 'green', CANCELLED: 'red' }

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors]           = useState([])
  const [patients, setPatients]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [modal, setModal]               = useState(false)
  const [form, setForm]                 = useState(EMPTY)
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')
  const [filter, setFilter]             = useState('ALL')

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [a, d, p] = await Promise.all([getAppointments(), getDoctors(), getPatients()])
      setAppointments(a.data)
      setDoctors(d.data)
      setPatients(p.data)
    } catch { setError('Failed to load data') }
    finally { setLoading(false) }
  }

  const openModal  = () => { setForm(EMPTY); setError(''); setModal(true) }
  const closeModal = () => { setModal(false); setError('') }
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleBook = async (e) => {
    e.preventDefault()
    if (!form.doctorId || !form.patientId || !form.appointmentDate || !form.appointmentTime) {
      setError('Please fill all required fields.'); return
    }
    setSaving(true); setError('')
    try {
      await addAppointment({
        doctorId: Number(form.doctorId),
        patientId: Number(form.patientId),
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        notes: form.notes,
      })
      closeModal(); loadAll()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book appointment.')
    } finally { setSaving(false) }
  }

  const handleStatus = async (id, status) => {
    try { await updateAppStatus(id, status); loadAll() }
    catch { alert('Failed to update status.') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel and delete this appointment?')) return
    try { await deleteAppointment(id); loadAll() }
    catch { alert('Failed to delete.') }
  }

  const filtered = appointments.filter(a =>
    filter === 'ALL' ? true : a.status === filter
  )

  const columns = [
    { key: 'idx',     label: '#', render: (row) => filtered.indexOf(row) + 1 },
    { key: 'patient', label: 'Patient', render: a => <strong>{a.patient?.name ?? '—'}</strong> },
    { key: 'doctor',  label: 'Doctor',  render: a => `Dr. ${a.doctor?.name ?? '—'}` },
    { key: 'spec',    label: 'Specialization', render: a => a.doctor?.specialization ?? '—' },
    { key: 'date',    label: 'Date',    render: a => a.appointmentDate },
    { key: 'time',    label: 'Time',    render: a => a.appointmentTime },
    { key: 'notes',   label: 'Notes',   render: a => a.notes || '—' },
    {
      key: 'status', label: 'Status',
      render: a => <Badge label={a.status} color={STATUS_COLOR[a.status] ?? 'gray'} />,
    },
    {
      key: 'actions', label: 'Actions',
      render: (a) => (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {a.status === 'SCHEDULED' && (
            <Button size="sm" variant="success" onClick={() => handleStatus(a.id, 'COMPLETED')}>
              ✅ Done
            </Button>
          )}
          {a.status !== 'CANCELLED' && (
            <Button size="sm" variant="warning" onClick={() => handleStatus(a.id, 'CANCELLED')}>
              ❌ Cancel
            </Button>
          )}
          <Button size="sm" variant="danger" onClick={() => handleDelete(a.id)}>🗑️</Button>
        </div>
      ),
    },
  ]

  const counts = {
    ALL: appointments.length,
    SCHEDULED: appointments.filter(a => a.status === 'SCHEDULED').length,
    COMPLETED: appointments.filter(a => a.status === 'COMPLETED').length,
    CANCELLED: appointments.filter(a => a.status === 'CANCELLED').length,
  }

  return (
    <Layout>
      <PageHeader
        title="Appointments"
        subtitle={`${appointments.length} total appointment${appointments.length !== 1 ? 's' : ''}`}
        action={<Button onClick={openModal}>📅 Book Appointment</Button>}
      />

      {error && <div style={{ marginBottom: 14 }}><Alert message={error} /></div>}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '7px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600,
            border: 'none', cursor: 'pointer',
            background: filter === s ? '#2563eb' : '#e2e8f0',
            color: filter === s ? '#fff' : '#475569',
          }}>
            {s} <span style={{ opacity: .7 }}>({counts[s]})</span>
          </button>
        ))}
      </div>

      <Card>
        {loading ? <Spinner /> : <Table columns={columns} data={filtered} emptyMessage="No appointments found." />}
      </Card>

      {/* Book Modal */}
      <Modal open={modal} onClose={closeModal} title="📅 Book New Appointment" width={500}>
        {error && <div style={{ marginBottom: 14 }}><Alert message={error} /></div>}
        <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select label="Doctor *" name="doctorId" value={form.doctorId} onChange={handleChange}>
            <option value="">Select Doctor</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
            ))}
          </Select>
          <Select label="Patient *" name="patientId" value={form.patientId} onChange={handleChange}>
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Date *</label>
              <input type="date" name="appointmentDate" value={form.appointmentDate}
                onChange={handleChange} required
                style={{ padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Time *</label>
              <input type="time" name="appointmentTime" value={form.appointmentTime}
                onChange={handleChange} required
                style={{ padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              rows={3} placeholder="Optional notes…"
              style={{ padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="gray" onClick={closeModal} type="button">Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Booking…' : '📅 Book Appointment'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
