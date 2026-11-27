// admin_dashboard.js — Client controller for TalentRMG Admin Portal

function switchTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach((el) => el.classList.remove('active'))
  document.querySelectorAll('.nav-btn').forEach((el) => el.classList.remove('active'))

  const targetPane = document.getElementById('tab-' + tabId)
  if (targetPane) targetPane.classList.add('active')

  const clickedBtn = Array.from(document.querySelectorAll('.nav-btn')).find((b) =>
    b.getAttribute('onclick')?.includes(tabId)
  )
  if (clickedBtn) clickedBtn.classList.add('active')

  const titleMap = {
    overview: 'Executive RMG & Admin Dashboard',
    validations: 'Competency Review Queue (ENG-O11)',
    employees: 'Talent Directory & Profile Readiness (ENG-O12)',
    certifications: 'Professional Certifications & Credentials (ENG-O15)',
    demands: 'Project Demands & Resource Allocations (RMG)',
    projects: 'Engineer Project Portfolio Submissions (ENG-O04)',
    skills: 'Approved Organizational Skills Taxonomy (ENG-O06–O08)',
    'admin-settings': 'Administrator Profile & System Diagnostics'
  }

  const titleEl = document.getElementById('page-title')
  if (titleEl && titleMap[tabId]) titleEl.textContent = titleMap[tabId]
}

function filterQueue(dim, btn) {
  if (btn) {
    btn.parentElement.querySelectorAll('.filter-tab-btn').forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
  }
  const rows = document.querySelectorAll('#queue-table tbody tr')
  rows.forEach((tr) => {
    const rowDim = tr.getAttribute('data-dimension') || ''
    tr.style.display = dim === 'ALL' || rowDim === dim ? '' : 'none'
  })
}

function filterEmployees(status, btn) {
  if (btn) {
    btn.parentElement.querySelectorAll('.filter-tab-btn').forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
  }
  const rows = document.querySelectorAll('#employee-table tbody tr')
  rows.forEach((tr) => {
    const isAction = tr.getAttribute('data-action-required') === 'true'
    const isComplete = tr.getAttribute('data-complete') === 'true'
    if (status === 'ALL') tr.style.display = ''
    else if (status === 'ACTION_REQUIRED') tr.style.display = isAction ? '' : 'none'
    else if (status === 'COMPLETED') tr.style.display = isComplete ? '' : 'none'
    else tr.style.display = ''
  })
}

function filterProjects(status, btn) {
  if (btn) {
    btn.parentElement.querySelectorAll('.filter-tab-btn').forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
  }
  const rows = document.querySelectorAll('#projects-table tbody tr')
  rows.forEach((tr) => {
    const s = tr.getAttribute('data-status') || ''
    tr.style.display = status === 'ALL' || s === status ? '' : 'none'
  })
}

function filterCerts(cat, btn) {
  if (btn) {
    btn.parentElement.querySelectorAll('.filter-tab-btn').forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
  }
  const rows = document.querySelectorAll('#certs-table tbody tr')
  rows.forEach((tr) => {
    const c = tr.getAttribute('data-category') || ''
    tr.style.display = cat === 'ALL' || c === cat ? '' : 'none'
  })
}

function filterDemands(status, btn) {
  if (btn) {
    btn.parentElement.querySelectorAll('.filter-tab-btn').forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
  }
  const rows = document.querySelectorAll('#demands-table tbody tr')
  rows.forEach((tr) => {
    const s = tr.getAttribute('data-status') || ''
    tr.style.display = status === 'ALL' || s === status ? '' : 'none'
  })
}

function handleEmployeeFeedbackClick(btn) {
  const d = btn.dataset
  openFeedbackModal(
    d.id,
    d.name,
    d.code,
    d.complete === '1',
    d.update === '1',
    d.feedback || '',
    d.reminder || 'NONE'
  )
}

function openFeedbackModal(empId, name, code, isComplete, needsUpdate, feedback, reminderStatus) {
  document.getElementById('fbEmpName').innerText = name
  document.getElementById('fbEmpId').innerText = code
  document.getElementById('employeeFeedbackForm').action = '/employees/' + empId + '/feedback/'
  document.getElementById('fbIsProfileComplete').checked = !isComplete
  document.getElementById('fbNeedsProjectUpdate').checked = needsUpdate
  document.getElementById('fbAdminFeedback').value = feedback || ''
  if (document.getElementById('fbReminderStatus')) {
    document.getElementById('fbReminderStatus').value = reminderStatus || (needsUpdate ? 'ACTION_REQUIRED' : 'NONE')
  }
  document.getElementById('employeeFeedbackModal').classList.add('active')
}

function closeFeedbackModal() {
  document.getElementById('employeeFeedbackModal').classList.remove('active')
}

function openCompetencyReviewModal(compId, empName, skillName, dimension, selfRating) {
  document.getElementById('compEmpName').innerText = empName
  document.getElementById('compSkillName').innerText = skillName + ' (' + dimension + ')'
  document.getElementById('compSelfRating').innerText = selfRating
  document.getElementById('compApprovedRating').value = selfRating || 'INTERMEDIATE'
  document.getElementById('compFeedback').value = ''
  document.getElementById('competencyReviewForm').action = '/competencies/' + compId + '/validate/'
  document.getElementById('competencyReviewModal').classList.add('active')
}

function closeCompetencyReviewModal() {
  document.getElementById('competencyReviewModal').classList.remove('active')
}

function showAddSkillModal() {
  document.getElementById('addSkillModal').classList.add('active')
}

function closeAddSkillModal() {
  document.getElementById('addSkillModal').classList.remove('active')
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container')
  if (!container) return
  const toast = document.createElement('div')
  toast.className = 'toast-msg ' + type
  toast.innerHTML = `<span>🔔</span> <span>${msg}</span>`
  container.appendChild(toast)
  setTimeout(() => toast.remove(), 4000)
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search)
  const tab = urlParams.get('tab')
  if (tab) switchTab(tab.replace('admin-', ''))
})
