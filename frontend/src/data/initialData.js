// initialData.js — Skills taxonomy & resume extraction mapping

export const DEFAULT_SKILL_TAXONOMY = [
  { id: 1, name: 'Python', skill_code: 'TEC-PY-001', dimension: 'TECHNICAL', description: 'Backend & automation' },
  { id: 2, name: 'FastAPI', skill_code: 'TEC-FA-001', dimension: 'TECHNICAL', description: 'High-performance API framework' },
  { id: 3, name: 'Django', skill_code: 'TEC-DJ-001', dimension: 'TECHNICAL', description: 'High-level Python web framework' },
  { id: 4, name: 'React.js', skill_code: 'TEC-RC-001', dimension: 'TECHNICAL', description: 'Frontend component architecture' },
  { id: 5, name: 'Kubernetes', skill_code: 'TEC-K8-001', dimension: 'TECHNICAL', description: 'Cluster orchestration' },
  { id: 6, name: 'Docker', skill_code: 'TEC-DK-001', dimension: 'TECHNICAL', description: 'Container runtime' },
  { id: 7, name: 'PostgreSQL', skill_code: 'TEC-PG-001', dimension: 'TECHNICAL', description: 'Relational DB' },
  { id: 8, name: 'Apache Kafka', skill_code: 'TEC-KF-001', dimension: 'TECHNICAL', description: 'Distributed event streaming' },
  { id: 9, name: 'AWS Cloud', skill_code: 'TEC-AWS-001', dimension: 'TECHNICAL', description: 'AWS infrastructure' },
  { id: 10, name: 'Azure Cloud', skill_code: 'TEC-AZ-001', dimension: 'TECHNICAL', description: 'Azure infrastructure' },
  { id: 11, name: 'Healthcare & Life Sciences', skill_code: 'DOM-HC-001', dimension: 'DOMAIN', description: 'Claims & EHR' },
  { id: 12, name: 'Automotive & Telematics', skill_code: 'DOM-AU-001', dimension: 'DOMAIN', description: 'Connected vehicles' },
  { id: 13, name: 'Industrial & Manufacturing', skill_code: 'DOM-IN-001', dimension: 'DOMAIN', description: 'Industrial IoT' },
  { id: 14, name: 'Energy & Utilities', skill_code: 'DOM-EN-001', dimension: 'DOMAIN', description: 'Smart metering' },
  { id: 15, name: 'Logistics & Supply Chain', skill_code: 'DOM-LG-001', dimension: 'DOMAIN', description: 'Fleet tracking' },
  { id: 16, name: 'Financial Services & Fintech', skill_code: 'DOM-FS-001', dimension: 'DOMAIN', description: 'Core banking & payments' },
  { id: 17, name: 'Individual Contributor', skill_code: 'FUN-IC-001', dimension: 'FUNCTIONAL', description: 'Hands-on delivery' },
  { id: 18, name: 'Team Lead', skill_code: 'FUN-TL-001', dimension: 'FUNCTIONAL', description: 'Sprint rituals & mentoring' },
  { id: 19, name: 'Technology Lead', skill_code: 'FUN-TC-001', dimension: 'FUNCTIONAL', description: 'Architectural governance' },
  { id: 20, name: 'Solution Architect', skill_code: 'FUN-AR-001', dimension: 'FUNCTIONAL', description: 'End-to-end design' },
  { id: 21, name: 'Technical Program Manager', skill_code: 'FUN-TP-001', dimension: 'FUNCTIONAL', description: 'Cross-functional delivery' },
]

export const INITIAL_DEMO_PROJECTS = []
export const INITIAL_DEMO_COMPETENCIES = []

export function mapExtractedCompetencies(extractedSkills, newProjs) {
  return extractedSkills.map((s, i) => {
    const matched = DEFAULT_SKILL_TAXONOMY.find((t) => t.skill_code === s.code) || {
      id: Date.now() + 100 + i, name: s.name, skill_code: s.code, dimension: s.dimension
    }
    return {
      id: Date.now() + 200 + i, skill: matched, skill_id: matched.id,
      self_assessed_rating: s.suggestedRating, approved_rating: null,
      validation_status: 'PENDING', manager_feedback: '', project_evidence: newProjs
    }
  })
}

export function simulateResumeExtraction(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        filename: file.name,
        extractedSummary: 'Experienced software engineer specialized in backend microservices and cloud infrastructure.',
        extractedProjects: [
          {
            project_name: 'Enterprise Claims Processing Platform',
            customer_or_employer: 'Healthcare Solutions',
            industry: 'Healthcare',
            start_date: '2023-01-15',
            end_date: '',
            business_problem: 'Manual claims verification caused turnaround delays.',
            technology_stack: 'Python, FastAPI, PostgreSQL, Kafka, Docker, Azure',
            individual_responsibilities: 'Designed REST APIs for automated claims intake and fraud checks.',
            measurable_achievements: 'Decreased claim processing latency by 65%.'
          }
        ],
        extractedSkills: [
          { name: 'Python', code: 'TEC-PY-001', dimension: 'TECHNICAL', suggestedRating: 'ADVANCED', confidence: '96%' },
          { name: 'FastAPI', code: 'TEC-FA-001', dimension: 'TECHNICAL', suggestedRating: 'ADVANCED', confidence: '92%' },
          { name: 'PostgreSQL', code: 'TEC-PG-001', dimension: 'TECHNICAL', suggestedRating: 'ADVANCED', confidence: '94%' },
          { name: 'Healthcare & Life Sciences', code: 'DOM-HC-001', dimension: 'DOMAIN', suggestedRating: 'INTERMEDIATE', confidence: '90%' },
        ]
      })
    }, 1000)
  })
}
