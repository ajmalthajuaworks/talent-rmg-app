import { useState, useMemo } from 'react'
import { DEFAULT_SKILL_TAXONOMY, parseSkillsFromText } from '../../data/initialData'
import { parseResumeApi } from '../../api'

export default function BulkSkillModal({ isOpen, onClose, onSubmit, projects }) {
  const [tab, setTab] = useState('taxonomy')
  const [selectedIds, setSelectedIds] = useState([])
  const [pastedText, setPastedText] = useState('')
  const [defaultRating, setDefaultRating] = useState('INTERMEDIATE')
  const [selectedEvidence, setSelectedEvidence] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [excludedNames, setExcludedNames] = useState([])
  const [aiExtractedSkills, setAiExtractedSkills] = useState(null)

  const rawMatched = useMemo(() => {
    if (aiExtractedSkills) return aiExtractedSkills
    return !pastedText.trim() ? [] : parseSkillsFromText(pastedText)
  }, [pastedText, aiExtractedSkills])

  const matched = useMemo(() => {
    return rawMatched.filter((m) => !excludedNames.includes(m.name.toLowerCase()))
  }, [rawMatched, excludedNames])

  if (!isOpen) return null

  const handleAiExtract = async () => {
    if (!pastedText.trim()) return
    setAiLoading(true)
    try {
      const res = await parseResumeApi(pastedText)
      if (res && res.extractedSkills && res.extractedSkills.length > 0) {
        setAiExtractedSkills(res.extractedSkills)
        setExcludedNames([])
      }
    } catch {
      alert('AI extraction failed, fell back to local keyword parser.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleTextChange = (e) => {
    setPastedText(e.target.value)
    setAiExtractedSkills(null)
    setExcludedNames([])
  }

  const removeMatchedSkill = (name) => {
    setExcludedNames((prev) => [...prev, name.toLowerCase()])
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const selectAllInDim = (dim) => {
    const ids = DEFAULT_SKILL_TAXONOMY.filter((s) => s.dimension === dim).map((s) => s.id)
    const all = ids.every((id) => selectedIds.includes(id))
    setSelectedIds((prev) => (all ? prev.filter((id) => !ids.includes(id)) : Array.from(new Set([...prev, ...ids]))))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const target = tab === 'taxonomy'
      ? DEFAULT_SKILL_TAXONOMY.filter((s) => selectedIds.includes(s.id))
      : matched.map((m) => DEFAULT_SKILL_TAXONOMY.find((t) => t.skill_code === m.code) || { id: Date.now() + Math.random(), name: m.name, skill_code: m.code, dimension: m.dimension })

    if (target.length === 0) return alert('Please select or paste at least one skill.')

    const payload = target.map((s, idx) => ({
      id: Date.now() + idx, skill: s, skill_id: s.id, self_assessed_rating: defaultRating,
      approved_rating: null, validation_status: 'PENDING', manager_feedback: '',
      project_evidence: selectedEvidence.map((id) => projects.find((p) => p.id === id)).filter(Boolean)
    }))
    onSubmit(payload)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800' }}>⚡ Batch Add Skills (LinkedIn / Naukri Mode)</h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>Add 10–20+ skills at once from taxonomy or paste from resume.</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button type="button" onClick={() => setTab('taxonomy')} className={`btn btn-sm ${tab === 'taxonomy' ? 'btn-primary' : 'btn-secondary'}`}>
                📋 Pick from Taxonomy Checklist
              </button>
              <button type="button" onClick={() => setTab('paste')} className={`btn btn-sm ${tab === 'paste' ? 'btn-primary' : 'btn-secondary'}`}>
                📝 Paste from LinkedIn / Naukri Text
              </button>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '12px', fontWeight: '700' }}>Proficiency Rating Level for Batch</label>
                <select className="form-control" value={defaultRating} onChange={(e) => setDefaultRating(e.target.value)}>
                  <option value="TRAINED">Trained</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate (Standard)</option>
                  <option value="ADVANCED">Advanced (Designs solutions)</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
              {projects.length > 0 && (
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Link Project Evidence (Optional)</label>
                  <select className="form-control" onChange={(e) => {
                    const v = parseInt(e.target.value)
                    if (v && !selectedEvidence.includes(v)) setSelectedEvidence([...selectedEvidence, v])
                  }}>
                    <option value="">-- Choose project --</option>
                    {projects.map((p) => <option key={p.id} value={p.id}>{p.project_name}</option>)}
                  </select>
                </div>
              )}
            </div>

            {tab === 'taxonomy' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Click to select ({selectedIds.length} selected):</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" onClick={() => selectAllInDim('TECHNICAL')} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }}>+ All Tech</button>
                    <button type="button" onClick={() => selectAllInDim('DOMAIN')} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }}>+ All Domain</button>
                    <button type="button" onClick={() => selectAllInDim('FUNCTIONAL')} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }}>+ All Roles</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '240px', overflowY: 'auto', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                  {DEFAULT_SKILL_TAXONOMY.map((s) => {
                    const sel = selectedIds.includes(s.id)
                    return (
                      <span key={s.id} onClick={() => toggleSelect(s.id)} style={{
                        cursor: 'pointer', padding: '5px 10px', borderRadius: '6px', fontSize: '12.5px',
                        fontWeight: sel ? '700' : '500', background: sel ? '#2563eb' : '#fff', color: sel ? '#fff' : '#334155',
                        border: sel ? '1px solid #2563eb' : '1px solid #cbd5e1'
                      }}>
                        {sel ? '✓ ' : '+ '}{s.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Paste Skills / Summary Text:</label>
                  <button type="button" onClick={handleAiExtract} disabled={!pastedText.trim() || aiLoading} className="btn btn-secondary btn-sm" style={{ fontSize: '11px', padding: '3px 8px', color: '#2563eb' }}>
                    {aiLoading ? '⏳ AI Analyzing...' : '✨ Deep AI Extract (Gemini)'}
                  </button>
                </div>
                <textarea className="form-control" rows={4} placeholder="e.g.: Python, Django, React, Docker, Kubernetes, AWS, PostgreSQL, Redis, REST APIs, Microservices, CI/CD, Git..." value={pastedText} onChange={handleTextChange} />
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: matched.length > 0 ? '#16a34a' : '#64748b' }}>
                    {matched.length > 0 ? `✅ Extracted ${matched.length} exact skills:` : 'Paste text to recognize exact skills automatically'}
                  </div>
                  {matched.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {matched.map((m, i) => (
                        <span key={i} className="badge-tag" style={{ background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span>✓ {m.name}</span>
                          {m.isCustom && <span style={{ fontSize: '10px', opacity: 0.8 }}>(custom)</span>}
                          <button type="button" onClick={() => removeMatchedSkill(m.name)} style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontWeight: '800', marginLeft: '2px', fontSize: '12px' }}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{tab === 'taxonomy' ? `${selectedIds.length} skills selected` : `${matched.length} skills recognized`}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Add {tab === 'taxonomy' ? selectedIds.length : matched.length} Skills →</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
