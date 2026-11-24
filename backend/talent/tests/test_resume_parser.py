import json
from django.test import TestCase, Client
from django.urls import reverse
from talent.models import Skill
from talent.taxonomy_skill_data import ensure_skills_seeded

class ResumeParserApiTest(TestCase):
    def setUp(self):
        self.client = Client()
        ensure_skills_seeded()

    def test_parse_resume_text_success(self):
        sample_text = (
            "Ajmal Thaju - Senior Full Stack Engineer. "
            "Extensive experience in Python, Django, React.js, PostgreSQL, Docker, AWS Cloud. "
            "Led Financial Services Core Banking API modernization."
        )
        response = self.client.post(
            reverse('resume_parse'),
            data=json.dumps({'resume_text': sample_text}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get('status'), 'success')
        extracted = data.get('data', {})
        self.assertIn('extractedSkills', extracted)
        self.assertIn('extractedProjects', extracted)
        self.assertTrue(len(extracted['extractedSkills']) >= 1)

    def test_parse_resume_empty_fails(self):
        response = self.client.post(
            reverse('resume_parse'),
            data=json.dumps({'resume_text': '   '}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_parse_resume_get_method_not_allowed(self):
        response = self.client.get(reverse('resume_parse'))
        self.assertEqual(response.status_code, 405)
