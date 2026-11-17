from rest_framework import viewsets
from .models import EmployeeProfile, Skill, ProjectExperience, CompetencyRating
from .serializers import (
    EmployeeProfileSerializer, 
    SkillSerializer, 
    ProjectExperienceSerializer, 
    CompetencyRatingSerializer
)

class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class ProjectExperienceViewSet(viewsets.ModelViewSet):
    queryset = ProjectExperience.objects.all()
    serializer_class = ProjectExperienceSerializer

class CompetencyRatingViewSet(viewsets.ModelViewSet):
    queryset = CompetencyRating.objects.all()
    serializer_class = CompetencyRatingSerializer