export default function TopNavbar({
  currentTab,
  department,
  onOpenRoadmap,
  onLogout
}) {
  const getTabHeading = () => {
    switch (currentTab) {
      case 'overview':
        return 'Engineer Profile & Readiness Overview'
      case 'resume-upload':
        return 'Resume Ingestion & Parsing '
      case 'projects':
        return 'Project Experience Portfolio '
      case 'skills':
        return 'Competency Ratings & Evidence Mapping'
      case 'resume':
        return 'Customer-Facing Resume Preview '
      default:
        return 'Talent Portal'
    }
  }

  return (
    <header className="top-navbar no-print">
      <h1>{getTabHeading()}</h1>
      <div className="navbar-actions">
        <button
          onClick={onOpenRoadmap}
          className="btn btn-secondary btn-sm btn-pill"
          style={{ fontWeight: '700', color: '#2563eb' }}
        >
          📅 4-Week Plan: Week 1 Active
        </button>
        <span className="badge badge-rating">{department || 'Engineering'}</span>
        <button onClick={onLogout} className="btn btn-secondary btn-sm">
          Log Out
        </button>
      </div>
    </header>
  )
}
