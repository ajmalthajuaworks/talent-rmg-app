# taxonomy_data.py — Standard Organization Competency Taxonomy
from .models import Skill

DEFAULT_SKILLS = [
    # Technical
    ('Python', 'TEC-PY-001', 'TECHNICAL', 'Core programming language for backend and automation'),
    ('Django', 'TEC-DJ-001', 'TECHNICAL', 'High-level Python web framework'),
    ('FastAPI', 'TEC-FA-001', 'TECHNICAL', 'High-performance Python API framework'),
    ('React.js', 'TEC-RC-001', 'TECHNICAL', 'Frontend UI component library'),
    ('PostgreSQL', 'TEC-PG-001', 'TECHNICAL', 'Relational database management system'),
    ('Kubernetes', 'TEC-K8-001', 'TECHNICAL', 'Container orchestration and cluster deployment'),
    ('Docker', 'TEC-DK-001', 'TECHNICAL', 'Container runtime and image packaging'),
    ('AWS Cloud', 'TEC-AWS-001', 'TECHNICAL', 'Amazon Web Services cloud services'),
    ('Azure Cloud', 'TEC-AZ-001', 'TECHNICAL', 'Microsoft Azure cloud platform'),
    ('Apache Kafka', 'TEC-KF-001', 'TECHNICAL', 'Distributed event and message streaming platform'),
    # Domain
    ('Healthcare & Life Sciences', 'DOM-HC-001', 'DOMAIN', 'Hospital systems, medical claims & EHR platforms'),
    ('Automotive', 'DOM-AU-001', 'DOMAIN', 'Connected vehicle software, telematics and ADAS'),
    ('Industrial & Manufacturing', 'DOM-IN-001', 'DOMAIN', 'Smart factories, IoT sensors and predictive maintenance'),
    ('Energy & Utilities', 'DOM-EN-001', 'DOMAIN', 'Smart metering, power grid operations and renewable energy'),
    ('Logistics & Supply Chain', 'DOM-LG-001', 'DOMAIN', 'Fleet tracking, warehouse management and inventory routing'),
    ('Financial Services & Fintech', 'DOM-FS-001', 'DOMAIN', 'Core banking, payments processing and risk analytics'),
    # Functional
    ('Individual Contributor', 'FUN-IC-001', 'FUNCTIONAL', 'Hands-on software development, testing and feature delivery'),
    ('Team Lead', 'FUN-TL-001', 'FUNCTIONAL', 'Agile sprint execution, code reviews and squad coordination'),
    ('Technology Lead', 'FUN-TC-001', 'FUNCTIONAL', 'Technical design authority, architectural patterns and mentoring'),
    ('Solution Architect', 'FUN-AR-001', 'FUNCTIONAL', 'End-to-end system design, NFR compliance and customer architecture'),
    ('Technical Program Manager', 'FUN-TP-001', 'FUNCTIONAL', 'Cross-project delivery, milestone tracking and dependency management'),
]

def ensure_skills_seeded():
    if Skill.objects.count() == 0:
        for name, code, dim, desc in DEFAULT_SKILLS:
            Skill.objects.get_or_create(
                skill_code=code,
                defaults={'name': name, 'dimension': dim, 'description': desc}
            )
