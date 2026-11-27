// api.js — Central API service for TalentRMG React Frontend
import { simulateResumeExtraction } from './data/initialData'

async function request(endpoint, options = {}) {
  const isForm = options.body instanceof FormData
  const defaultHeaders = isForm ? { 'Accept': 'application/json' } : {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }

  const config = {
    credentials: 'include',
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  let res = null
  try {
    res = await fetch(`/api/talent${endpoint}`, config)
  } catch {
    res = null
  }

  if (!res || res.status === 404) {
    try {
      const directRes = await fetch(`http://127.0.0.1:8000/api/talent${endpoint}`, config)
      if (directRes && directRes.status !== 404) res = directRes
    } catch {}
  }

  if (!res) throw new Error('Backend server is not reachable.')
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error || errData.detail || `Request failed (${res.status})`)
  }
  return await res.json()
}

// ── Auth APIs ────────────────────────────────────────────────────────────────
export async function loginApi(username, password) {
  return request('/login/', { method: 'POST', body: JSON.stringify({ username, password }) })
}

export async function signupApi(formData) {
  return request('/signup/', { method: 'POST', body: JSON.stringify(formData) })
}

export async function logoutApi() {
  return request('/logout/', { method: 'POST' }).catch(() => ({}))
}

export async function getMeApi() {
  return request('/me/')
}

// ── Profile APIs ─────────────────────────────────────────────────────────────
export async function updateProfileApi(data) {
  return request('/profile/update/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function completeReminderApi(employeeId) {
  const url = employeeId ? `/employees/${employeeId}/complete-reminder/` : '/profile/complete-reminder/'
  return request(url, { method: 'POST' })
}

// ── Projects APIs (Add, Edit, Delete, View) ──────────────────────────────────
export async function getProjectsApi(employeeId) {
  const query = employeeId ? `?employee=${employeeId}` : ''
  return request(`/experiences/${query}`)
}

export async function addProjectApi(projectData) {
  try {
    return await request('/projects/add/', { method: 'POST', body: JSON.stringify(projectData) })
  } catch {
    return await request('/experiences/', { method: 'POST', body: JSON.stringify(projectData) })
  }
}

export async function updateProjectApi(projectId, projectData) {
  return request(`/experiences/${projectId}/`, { method: 'PATCH', body: JSON.stringify(projectData) })
}

export async function deleteProjectApi(projectId, employeeId) {
  try {
    return await request(`/projects/${projectId}/delete/`, { method: 'POST', body: JSON.stringify({ employee: employeeId }) })
  } catch {
    return await request(`/experiences/${projectId}/`, { method: 'DELETE' })
  }
}

// ── Skills & Competencies APIs ───────────────────────────────────────────────
export async function getSkillsApi(dimension) {
  const query = dimension ? `?dimension=${dimension}` : ''
  return request(`/skills/${query}`)
}

export async function getCompetenciesApi(employeeId) {
  const query = employeeId ? `?employee=${employeeId}` : ''
  return request(`/competencies/${query}`)
}

export async function submitCompetencyRatingApi(data) {
  try {
    return await request('/skills/add/', { method: 'POST', body: JSON.stringify(data) })
  } catch {
    if (data.id && typeof data.id === 'number' && data.id < 1000000000) {
      try { return await request(`/competencies/${data.id}/`, { method: 'PATCH', body: JSON.stringify(data) }) } catch {}
    }
    return await request('/competencies/', { method: 'POST', body: JSON.stringify(data) })
  }
}

export async function deleteCompetencyRatingApi(ratingId) {
  try {
    return await request(`/skills/${ratingId}/delete/`, { method: 'POST' })
  } catch {
    return await request(`/competencies/${ratingId}/`, { method: 'DELETE' })
  }
}

// ── AI Resume Parsing API ───────────────────────────────────────────────────
export async function parseResumeApi(fileOrText) {
  try {
    let res = null
    if (fileOrText instanceof File || fileOrText instanceof Blob) {
      const fd = new FormData()
      fd.append('resume', fileOrText)
      res = await request('/resume/parse/', { method: 'POST', body: fd })
    } else if (typeof fileOrText === 'string') {
      res = await request('/resume/parse/', {
        method: 'POST',
        body: JSON.stringify({ resume_text: fileOrText })
      })
    }
    if (res && res.data) return res.data
    if (res && res.extractedSkills) return res
  } catch (err) {
    console.warn('Backend AI resume parsing failed, using client heuristic fallback:', err)
  }
  return simulateResumeExtraction(fileOrText)
}

export { DEFAULT_SKILL_TAXONOMY, simulateResumeExtraction } from './data/initialData'
