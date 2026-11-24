import { useState, useEffect } from 'react'
import Auth from './components/auth/Auth'
import Sidebar from './components/layout/Sidebar'
import TopNavbar from './components/layout/TopNavbar'
import ProfileOverview from './components/profile/ProfileOverview'
import ProfileSetup from './components/profile/ProfileSetup'
import ResumeUpload from './components/resume/ResumeUpload'
import ProjectsManager from './components/projects/ProjectsManager'
import SkillsManager from './components/skills/SkillsManager'
import ValidationStatus from './components/skills/ValidationStatus'
import ResumePreview from './components/resume/ResumePreview'
import RoadmapModal from './components/layout/RoadmapModal'
import { mapExtractedCompetencies, INITIAL_DEMO_COMPETENCIES } from './data/initialData'
import {
  getProjectsApi, addProjectApi, updateProjectApi, deleteProjectApi,
  getCompetenciesApi, submitCompetencyRatingApi, deleteCompetencyRatingApi, logoutApi, updateProfileApi
} from './api'

export default function App() {
  const [user, setUser] = useState(null)
  const [currentTab, setCurrentTab] = useState('validation-status')
  const [roadmapOpen, setRoadmapOpen] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [projects, setProjects] = useState([])
  const [competencies, setCompetencies] = useState(INITIAL_DEMO_COMPETENCIES)
  const [profile, setProfile] = useState({
    employee_id: '', designation: '', department: '', phone: '', location: '', summary: '',
    years_of_experience: '', linkedin_url: '', user: { first_name: '', last_name: '', username: '', email: '' }
  })

  useEffect(() => {
    localStorage.removeItem('talent_rmg_user')
    sessionStorage.removeItem('talent_rmg_user')
  }, [])

  const loadUserData = (u) => {
    const empId = u?.profile?.id || u?.user_id
    if (!empId) return
    getProjectsApi(empId).then((d) => { const l = Array.isArray(d) ? d : d?.results; if (l?.length) setProjects(l) }).catch(() => {})
    getCompetenciesApi(empId).then((d) => { const l = Array.isArray(d) ? d : d?.results; if (l?.length) setCompetencies(l) }).catch(() => {})
  }

  const notify = (msg) => { setFeedbackMsg(msg); setTimeout(() => setFeedbackMsg(''), 4500) }

  const handleAuthSuccess = (d) => {
    setUser(d)
    if (d.profile) setProfile(d.profile)
    loadUserData(d)
    notify(`Welcome, ${d.profile?.user?.first_name || d.username}!`)
  }

  const handleLogout = async () => {
    try { await logoutApi() } catch {}
    setUser(null)
    setProfile({ employee_id: '', designation: '', department: '', user: { first_name: '', last_name: '', username: '', email: '' } })
    setProjects([])
    setCompetencies([])
    localStorage.clear()
    sessionStorage.clear()
  }

  const handleSaveProfile = async (updated) => {
    const payload = {
      employee_id: updated.employee_id, user_id: user?.user_id || user?.id,
      first_name: updated.user?.first_name, last_name: updated.user?.last_name,
      email: updated.user?.email, designation: updated.designation, department: updated.department,
      phone: updated.phone, location: updated.location, summary: updated.summary,
      years_of_experience: updated.years_of_experience, linkedin_url: updated.linkedin_url
    }
    try {
      const res = await updateProfileApi(payload)
      const p = res?.profile || updated
      setProfile(p)
      if (user) setUser((prev) => ({ ...prev, profile: p }))
    } catch {
      setProfile(updated)
      if (user) setUser((prev) => ({ ...prev, profile: updated }))
    }
    notify('Profile details saved successfully.')
  }

  const handleAddProject = async (p) => {
    try {
      const created = await addProjectApi({ ...p, employee: profile?.id || user?.profile?.id })
      setProjects([created, ...projects])
    } catch { setProjects([{ ...p, id: Date.now() }, ...projects]) }
    notify(`Project "${p.project_name}" added.`)
  }

  const handleUpdateProject = async (id, fields) => {
    try {
      const updated = await updateProjectApi(id, fields)
      setProjects(projects.map((p) => (p.id === id ? { ...p, ...updated } : p)))
    } catch { setProjects(projects.map((p) => (p.id === id ? { ...p, ...fields } : p))) }
    notify('Project details updated.')
  }

  const handleDeleteProject = async (id) => {
    try { await deleteProjectApi(id) } catch {}
    setProjects(projects.filter((p) => p.id !== id))
    notify('Project removed.')
  }

  const handleAddOrUpdateRating = async (c) => {
    const empId = profile?.id || user?.profile?.id
    const idx = competencies.findIndex((x) => (x.skill?.id || x.skill_id) === c.skill_id)
    try {
      const saved = await submitCompetencyRatingApi({ employee: empId, skill: c.skill_id, self_assessed_rating: c.self_assessed_rating, validation_status: 'PENDING' })
      const merged = { ...c, ...saved, skill: saved.skill || c.skill }
      const list = [...competencies]
      if (idx >= 0) list[idx] = merged
      else list.unshift(merged)
      setCompetencies(list)
    } catch {
      const list = [...competencies]
      if (idx >= 0) list[idx] = { ...list[idx], ...c }
      else list.unshift(c)
      setCompetencies(list)
    }
    notify(`Rating for ${c.skill.name} submitted for manager review.`)
  }

  const handleBulkAddRatings = async (newRatingsList) => {
    const empId = profile?.id || user?.profile?.id
    const updated = [...competencies]
    for (const item of newRatingsList) {
      const idx = updated.findIndex((x) => (x.skill?.id || x.skill_id) === item.skill_id)
      if (idx >= 0) updated[idx] = { ...updated[idx], ...item }
      else updated.unshift(item)
    }
    setCompetencies(updated)
    notify(`Batch added ${newRatingsList.length} skills!`)
    for (const item of newRatingsList) {
      try {
        await submitCompetencyRatingApi({ employee: empId, skill: item.skill_id, self_assessed_rating: item.self_assessed_rating, validation_status: 'PENDING' })
      } catch {}
    }
  }

  const handleDeleteRating = async (id) => {
    try { await deleteCompetencyRatingApi(id) } catch {}
    setCompetencies(competencies.filter((c) => c.id !== id))
    notify('Rating removed.')
  }

  const handleImportExtractedData = async (extracted) => {
    const empId = profile?.id || user?.profile?.id
    const newProjs = extracted.extractedProjects.map((p, i) => ({ ...p, id: Date.now() + i, employee: empId }))
    const newComps = mapExtractedCompetencies(extracted.extractedSkills, newProjs)
    setProjects([...newProjs, ...projects])
    setCompetencies([...newComps, ...competencies])
    setCurrentTab('projects')
    notify(`Imported ${newProjs.length} projects and ${newComps.length} skills!`)
    for (const p of newProjs) { try { await addProjectApi(p) } catch {} }
    for (const c of newComps) { try { await submitCompetencyRatingApi({ employee: empId, skill: c.skill_id, self_assessed_rating: c.self_assessed_rating, validation_status: 'PENDING' }) } catch {} }
  }

  if (!user) return <Auth onAuthSuccess={handleAuthSuccess} />
  const actionRequiredCount = competencies.filter(c => c.validation_status === 'REJECTED' || c.validation_status === 'REVISED').length
  const pendingCount = competencies.filter(c => (c.validation_status || 'DRAFT').toUpperCase() === 'PENDING' || (c.validation_status || '').toUpperCase() === 'DRAFT').length

  return (
    <div className="app-container">
      <Sidebar
        currentTab={currentTab} setCurrentTab={setCurrentTab} profile={profile} user={user}
        projectsCount={projects.length} competenciesCount={competencies.length} actionRequiredCount={actionRequiredCount} pendingCount={pendingCount} onLogout={handleLogout}
      />
      <main className="main-content">
        <TopNavbar currentTab={currentTab} department={profile.department} needsProjectUpdate={profile?.needs_project_update} onNavigate={setCurrentTab} onOpenRoadmap={() => setRoadmapOpen(true)} onLogout={handleLogout} />
        <div className="scroll-body">
          {feedbackMsg && <div className="alert alert-success"><span>✅</span><span>{feedbackMsg}</span></div>}
          {currentTab === 'validation-status' && <ValidationStatus competencies={competencies} projects={projects} onAddOrUpdateRating={handleAddOrUpdateRating} onNavigate={setCurrentTab} />}
          {currentTab === 'overview' && <ProfileOverview profile={profile} projects={projects} competencies={competencies} onSaveProfile={handleSaveProfile} onNavigate={setCurrentTab} />}
          {currentTab === 'profile-setup' && <ProfileSetup profile={profile} onSaveProfile={handleSaveProfile} onNavigate={setCurrentTab} />}
          {currentTab === 'resume-upload' && <ResumeUpload onImportExtractedData={handleImportExtractedData} />}
          {currentTab === 'projects' && <ProjectsManager projects={projects} onAddProject={handleAddProject} onUpdateProject={handleUpdateProject} onDeleteProject={handleDeleteProject} />}
          {(currentTab === 'skills' || currentTab.startsWith('skills-')) && (
            <SkillsManager
              competencies={competencies} projects={projects}
              initialDimension={currentTab === 'skills-domain' ? 'DOMAIN' : currentTab === 'skills-functional' ? 'FUNCTIONAL' : 'TECHNICAL'}
              onAddOrUpdateRating={handleAddOrUpdateRating} onBulkAddRatings={handleBulkAddRatings} onDeleteRating={handleDeleteRating}
            />
          )}
          {currentTab === 'resume' && <ResumePreview profile={profile} projects={projects} competencies={competencies} />}
          {(currentTab === 'gap-analysis' || currentTab === 'certifications') && (
            <div className="card" style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>{currentTab === 'gap-analysis' ? '📊' : '🎓'}</div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{currentTab === 'gap-analysis' ? 'Competency Gap Analysis' : 'Professional Certifications'}</h3>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Benchmark verified competencies against client requirements.</p>
            </div>
          )}
        </div>
      </main>
      <RoadmapModal isOpen={roadmapOpen} onClose={() => setRoadmapOpen(false)} />
    </div>
  )
}
