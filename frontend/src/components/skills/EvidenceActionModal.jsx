import { useState, useEffect } from 'react'

export default function EvidenceActionModal({ isOpen, onClose, comp, mode, projects, onSubmit }) {
  const [rating, setRating] = useState('INTERMEDIATE')
  const [notes, setNotes] = useState('')
  const [selectedProjectIds, setSelectedProjectIds] = useState([])

  useEffect(() => {
    if (comp) {
      setRating(comp.approved_rating || comp.self_assessed_rating || 'INTERMEDIATE')
      setNotes('')
      setSelectedProjectIds(comp.project_evidence?.map((p) => p.id || p) || [])
    }
  }, [comp])

  if (!isOpen || !comp) return null

  const isResubmit = mode === 'resubmit'
  const skillName = comp.skill?.name || comp.skill_name || 'Competency'

  const toggleProject = (pId) => {
    setSelectedProjectIds((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const evidenceObjs = selectedProjectIds
      .map((id) => projects.find((p) => p.id === id))
      .filter(Boolean)

    const updated = {
      ...comp,
      self_assessed_rating: isResubmit ? rating : comp.self_assessed_rating,
      validation_status: 'PENDING',
      manager_feedback: notes ? `Resubmitted: ${notes}` : 'Resubmitted with updated details.',
      project_evidence: evidenceObjs
    }
    onSubmit(updated)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
              {isResubmit ? `🔄 Resubmit Rating: ${skillName}` : `📎 Add Project Evidence: ${skillName}`}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              {isResubmit ? 'Adjust rating level and provide clarification to your manager.' : 'Link concrete project experiences to substantiate your competency.'}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            {/* Manager feedback warning callout */}
            {comp.manager_feedback && (
              <div style={{ background: isResubmit ? '#fef2f2' : '#f5f3ff', border: `1px solid ${isResubmit ? '#fecaca' : '#ddd6fe'}`, borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: isResubmit ? '#b91c1c' : '#6d28d9', marginBottom: '4px' }}>
                  Manager Feedback:
                </div>
                <div style={{ fontSize: '13px', color: isResubmit ? '#991b1b' : '#5b21b6', fontStyle: 'italic', lineHeight: '1.4' }}>
                  "{comp.manager_feedback}"
                </div>
              </div>
            )}

            {isResubmit && (
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Adjust Proposed Rating Level:
                </label>
                <select className="form-control" value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value="ZERO">Zero Skill</option>
                  <option value="TRAINED">Trained</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate (Standard)</option>
                  <option value="ADVANCED">Advanced (Designs solutions)</option>
                  <option value="EXPERT">Expert (Enterprise authority)</option>
                </select>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Link Project Evidence:
              </label>
              {projects.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                  {projects.map((p) => {
                    const checked = selectedProjectIds.includes(p.id)
                    return (
                      <label key={p.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', cursor: 'pointer', padding: '4px' }}>
                        <input type="checkbox" checked={checked} onChange={() => toggleProject(p.id)} style={{ marginTop: '2px' }} />
                        <div>
                          <strong style={{ color: '#0f172a' }}>{p.project_name}</strong>
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                            {p.customer_or_employer} · {p.industry}
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                  No past projects found. You can add project experiences in the Project Experience tab.
                </div>
              )}
            </div>

            <div className="form-group">
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                Clarification Notes to Manager (Optional):
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Detail specific deliverables, repos, or production responsibilities addressing the manager's review..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">
              {isResubmit ? 'Resubmit for Validation' : 'Submit Evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
