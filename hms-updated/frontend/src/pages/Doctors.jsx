import { useEffect, useState } from 'react'
import Layout from '../layouts/Layout'
import { getDoctors, addDoctor, updateDoctor, deleteDoctor } from '../services/index'
import { Button, Input, Modal, Table, PageHeader, Card, Spinner, Alert } from '../components/UI'

const EMPTY = { name: '', specialization: '', department: '', phone: '', email: '' }

export default function Doctors() {
  const [doctors, setDoctors]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')

  useEffect(() => { fetch() }, [])

  const fetch = () => {
    setLoading(true)
    getDoctors()
      .then(r => setDoctors(r.data))
      .catch(() => setError('Failed to load doctors'))
      .finally(() => setLoading(false))
  }

  const openAdd = () => { setForm(EMPTY); setEditId(null); setError(''); setModal(true) }
  const openEdit = (d) => {
    setForm({ name: d.name, specialization: d.specialization,
      department: d.department || '', phone: d.phone || '', email: d.email || '' })
    setEditId(d.id); setError(''); setModal(true)
  }
  const closeModal = () => { setModal(false); setError('') }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.specialization.trim()) {
      setError('Name and Specialization are required.'); return
    }
    setSaving(true); setError('')
    try {
      editId ? await updateDoctor(editId, form) : await addDoctor(form)
      closeModal(); fetch()
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor? All their appointments will also be removed.')) return
    try {
      await deleteDoctor(id); fetch()
    } catch {
      alert('Failed to delete doctor.')
    }
  }

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'sno',            label: '#',              render: (_, i) => i + 1 },
    { key: 'name',           label: 'Name',           render: d => <strong>{d.name}</strong> },
    { key: 'specialization', label: 'Specialization' },
    { key: 'department',     label: 'Department' },
    { key: 'phone',          label: 'Phone' },
    { key: 'email',          label: 'Email' },
    {
      key: 'actions', label: 'Actions',
      render: (d) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="ghost"   onClick={() => openEdit(d)}>✏️ Edit</Button>
          <Button size="sm" variant="danger"  onClick={() => handleDelete(d.id)}>🗑️ Delete</Button>
        </div>
      ),
    },
  ]

  // patch: pass index to render
  const colsWithIndex = columns.map(col =>
    col.key === 'sno'
      ? { ...col, render: (row) => filtered.indexOf(row) + 1 }
      : col
  )

  return (
    <Layout>
      <PageHeader
        title="Doctors"
        subtitle={`${doctors.length} doctor${doctors.length !== 1 ? 's' : ''} registered`}
        action={<Button onClick={openAdd}>➕ Add Doctor</Button>}
      />

      <Card style={{ padding: 20, marginBottom: 16 }}>
        <input
          placeholder="🔍  Search by name or specialization…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '9px 14px',
            border: '1.5px solid #e2e8f0', borderRadius: 8,
            fontSize: 14, outline: 'none',
          }}
        />
      </Card>

      <Card>
        {loading ? <Spinner /> : <Table columns={colsWithIndex} data={filtered} emptyMessage="No doctors found." />}
      </Card>

      {/* Add / Edit Modal */}
      <Modal open={modal} onClose={closeModal} title={editId ? '✏️ Edit Doctor' : '➕ Add Doctor'}>
        {error && <div style={{ marginBottom: 14 }}><Alert message={error} /></div>}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Full Name *"       name="name"           value={form.name}           onChange={handleChange} placeholder="Dr. Raj Sharma" />
            <Input label="Specialization *"  name="specialization" value={form.specialization} onChange={handleChange} placeholder="Cardiology" />
            <Input label="Department"        name="department"     value={form.department}     onChange={handleChange} placeholder="Cardiac Unit" />
            <Input label="Phone"             name="phone"          value={form.phone}          onChange={handleChange} placeholder="+91 9876543210" />
          </div>
          <Input label="Email" name="email" value={form.email} onChange={handleChange} placeholder="doctor@hospital.com" />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="gray" onClick={closeModal} type="button">Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editId ? 'Update Doctor' : 'Add Doctor'}</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
