from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token

class AuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.user_url = reverse('user-detail')
        self.logout_url = reverse('logout')
        
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'StrongPass123',
            'password2': 'StrongPass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        self.login_data = {
            'username': 'testuser',
            'password': 'StrongPass123'
        }
    
    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('token' in response.data)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')
    
    def test_user_login(self):
        # First register a user
        self.client.post(self.register_url, self.user_data, format='json')
        
        # Then attempt to login
        response = self.client.post(self.login_url, self.login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('token' in response.data)
    
    def test_get_user_details(self):
        # First register a user
        register_response = self.client.post(self.register_url, self.user_data, format='json')
        token = register_response.data['token']
        
        # Authenticate the request
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        # Get user details
        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
    
    def test_logout(self):
        # First register a user
        register_response = self.client.post(self.register_url, self.user_data, format='json')
        token = register_response.data['token']
        
        # Authenticate the request
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        # Logout
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify token is deleted
        self.assertEqual(Token.objects.count(), 0)
