import { useState } from 'react'
import { simulateResumeExtraction } from '../api'

export default function ResumeUpload({ onImportExtractedData }) {
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [extractionResult, setExtractionResult] = useState(null)
  const [imported, setImported] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      handleAnalyze(selected)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0]
      setFile(dropped)
      handleAnalyze(dropped)
    }
  }

  const handleAnalyze = async (uploadedFile) => {
    setAnalyzing(true)
    setExtractionResult(null)
    setImported(false)

    try {
      const result = await simulateResumeExtraction(uploadedFile)
      setExtractionResult(result)
    } catch {
      alert('Failed to analyze resume.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleImport = () => {
    if (!extractionResult) return
    onImportExtractedData(extractionResult)
    setImported(true)
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>📄</span>
            <span>Resume Ingestion & Skill Extraction</span>
          </div>
          <span className="badge badge-rating">AI Extraction Engine</span>
        </div>
        <div className="card-body">
          <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '16px', lineHeight: '1.5' }}>
            Upload an existing PDF or DOCX resume. The parser extracts your professional background, project history, individual contributions, and automatically maps skills to the organization's approved taxonomy.
          </p>

          {/* Upload Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '36px 20px',
              textAlign: 'center',
              background: '#f8fafc',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onClick={() => document.getElementById('resume-file-input').click()}
          >
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div style={{ fontSize: '42px', marginBottom: '8px' }}>☁️</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
              {file ? file.name : 'Click to select or drag and drop your resume file'}
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
              Supports PDF, DOC, DOCX up to 10 MB
            </div>
          </div>

          {analyzing && (
            <div style={{ marginTop: '24px', textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb', marginBottom: '8px' }}>
                Analyzing resume structure & extracting skill dimensions...
              </div>
              <div className="progress-container" style={{ maxWidth: '380px', margin: '0 auto' }}>
                <div className="progress-bar-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
          )}

          {extractionResult && (
            <div style={{ marginTop: '28px' }}>
              <div className="alert alert-success" style={{ justifyContent: 'space-between' }}>
                <div>
                  <strong>Extraction Complete:</strong> Identified <strong>{extractionResult.extractedProjects.length} projects</strong> and <strong>{extractionResult.extractedSkills.length} skills</strong> ready for mapping.
                </div>
                {!imported ? (
                  <button onClick={handleImport} className="btn btn-primary btn-sm">
                    ✓ Apply Extracted Data to Profile
                  </button>
                ) : (
                  <span className="badge badge-approved">✓ Applied to Profile</span>
                )}
              </div>

              {/* Extracted Projects Preview */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💼</span> Extracted Project Experiences ({extractionResult.extractedProjects.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {extractionResult.extractedProjects.map((p, idx) => (
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
                        {p.technology_stack.split(',').map((t, i) => (
                          <span key={i} className="badge-tag">{t.trim()}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extracted Skills Preview */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚙️</span> Proposed Skill Taxonomy Mappings ({extractionResult.extractedSkills.length})
                </h4>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Taxonomy Code</th>
                        <th>Extracted Skill</th>
                        <th>Dimension</th>
                        <th>Suggested Rating</th>
                        <th>Confidence</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractionResult.extractedSkills.map((s, idx) => (
                        <tr key={idx}>
                          <td><code>{s.code}</code></td>
                          <td><strong>{s.name}</strong></td>
                          <td><span className="badge badge-rating">{s.dimension}</span></td>
                          <td><span className="badge badge-approved">{s.suggestedRating}</span></td>
                          <td><span style={{ color: '#16a34a', fontWeight: '700' }}>{s.confidence}</span></td>
                          <td><span className="badge badge-pending">Ready to map</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
