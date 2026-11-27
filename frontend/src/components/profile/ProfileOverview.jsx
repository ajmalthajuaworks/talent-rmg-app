import { useState, useEffect } from 'react'
import ReadinessChecklist from './ReadinessChecklist'

export default function ProfileOverview({
  profile,
  onSaveProfile,
  projects,
  competencies,
  onNavigate,
  onCompleteReminder
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

  const hasReminder = profile?.needs_project_update || profile?.admin_feedback || profile?.reminder_status === 'ACTION_REQUIRED'
  const isCompleted = profile?.reminder_status === 'COMPLETED_BY_EMPLOYEE'

  return (
    <div>
      {(hasReminder || isCompleted) && (
        <div
          className="alert"
          style={{
            background: isCompleted ? '#f0fdf4' : profile.needs_project_update ? '#fffbeb' : '#f8fafc',
            border: `1.5px solid ${isCompleted ? '#bbf7d0' : profile.needs_project_update ? '#fde68a' : '#cbd5e1'}`,
            borderRadius: '10px', padding: '14px 18px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '22px' }}>{isCompleted ? '✅' : profile.needs_project_update ? '⚠️' : '💬'}</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#0f172a' }}>
                {isCompleted ? 'Update Completed — Awaiting Manager Review' : profile.needs_project_update ? 'Action Required: Project Portfolio Update Requested' : 'Manager / Admin Notice'}
              </div>
              {profile.admin_feedback && (
                <div style={{ fontSize: '13px', color: '#334155', fontStyle: 'italic', marginTop: '2px' }}>
                  "{profile.admin_feedback}"
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {profile.needs_project_update && onNavigate && (
              <button onClick={() => onNavigate('projects')} className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                Update Projects →
              </button>
            )}
            {!isCompleted && (profile.needs_project_update || profile.reminder_status === 'ACTION_REQUIRED') && onCompleteReminder && (
              <button onClick={onCompleteReminder} className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                ✓ Mark as Completed
              </button>
            )}
            {isCompleted && (
              <span className="badge" style={{ background: '#dcfce7', color: '#15803d', padding: '6px 10px', fontSize: '11px', fontWeight: '700' }}>
                ✓ Completed
              </span>
            )}
          </div>
        </div>
      )}

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-label">Profile Completeness</div>
          <div className="stat-card-value" style={{ color: '#2563eb' }}>{completenessScore}%</div>
          <div className="progress-container">
            <div className="progress-bar-fill" style={{ width: `${completenessScore}%` }}></div>
          </div>
          <div className="stat-card-desc" style={{ marginTop: '6px' }}>{completenessScore === 100 ? 'Profile fully benchmarked' : 'Complete all fields & skills'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Projects Logged</div>
          <div className="stat-card-value">{projects.length}</div>
          <div className="stat-card-desc">Commercial delivery engagements</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Verified Competencies</div>
          <div className="stat-card-value" style={{ color: '#16a34a' }}>{approvedCount}</div>
          <div className="stat-card-desc">{pendingCount} pending manager review</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">RM Bench Readiness</div>
          <div className="stat-card-value" style={{ color: '#7c3aed' }}>{completenessScore >= 80 ? 'Ready' : 'In Progress'}</div>
          <div className="stat-card-desc">Client proposal match rate</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Professional Identity & Contact</div>
              <div className="card-subtitle">Information visible to resource managers & staffing coordinators</div>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="form-control" value={formData.user?.first_name || ''} onChange={(e) => setFormData({ ...formData, user: { ...formData.user, first_name: e.target.value } })} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="form-control" value={formData.user?.last_name || ''} onChange={(e) => setFormData({ ...formData, user: { ...formData.user, last_name: e.target.value } })} />
                </div>
              </div>
              <div className="form-group">
                <label>Work Email</label>
                <input type="email" className="form-control" value={formData.user?.email || ''} onChange={(e) => setFormData({ ...formData, user: { ...formData.user, email: e.target.value } })} />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Employee ID</label>
                  <input type="text" className="form-control" value={formData.employee_id || ''} disabled style={{ background: '#f1f5f9' }} />
                </div>
                <div className="form-group">
                  <label>Designation *</label>
                  <input type="text" className="form-control" value={formData.designation || ''} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Department / Delivery Unit *</label>
                <input type="text" className="form-control" value={formData.department || ''} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">Save Profile Details</button>
            </form>
          </div>
        </div>
        <ReadinessChecklist profile={profile} projects={projects} competencies={competencies} onNavigate={onNavigate} />
      </div>
    </div>
  )
}
