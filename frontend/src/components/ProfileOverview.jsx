import { useState, useEffect } from 'react'
import ReadinessChecklist from './ReadinessChecklist'

export default function ProfileOverview({
  profile,
  onSaveProfile,
  projects,
  competencies,
  onNavigate
}) {
  const [formData, setFormData] = useState(profile)

  useEffect(() => {
    setFormData(profile)
  }, [profile])

  const approvedCount = competencies.filter((c) => c.validation_status === 'APPROVED').length
  const pendingCount = competencies.filter((c) => c.validation_status === 'PENDING').length

  let completenessScore = 0
  if (profile.designation && profile.department) completenessScore += 20
  if (projects.length >= 1) completenessScore += 30
  if (competencies.some((c) => (c.skill?.dimension || c.dimension) === 'TECHNICAL')) completenessScore += 20
  if (competencies.some((c) => (c.skill?.dimension || c.dimension) === 'DOMAIN')) completenessScore += 15
  if (competencies.some((c) => (c.skill?.dimension || c.dimension) === 'FUNCTIONAL')) completenessScore += 15

  const handleSubmit = (e) => {
    e.preventDefault()
    onSaveProfile(formData)
  }

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-label">Profile Completeness</div>
          <div className="stat-card-value" style={{ color: '#2563eb' }}>{completenessScore}%</div>
          <div className="progress-container">
            <div className="progress-bar-fill" style={{ width: `${completenessScore}%` }}></div>
          </div>
          <div className="stat-card-sub">
            {completenessScore === 100 ? 'All sections fully populated' : 'Additional sections need ratings'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label">Approved Competencies</div>
          <div className="stat-card-value" style={{ color: '#16a34a' }}>{approvedCount}</div>
          <div className="stat-card-sub">Out of {competencies.length} ratings submitted</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label">Pending Validation</div>
          <div className="stat-card-value" style={{ color: '#d97706' }}>{pendingCount}</div>
          <div className="stat-card-sub">Awaiting review</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label">Project Experiences</div>
          <div className="stat-card-value" style={{ color: '#0f172a' }}>{projects.length}</div>
          <div className="stat-card-sub">Available as competency evidence</div>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span>👤</span> Standard Employee Profile</div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.user?.first_name || ''}
                    onChange={(e) => setFormData({ ...formData, user: { ...formData.user, first_name: e.target.value } })}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.user?.last_name || ''}
                    onChange={(e) => setFormData({ ...formData, user: { ...formData.user, last_name: e.target.value } })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Work Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.user?.email || ''}
                  onChange={(e) => setFormData({ ...formData, user: { ...formData.user, email: e.target.value } })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.employee_id || ''}
                    disabled
                    style={{ background: '#f1f5f9' }}
                  />
                </div>
                <div className="form-group">
                  <label>Designation *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Department / Delivery Unit *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                Save Profile Details
              </button>
            </form>
          </div>
        </div>

        <ReadinessChecklist
          profile={profile}
          projects={projects}
          competencies={competencies}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  )
}
