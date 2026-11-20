// api.js — Central API service for TalentRMG React Frontend

async function request(endpoint, options = {}) {
  const defaultHeaders = {
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

export async function deleteProjectApi(projectId) {
  try {
    return await request(`/projects/${projectId}/delete/`, { method: 'POST' })
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

export { DEFAULT_SKILL_TAXONOMY, simulateResumeExtraction } from './data/initialData'
