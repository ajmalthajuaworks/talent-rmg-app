import { useState } from 'react'
import ProjectFormModal from './ProjectFormModal'
import ProjectCard from './ProjectCard'
import SkillMappingModal from './SkillMappingModal'

export default function ProjectsManager({ projects, onAddProject, onUpdateProject, onDeleteProject }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [mappingProject, setMappingProject] = useState(null)
  const [toastMsg, setToastMsg] = useState('')

  const openAddModal = () => {
    setEditingProject(null)
    setModalOpen(true)
  }

  const openEditModal = (project) => {
    setEditingProject(project)
    setModalOpen(true)
  }

  const openMapSkills = (project) => {
    setMappingProject(project)
  }

  const handleSaveMapping = (projectId, skillIds) => {
    setToastMsg(`Mapped ${skillIds.length} skills as verified evidence for this project!`)
    setTimeout(() => setToastMsg(''), 4000)
  }

  const handleSubmit = (formData) => {
    if (editingProject) {
      onUpdateProject(editingProject.id, formData)
    } else {
      onAddProject(formData)
    }
    setModalOpen(false)
  }

  return (
    <div>
      {toastMsg && (
        <div className="alert alert-success" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✅</span>
          <strong>{toastMsg}</strong>
        </div>
      )}

      <div
        className="card"
        style={{
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          padding: '24px 28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h2 style={{ fontSize: '16.5px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Project Experience
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '3px 0 0 0' }}>
              Document client and internal projects to serve as verifiable competency evidence (ENG-O04 / ENG-O05).
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: '700', borderRadius: '7px' }}
          >
            + Add Project
          </button>
        </div>

        {projects.length > 0 ? (
          <div>
            {projects.map((p, idx) => (
              <ProjectCard
                key={p.id}
                project={p}
                onEdit={openEditModal}
                onMapSkills={openMapSkills}
                onDelete={onDeleteProject}
                isLast={idx === projects.length - 1}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📁</div>
            <h4 style={{ fontSize: '15px', color: '#334155', marginBottom: '4px' }}>No Project Experience Added Yet</h4>
            <p style={{ fontSize: '13px', marginBottom: '16px' }}>
              Add your project details manually or import them using the Resume Ingestion tool.
            </p>
            <button onClick={openAddModal} className="btn btn-primary btn-sm">
              + Add Project Now
            </button>
          </div>
        )}
      </div>

      <ProjectFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editingProject={editingProject}
      />

      <SkillMappingModal
        isOpen={Boolean(mappingProject)}
        project={mappingProject}
        onClose={() => setMappingProject(null)}
        onSaveMapping={handleSaveMapping}
      />
    </div>
  )
}
