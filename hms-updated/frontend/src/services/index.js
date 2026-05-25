import api from './api'

// ── Auth ──────────────────────────────────────────────────────
export const login    = (data) => api.post('/api/auth/login', data)
export const register = (data) => api.post('/api/auth/register', data)

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('username')
}

export const getRole     = () => localStorage.getItem('role')
export const getUsername = () => localStorage.getItem('username')
export const isLoggedIn  = () => !!localStorage.getItem('token')

// ── Doctors ───────────────────────────────────────────────────
export const getDoctors   = ()        => api.get('/api/doctors')
export const addDoctor    = (d)       => api.post('/api/doctors', d)
export const updateDoctor = (id, d)   => api.put(`/api/doctors/${id}`, d)
export const deleteDoctor = (id)      => api.delete(`/api/doctors/${id}`)

// ── Patients ──────────────────────────────────────────────────
export const getPatients   = ()        => api.get('/api/patients')
export const addPatient    = (p)       => api.post('/api/patients', p)
export const updatePatient = (id, p)   => api.put(`/api/patients/${id}`, p)
export const deletePatient = (id)      => api.delete(`/api/patients/${id}`)

// ── Appointments ──────────────────────────────────────────────
export const getAppointments   = ()       => api.get('/api/appointments')
export const addAppointment    = (a)      => api.post('/api/appointments', a)
export const updateAppStatus   = (id, s)  => api.put(`/api/appointments/${id}/status`, { status: s })
export const deleteAppointment = (id)     => api.delete(`/api/appointments/${id}`)

// ── Dashboard ─────────────────────────────────────────────────
export const getDashboardStats = () => api.get('/api/dashboard/stats')
