import { useState } from 'react'
import { DEFAULT_SKILL_TAXONOMY } from '../api'
import SkillsTable from './SkillsTable'
import SkillRatingModal from './SkillRatingModal'

export default function SkillsManager({
  competencies,
  projects,
  onAddOrUpdateRating,
  onDeleteRating
}) {
  const [activeDimension, setActiveDimension] = useState('TECHNICAL')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCompetency, setEditingCompetency] = useState(null)

  const filteredCompetencies = competencies.filter(
    (c) => (c.skill?.dimension || c.dimension) === activeDimension
  )

  const availableTaxonomy = DEFAULT_SKILL_TAXONOMY.filter(
    (s) => s.dimension === activeDimension
  )

  const openAddModal = () => {
    setEditingCompetency(null)
    setModalOpen(true)
  }

  const openEditModal = (comp) => {
    setEditingCompetency(comp)
    setModalOpen(true)
  }

  const handleModalSubmit = ({ selectedSkill, rating, evidenceIds }) => {
    onAddOrUpdateRating({
      id: editingCompetency ? editingCompetency.id : Date.now(),
      skill: selectedSkill,
      skill_id: selectedSkill.id,
      self_assessed_rating: rating,
      approved_rating: editingCompetency ? editingCompetency.approved_rating : null,
      validation_status: 'PENDING',
      manager_feedback: '',
      project_evidence: evidenceIds.map((id) => projects.find((p) => p.id === id)).filter(Boolean)
    })
    setModalOpen(false)
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>⚙️</span>
            <span>Competency Framework & Skills Rating</span>
          </div>
          <button onClick={openAddModal} className="btn btn-primary btn-sm">
            + Rate New Skill
          </button>
        </div>
        <div className="card-body">
          <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '20px' }}>
            Rate your proficiency against the approved 6-level framework (Zero, Trained, Beginner, Intermediate, Advanced, Expert). Mapped project experiences serve as verifiable evidence for manager review.
          </p>

          <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', marginBottom: '20px' }}>
            {[
              { key: 'TECHNICAL', label: 'Technical Skills', icon: '⚙️' },
              { key: 'DOMAIN', label: 'Domain Competencies', icon: '🌐' },
              { key: 'FUNCTIONAL', label: 'Functional Roles', icon: '🧩' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveDimension(tab.key)}
                style={{
                  padding: '10px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeDimension === tab.key ? '2px solid #2563eb' : '2px solid transparent',
                  marginBottom: '-2px',
                  fontWeight: activeDimension === tab.key ? '700' : '500',
                  color: activeDimension === tab.key ? '#2563eb' : '#64748b',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="badge badge-rating">
                  {competencies.filter((c) => (c.skill?.dimension || c.dimension) === tab.key).length}
                </span>
              </button>
            ))}
          </div>

          {filteredCompetencies.length > 0 ? (
            <SkillsTable
              competencies={filteredCompetencies}
              onEdit={openEditModal}
              onDelete={onDeleteRating}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
              <h4 style={{ fontSize: '14px', color: '#334155', marginBottom: '4px' }}>
                No {activeDimension.toLowerCase()} competencies rated yet
              </h4>
              <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                Select from the standard {activeDimension.toLowerCase()} taxonomy to submit your self-assessment.
              </p>
              <button onClick={openAddModal} className="btn btn-primary btn-sm">
                + Rate {activeDimension} Skill
              </button>
            </div>
          )}
        </div>
      </div>

      <SkillRatingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingCompetency={editingCompetency}
        activeDimension={activeDimension}
        availableTaxonomy={availableTaxonomy}
        projects={projects}
      />
    </div>
  )
}
