from django.test import TestCase
from django.contrib.auth.models import User
from talent.models import EmployeeProfile, Skill, ProjectExperience, CompetencyRating

class CompetencyEvidenceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='compdev', password='DevPassword123!')
        self.profile = EmployeeProfile.objects.create(
            user=self.user,
            employee_id='EMP-333333',
            designation='Lead Engineer',
            department='Platform'
        )
        self.tech_skill = Skill.objects.create(name='Python', skill_code='TECH-PY-01', dimension='TECHNICAL')
        self.domain_skill = Skill.objects.create(name='Healthcare', skill_code='DOM-HLTH-01', dimension='DOMAIN')
        self.func_skill = Skill.objects.create(name='Technical Lead', skill_code='FUNC-LEAD-01', dimension='FUNCTIONAL')
        self.project = ProjectExperience.objects.create(
            employee=self.profile,
            project_name='Clinical EHR Ingestion',
            start_date='2023-01-01'
        )

    def test_submit_technical_rating_positive(self):
        rating = CompetencyRating.objects.create(
            employee=self.profile,
            skill=self.tech_skill,
            self_assessed_rating='ADVANCED',
            validation_status='PENDING'
        )
        self.assertEqual(rating.self_assessed_rating, 'ADVANCED')
        self.assertEqual(rating.validation_status, 'PENDING')

    def test_submit_domain_rating_positive(self):
        rating = CompetencyRating.objects.create(
            employee=self.profile,
            skill=self.domain_skill,
            self_assessed_rating='INTERMEDIATE'
        )
        self.assertEqual(rating.skill.dimension, 'DOMAIN')

    def test_submit_functional_rating_positive(self):
        rating = CompetencyRating.objects.create(
            employee=self.profile,
            skill=self.func_skill,
            self_assessed_rating='EXPERT'
        )
        self.assertEqual(rating.skill.dimension, 'FUNCTIONAL')

    def test_six_level_rating_framework_boundary(self):
        levels = ['ZERO', 'TRAINED', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']
        for i, lvl in enumerate(levels):
            sk = Skill.objects.create(name=f'Skill_{lvl}', skill_code=f'SK-{i}', dimension='TECHNICAL')
            r = CompetencyRating.objects.create(employee=self.profile, skill=sk, self_assessed_rating=lvl)
            self.assertEqual(r.self_assessed_rating, lvl)

    def test_link_project_evidence_positive(self):
        rating = CompetencyRating.objects.create(
            employee=self.profile,
            skill=self.tech_skill,
            self_assessed_rating='ADVANCED'
        )
        rating.project_evidence.add(self.project)
        self.assertIn(self.project, rating.project_evidence.all())

    def test_link_multiple_projects_evidence_boundary(self):
        proj2 = ProjectExperience.objects.create(employee=self.profile, project_name='Project 2', start_date='2024-01-01')
        rating = CompetencyRating.objects.create(employee=self.profile, skill=self.tech_skill, self_assessed_rating='ADVANCED')
        rating.project_evidence.add(self.project, proj2)
        self.assertEqual(rating.project_evidence.count(), 2)

    def test_delete_competency_rating_positive(self):
        rating = CompetencyRating.objects.create(employee=self.profile, skill=self.tech_skill, self_assessed_rating='BEGINNER')
        r_id = rating.id
        rating.delete()
        self.assertFalse(CompetencyRating.objects.filter(id=r_id).exists())

    def test_update_rating_resets_validation_status_positive(self):
        rating = CompetencyRating.objects.create(
            employee=self.profile,
            skill=self.tech_skill,
            self_assessed_rating='BEGINNER',
            approved_rating='BEGINNER',
            validation_status='APPROVED'
        )
        rating.self_assessed_rating = 'INTERMEDIATE'
        rating.validation_status = 'PENDING'
        rating.save()
        rating.refresh_from_db()
        self.assertEqual(rating.validation_status, 'PENDING')

    def test_unique_rating_per_employee_skill_positive(self):
        CompetencyRating.objects.create(employee=self.profile, skill=self.tech_skill, self_assessed_rating='BEGINNER')
        ratings_count = CompetencyRating.objects.filter(employee=self.profile, skill=self.tech_skill).count()
        self.assertEqual(ratings_count, 1)

    def test_skill_string_representation_positive(self):
        self.assertIn('TECH-PY-01', str(self.tech_skill))
        self.assertIn('Python', str(self.tech_skill))

    def test_competency_rating_str_representation_positive(self):
        rating = CompetencyRating.objects.create(employee=self.profile, skill=self.tech_skill, self_assessed_rating='EXPERT')
        self.assertIn('compdev', str(rating))
        self.assertIn('Python', str(rating))

    def test_skill_add_and_resubmit_flow_positive(self):
        self.client.force_login(self.user)
        # 1. Add skill rating
        res = self.client.post('/skills/add/', {
            'skill_id': self.tech_skill.id,
            'rating': 'ADVANCED',
            'employee': self.profile.id
        }, content_type='application/json', HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(res.status_code, 201)
        comp = CompetencyRating.objects.get(employee=self.profile, skill=self.tech_skill)
        self.assertEqual(comp.self_assessed_rating, 'ADVANCED')
        self.assertEqual(comp.validation_status, 'PENDING')

        # 2. Resubmit with manager_feedback clarification and evidence
        res2 = self.client.post('/skills/add/', {
            'skill_id': self.tech_skill.id,
            'rating': 'EXPERT',
            'manager_feedback': 'Resubmitted: Attached clinical EHR project evidence',
            'project_evidence': [{'id': self.project.id}],
            'employee': self.profile.id
        }, content_type='application/json', HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(res2.status_code, 201)
        comp.refresh_from_db()
        self.assertEqual(comp.self_assessed_rating, 'EXPERT')
        self.assertEqual(comp.validation_status, 'PENDING')
        self.assertIn('Resubmitted:', comp.manager_feedback)
        self.assertIn(self.project, comp.project_evidence.all())
