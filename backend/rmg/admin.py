from django.contrib import admin
from .models import InternalProject, ProjectDemand, ResourceAllocation

@admin.register(InternalProject)
class InternalProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'customer', 'practice', 'delivery_unit', 'is_active')
    list_filter = ('is_active', 'practice', 'delivery_unit')
    search_fields = ('name', 'customer')

@admin.register(ProjectDemand)
class ProjectDemandAdmin(admin.ModelAdmin):
    list_display = ('project', 'functional_role', 'positions_count', 'target_joining_date', 'status')
    list_filter = ('status', 'functional_role')
    search_fields = ('project__name',)

@admin.register(ResourceAllocation)
class ResourceAllocationAdmin(admin.ModelAdmin):
    list_display = ('employee', 'project', 'allocation_percentage', 'start_date', 'expected_end_date', 'status')
    list_filter = ('status', 'allocation_percentage')
    search_fields = ('employee__user__last_name', 'project__name')