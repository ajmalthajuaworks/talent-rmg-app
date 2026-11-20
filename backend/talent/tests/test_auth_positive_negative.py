import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from talent.models import EmployeeProfile

class AuthTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.signup_url = '/api/talent/signup/'
        self.login_url = '/api/talent/login/'
        self.logout_url = '/api/talent/logout/'
        self.me_url = '/api/talent/me/'
        
        self.test_user = User.objects.create_user(
            username='existinguser',
            password='SecretPassword123!',
            email='existing@company.com'
        )
        self.profile = EmployeeProfile.objects.create(
            user=self.test_user,
            employee_id='EMP-111111',
            designation='Software Engineer',
            department='Engineering'
        )

    def test_signup_success_positive(self):
        payload = {
            'username': 'newengineer',
            'password': 'SecurePassWord789!',
            'confirm_password': 'SecurePassWord789!',
            'email': 'newengineer@company.com',
            'first_name': 'New',
            'last_name': 'Engineer',
            'employee_id': 'EMP-999999',
            'designation': 'QA Engineer',
            'department': 'Quality Assurance'
        }
        res = self.client.post(self.signup_url, json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 201)
        self.assertTrue(User.objects.filter(username='newengineer').exists())

    def test_signup_duplicate_username_negative(self):
        payload = {
            'username': 'existinguser',
            'password': 'Password123!',
            'confirm_password': 'Password123!',
            'email': 'other@company.com'
        }
        res = self.client.post(self.signup_url, json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 400)
        self.assertIn('already exists', res.json().get('error', ''))

    def test_signup_password_mismatch_boundary(self):
        payload = {
            'username': 'mismatchuser',
            'password': 'Password123!',
            'confirm_password': 'DifferentPassword456!'
        }
        res = self.client.post(self.signup_url, json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 400)
        self.assertIn('do not match', res.json().get('error', ''))

    def test_signup_missing_required_fields_negative(self):
        payload = {'username': 'onlyusername'}
        res = self.client.post(self.signup_url, json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 400)

    def test_login_success_positive(self):
        payload = {'username': 'existinguser', 'password': 'SecretPassword123!'}
        res = self.client.post(self.login_url, json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json().get('username'), 'existinguser')

    def test_login_wrong_password_negative(self):
        payload = {'username': 'existinguser', 'password': 'WrongPassword!'}
        res = self.client.post(self.login_url, json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 401)
        self.assertIn('Invalid', res.json().get('error', ''))

    def test_login_nonexistent_user_negative(self):
        payload = {'username': 'doesnotexist', 'password': 'Password123!'}
        res = self.client.post(self.login_url, json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 401)

    def test_login_empty_credentials_boundary(self):
        payload = {'username': '', 'password': ''}
        res = self.client.post(self.login_url, json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 400)

    def test_logout_positive(self):
        self.client.login(username='existinguser', password='SecretPassword123!')
        res = self.client.post(self.logout_url)
        self.assertEqual(res.status_code, 200)

    def test_me_view_positive(self):
        self.client.login(username='existinguser', password='SecretPassword123!')
        res = self.client.get(self.me_url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json().get('username'), 'existinguser')
