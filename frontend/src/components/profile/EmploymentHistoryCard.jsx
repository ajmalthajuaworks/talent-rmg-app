export default function EmploymentHistoryCard({ employments, onChange, onAdd, onSave }) {
  return (
    <div className="card" style={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
      <div className="card-header" style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
        <div className="card-title" style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>👤</span> Employment History
        </div>
      </div>

      <form onSubmit={onSave} style={{ padding: '24px' }}>
        {employments.map((emp, idx) => (
          <div key={emp.id} style={{ marginBottom: idx < employments.length - 1 ? '24px' : '0', paddingBottom: idx < employments.length - 1 ? '20px' : '0', borderBottom: idx < employments.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155', marginBottom: '6px', display: 'block' }}>
                  Company / Employer
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Accenture Solutions Pvt. Ltd."
                  value={emp.company}
                  onChange={(e) => onChange(idx, 'company', e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155', marginBottom: '6px', display: 'block' }}>
                  Role
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Application Development Senior Analyst"
                  value={emp.role}
                  onChange={(e) => onChange(idx, 'role', e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155', marginBottom: '6px', display: 'block' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={emp.startDate}
                  onChange={(e) => onChange(idx, 'startDate', e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155', marginBottom: '6px', display: 'block' }}>
                  End Date (leave blank if current)
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={emp.endDate}
                  onChange={(e) => onChange(idx, 'endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '22px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ background: '#2563eb', padding: '9px 20px', fontWeight: '700', borderRadius: '7px' }}
          >
            Save Employment
          </button>
          <button
            type="button"
            onClick={onAdd}
            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer' }}
          >
            + Add Another Employment
          </button>
        </div>
      </form>
    </div>
  )
}
