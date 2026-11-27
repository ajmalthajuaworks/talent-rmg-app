function SkillPill({ name, bg, color }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: bg,
        color: color,
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12.5px',
        fontWeight: '600',
        margin: '3px 4px 3px 0'
      }}
    >
      {name}
    </span>
  )
}

function SectionTitle({ title }) {
  return (
    <h3
      style={{
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: '700',
        color: '#2563eb',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '4px',
        marginBottom: '10px'
      }}
    >
      {title}
    </h3>
  )
}

export default function ResumePreview({ profile, projects, competencies }) {
  const techSkills = competencies.filter(
    (c) => (c.skill?.dimension || c.dimension) === 'TECHNICAL'
  )
  const domainSkills = competencies.filter(
    (c) => (c.skill?.dimension || c.dimension) === 'DOMAIN'
  )
  const functionalSkills = competencies.filter(
    (c) => (c.skill?.dimension || c.dimension) === 'FUNCTIONAL'
  )

  const fullName = `${profile.user?.first_name || ''} ${profile.user?.last_name || ''}`.trim() || profile.user?.username || 'Ajmal Thaju'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            Customer-Ready Resume Generator
          </h2>
          <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
            Internal codes, manager validation notes, and numerical rating levels are filtered out per company compliance (SYS-08).
          </p>
        </div>
        <button onClick={() => window.print()} className="btn btn-primary no-print">
          🖨️ Print / Save as PDF
        </button>
      </div>

      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '40px 48px',
        maxWidth: '850px',
        margin: '0 auto',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        lineHeight: '1.6'
      }}>
        {/* Header */}
        <div style={{
          borderBottom: '2.5px solid #2563eb',
          paddingBottom: '20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
              {fullName?.toUpperCase()}
            </h1>
            <div style={{ fontSize: '15px', color: '#2563eb', fontWeight: '600', marginTop: '4px' }}>
              {profile.designation} · {profile.department}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12.5px', color: '#64748b' }}>
            <div>ID: {profile.employee_id}</div>
            <div>{profile.user?.email || 'contact@company.com'}</div>
          </div>
        </div>

        {/* Technical Capabilities */}
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle title="Core Technical Skills" />
          <div>
            {techSkills.length > 0 ? (
              techSkills.map((c, i) => (
                <SkillPill key={i} name={c.skill?.name || c.skill_name} bg="#eff6ff" color="#1d4ed8" />
              ))
            ) : (
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>None recorded yet</span>
            )}
          </div>
        </div>

        {/* Domain Expertise */}
        {domainSkills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <SectionTitle title="Industry Domain Knowledge" />
            <div>
              {domainSkills.map((c, i) => (
                <SkillPill key={i} name={c.skill?.name || c.skill_name} bg="#faf5ff" color="#9333ea" />
              ))}
            </div>
          </div>
        )}

        {/* Functional Roles */}
        {functionalSkills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <SectionTitle title="Demonstrated Functional Responsibilities" />
            <div>
              {functionalSkills.map((c, i) => (
                <SkillPill key={i} name={c.skill?.name || c.skill_name} bg="#fff7ed" color="#ea580c" />
              ))}
            </div>
          </div>
        )}

        {/* Projects Timeline */}
        <div>
          <SectionTitle title="Professional Project Engagements" />
          {projects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ borderLeft: '3px solid #2563eb', paddingLeft: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{p.project_name}</h4>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {p.start_date} – {p.end_date || 'Present'}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>
                    {p.customer_or_employer} · {p.industry}
                  </div>
                  {p.business_problem && (
                    <div style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
                      <strong>Business Context:</strong> {p.business_problem}
                    </div>
                  )}
                  <div style={{ fontSize: '13px', color: '#1e293b', marginTop: '6px' }}>
                    <strong>Key Responsibilities:</strong> {p.individual_responsibilities}
                  </div>
                  {p.measurable_achievements && (
                    <div style={{ fontSize: '13px', color: '#15803d', marginTop: '4px' }}>
                      <strong>Key Achievements:</strong> {p.measurable_achievements}
                    </div>
                  )}
                  <div style={{ marginTop: '8px' }}>
                    <strong>Technologies Used: </strong>
                    <span style={{ color: '#475569', fontSize: '12.5px' }}>{p.technology_stack}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>No project experience recorded.</div>
          )}
        </div>
      </div>
    </div>
  )
}
