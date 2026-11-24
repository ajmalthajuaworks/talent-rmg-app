export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        background: '#ffffff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{project.project_name}</h3>
            {!project.end_date && <span className="badge badge-approved">Current Engagement</span>}
          </div>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
            <strong>{project.customer_or_employer}</strong> · {project.industry} · {project.start_date} to {project.end_date || 'Present'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onEdit(project)} className="btn btn-secondary btn-sm">
            ✏️ Edit Project
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete "${project.project_name}"?`)) {
                onDelete(project.id)
              }
            }}
            className="btn btn-danger btn-sm"
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {project.business_problem && (
        <div style={{ fontSize: '13px', color: '#334155', margin: '8px 0', lineHeight: '1.4' }}>
          <strong>Objective:</strong> {project.business_problem}
        </div>
      )}

      <div style={{ fontSize: '13px', color: '#1e293b', margin: '8px 0', lineHeight: '1.5' }}>
        <strong>Individual Responsibilities:</strong> {project.individual_responsibilities}
      </div>

      {project.measurable_achievements && (
        <div style={{ fontSize: '13px', color: '#0369a1', background: '#f0f9ff', padding: '6px 10px', borderRadius: '6px', margin: '8px 0' }}>
          🎯 <strong>Achievements:</strong> {project.measurable_achievements}
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', marginRight: '6px' }}>Technologies:</span>
        {project.technology_stack ? (
          project.technology_stack.split(',').map((tech, i) => (
            <span key={i} className="badge-tag">{tech.trim()}</span>
          ))
        ) : (
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>None specified</span>
        )}
      </div>
    </div>
  )
}
