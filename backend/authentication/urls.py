from django.urls import path
from .views import (
    RegisterView, 
    LoginView, 
    UserDetailView, 
    LogoutView,
    VerifyOTPView,
    ResendOTPView,
    AdminAnalyticsView,
    AdminLogsView,
    AdminSettingsView,
    UserManagementView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
    
    # Admin endpoints
    path('admin/analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('admin/logs/', AdminLogsView.as_view(), name='admin-logs'),
    path('admin/settings/', AdminSettingsView.as_view(), name='admin-settings'),
    path('admin/users/', UserManagementView.as_view(), name='admin-users'),
    path('admin/users/<int:user_id>/', UserManagementView.as_view(), name='admin-user-detail'),
] 