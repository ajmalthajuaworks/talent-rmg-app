# views.py — Re-exports modular controllers to maintain clean line-count and backwards compatibility
from .viewsets import EmployeeProfileViewSet, SkillViewSet, ProjectExperienceViewSet, CompetencyRatingViewSet
from .auth_views import login_page, signup_page, logout_view, me_view
from .admin_auth_views import admin_login_page, admin_logout_view
from .portal_views import dashboard_view, profile_update, project_add, project_delete, project_validate, skill_add, skill_delete, competency_validate
from .resume_parser import resume_parse_view
from .feedback_views import send_employee_feedback

__all__ = [
    'EmployeeProfileViewSet', 'SkillViewSet', 'ProjectExperienceViewSet', 'CompetencyRatingViewSet',
    'login_page', 'signup_page', 'logout_view', 'me_view', 'dashboard_view',
    'profile_update', 'project_add', 'project_delete', 'project_validate', 'skill_add', 'skill_delete', 'competency_validate',
    'admin_login_page', 'admin_logout_view', 'resume_parse_view', 'send_employee_feedback'
]
