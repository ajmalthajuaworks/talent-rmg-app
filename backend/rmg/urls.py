from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InternalProjectViewSet, ProjectDemandViewSet, ResourceAllocationViewSet

router = DefaultRouter()
router.register(r'projects', InternalProjectViewSet)
router.register(r'demands', ProjectDemandViewSet)
router.register(r'allocations', ResourceAllocationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]