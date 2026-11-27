// ExtractedPreview.jsx — Displays parsed projects and skills preview with cherry-pick selection
import { useState, useEffect } from 'react'

export default function ExtractedPreview({ extractionResult, imported, onImport }) {
  const [decisions, setDecisions] = useState({})

  useEffect(() => {
    if (extractionResult?.extractedSkills) {
      const initial = {}
      extractionResult.extractedSkills.forEach((_, idx) => {
        initial[idx] = true
      })
      setDecisions(initial)
    }
  }, [extractionResult])

  if (!extractionResult) return null

  const skills = extractionResult.extractedSkills || []
  const projects = extractionResult.extractedProjects || []
  const acceptedSkills = skills.filter((_, idx) => decisions[idx] !== false)

  const handleToggle = (idx, status) => {
    setDecisions((prev) => ({ ...prev, [idx]: status }))
  }

  const handleSelectAll = (status) => {
    const updated = {}
    skills.forEach((_, idx) => {
      updated[idx] = status
    })
    setDecisions(updated)
  }

  const handleApply = () => {
    onImport({
      ...extractionResult,
      extractedSkills: acceptedSkills
    })
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <div className="alert alert-success" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Extraction Complete:</strong> Identified <strong>{projects.length} projects</strong> and <strong>{skills.length} skills</strong>.
          <span style={{ marginLeft: '6px', color: '#166534', fontWeight: '600' }}>
            ({acceptedSkills.length} selected for profile import)
          </span>
        </div>
        {!imported ? (
          <button
            onClick={handleApply}
            disabled={acceptedSkills.length === 0 && projects.length === 0}
            className="btn btn-primary btn-sm"
          >
            ✓ Apply Selected ({acceptedSkills.length} Skills & {projects.length} Projects)
          </button>
        ) : (
          <span className="badge badge-approved" style={{ fontSize: '13px', padding: '6px 12px' }}>✓ Applied to Profile</span>
        )}
      </div>

      {/* Projects Preview */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💼</span> Extracted Project Experiences ({projects.length})
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {projects.map((p, idx) => (
            <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{p.project_name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    <strong>{p.customer_or_employer}</strong> · {p.industry} · {p.start_date} to {p.end_date || 'Present'}
                  </div>
                </div>
                <span className="badge badge-rating">High Confidence</span>
              </div>
              <div style={{ fontSize: '13px', color: '#334155', margin: '8px 0', lineHeight: '1.4' }}>
                {p.individual_responsibilities}
              </div>
              <div>
                {(p.technology_stack || '').split(',').map((t, i) => (
                  <span key={i} className="badge-tag">{t.trim()}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Preview with Cherry-Picking */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span>⚙️</span> Proposed Skill Taxonomy Mappings ({skills.length} items)
          </h4>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button type="button" onClick={() => handleSelectAll(true)} className="btn btn-secondary btn-sm" style={{ fontSize: '11.5px', padding: '3px 8px' }}>
              ✓ Select All
            </button>
            <button type="button" onClick={() => handleSelectAll(false)} className="btn btn-secondary btn-sm" style={{ fontSize: '11.5px', padding: '3px 8px' }}>
              ✕ Deselect All
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Decision</th>
                <th>Code</th>
                <th>Extracted Competency</th>
                <th>Dimension</th>
                <th>Suggested Rating</th>
                <th>Confidence</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s, idx) => {
                const isAccepted = decisions[idx] !== false
                return (
                  <tr key={idx} style={{ opacity: isAccepted ? 1 : 0.45, transition: 'opacity 0.15s ease' }}>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => handleToggle(idx, true)}
                          title="Accept skill for import"
                          className={`btn btn-sm ${isAccepted ? 'btn-success' : 'btn-secondary'}`}
                          style={{ padding: '3px 8px', fontSize: '11.5px' }}
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(idx, false)}
                          title="Reject / Exclude skill from import"
                          className={`btn btn-sm ${!isAccepted ? 'btn-danger' : 'btn-secondary'}`}
                          style={{ padding: '3px 8px', fontSize: '11.5px' }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                    <td><code>{s.code}</code></td>
                    <td><strong>{s.name}</strong></td>
                    <td>
                      <span className={`badge ${s.dimension === 'FUNCTIONAL' ? 'badge-functional' : s.dimension === 'DOMAIN' ? 'badge-domain' : 'badge-tech'}`}>
                        {s.dimension}
                      </span>
                    </td>
                    <td><span className="badge badge-approved">{s.suggestedRating}</span></td>
                    <td><span style={{ color: '#16a34a', fontWeight: '700' }}>{s.confidence}</span></td>
                    <td>
                      {isAccepted ? (
                        <span className="badge badge-pending" style={{ color: '#15803d', background: '#dcfce7' }}>✓ Included</span>
                      ) : (
                        <span className="badge badge-rejected">✕ Excluded</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
