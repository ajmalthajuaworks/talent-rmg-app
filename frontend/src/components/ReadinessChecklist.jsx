export default function ReadinessChecklist({ profile, projects, competencies, onNavigate }) {
  const items = [
    {
      label: 'Standard Identification',
      sub: 'Employee ID, designation & department set',
      done: Boolean(profile.designation && profile.department)
    },
    {
      label: 'Project Portfolio',
      sub: `${projects.length} project engagement(s) recorded`,
      done: projects.length > 0
    },
    {
      label: 'Technical Competencies',
      sub: 'Rated against standard skill codes',
      done: competencies.some((c) => (c.skill?.dimension || c.dimension) === 'TECHNICAL')
    },
    {
      label: 'Domain Skills',
      sub: 'Industry vertical experience identified',
      done: competencies.some((c) => (c.skill?.dimension || c.dimension) === 'DOMAIN')
    },
    {
      label: 'Functional Capabilities',
      sub: 'Role proficiencies documented',
      done: competencies.some((c) => (c.skill?.dimension || c.dimension) === 'FUNCTIONAL')
    }
  ]

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span>📋</span> Profile Readiness Checklist
        </div>
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: item.done ? '#16a34a' : '#dc2626', fontWeight: '800' }}>
                {item.done ? '✓' : '✗'}
              </span>
              <div>
                <strong>{item.label}:</strong> {item.sub}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
          <button onClick={() => onNavigate('resume-upload')} className="btn btn-secondary btn-sm">
            Upload Resume →
          </button>
          <button onClick={() => onNavigate('projects')} className="btn btn-secondary btn-sm">
            Manage Projects →
          </button>
        </div>
      </div>
    </div>
  )
}
