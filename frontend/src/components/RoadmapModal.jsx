export default function RoadmapModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const weeks = [
    {
      week: 'Week 1',
      title: 'Profile Foundation, Resume Ingestion & Project Management',
      status: 'Current Week (Active)',
      badgeClass: 'badge-approved',
      items: [
        'ENG-O01 / ENG-O03: Account creation, login, and standardized employee profile setup (forms for designation, department, employee ID).',
        'ENG-O02: Upload existing resume (PDF/DOCX) with automated extraction of employment, projects, and skills.',
        'ENG-O04: Maintain project experience — Add, update/edit, and delete projects with customer, industry, duration, technologies, responsibilities, and achievements.',
        'ENG-O06: Maintain technical skills — Submit proficiency ratings against the 6 approved competency levels.',
        'ENG-O07: Maintain domain skills — Identify and rate industry domain experience (Automotive, Healthcare, Industrial, Energy, Logistics).',
        'ENG-O08: Maintain functional competencies — Identify and rate roles (Individual Contributor, Team Lead, Tech Lead, Architect, TPM).',
      ]
    },
    {
      week: 'Week 2',
      title: 'Skill Evidence Mapping, AI Recommendations & Validation Feedback',
      status: 'Planned for Week 2',
      badgeClass: 'badge-pending',
      items: [
        'ENG-O05: Map each project experience to relevant technical skills, domain skills, and functional roles.',
        'ENG-O09: Review AI skill recommendations extracted from resume descriptions, accept or reject proposed codes.',
        'ENG-O10: Submit self-assessed skill levels with supporting project evidence for manager review.',
        'ENG-O11: Review approved competency ratings, rejected ratings, and written manager feedback separately from self-assessments.',
      ]
    },
    {
      week: 'Week 3',
      title: 'Competency Gap Analysis, Adjacent Skills & Certifications',
      status: 'Planned for Week 3',
      badgeClass: 'badge-draft',
      items: [
        'ENG-O12: Identify profile information gaps (missing project objectives, responsibilities, or technologies).',
        'ENG-O13: Identify competency gaps by comparing current ratings against target engineering career profiles.',
        'ENG-O14: Discover related and adjacent skills (e.g. Kafka -> Flink, Azure -> AWS) transferable from project history.',
        'ENG-O15: Maintain certifications and training records (issuing body, credential ID, validity period).',
      ]
    },
    {
      week: 'Week 4',
      title: 'Customer Resume Generation, Multi-Format Export & Profile Freshness',
      status: 'Planned for Week 4',
      badgeClass: 'badge-draft',
      items: [
        'ENG-O16: Generate customer-ready detailed resume and one-page professional summary (excluding internal ratings & codes).',
        'ENG-O17: Export generated resume profiles in customer-ready PDF and presentation formats.',
        'ENG-O18: Maintain profile freshness — automated update reminders and last substantive update tracking.',
        'ENG-O19: Review overall profile completeness, validation status dashboard, and profile health metric.',
      ]
    }
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800' }}>
              📅 Actor 1 (Engineer): 4-Week Delivery Roadmap
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              All 19 Functional Objectives (ENG-O01 to ENG-O19) scheduled across 4 delivery weeks
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {weeks.map((w, idx) => (
              <div
                key={idx}
                style={{
                  border: idx === 0 ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  background: idx === 0 ? '#f8fafc' : '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#2563eb' }}>{w.week}:</span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{w.title}</span>
                  </div>
                  <span className={`badge ${w.badgeClass}`}>{w.status}</span>
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: '#334155', lineHeight: '1.6' }}>
                  {w.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  )
}
