export default function Sidebar({
  currentTab,
  setCurrentTab,
  profile,
  user,
  projectsCount,
  competenciesCount,
  actionRequiredCount = 2,
  pendingCount = 0,
  onLogout
}) {
  const avatarLetter = (profile?.user?.first_name || user?.username || 'A')[0].toUpperCase()
  const displayName = `${profile?.user?.first_name || ''} ${profile?.user?.last_name || user?.username || ''}`.trim()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-badge">T</div>
        <div className="brand-text">
          <h2>TalentRMG</h2>
          <span>Engineer Portal</span>
        </div>
      </div>

      <div className="nav-section-title">My Profile</div>
      <button className={`nav-item ${currentTab === 'overview' ? 'active' : ''}`} onClick={() => setCurrentTab('overview')}>
        <span>🏠</span> Dashboard
      </button>

      <button className={`nav-item ${currentTab === 'profile-setup' ? 'active' : ''}`} onClick={() => setCurrentTab('profile-setup')}>
        <span>👤</span> Profile Setup
      </button>

      <button className={`nav-item ${currentTab === 'projects' ? 'active' : ''}`} onClick={() => setCurrentTab('projects')}>
        <span>💼</span> Project Experience
      </button>

      <div className="nav-section-title">Competencies</div>
      <button className={`nav-item ${currentTab === 'skills-technical' || currentTab === 'skills' ? 'active' : ''}`} onClick={() => setCurrentTab('skills-technical')}>
        <span>⚙️</span> Manage Skills
      </button>

      <button className={`nav-item ${currentTab === 'resume-upload' ? 'active' : ''}`} onClick={() => setCurrentTab('resume-upload')}>
        <span>🤖</span> AI Recommendations
        <span className="nav-badge" style={{ background: '#ea580c', color: '#fff', borderRadius: '50%', minWidth: '18px', height: '18px', display: 'grid', placeItems: 'center', padding: '0 4px', fontSize: '11px', fontWeight: '800' }}>3</span>
      </button>

      <button className={`nav-item ${currentTab === 'validation-status' ? 'active' : ''}`} onClick={() => setCurrentTab('validation-status')}>
        <span>✅</span> Validation Status
        <span className="nav-badge" style={{ background: '#ea580c', color: '#fff', borderRadius: '50%', minWidth: '18px', height: '18px', display: 'grid', placeItems: 'center', padding: '0 4px', fontSize: '11px', fontWeight: '800' }}>
          {pendingCount}
        </span>
      </button>

      <div className="nav-section-title">Growth</div>
      <button className={`nav-item ${currentTab === 'gap-analysis' ? 'active' : ''}`} onClick={() => setCurrentTab('gap-analysis')}>
        <span>📊</span> Gap Analysis
      </button>

      <button className={`nav-item ${currentTab === 'certifications' ? 'active' : ''}`} onClick={() => setCurrentTab('certifications')}>
        <span>🎓</span> Certifications
      </button>

      <div className="nav-section-title">Export</div>
      <button className={`nav-item ${currentTab === 'resume' ? 'active' : ''}`} onClick={() => setCurrentTab('resume')}>
        <span>📄</span> Generate Resume
      </button>

      {/* Sidebar Footer */}
      <div className="sidebar-user">
        <div className="user-avatar">{avatarLetter}</div>
        <div className="user-details">
          <div className="user-name">{displayName?.toUpperCase()}</div>
          <div className="user-role">
            {profile?.employee_id} · {profile?.designation}
          </div>
        </div>
        <button onClick={onLogout} className="btn btn-secondary btn-sm" style={{ padding: '6px 8px' }} title="Sign out">
          🚪
        </button>
      </div>
    </aside>
  )
}
