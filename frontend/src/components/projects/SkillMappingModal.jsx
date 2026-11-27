import { useState, useEffect } from 'react'
import { DEFAULT_SKILL_TAXONOMY } from '../../data/initialData'

export default function SkillMappingModal({ isOpen, onClose, project, onSaveMapping }) {
  if (!isOpen || !project) return null

  const projectTechs = (project.technology_stack || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)

  const [selectedSkillIds, setSelectedSkillIds] = useState([])

  useEffect(() => {
    // Automatically match skills from project tech stack
    const matched = DEFAULT_SKILL_TAXONOMY.filter((s) =>
      projectTechs.some((t) => s.name.toLowerCase().includes(t) || t.includes(s.name.toLowerCase()))
    ).map((s) => s.id)
    setSelectedSkillIds(matched.length > 0 ? matched : [1, 4, 10])
  }, [project])

  const toggleSkill = (id) => {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    if (onSaveMapping) {
      onSaveMapping(project.id, selectedSkillIds)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
              🔗 Map Skills to Project Experience
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
              {project.project_name} · {project.customer_or_employer}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '13px', color: '#334155', marginBottom: '14px', lineHeight: '1.5' }}>
            Select verified skills demonstrated during this project. Linked skills serve as project evidence under <strong>ENG-O05</strong> for manager competency reviews.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {DEFAULT_SKILL_TAXONOMY.map((skill) => {
              const isSelected = selectedSkillIds.includes(skill.id)
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: isSelected ? '700' : '500',
                    border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    color: isSelected ? '#1d4ed8' : '#475569',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{isSelected ? '✓' : '+'}</span>
                  <span>{skill.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {selectedSkillIds.length} skills selected
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="btn btn-primary btn-sm" style={{ fontWeight: '700' }}>
              Save Skill Mapping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
