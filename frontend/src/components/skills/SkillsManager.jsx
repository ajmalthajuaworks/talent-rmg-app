import { useState, useEffect } from 'react'
import { DEFAULT_SKILL_TAXONOMY } from '../../api'
import SkillsTable from './SkillsTable'
import SkillRatingModal from './SkillRatingModal'
import BulkSkillModal from './BulkSkillModal'

export default function SkillsManager({
  competencies,
  projects,
  onAddOrUpdateRating,
  onBulkAddRatings,
  onDeleteRating,
  initialDimension = 'TECHNICAL'
}) {
  const [activeDimension, setActiveDimension] = useState(initialDimension)
  const [reviewFilter, setReviewFilter] = useState('ALL')
  const [modalOpen, setModalOpen] = useState(false)
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [editingCompetency, setEditingCompetency] = useState(null)

  useEffect(() => {
    if (initialDimension) setActiveDimension(initialDimension)
  }, [initialDimension])

  const filteredCompetencies = competencies.filter((c) => {
    const dimMatch = (c.skill?.dimension || c.dimension) === activeDimension
    if (!dimMatch) return false
    const status = (c.validation_status || 'DRAFT').toUpperCase()
    if (reviewFilter === 'PENDING') return status === 'PENDING' || status === 'DRAFT'
    if (reviewFilter === 'APPROVED') return status === 'APPROVED'
    if (reviewFilter === 'REJECTED') return status === 'REJECTED' || status === 'REVISED'
    return true
  })

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
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setBulkModalOpen(true)} className="btn btn-secondary btn-sm" style={{ fontWeight: '600' }}>
              ⚡ Quick Batch Add / Paste
            </button>
            <button onClick={openAddModal} className="btn btn-primary btn-sm">
              + Rate Single Skill
            </button>
          </div>
        </div>
        <div className="card-body">
          <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '20px' }}>
            Rate your proficiency against the approved 6-level framework (Zero, Trained, Beginner, Intermediate, Advanced, Expert). Use <strong>Quick Batch Add</strong> to add 10–20+ skills from LinkedIn/Naukri at once.
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

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>STATUS:</span>
            {[
              { key: 'ALL', label: 'All Rated' },
              { key: 'PENDING', label: '⏳ Pending Review' },
              { key: 'APPROVED', label: '✓ Approved' },
              { key: 'REJECTED', label: '✕ Rejected / Revisions' },
            ].map((seg) => (
              <button
                key={seg.key}
                type="button"
                onClick={() => setReviewFilter(seg.key)}
                className={`btn btn-sm ${reviewFilter === seg.key ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11.5px', padding: '4px 10px' }}
              >
                {seg.label}
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

      <BulkSkillModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onSubmit={onBulkAddRatings}
        projects={projects}
      />
    </div>
  )
}
