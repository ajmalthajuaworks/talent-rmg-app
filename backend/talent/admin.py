from django.contrib import admin
from .models import EmployeeProfile, Skill, ProjectExperience, CompetencyRating

@admin.register(EmployeeProfile)
class EmployeeProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'employee_id', 'designation', 'department', 'is_profile_complete')
    list_filter = ('department', 'is_profile_complete')
    search_fields = ('employee_id', 'user__first_name', 'user__last_name')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'skill_code', 'dimension')
    list_filter = ('dimension',)
    search_fields = ('name', 'skill_code')

@admin.register(ProjectExperience)
class ProjectExperienceAdmin(admin.ModelAdmin):
    list_display = ('project_name', 'employee', 'customer_or_employer', 'start_date', 'end_date')
    list_filter = ('industry',)
    search_fields = ('project_name', 'customer_or_employer', 'employee__user__last_name')

@admin.register(CompetencyRating)
class CompetencyRatingAdmin(admin.ModelAdmin):
    list_display = ('employee', 'skill', 'self_assessed_rating', 'approved_rating', 'validation_status')
    list_filter = ('validation_status', 'skill__dimension')
    search_fields = ('employee__user__last_name', 'skill__name')