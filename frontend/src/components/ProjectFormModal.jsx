import { useState, useEffect } from 'react'

export default function ProjectFormModal({ isOpen, onClose, onSubmit, editingProject }) {
  const initialForm = {
    project_name: '',
    customer_or_employer: '',
    industry: 'Healthcare',
    start_date: '',
    end_date: '',
    business_problem: '',
    technology_stack: '',
    individual_responsibilities: '',
    measurable_achievements: '',
  }

  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    if (editingProject) {
      setFormData({
        project_name: editingProject.project_name || '',
        customer_or_employer: editingProject.customer_or_employer || '',
        industry: editingProject.industry || 'Healthcare',
        start_date: editingProject.start_date || '',
        end_date: editingProject.end_date || '',
        business_problem: editingProject.business_problem || '',
        technology_stack: editingProject.technology_stack || '',
        individual_responsibilities: editingProject.individual_responsibilities || '',
        measurable_achievements: editingProject.measurable_achievements || '',
      })
    } else {
      setFormData(initialForm)
    }
  }, [editingProject, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingProject ? '✏️ Edit Project Experience' : '➕ Add Project Experience'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Healthcare Claims Platform"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Customer / Employer *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Apollo Hospitals"
                  value={formData.customer_or_employer}
                  onChange={(e) => setFormData({ ...formData, customer_or_employer: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Industry *</label>
                <select
                  className="form-control"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  required
                >
                  <option value="Healthcare">Healthcare & Life Sciences</option>
                  <option value="Automotive">Automotive & Telematics</option>
                  <option value="Industrial">Industrial & Manufacturing</option>
                  <option value="Energy">Energy & Utilities</option>
                  <option value="Logistics">Logistics & Supply Chain</option>
                  <option value="Financial Services">Financial Services & Fintech</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Technology Stack (Comma separated) *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Python, FastAPI, Kubernetes, PostgreSQL"
                  value={formData.technology_stack}
                  onChange={(e) => setFormData({ ...formData, technology_stack: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date (Leave blank if ongoing)</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Business Problem / Context</label>
              <textarea
                className="form-control"
                placeholder="Describe the business problem the project solved..."
                value={formData.business_problem}
                onChange={(e) => setFormData({ ...formData, business_problem: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Individual Responsibilities & Contributions *</label>
              <textarea
                className="form-control"
                placeholder="Describe your specific technical contributions..."
                value={formData.individual_responsibilities}
                onChange={(e) => setFormData({ ...formData, individual_responsibilities: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Measurable Achievements / Metrics</label>
              <textarea
                className="form-control"
                placeholder="e.g. Reduced processing latency by 40%..."
                value={formData.measurable_achievements}
                onChange={(e) => setFormData({ ...formData, measurable_achievements: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">
              {editingProject ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
