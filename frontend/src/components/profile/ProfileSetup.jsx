import { useState, useEffect } from 'react'
import ManualEntryForm from './ManualEntryForm'
import EmploymentHistoryCard from './EmploymentHistoryCard'

export default function ProfileSetup({ profile, onSaveProfile, onNavigate }) {
  const [subTab, setSubTab] = useState('personal')
  const [savedMsg, setSavedMsg] = useState('')
  const [employments, setEmployments] = useState([
    {
      id: 1,
      company: 'Accenture Solutions Pvt. Ltd.',
      role: 'Application Development Senior Analyst',
      startDate: '2019-07-15',
      endDate: ''
    }
  ])

  useEffect(() => {
    if (profile?.designation || profile?.department) {
      setEmployments([
        {
          id: 1,
          company: profile.department || 'Accenture Solutions Pvt. Ltd.',
          role: profile.designation || 'Application Development Senior Analyst',
          startDate: '2019-07-15',
          endDate: ''
        }
      ])
    }
  }, [profile])

  const handleEmploymentChange = (index, field, value) => {
    setEmployments((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleAddAnother = () => {
    setEmployments((prev) => [
      ...prev,
      { id: Date.now(), company: '', role: '', startDate: '', endDate: '' }
    ])
  }

  const handleSaveEmployment = (e) => {
    e.preventDefault()
    const primary = employments[0]
    onSaveProfile({
      ...profile,
      designation: primary?.role || profile.designation,
      department: primary?.company || profile.department
    })
    setSavedMsg('Employment history saved successfully!')
    setTimeout(() => setSavedMsg(''), 4000)
  }

  const handleSaveManual = (form) => {
    onSaveProfile({
      ...profile,
      ...form,
      user: {
        ...profile?.user,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email
      }
    })
    setSavedMsg('Personal details saved successfully!')
    setTimeout(() => setSavedMsg(''), 4000)
  }

  const tabStyle = (tabKey) => ({
    padding: '12px 4px', background: 'none', border: 'none',
    borderBottom: subTab === tabKey ? '2.5px solid #2563eb' : '2.5px solid transparent',
    marginBottom: '-1px', color: subTab === tabKey ? '#2563eb' : '#64748b',
    fontWeight: subTab === tabKey ? '700' : '600', fontSize: '13.5px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '6px'
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', background: '#f8fafc', padding: '0 8px' }}>
        <button
          type="button"
          onClick={() => { setSubTab('upload'); if (onNavigate) onNavigate('resume-upload') }}
          style={tabStyle('upload')}
        >
          <span>📤</span> Upload Resume
        </button>

        <button
          type="button"
          onClick={() => setSubTab('manual')}
          style={tabStyle('manual')}
        >
          <span>📝</span> Manual Entry
        </button>

        <button
          type="button"
          onClick={() => setSubTab('personal')}
          style={tabStyle('personal')}
        >
          <span>👤</span> Personal Info
        </button>
      </div>

      {savedMsg && (
        <div className="alert alert-success" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✅</span> <strong>{savedMsg}</strong>
        </div>
      )}

      {subTab === 'personal' && (
        <EmploymentHistoryCard
          employments={employments}
          onChange={handleEmploymentChange}
          onAdd={handleAddAnother}
          onSave={handleSaveEmployment}
        />
      )}

      {subTab === 'manual' && <ManualEntryForm profile={profile} onSave={handleSaveManual} />}
    </div>
  )
}
