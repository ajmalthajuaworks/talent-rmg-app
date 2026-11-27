export default function SkillsTable({ competencies, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Skill Code</th>
            <th>Competency Name</th>
            <th>Self-Assessed Rating</th>
            <th>Approved Rating</th>
            <th>Validation Status</th>
            <th>Linked Evidence</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {competencies.map((comp) => (
            <tr key={comp.id}>
              <td><code>{comp.skill?.skill_code || 'CODE'}</code></td>
              <td>
                <strong>{comp.skill?.name || comp.skill_name}</strong>
              </td>
              <td>
                <span className="badge badge-rating">
                  {comp.self_assessed_rating || 'INTERMEDIATE'}
                </span>
              </td>
              <td>
                {comp.approved_rating ? (
                  <div>
                    <span className="badge badge-approved">{comp.approved_rating}</span>
                    {comp.approved_rating !== comp.self_assessed_rating && (
                      <div style={{ fontSize: '11px', color: '#b45309', marginTop: '2px', fontWeight: '600' }}>
                        Revised from {comp.self_assessed_rating}
                      </div>
                    )}
                  </div>
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>Awaiting review</span>
                )}
              </td>
              <td>
                <span className={`badge badge-${(comp.validation_status || 'draft').toLowerCase()}`}>
                  {comp.validation_status || 'DRAFT'}
                </span>
                {comp.validation_status === 'REJECTED' || comp.validation_status === 'REVISED' ? (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '5px 8px', borderRadius: '6px', fontSize: '11.5px', marginTop: '5px' }}>
                    <strong>Manager Note:</strong> "{comp.manager_feedback || 'Needs further project evidence.'}"
                    <span style={{ display: 'block', color: '#b91c1c', marginTop: '2px', fontWeight: '600' }}>⚠️ Evidence gap</span>
                  </div>
                ) : comp.manager_feedback ? (
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    "{comp.manager_feedback}"
                  </div>
                ) : null}
              </td>
              <td>
                {comp.project_evidence && comp.project_evidence.length > 0 ? (
                  comp.project_evidence.map((p, i) => (
                    <span key={i} className="badge-tag">{p.project_name || p}</span>
                  ))
                ) : (
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>None linked</span>
                )}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => onEdit(comp)} className="btn btn-secondary btn-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Remove rating for ${comp.skill?.name}?`)) {
                        onDelete(comp.id)
                      }
                    }}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
