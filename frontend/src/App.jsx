import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import Sidebar from './components/Sidebar'
import TopNavbar from './components/TopNavbar'
import ProfileOverview from './components/ProfileOverview'
import ResumeUpload from './components/ResumeUpload'
import ProjectsManager from './components/ProjectsManager'
import SkillsManager from './components/SkillsManager'
import ResumePreview from './components/ResumePreview'
import RoadmapModal from './components/RoadmapModal'
import { mapExtractedCompetencies } from './data/initialData'
import {
  getProjectsApi, addProjectApi, updateProjectApi, deleteProjectApi,
  getCompetenciesApi, submitCompetencyRatingApi, deleteCompetencyRatingApi,
  logoutApi, updateProfileApi
} from './api'

export default function App() {
  const [user, setUser] = useState(null)
  const [currentTab, setCurrentTab] = useState('overview')
  const [roadmapOpen, setRoadmapOpen] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [projects, setProjects] = useState([])
  const [competencies, setCompetencies] = useState([])
  const [profile, setProfile] = useState({
    employee_id: '', designation: '', department: '',
    user: { first_name: '', last_name: '', username: '', email: '' }
  })

  useEffect(() => {
    localStorage.removeItem('talent_rmg_user')
    sessionStorage.removeItem('talent_rmg_user')
  }, [])

  const loadUserData = (u) => {
    const empId = u?.profile?.id || u?.user_id
    if (!empId) return
    getProjectsApi(empId).then((d) => {
      const list = Array.isArray(d) ? d : d?.results
      if (Array.isArray(list) && list.length > 0) setProjects(list)
    }).catch(() => {})

    getCompetenciesApi(empId).then((d) => {
      const list = Array.isArray(d) ? d : d?.results
      if (Array.isArray(list) && list.length > 0) setCompetencies(list)
    }).catch(() => {})
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
    setProfile({
      employee_id: '', designation: '', department: '',
      user: { first_name: '', last_name: '', username: '', email: '' }
    })
    setProjects([])
    setCompetencies([])
    localStorage.clear()
    sessionStorage.clear()
  }

  const handleSaveProfile = async (updated) => {
    const payload = {
      employee_id: updated.employee_id, user_id: user?.user_id || user?.id,
      first_name: updated.user?.first_name, last_name: updated.user?.last_name,
      email: updated.user?.email, designation: updated.designation, department: updated.department
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
    const empId = profile?.id || user?.profile?.id
    try {
      const created = await addProjectApi({ ...p, employee: empId })
      setProjects([created, ...projects])
    } catch {
      setProjects([{ ...p, id: Date.now() }, ...projects])
    }
    notify(`Project "${p.project_name}" added.`)
  }

  const handleUpdateProject = async (id, fields) => {
    try {
      const updated = await updateProjectApi(id, fields)
      setProjects(projects.map((p) => (p.id === id ? { ...p, ...updated } : p)))
    } catch {
      setProjects(projects.map((p) => (p.id === id ? { ...p, ...fields } : p)))
    }
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
      const saved = await submitCompetencyRatingApi({
        employee: empId,
        skill: c.skill_id,
        self_assessed_rating: c.self_assessed_rating,
        validation_status: 'PENDING'
      })
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

  const handleDeleteRating = async (id) => {
    try { await deleteCompetencyRatingApi(id) } catch {}
    setCompetencies(competencies.filter((c) => c.id !== id))
    notify('Rating removed.')
  }

  const handleImportExtractedData = (extracted) => {
    const newProjs = extracted.extractedProjects.map((p, i) => ({ ...p, id: Date.now() + i }))
    const newComps = mapExtractedCompetencies(extracted.extractedSkills, newProjs)
    setProjects([...newProjs, ...projects])
    setCompetencies([...newComps, ...competencies])
    setCurrentTab('projects')
    notify(`Imported ${newProjs.length} projects and ${newComps.length} skills!`)
  }

  if (!user) return <Auth onAuthSuccess={handleAuthSuccess} />

  return (
    <div className="app-container">
      <Sidebar
        currentTab={currentTab} setCurrentTab={setCurrentTab}
        profile={profile} user={user}
        projectsCount={projects.length} competenciesCount={competencies.length}
        onLogout={handleLogout}
      />
      <main className="main-content">
        <TopNavbar
          currentTab={currentTab} department={profile.department}
          onOpenRoadmap={() => setRoadmapOpen(true)} onLogout={handleLogout}
        />
        <div className="scroll-body">
          {feedbackMsg && <div className="alert alert-success"><span>✅</span><span>{feedbackMsg}</span></div>}
          {currentTab === 'overview' && (
            <ProfileOverview profile={profile} projects={projects} competencies={competencies} onSaveProfile={handleSaveProfile} onNavigate={setCurrentTab} />
          )}
          {currentTab === 'resume-upload' && <ResumeUpload onImportExtractedData={handleImportExtractedData} />}
          {currentTab === 'projects' && (
            <ProjectsManager projects={projects} onAddProject={handleAddProject} onUpdateProject={handleUpdateProject} onDeleteProject={handleDeleteProject} />
          )}
          {currentTab === 'skills' && (
            <SkillsManager competencies={competencies} projects={projects} onAddOrUpdateRating={handleAddOrUpdateRating} onDeleteRating={handleDeleteRating} />
          )}
          {currentTab === 'resume' && <ResumePreview profile={profile} projects={projects} competencies={competencies} />}
        </div>
      </main>
      <RoadmapModal isOpen={roadmapOpen} onClose={() => setRoadmapOpen(false)} />
    </div>
  )
}
