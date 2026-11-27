import { useState } from 'react'
import { parseResumeApi } from '../../api'
import ExtractedPreview from './ExtractedPreview'

export default function ResumeUpload({ onImportExtractedData }) {
  const [mode, setMode] = useState('upload') // 'upload' | 'paste'
  const [file, setFile] = useState(null)
  const [pasteText, setPasteText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [extractionResult, setExtractionResult] = useState(null)
  const [imported, setImported] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      triggerExtraction(selected)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0]
      setFile(dropped)
      triggerExtraction(dropped)
    }
  }

  const triggerExtraction = async (source) => {
    setAnalyzing(true)
    setExtractionResult(null)
    setImported(false)
    try {
      const result = await parseResumeApi(source)
      setExtractionResult(result)
    } catch {
      alert('Failed to analyze resume data.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleImport = (customResult) => {
    const toImport = customResult && customResult.extractedSkills ? customResult : extractionResult
    if (!toImport) return
    onImportExtractedData(toImport)
    setImported(true)
  }

  const loadSampleNaukriText = () => {
    const sample = `Ajmal Thaju - Senior Full Stack Engineer (Python, React, Cloud)
Summary: Experienced software engineer with deep proficiency in Python, Django, FastAPI, React.js, PostgreSQL, Docker, Kubernetes, AWS Cloud, Redis, Kafka, REST APIs, Microservices, CI/CD, Git, Linux. Domain experience in Financial Services, Core Banking, and Healthcare. Squad leadership, Agile Scrum Master rituals, and architectural design.`
    setPasteText(sample)
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>📄</span>
            <span>Resume Ingestion & AI Entity Extraction </span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setMode('upload')}
              className={`btn btn-sm ${mode === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
            >
              📁 File Upload
            </button>
            <button
              onClick={() => setMode('paste')}
              className={`btn btn-sm ${mode === 'paste' ? 'btn-primary' : 'btn-secondary'}`}
            >
              📝 Paste Profile Text
            </button>
          </div>
        </div>
        <div className="card-body">
          <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '16px', lineHeight: '1.5' }}>
            Upload an existing PDF or DOCX resume. The parser extracts your professional background, project history, individual contributions, and automatically maps skills to the organization's approved taxonomy.
          </p>

          {/* MODE 1: FILE UPLOAD */}
          {mode === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              style={{
                border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '32px 20px',
                textAlign: 'center', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.15s ease'
              }}
              onClick={() => document.getElementById('resume-file-input').click()}
            >
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <div style={{ fontSize: '38px', marginBottom: '6px' }}>☁️</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                {file ? file.name : 'Click to select or drag and drop your LinkedIn / Naukri resume'}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                Supports PDF, DOCX, DOC, TXT (Extracts 15–20+ skills & past projects)
              </div>
            </div>
          )}

          {/* MODE 2: PASTE TEXT DIRECTLY */}
          {mode === 'paste' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700' }}>Paste Resume / Profile Text:</label>
                <button type="button" onClick={loadSampleNaukriText} className="btn btn-secondary btn-sm" style={{ fontSize: '11px', padding: '3px 8px' }}>
                  Load Sample LinkedIn Profile
                </button>
              </div>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Paste your LinkedIn 'About', 'Experience', and 'Skills' section, or Naukri resume summary..."
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                style={{ fontSize: '13px', lineHeight: '1.4' }}
              />
              <button
                onClick={() => triggerExtraction(pasteText)}
                disabled={!pasteText.trim() || analyzing}
                className="btn btn-primary btn-sm"
                style={{ marginTop: '10px' }}
              >
                🔍 Extract Skills & Projects from Text
              </button>
            </div>
          )}

          {analyzing && (
            <div style={{ marginTop: '20px', textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb', marginBottom: '8px' }}>
                Parsing resume structure & mapping 15–20 skills to taxonomy...
              </div>
              <div className="progress-container" style={{ maxWidth: '360px', margin: '0 auto' }}>
                <div className="progress-bar-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
          )}

          <ExtractedPreview
            extractionResult={extractionResult}
            imported={imported}
            onImport={handleImport}
          />
        </div>
      </div>
    </div>
  )
}
