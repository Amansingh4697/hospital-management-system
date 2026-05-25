import { useEffect, useState } from 'react'
import Layout from '../layouts/Layout'
import { getPatients, addPatient, updatePatient, deletePatient } from '../services/index'
import { Button, Input, Select, Modal, Table, PageHeader, Card, Spinner, Alert, Badge } from '../components/UI'

const EMPTY = { name: '', age: '', gender: '', disease: '', phone: '', email: '', address: '' }

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    getPatients()
      .then(r => setPatients(r.data))
      .catch(() => setError('Failed to load patients'))
      .finally(() => setLoading(false))
  }

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setError(''); setModal(true) }
  const openEdit = (p) => {
    setForm({ name: p.name, age: p.age ?? '', gender: p.gender ?? '',
      disease: p.disease ?? '', phone: p.phone ?? '',
      email: p.email ?? '', address: p.address ?? '' })
    setEditId(p.id); setError(''); setModal(true)
  }
  const closeModal = () => { setModal(false); setError('') }
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required.'); return }
    setSaving(true); setError('')
    try {
      editId ? await updatePatient(editId, form) : await addPatient(form)
      closeModal(); load()
    } catch {
      setError('Failed to save. Please try again.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient record?')) return
    try { await deletePatient(id); load() }
    catch { alert('Failed to delete patient.') }
  }

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.disease || '').toLowerCase().includes(search.toLowerCase())
  )

  const genderColor = (g) => g === 'Male' ? 'blue' : g === 'Female' ? 'red' : 'gray'

  const columns = [
    { key: 'idx',     label: '#',       render: (row) => filtered.indexOf(row) + 1 },
    { key: 'name',    label: 'Name',    render: d => <strong>{d.name}</strong> },
    { key: 'age',     label: 'Age',     render: d => d.age ? `${d.age} yrs` : '—' },
    { key: 'gender',  label: 'Gender',  render: d => d.gender ? <Badge label={d.gender} color={genderColor(d.gender)} /> : '—' },
    { key: 'disease', label: 'Disease' },
    { key: 'phone',   label: 'Phone' },
    { key: 'email',   label: 'Email' },
    {
      key: 'actions', label: 'Actions',
      render: (d) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="ghost"  onClick={() => openEdit(d)}>✏️ Edit</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(d.id)}>🗑️ Delete</Button>
        </div>
      ),
    },
  ]

  return (
    <Layout>
      <PageHeader
        title="Patients"
        subtitle={`${patients.length} patient record${patients.length !== 1 ? 's' : ''}`}
        action={<Button onClick={openAdd}>➕ Add Patient</Button>}
      />

      <Card style={{ padding: 20, marginBottom: 16 }}>
        <input
          placeholder="🔍  Search by name or disease…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '9px 14px',
            border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none',
          }}
        />
      </Card>

      <Card>
        {loading ? <Spinner /> : <Table columns={columns} data={filtered} emptyMessage="No patients found." />}
      </Card>

      <Modal open={modal} onClose={closeModal} title={editId ? '✏️ Edit Patient' : '➕ Add Patient'} width={520}>
        {error && <div style={{ marginBottom: 14 }}><Alert message={error} /></div>}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Full Name *" name="name"    value={form.name}    onChange={handleChange} placeholder="Ankit Verma" />
            <Input label="Age"         name="age"     value={form.age}     onChange={handleChange} placeholder="28" type="number" />
            <Select label="Gender" name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
            <Input label="Disease / Condition" name="disease" value={form.disease} onChange={handleChange} placeholder="Hypertension" />
            <Input label="Phone"   name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" />
            <Input label="Email"   name="email" value={form.email} onChange={handleChange} placeholder="patient@email.com" />
          </div>
          <Input label="Address" name="address" value={form.address} onChange={handleChange} placeholder="123 Main Street, Nagpur" />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="gray" onClick={closeModal} type="button">Cancel</Button>
            <Button variant="success" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editId ? 'Update Patient' : 'Add Patient'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
