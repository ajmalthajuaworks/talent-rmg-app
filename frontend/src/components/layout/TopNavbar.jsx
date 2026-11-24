export default function TopNavbar({
  currentTab,
  department,
  needsProjectUpdate,
  onNavigate,
  onOpenRoadmap,
  onLogout
}) {
  const getTabHeading = () => {
    switch (currentTab) {
      case 'overview':
        return 'Dashboard'
      case 'validation-status':
        return 'Validation Status'
      case 'profile-setup':
        return 'Profile Setup'
      case 'resume-upload':
        return 'AI Recommendations & Resume Parsing'
      case 'projects':
        return 'Project Experience'
      case 'skills':
      case 'skills-technical':
        return 'Technical Competency Ratings'
      case 'skills-domain':
        return 'Domain Competency Ratings'
      case 'skills-functional':
        return 'Functional Role Ratings'
      case 'gap-analysis':
        return 'Competency Gap Analysis'
      case 'certifications':
        return 'Professional Certifications'
      case 'resume':
        return 'Customer-Facing Resume'
      default:
        return 'Validation Status'
    }
  }

  return (
    <header className="top-navbar no-print">
      <h1>{getTabHeading()}</h1>
      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '99px', fontSize: '12.5px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🔔</span> Profile update due in <strong style={{ fontWeight: '800' }}>12 days</strong>
        </span>
        <button
          onClick={() => onNavigate && onNavigate('profile-setup')}
          className="btn btn-primary btn-sm"
          style={{ fontWeight: '700' }}
        >
          + Update Profile
        </button>
        <button onClick={onLogout} className="btn btn-secondary btn-sm" title="Log Out">
          Sign Out
        </button>
      </div>
    </header>
  )
}
