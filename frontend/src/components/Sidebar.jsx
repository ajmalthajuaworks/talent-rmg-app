export default function Sidebar({
  currentTab,
  setCurrentTab,
  profile,
  user,
  projectsCount,
  competenciesCount,
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
      <button
        className={`nav-item ${currentTab === 'overview' ? 'active' : ''}`}
        onClick={() => setCurrentTab('overview')}
      >
        <span>🏠</span> Overview
      </button>

      <button
        className={`nav-item ${currentTab === 'resume-upload' ? 'active' : ''}`}
        onClick={() => setCurrentTab('resume-upload')}
      >
        <span>📄</span> Upload Resume
        <span className="nav-badge" style={{ background: '#2563eb' }}>AI</span>
      </button>

      <button
        className={`nav-item ${currentTab === 'projects' ? 'active' : ''}`}
        onClick={() => setCurrentTab('projects')}
      >
        <span>💼</span> Projects Portfolio
        <span className="nav-badge">{projectsCount}</span>
      </button>

      <div className="nav-section-title">Competencies</div>
      <button
        className={`nav-item ${currentTab === 'skills' ? 'active' : ''}`}
        onClick={() => setCurrentTab('skills')}
      >
        <span>⚙️</span> Skills & Ratings
        <span className="nav-badge">{competenciesCount}</span>
      </button>

      <div className="nav-section-title">Submissions</div>
      <button
        className={`nav-item ${currentTab === 'resume' ? 'active' : ''}`}
        onClick={() => setCurrentTab('resume')}
      >
        <span>📋</span> Customer Resume
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
        <button
          onClick={onLogout}
          className="btn btn-secondary btn-sm"
          style={{ padding: '6px 8px' }}
          title="Sign out"
        >
          🚪
        </button>
      </div>
    </aside>
  )
}
