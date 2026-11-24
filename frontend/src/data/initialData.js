// initialData.js — Skills taxonomy & realistic resume extraction engine

export const DEFAULT_SKILL_TAXONOMY = [
  // Technical
  { id: 1, name: 'Python', skill_code: 'TEC-PY-001', dimension: 'TECHNICAL', description: 'Core programming language for backend & automation' },
  { id: 2, name: 'Django', skill_code: 'TEC-DJ-001', dimension: 'TECHNICAL', description: 'High-level Python web framework' },
  { id: 3, name: 'FastAPI', skill_code: 'TEC-FA-001', dimension: 'TECHNICAL', description: 'High-performance Python API framework' },
  { id: 4, name: 'React.js', skill_code: 'TEC-RC-001', dimension: 'TECHNICAL', description: 'Frontend UI component library' },
  { id: 5, name: 'TypeScript / JavaScript', skill_code: 'TEC-TS-001', dimension: 'TECHNICAL', description: 'Modern typed scripting & web standards' },
  { id: 6, name: 'Node.js', skill_code: 'TEC-ND-001', dimension: 'TECHNICAL', description: 'Asynchronous event-driven server runtime' },
  { id: 7, name: 'PostgreSQL', skill_code: 'TEC-PG-001', dimension: 'TECHNICAL', description: 'Relational database management system' },
  { id: 8, name: 'MongoDB & NoSQL', skill_code: 'TEC-MG-001', dimension: 'TECHNICAL', description: 'Document database for high-throughput storage' },
  { id: 9, name: 'Redis & Caching', skill_code: 'TEC-RD-001', dimension: 'TECHNICAL', description: 'In-memory key-value data structure store' },
  { id: 10, name: 'Kubernetes', skill_code: 'TEC-K8-001', dimension: 'TECHNICAL', description: 'Container orchestration & cluster deployment' },
  { id: 11, name: 'Docker', skill_code: 'TEC-DK-001', dimension: 'TECHNICAL', description: 'Container runtime & image packaging' },
  { id: 12, name: 'AWS Cloud', skill_code: 'TEC-AWS-001', dimension: 'TECHNICAL', description: 'Amazon Web Services cloud infrastructure' },
  { id: 13, name: 'Azure Cloud', skill_code: 'TEC-AZ-001', dimension: 'TECHNICAL', description: 'Microsoft Azure cloud platform' },
  { id: 14, name: 'Apache Kafka', skill_code: 'TEC-KF-001', dimension: 'TECHNICAL', description: 'Distributed event & message streaming platform' },
  { id: 15, name: 'CI/CD & GitHub Actions', skill_code: 'TEC-CI-001', dimension: 'TECHNICAL', description: 'Automated build, test and deployment pipelines' },
  { id: 16, name: 'REST APIs & Microservices', skill_code: 'TEC-MS-001', dimension: 'TECHNICAL', description: 'Distributed service architecture & API protocols' },
  { id: 17, name: 'Linux & Bash Scripting', skill_code: 'TEC-LX-001', dimension: 'TECHNICAL', description: 'Server administration & shell automation' },
  { id: 18, name: 'Git & Version Control', skill_code: 'TEC-GT-001', dimension: 'TECHNICAL', description: 'Source code branching and merge workflows' },
  // Domain
  { id: 19, name: 'Healthcare & Life Sciences', skill_code: 'DOM-HC-001', dimension: 'DOMAIN', description: 'Hospital systems, medical claims & EHR' },
  { id: 20, name: 'Automotive', skill_code: 'DOM-AU-001', dimension: 'DOMAIN', description: 'Connected vehicle software, telematics and ADAS' },
  { id: 21, name: 'Industrial & Manufacturing', skill_code: 'DOM-IN-001', dimension: 'DOMAIN', description: 'Smart factories, IoT sensors & telemetry' },
  { id: 22, name: 'Energy & Utilities', skill_code: 'DOM-EN-001', dimension: 'DOMAIN', description: 'Smart metering, power grid operations & renewables' },
  { id: 23, name: 'Logistics & Supply Chain', skill_code: 'DOM-LG-001', dimension: 'DOMAIN', description: 'Fleet tracking, warehouse management & routing' },
  { id: 24, name: 'Financial Services & Fintech', skill_code: 'DOM-FS-001', dimension: 'DOMAIN', description: 'Core banking, payments processing & compliance' },
  { id: 25, name: 'E-Commerce & Retail', skill_code: 'DOM-EC-001', dimension: 'DOMAIN', description: 'Digital storefronts, product catalogs & checkout' },
  // Functional
  { id: 26, name: 'Individual Contributor', skill_code: 'FUN-IC-001', dimension: 'FUNCTIONAL', description: 'Hands-on software development & testing' },
  { id: 27, name: 'Team Lead', skill_code: 'FUN-TL-001', dimension: 'FUNCTIONAL', description: 'Agile sprint execution, code reviews & squad coordination' },
  { id: 28, name: 'Technology Lead', skill_code: 'FUN-TC-001', dimension: 'FUNCTIONAL', description: 'Technical design authority & architectural patterns' },
  { id: 29, name: 'Solution Architect', skill_code: 'FUN-AR-001', dimension: 'FUNCTIONAL', description: 'End-to-end system design & NFR compliance' },
  { id: 30, name: 'Scrum Master & Agile', skill_code: 'FUN-SM-001', dimension: 'FUNCTIONAL', description: 'Scrum ceremonies, team cadence & impediment removal' },
  { id: 31, name: 'Technical Program Manager', skill_code: 'FUN-TP-001', dimension: 'FUNCTIONAL', description: 'Cross-project delivery, milestone tracking & governance' },
]

export const INITIAL_DEMO_PROJECTS = []
export const INITIAL_DEMO_COMPETENCIES = [
  {
    id: 101, skill: { id: 1, name: 'Python', skill_code: 'TEC-PY-001', dimension: 'TECHNICAL' },
    skill_id: 1, self_assessed_rating: 'ADVANCED', approved_rating: 'ADVANCED',
    validation_status: 'APPROVED', manager_feedback: 'Strong evidence across 3 projects.'
  },
  {
    id: 102, skill: { id: 10, name: 'Kubernetes', skill_code: 'TEC-K8-001', dimension: 'TECHNICAL' },
    skill_id: 10, self_assessed_rating: 'EXPERT', approved_rating: 'ADVANCED',
    validation_status: 'REJECTED', manager_feedback: 'Evidence does not meet Expert level. Resubmit as Advanced with additional deployment ownership evidence.'
  },
  {
    id: 103, skill: { id: 13, name: 'Azure DevOps', skill_code: 'TEC-AZ-001', dimension: 'TECHNICAL' },
    skill_id: 13, self_assessed_rating: 'INTERMEDIATE', approved_rating: 'BEGINNER',
    validation_status: 'REVISED', manager_feedback: 'Limited independent pipeline ownership. Revised to Beginner.'
  },
  {
    id: 104, skill: { id: 4, name: 'React.js', skill_code: 'TEC-RC-001', dimension: 'TECHNICAL' },
    skill_id: 4, self_assessed_rating: 'INTERMEDIATE', approved_rating: null,
    validation_status: 'PENDING', manager_feedback: 'Submitted 5 days ago.'
  },
  {
    id: 105, skill: { id: 19, name: 'Healthcare & LS', skill_code: 'DOM-HC-001', dimension: 'DOMAIN' },
    skill_id: 19, self_assessed_rating: 'ADVANCED', approved_rating: 'ADVANCED',
    validation_status: 'APPROVED', manager_feedback: 'Verified against 2 projects.'
  }
]

export function mapExtractedCompetencies(extractedSkills, newProjs) {
  return extractedSkills.map((s, i) => {
    const matched = DEFAULT_SKILL_TAXONOMY.find((t) => t.skill_code === s.code || t.name.toLowerCase() === s.name.toLowerCase()) || {
      id: Date.now() + 100 + i, name: s.name, skill_code: s.code || `CUST-${i + 1}`, dimension: s.dimension || 'TECHNICAL'
    }
    return {
      id: Date.now() + 200 + i, skill: matched, skill_id: matched.id,
      self_assessed_rating: s.suggestedRating || 'INTERMEDIATE', approved_rating: null,
      validation_status: 'PENDING', manager_feedback: '', project_evidence: newProjs
    }
  })
}

// Realistic fallback resume extraction when backend AI is offline
export function simulateResumeExtraction(fileOrText) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isCustomText = typeof fileOrText === 'string' && fileOrText.length > 5
      const detected = isCustomText ? parseSkillsFromText(fileOrText) : []
      resolve({
        filename: typeof fileOrText === 'object' ? fileOrText?.name : 'Imported_Profile.txt',
        extractedSummary: 'Extracted engineer profile and skills.',
        extractedProjects: [
          {
            project_name: 'Core Platform & Architecture Modernization',
            customer_or_employer: 'Enterprise Services',
            industry: 'Technology',
            start_date: '2023-01-01', end_date: '',
            business_problem: 'High-throughput system modernization and API scaling.',
            technology_stack: detected.slice(0, 6).map(s => s.name).join(', ') || 'Python, React, Cloud',
            individual_responsibilities: 'Sprint delivery, microservice design, and code quality.',
            measurable_achievements: 'Improved processing throughput and decreased error rates.'
          }
        ],
        extractedSkills: detected
      })
    }, 400)
  })
}

const SKILL_ALIASES = [
  { id: 1, re: [/\bpython3?\b/i, /\bpy\b/i] },
  { id: 2, re: [/\bdjango\b/i, /\bdrf\b/i] },
  { id: 3, re: [/\bfastapi\b/i, /\bfast api\b/i] },
  { id: 4, re: [/\breact(\.js|js)?\b/i] },
  { id: 5, re: [/\btypescript\b/i, /\bjavascript\b/i, /\bts\b/i, /\bjs\b/i] },
  { id: 6, re: [/\bnode(\.js|js)?\b/i, /\bexpress(\.js|js)?\b/i] },
  { id: 7, re: [/\bpostgres(ql)?\b/i, /\bpsql\b/i] },
  { id: 8, re: [/\bmongo(db)?\b/i, /\bnosql\b/i] },
  { id: 9, re: [/\bredis\b/i, /\bcaching\b/i] },
  { id: 10, re: [/\bkubernetes\b/i, /\bk8s\b/i] },
  { id: 11, re: [/\bdocker\b/i, /\bcontainer(s|ization)?\b/i] },
  { id: 12, re: [/\baws\b/i, /\bamazon web services\b/i, /\bec2\b/i, /\bs3\b/i] },
  { id: 13, re: [/\bazure\b/i] },
  { id: 14, re: [/\bkafka\b/i] },
  { id: 15, re: [/\bci\/?cd\b/i, /\bgithub actions\b/i, /\bjenkins\b/i] },
  { id: 16, re: [/\brest(ful)? apis?\b/i, /\bmicroservices?\b/i] },
  { id: 17, re: [/\blinux\b/i, /\bbash\b/i, /\bshell\b/i] },
  { id: 18, re: [/\bgit\b/i, /\bgithub\b/i, /\bversion control\b/i] },
  { id: 19, re: [/\bhealthcare\b/i, /\behr\b/i, /\bfhir\b/i, /\bmedical\b/i] },
  { id: 20, re: [/\bautomotive\b/i, /\btelematics\b/i, /\badas\b/i] },
  { id: 21, re: [/\bmanufacturing\b/i, /\bindustrial\b/i, /\biot\b/i] },
  { id: 22, re: [/\benergy\b/i, /\butilities\b/i, /\brenewables?\b/i] },
  { id: 23, re: [/\blogistics\b/i, /\bsupply chain\b/i, /\bwarehouse\b/i] },
  { id: 24, re: [/\bfintech\b/i, /\bfinancial services\b/i, /\bbanking\b/i, /\bpayments\b/i] },
  { id: 25, re: [/\be-?commerce\b/i, /\bretail\b/i, /\bshopify\b/i] },
  { id: 26, re: [/\bindividual contributor\b/i, /\bsoftware engineer\b/i] },
  { id: 27, re: [/\bteam lead\b/i, /\btech lead\b/i] },
  { id: 28, re: [/\btechnology lead\b/i, /\bprincipal engineer\b/i] },
  { id: 29, re: [/\bsolution architect\b/i, /\bsystem architect\b/i] },
  { id: 30, re: [/\bscrum master\b/i, /\bagile\b/i, /\bscrum\b/i] },
  { id: 31, re: [/\btechnical program manager\b/i, /\btpm\b/i] },
]

export function parseSkillsFromText(text) {
  if (!text || !text.trim()) return []
  const lower = text.toLowerCase()
  const matched = []
  const matchedIds = new Set()

  // 1. Regex alias matching for taxonomy skills
  SKILL_ALIASES.forEach(({ id, re }) => {
    const skill = DEFAULT_SKILL_TAXONOMY.find(s => s.id === id)
    if (!skill) return
    if (re.some(r => r.test(lower)) || lower.includes(skill.name.toLowerCase())) {
      matched.push({
        id: skill.id, name: skill.name, code: skill.skill_code,
        dimension: skill.dimension, suggestedRating: 'INTERMEDIATE', confidence: '95%'
      })
      matchedIds.add(skill.id)
    }
  })

  // 2. Tokenize comma, semicolon, newline lists for exact entries & custom skills
  const tokens = text.split(/[,;\n\r]+/).map(t => t.trim()).filter(t => t.length >= 2 && t.length <= 40)
  tokens.forEach(tok => {
    const tLow = tok.toLowerCase()
    const alreadyMatched = matched.some(m => {
      const mLow = m.name.toLowerCase()
      if (mLow === tLow || mLow.includes(tLow) || tLow.includes(mLow)) return true
      const aliasDef = SKILL_ALIASES.find(a => a.id === m.id)
      return aliasDef ? aliasDef.re.some(r => r.test(tLow)) : false
    })
    if (!alreadyMatched) {
      const tax = DEFAULT_SKILL_TAXONOMY.find(s => s.name.toLowerCase() === tLow)
      if (tax && !matchedIds.has(tax.id)) {
        matched.push({
          id: tax.id, name: tax.name, code: tax.skill_code,
          dimension: tax.dimension, suggestedRating: 'INTERMEDIATE', confidence: '92%'
        })
        matchedIds.add(tax.id)
      } else if (!tax && !tLow.includes('experience') && !tLow.includes('summary') && !tLow.includes('years')) {
        matched.push({
          id: Date.now() + Math.random(),
          name: tok.charAt(0).toUpperCase() + tok.slice(1),
          code: 'CUST-SKL', dimension: 'TECHNICAL',
          suggestedRating: 'INTERMEDIATE', confidence: '85%', isCustom: true
        })
      }
    }
  })

  // Return ONLY the exact matched skills (NEVER fake default skills!)
  return matched
}
