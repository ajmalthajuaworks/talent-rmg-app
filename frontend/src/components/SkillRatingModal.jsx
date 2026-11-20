import { useState, useEffect } from 'react'

export default function SkillRatingModal({
  isOpen,
  onClose,
  onSubmit,
  editingCompetency,
  activeDimension,
  availableTaxonomy,
  projects
}) {
  const [formSkillId, setFormSkillId] = useState('')
  const [formRating, setFormRating] = useState('INTERMEDIATE')
  const [formEvidence, setFormEvidence] = useState([])

  useEffect(() => {
    if (editingCompetency) {
      setFormSkillId(editingCompetency.skill?.id || editingCompetency.skill_id)
      setFormRating(editingCompetency.self_assessed_rating || 'INTERMEDIATE')
      setFormEvidence(editingCompetency.project_evidence?.map((p) => (typeof p === 'object' ? p.id : p)) || [])
    } else {
      setFormSkillId(availableTaxonomy[0]?.id || '')
      setFormRating('INTERMEDIATE')
      setFormEvidence([])
    }
  }, [editingCompetency, availableTaxonomy, isOpen])

  if (!isOpen) return null

  const handleEvidenceToggle = (projectId) => {
    setFormEvidence((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedSkill = availableTaxonomy.find((s) => s.id === parseInt(formSkillId)) || {
      id: parseInt(formSkillId),
      name: 'Custom Skill',
      skill_code: 'CUST-001',
      dimension: activeDimension
    }

    onSubmit({
      selectedSkill,
      rating: formRating,
      evidenceIds: formEvidence
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {editingCompetency ? '✏️ Update Skill Rating' : `➕ Rate ${activeDimension} Competency`}
          </h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Select Skill from Taxonomy *</label>
              <select
                className="form-control"
                value={formSkillId}
                onChange={(e) => setFormSkillId(e.target.value)}
                required
              >
                {availableTaxonomy.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.skill_code}) — {s.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Self-Assessed Proficiency Rating Level *</label>
              <select
                className="form-control"
                value={formRating}
                onChange={(e) => setFormRating(e.target.value)}
                required
              >
                <option value="ZERO">Zero Skill — No theoretical or practical knowledge</option>
                <option value="TRAINED">Trained — Completed training / coursework</option>
                <option value="BEGINNER">Beginner — Basic hands-on experience under guidance</option>
                <option value="INTERMEDIATE">Intermediate — Independent execution on standard tasks</option>
                <option value="ADVANCED">Advanced — Deep expertise, mentors others & designs solutions</option>
                <option value="EXPERT">Expert — Organizational authority, cross-domain architect</option>
              </select>
            </div>

            <div className="form-group">
              <label>Link Supporting Project Evidence</label>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                Select project engagements where you applied this competency:
              </p>
              {projects.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                  {projects.map((p) => (
                    <label key={p.id} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formEvidence.includes(p.id)}
                        onChange={() => handleEvidenceToggle(p.id)}
                      />
                      <span>
                        <strong>{p.project_name}</strong> ({p.customer_or_employer})
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  No projects recorded yet. You can still rate this skill and link evidence later.
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Submit for Manager Validation</button>
          </div>
        </form>
      </div>
    </div>
  )
}
