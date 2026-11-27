import { useState, useEffect } from 'react'

export default function ManualEntryForm({ profile, onSave }) {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', location: '', linkedin_url: '', summary: ''
  })

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.user?.first_name || '', last_name: profile.user?.last_name || '',
        email: profile.user?.email || '', phone: profile.phone || '',
        location: profile.location || '', linkedin_url: profile.linkedin_url || '', summary: profile.summary || ''
      })
    }
  }, [profile])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="card" style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div className="card-header" style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
        <div className="card-title" style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
          <span>📝</span> Personal & Contact Details
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: '16px' }}>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" className="form-control" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" className="form-control" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input type="text" className="form-control" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Professional Bio / Summary</label>
          <textarea rows={3} className="form-control" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ padding: '9px 20px', fontWeight: '700' }}>
          Save Personal Info
        </button>
      </form>
    </div>
  )
}
