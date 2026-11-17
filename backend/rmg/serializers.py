from rest_framework import serializers
from .models import InternalProject, ProjectDemand, ResourceAllocation

class InternalProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalProject
        fields = '__all__'

class ProjectDemandSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    
    class Meta:
        model = ProjectDemand
        fields = '__all__'

class ResourceAllocationSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    project_name = serializers.CharField(source='project.name', read_only=True)
    
    class Meta:
        model = ResourceAllocation
        fields = '__all__'

    def get_employee_name(self, obj):
        return f"{obj.employee.user.first_name} {obj.employee.user.last_name}"