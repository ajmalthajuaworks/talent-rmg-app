import { useState } from 'react'

export default function SignupForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    employee_id: '',
    designation: '',
    department: '',
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700', color: '#94a3b8', marginBottom: '10px' }}>
        Credentials
      </div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Username *</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. jdoe"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Work Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="jdoe@company.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label>Password (min 6 chars) *</label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={formData.confirm_password}
            onChange={(e) => handleChange('confirm_password', e.target.value)}
            required
          />
        </div>
      </div>

      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700', color: '#94a3b8', margin: '12px 0 10px' }}>
        Employee Details
      </div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Last name"
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
          />
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label>Employee ID *</label>
          <input
            type="text"
            className="form-control"
            placeholder="EMP-0042"
            value={formData.employee_id}
            onChange={(e) => handleChange('employee_id', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Designation *</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Senior Software Engineer"
            value={formData.designation}
            onChange={(e) => handleChange('designation', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Department *</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. Platform & Cloud Engineering"
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }} disabled={loading}>
        {loading ? 'Creating Account...' : 'Complete Registration'}
      </button>
    </form>
  )
}
