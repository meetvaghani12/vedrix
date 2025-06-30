from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'documents', views.DocumentViewSet)

urlpatterns = [
    path('documents/dashboard/', views.get_dashboard_data, name='dashboard-data'),
    path('', include(router.urls)),
] 