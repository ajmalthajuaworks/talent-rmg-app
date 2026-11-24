import { useState } from 'react'
import EvidenceActionModal from './EvidenceActionModal'

export default function ValidationStatus({ competencies, projects, onAddOrUpdateRating }) {
  const [activeFilter, setActiveFilter] = useState('ALL') // 'ALL' | 'APPROVED' | 'PENDING' | 'ACTION_REQUIRED'
  const [modalState, setModalState] = useState({ isOpen: false, comp: null, mode: 'resubmit' })

  const allCount = competencies.length
  const approvedCount = competencies.filter((c) => c.validation_status === 'APPROVED').length
  const pendingCount = competencies.filter((c) => c.validation_status === 'PENDING' || c.validation_status === 'DRAFT').length
  const actionRequiredCount = competencies.filter((c) => c.validation_status === 'REJECTED' || c.validation_status === 'REVISED').length

  const filtered = competencies.filter((c) => {
    const st = (c.validation_status || 'DRAFT').toUpperCase()
    if (activeFilter === 'APPROVED') return st === 'APPROVED'
    if (activeFilter === 'PENDING') return st === 'PENDING' || st === 'DRAFT'
    if (activeFilter === 'ACTION_REQUIRED') return st === 'REJECTED' || st === 'REVISED'
    return true
  })

  const openAction = (comp, mode) => {
    setModalState({ isOpen: true, comp, mode })
  }

  const renderRatingBadge = (rating) => {
    const map = {
      EXPERT: { bg: '#fdf4ff', color: '#c026d3' },
      ADVANCED: { bg: '#eff6ff', color: '#2563eb' },
      INTERMEDIATE: { bg: '#ecfdf5', color: '#059669' },
      BEGINNER: { bg: '#fff7ed', color: '#ea580c' },
      TRAINED: { bg: '#f1f5f9', color: '#475569' }
    }
    const s = map[rating] || { bg: '#f1f5f9', color: '#64748b' }
    return (
      <span style={{ background: s.bg, color: s.color, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
        {rating || 'INTERMEDIATE'}
      </span>
    )
  }

  const renderApprovedCol = (c) => {
    if (c.validation_status === 'APPROVED') return renderRatingBadge(c.approved_rating || c.self_assessed_rating)
    if (c.validation_status === 'REVISED') {
      return (
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
          {renderRatingBadge(c.approved_rating || 'BEGINNER')}
          <span style={{ fontSize: '9px', color: '#7c3aed', fontWeight: '700', marginTop: '2px' }}>REVISED</span>
        </div>
      )
    }
    if (c.validation_status === 'REJECTED') {
      return (
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', background: '#f8fafc', padding: '2px 6px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: '700' }}>{c.approved_rating || 'ADVANCED'}</span>
          <span style={{ fontSize: '8.5px', color: '#0284c7', fontWeight: '700' }}>→ REVISED</span>
        </div>
      )
    }
    return <span style={{ color: '#94a3b8', fontSize: '14px' }}>—</span>
  }

  const renderStatusBadge = (status) => {
    const st = (status || 'DRAFT').toUpperCase()
    const config = {
      APPROVED: { bg: '#dcfce7', color: '#16a34a' },
      REJECTED: { bg: '#fee2e2', color: '#dc2626' },
      REVISED: { bg: '#f3e8ff', color: '#7c3aed' },
      PENDING: { bg: '#fef9c3', color: '#ca8a04' }
    }[st] || { bg: '#f1f5f9', color: '#64748b' }
    return (
      <span style={{ background: config.bg, color: config.color, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
        {st}
      </span>
    )
  }

  return (
    <div>
      <div className="card" style={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {/* Header */}
        <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: '#dcfce7', color: '#16a34a', width: '22px', height: '22px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: '800' }}>✓</span>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Competency Validation Status</span>
          </div>
          <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '3px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '700' }}>ENG-O11</span>
        </div>

        {/* Filter Navigation Tabs */}
        <div style={{ display: 'flex', gap: '24px', padding: '0 24px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
          {[
            { key: 'ALL', label: `All (${allCount})` },
            { key: 'APPROVED', label: `Approved (${approvedCount})` },
            { key: 'PENDING', label: `Pending (${pendingCount})` },
            { key: 'ACTION_REQUIRED', label: `Action Required (${actionRequiredCount})` },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveFilter(t.key)}
              style={{
                padding: '14px 2px',
                background: 'none',
                border: 'none',
                borderBottom: activeFilter === t.key ? '2px solid #2563eb' : '2px solid transparent',
                marginBottom: '-1px',
                color: activeFilter === t.key ? '#2563eb' : '#64748b',
                fontWeight: activeFilter === t.key ? '700' : '500',
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="table-wrapper" style={{ padding: '6px 12px 16px' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 14px', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>SKILL</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>DIMENSION</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>SELF-ASSESSED</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>APPROVED</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>STATUS</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>MANAGER FEEDBACK</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', color: '#64748b', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const isRejected = c.validation_status === 'REJECTED'
                const isRevised = c.validation_status === 'REVISED'
                const isDomain = (c.skill?.dimension || c.dimension) === 'DOMAIN'
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontWeight: '800', fontSize: '13.5px', color: '#0f172a' }}>
                      {c.skill?.name || c.skill_name}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ background: isDomain ? '#fdf4ff' : '#f0f9ff', color: isDomain ? '#c026d3' : '#0284c7', padding: '3px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: '700' }}>
                        {c.skill?.dimension || c.dimension || 'TECHNICAL'}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>{renderRatingBadge(c.self_assessed_rating)}</td>
                    <td style={{ padding: '14px' }}>{renderApprovedCol(c)}</td>
                    <td style={{ padding: '14px' }}>{renderStatusBadge(c.validation_status)}</td>
                    <td style={{ padding: '14px', fontSize: '12.5px', maxWidth: '300px' }}>
                      {isRejected ? (
                        <span style={{ color: '#dc2626', lineHeight: '1.4', display: 'block' }}>"{c.manager_feedback}"</span>
                      ) : isRevised ? (
                        <span style={{ color: '#7c3aed', lineHeight: '1.4', display: 'block' }}>"{c.manager_feedback}"</span>
                      ) : (
                        <span style={{ color: '#64748b' }}>{c.manager_feedback || (c.validation_status === 'PENDING' ? 'Submitted for review.' : 'Verified against projects.')}</span>
                      )}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      {isRejected && (
                        <button type="button" onClick={() => openAction(c, 'resubmit')} className="btn btn-secondary btn-sm" style={{ fontWeight: '700', border: '1px solid #cbd5e1', color: '#0f172a' }}>
                          Resubmit
                        </button>
                      )}
                      {isRevised && (
                        <button type="button" onClick={() => openAction(c, 'evidence')} className="btn btn-secondary btn-sm" style={{ fontWeight: '700', border: '1px solid #cbd5e1', color: '#0f172a' }}>
                          + Add Evidence
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <EvidenceActionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, comp: null, mode: 'resubmit' })}
        comp={modalState.comp}
        mode={modalState.mode}
        projects={projects}
        onSubmit={onAddOrUpdateRating}
      />
    </div>
  )
}
