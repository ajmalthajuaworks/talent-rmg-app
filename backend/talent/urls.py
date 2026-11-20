from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmployeeProfileViewSet, SkillViewSet, ProjectExperienceViewSet, CompetencyRatingViewSet,
    login_page, signup_page, logout_view, dashboard_view, profile_update,
    project_add, project_delete, project_validate, skill_add, skill_delete, competency_validate,
    admin_login_page, admin_logout_view, me_view
)

router = DefaultRouter()
router.register(r'employees', EmployeeProfileViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'experiences', ProjectExperienceViewSet)
router.register(r'competencies', CompetencyRatingViewSet)

urlpatterns = [
    path('dashboard/', dashboard_view, name='dashboard'),
    path('admin-login/', admin_login_page, name='admin_login'),
    path('admin-logout/', admin_logout_view, name='admin_logout'),
    path('profile/update/', profile_update, name='profile_update'),
    path('projects/add/', project_add, name='project_add'),
    path('projects/<int:pk>/delete/', project_delete, name='project_delete'),
    path('projects/<int:pk>/validate/', project_validate, name='project_validate'),
    path('skills/add/', skill_add, name='skill_add'),
    path('skills/<int:pk>/delete/', skill_delete, name='skill_delete'),
    path('competencies/<int:pk>/validate/', competency_validate, name='competency_validate'),
    path('login/', login_page, name='talent_login'),
    path('signup/', signup_page, name='talent_signup'),
    path('logout/', logout_view, name='talent_logout'),
    path('me/', me_view, name='talent_me'),
    path('', include(router.urls)),
]
