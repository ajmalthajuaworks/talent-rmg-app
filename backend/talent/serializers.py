from rest_framework import serializers
from .models import EmployeeProfile, Skill, ProjectExperience, CompetencyRating
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class EmployeeProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = EmployeeProfile
        fields = '__all__'

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class ProjectExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectExperience
        fields = '__all__'

class CompetencyRatingSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    skill_id = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(), source='skill', write_only=True, required=False
    )
    skill_name = serializers.CharField(source='skill.name', read_only=True)
    skill_code = serializers.CharField(source='skill.skill_code', read_only=True)
    dimension = serializers.CharField(source='skill.dimension', read_only=True)
    project_evidence = ProjectExperienceSerializer(many=True, read_only=True)
    employee_name = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = CompetencyRating
        fields = '__all__'

    def get_employee_name(self, obj):
        if obj.employee and obj.employee.user:
            full = obj.employee.user.get_full_name()
            return full if full.strip() else obj.employee.user.username
        return 'Unknown'
