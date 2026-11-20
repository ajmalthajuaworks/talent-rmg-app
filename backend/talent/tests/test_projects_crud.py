from django.test import TestCase
from django.contrib.auth.models import User
from talent.models import EmployeeProfile, ProjectExperience

class ProjectCrudTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='projdev', password='DevPassword123!')
        self.profile = EmployeeProfile.objects.create(
            user=self.user,
            employee_id='EMP-222222',
            designation='Cloud Architect',
            department='Infrastructure'
        )
        self.proj1 = ProjectExperience.objects.create(
            employee=self.profile,
            project_name='Legacy DB Migration to PostgreSQL',
            customer_or_employer='FinTech Corp',
            industry='Financial Services',
            start_date='2023-01-01',
            end_date='2023-06-30',
            business_problem='Legacy Oracle DB license costs and high query latency.',
            technology_stack='Python, PostgreSQL, Docker, AWS Aurora',
            individual_responsibilities='Schema conversion and data replication pipelines.',
            measurable_achievements='Saved 40% annual DB licensing fees.'
        )

    def test_create_project_full_positive(self):
        proj = ProjectExperience.objects.create(
            employee=self.profile,
            project_name='E-Commerce Microservices',
            customer_or_employer='Retail Giant',
            industry='Retail',
            start_date='2023-07-01',
            technology_stack='Django, Celery, Redis'
        )
        self.assertEqual(proj.project_name, 'E-Commerce Microservices')
        self.assertEqual(proj.employee, self.profile)

    def test_create_project_minimal_boundary(self):
        proj = ProjectExperience.objects.create(
            employee=self.profile,
            project_name='Internal Tooling Script',
            start_date='2024-01-01'
        )
        self.assertEqual(proj.project_name, 'Internal Tooling Script')
        self.assertEqual(proj.customer_or_employer, '')

    def test_retrieve_projects_for_employee_positive(self):
        projs = ProjectExperience.objects.filter(employee=self.profile)
        self.assertEqual(projs.count(), 1)
        self.assertEqual(projs.first().project_name, 'Legacy DB Migration to PostgreSQL')

    def test_update_project_details_positive(self):
        self.proj1.project_name = 'Renamed Migration Project'
        self.proj1.save()
        self.proj1.refresh_from_db()
        self.assertEqual(self.proj1.project_name, 'Renamed Migration Project')

    def test_partial_update_technology_stack_positive(self):
        self.proj1.technology_stack = 'Python, PostgreSQL, Kubernetes'
        self.proj1.save()
        self.proj1.refresh_from_db()
        self.assertIn('Kubernetes', self.proj1.technology_stack)

    def test_delete_existing_project_positive(self):
        proj_id = self.proj1.id
        self.proj1.delete()
        self.assertFalse(ProjectExperience.objects.filter(id=proj_id).exists())

    def test_delete_nonexistent_project_negative(self):
        with self.assertRaises(ProjectExperience.DoesNotExist):
            ProjectExperience.objects.get(id=999999).delete()

    def test_filter_projects_by_start_date_positive(self):
        ProjectExperience.objects.create(
            employee=self.profile,
            project_name='Newer Project',
            start_date='2024-06-01'
        )
        ordered = ProjectExperience.objects.filter(employee=self.profile).order_by('-start_date')
        self.assertEqual(ordered.first().project_name, 'Newer Project')

    def test_cascade_delete_with_employee_profile_positive(self):
        self.profile.delete()
        self.assertFalse(ProjectExperience.objects.filter(id=self.proj1.id).exists())

    def test_project_string_representation_positive(self):
        expected_str = f"Legacy DB Migration to PostgreSQL ({self.profile.user.username})"
        self.assertEqual(str(self.proj1), expected_str)
