import json
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from talent.models import EmployeeProfile, Skill, CompetencyRating
from talent.taxonomy_skill_data import ensure_skills_seeded

class AdminFeedbackAndReviewTests(TestCase):
    def setUp(self):
        self.client = Client()
        ensure_skills_seeded()
        self.admin_user = User.objects.create_superuser('admin', 'admin@example.com', 'adminpass123')
        self.engineer_user = User.objects.create_user('john', 'john@example.com', 'johnpass123')
        self.profile = EmployeeProfile.objects.create(
            user=self.engineer_user, employee_id='EMP-0099', designation='Senior Developer', department='Engineering'
        )
        self.skill = Skill.objects.filter(dimension='TECHNICAL').first()
        self.comp = CompetencyRating.objects.create(
            employee=self.profile, skill=self.skill, self_assessed_rating='INTERMEDIATE', validation_status='PENDING'
        )

    def test_send_employee_feedback_endpoint(self):
        self.client.force_login(self.admin_user)
        url = reverse('send_employee_feedback', kwargs={'employee_id': self.profile.id})
        res = self.client.post(url, {
            'feedback_text': 'Please update project latency numbers.',
            'needs_project_update': 'true',
            'is_profile_complete': 'false'
        }, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(res.status_code, 200)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.admin_feedback, 'Please update project latency numbers.')
        self.assertTrue(self.profile.needs_project_update)
        self.assertIsNotNone(self.profile.project_reminder_sent_at)
        self.assertFalse(self.profile.is_profile_complete)

    def test_competency_validate_with_manager_notes_and_rating(self):
        self.client.force_login(self.admin_user)
        url = reverse('competency_validate', kwargs={'pk': self.comp.id})
        res = self.client.post(url, {
            'action': 'approve',
            'approved_rating': 'ADVANCED',
            'feedback': 'Sprint achievements verified. Approved as Advanced.'
        }, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(res.status_code, 200)
        self.comp.refresh_from_db()
        self.assertEqual(self.comp.validation_status, 'APPROVED')
        self.assertEqual(self.comp.approved_rating, 'ADVANCED')
        self.assertIn('Sprint achievements', self.comp.manager_feedback)

    def test_competency_validate_revise_action(self):
        self.client.force_login(self.admin_user)
        url = reverse('competency_validate', kwargs={'pk': self.comp.id})
        res = self.client.post(url, {
            'action': 'revise',
            'approved_rating': 'BEGINNER',
            'feedback': 'Needs more production evidence for intermediate.'
        }, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(res.status_code, 200)
        self.comp.refresh_from_db()
        self.assertEqual(self.comp.validation_status, 'REVISED')
        self.assertEqual(self.comp.approved_rating, 'BEGINNER')
