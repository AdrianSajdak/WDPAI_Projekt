from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import CustomUser

class BasicAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_root_url(self):
        response = self.client.get('/')
        self.assertIn(response.status_code, [200, 404])

    def test_create_user(self):
        user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.check_password('password123'))
