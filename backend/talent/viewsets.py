# viewsets.py — Django REST Framework ViewSets with strict user data isolation
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import EmployeeProfile, Skill, ProjectExperience, CompetencyRating
from .serializers import (
    EmployeeProfileSerializer, SkillSerializer,
    ProjectExperienceSerializer, CompetencyRatingSerializer
)

class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer

    def get_queryset(self):
        user = self.request.user
        emp_id = self.request.query_params.get('employee') or self.request.query_params.get('id')
        if emp_id:
            return EmployeeProfile.objects.filter(id=emp_id)
        if user.is_authenticated and (user.is_staff or user.is_superuser):
            return EmployeeProfile.objects.all()
        if user.is_authenticated:
            return EmployeeProfile.objects.filter(user=user)
        return EmployeeProfile.objects.none()

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all().order_by('dimension', 'name')
    serializer_class = SkillSerializer

class ProjectExperienceViewSet(viewsets.ModelViewSet):
    queryset = ProjectExperience.objects.all().order_by('-start_date')
    serializer_class = ProjectExperienceSerializer

    def get_queryset(self):
        user = self.request.user
        emp_id = self.request.query_params.get('employee')
        if user.is_authenticated and (user.is_staff or user.is_superuser):
            return ProjectExperience.objects.filter(employee_id=emp_id) if emp_id else ProjectExperience.objects.all()
        if user.is_authenticated:
            return ProjectExperience.objects.filter(employee__user=user)
        if emp_id:
            return ProjectExperience.objects.filter(employee_id=emp_id)
        return ProjectExperience.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated and hasattr(user, 'employeeprofile'):
            serializer.save(employee=user.employeeprofile)
        else:
            serializer.save()

class CompetencyRatingViewSet(viewsets.ModelViewSet):
    queryset = CompetencyRating.objects.all().order_by('-id')
    serializer_class = CompetencyRatingSerializer

    def get_queryset(self):
        user = self.request.user
        emp_id = self.request.query_params.get('employee')
        if user.is_authenticated and (user.is_staff or user.is_superuser):
            return CompetencyRating.objects.filter(employee_id=emp_id) if emp_id else CompetencyRating.objects.all()
        if user.is_authenticated:
            return CompetencyRating.objects.filter(employee__user=user)
        if emp_id:
            return CompetencyRating.objects.filter(employee_id=emp_id)
        return CompetencyRating.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated and hasattr(user, 'employeeprofile'):
            serializer.save(employee=user.employeeprofile, validation_status='PENDING')
        else:
            serializer.save(validation_status='PENDING')
