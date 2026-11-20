from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from talent import views as talent_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', lambda request: redirect('admin_login')),
    path('dashboard/', talent_views.dashboard_view, name='dashboard'),
    path('admin-login/', talent_views.admin_login_page, name='admin_login'),
    path('admin-logout/', talent_views.admin_logout_view, name='admin_logout'),
    path('profile/update/', talent_views.profile_update, name='profile_update'),
    path('projects/add/', talent_views.project_add, name='project_add'),
    path('projects/<int:pk>/delete/', talent_views.project_delete, name='project_delete'),
    path('skills/add/', talent_views.skill_add, name='skill_add'),
    path('skills/<int:pk>/delete/', talent_views.skill_delete, name='skill_delete'),
    path('competencies/<int:pk>/validate/', talent_views.competency_validate, name='competency_validate'),
    path('login/', talent_views.login_page, name='login'),
    path('signup/', talent_views.signup_page, name='signup'),
    path('logout/', talent_views.logout_view, name='logout'),
    path('api/talent/', include('talent.urls')),
    path('api/rmg/', include('rmg.urls')),
]
