from rest_framework import viewsets
from .models import InternalProject, ProjectDemand, ResourceAllocation
from .serializers import InternalProjectSerializer, ProjectDemandSerializer, ResourceAllocationSerializer

class InternalProjectViewSet(viewsets.ModelViewSet):
    queryset = InternalProject.objects.all()
    serializer_class = InternalProjectSerializer

class ProjectDemandViewSet(viewsets.ModelViewSet):
    queryset = ProjectDemand.objects.all()
    serializer_class = ProjectDemandSerializer

class ResourceAllocationViewSet(viewsets.ModelViewSet):
    queryset = ResourceAllocation.objects.all()
    serializer_class = ResourceAllocationSerializer