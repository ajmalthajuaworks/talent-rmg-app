from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeProfileViewSet, SkillViewSet, ProjectExperienceViewSet, CompetencyRatingViewSet

# The DefaultRouter automatically generates the GET, POST, PUT, and DELETE routes
router = DefaultRouter()
router.register(r'employees', EmployeeProfileViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'experiences', ProjectExperienceViewSet)
router.register(r'competencies', CompetencyRatingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]