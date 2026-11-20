import { useState } from 'react'
import ProjectFormModal from './ProjectFormModal'
import ProjectCard from './ProjectCard'

export default function ProjectsManager({ projects, onAddProject, onUpdateProject, onDeleteProject }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const openAddModal = () => {
    setEditingProject(null)
    setModalOpen(true)
  }

  const openEditModal = (project) => {
    setEditingProject(project)
    setModalOpen(true)
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
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>💼</span>
            <span>Project Experience Portfolio ({projects.length})</span>
          </div>
          <button onClick={openAddModal} className="btn btn-primary btn-sm">
            + Add New Project
          </button>
        </div>
        <div className="card-body">
          <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '20px' }}>
            Maintain full details of internal and customer project engagements. Each project serves as verifiable evidence for your competency ratings and customer resume submission.
          </p>

          {projects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onEdit={openEditModal}
                  onDelete={onDeleteProject}
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
      </div>

      <ProjectFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editingProject={editingProject}
      />
    </div>
  )
}
