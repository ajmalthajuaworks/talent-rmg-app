export default function ProjectCard({ project, onEdit, onMapSkills, onDelete, isLast }) {
  const isCurrent = project.is_current || !project.end_date || project.end_date.toLowerCase() === 'present'

  const formatDates = () => {
    if (project.date_display) return project.date_display
    if (!project.start_date) return ''
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const s = new Date(project.start_date)
    const e = isCurrent ? new Date() : new Date(project.end_date)
    const sStr = isNaN(s.getTime()) ? project.start_date : `${months[s.getMonth()]} ${s.getFullYear()}`
    const eStr = isCurrent ? 'Present' : (isNaN(e.getTime()) ? project.end_date : `${months[e.getMonth()]} ${e.getFullYear()}`)
    let m = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
    if (m < 0) m = 0
    const yrs = Math.floor(m / 12)
    const mos = m % 12
    let dur = yrs > 0 ? `${yrs} yr${yrs > 1 ? 's' : ''} ` : ''
    dur += mos > 0 || yrs === 0 ? `${mos} mo${mos !== 1 ? 's' : ''}` : ''
    return `${sStr} – ${eStr} · ${dur.trim()}`
  }

  const techList = (project.technology_stack || '').split(',').map((t) => t.trim()).filter(Boolean)
  const isMissingResponsibilities = !project.individual_responsibilities || project.individual_responsibilities.trim() === ''
  const isValidated = project.validation_status === 'APPROVED' || project.validation_status === 'VALIDATED'
  const desc = project.business_problem || project.description || project.individual_responsibilities

  const btnStyle = {
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px',
    padding: '4px 12px', fontSize: '12px', fontWeight: '600', color: '#334155',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px'
  }

  return (
    <div style={{ paddingTop: '18px', paddingBottom: '20px', borderBottom: isLast ? 'none' : '1px solid #f1f5f9' }}>
      {/* Row 1: Bullseye Bullet + Title + Current Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #2563eb', flexShrink: 0 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
          </span>
          <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{project.project_name}</h3>
        </div>
        {isCurrent && (
          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.4px' }}>
            CURRENT
          </span>
        )}
      </div>

      {/* Row 2: Subtitle */}
      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '3px', marginBottom: '8px', paddingLeft: '27px' }}>
        <span>{project.customer_or_employer}</span>
        {project.industry && <span> · {project.industry}</span>}
        <span> · {formatDates()}</span>
      </div>

      {/* Row 3: Description */}
      {desc && (
        <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.5', margin: '0 0 10px 0', paddingLeft: '27px' }}>
          {desc}
        </p>
      )}

      {/* Row 4: Technology Stack Pills */}
      {techList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px', paddingLeft: '27px' }}>
          {techList.map((tech, i) => (
            <span key={i} style={{ background: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: '500', display: 'inline-block' }}>
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Row 5: Action Buttons (Left) & Status (Right) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '27px', marginTop: '4px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={() => onEdit && onEdit(project)} style={btnStyle}>
            <span>✏️</span> Edit
          </button>
          <button type="button" onClick={() => onMapSkills && onMapSkills(project)} style={btnStyle}>
            <span>🔗</span> Map Skills
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${project.project_name}"?`)) {
                onDelete && onDelete(project.id)
              }
            }}
            style={{ ...btnStyle, color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2' }}
          >
            <span>🗑️</span> Delete
          </button>
        </div>

        <div>
          {isValidated && (
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>
              VALIDATED
            </span>
          )}
          {!isValidated && isMissingResponsibilities && (
            <span style={{ background: '#fffbeb', color: '#b45309', padding: '3px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span>⚠️</span> Missing individual responsibilities
            </span>
          )}
          {!isValidated && !isMissingResponsibilities && project.validation_status === 'REJECTED' && (
            <span style={{ background: '#fee2e2', color: '#dc2626', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
              REJECTED
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
