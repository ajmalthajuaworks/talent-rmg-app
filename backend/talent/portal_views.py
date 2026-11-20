import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.http import JsonResponse
from .models import EmployeeProfile, Skill, ProjectExperience, CompetencyRating
from .serializers import EmployeeProfileSerializer, ProjectExperienceSerializer, CompetencyRatingSerializer
from .taxonomy_data import ensure_skills_seeded
from .auth_views import is_api_request

def parse_body(request):
    if request.content_type == 'application/json':
        try: return json.loads(request.body)
        except Exception: return {}
    return request.POST

def get_target_profile(request, data):
    if request.user.is_authenticated:
        p = EmployeeProfile.objects.filter(user=request.user).first()
        if p: return p
    if data.get('employee_id'):
        p = EmployeeProfile.objects.filter(employee_id=data.get('employee_id')).first()
        if p: return p
    if data.get('employee'):
        p = EmployeeProfile.objects.filter(id=data.get('employee')).first()
        if p: return p
    return None

@login_required(login_url='/admin-login/')
def dashboard_view(request):
    """Admin Dashboard: strict access control for staff and superusers."""
    if not (request.user.is_staff or request.user.is_superuser):
        messages.error(request, 'Unauthorized: Admin access required.')
        return redirect('admin_login')

    ensure_skills_seeded()
    profile, _ = EmployeeProfile.objects.get_or_create(
        user=request.user,
        defaults={'employee_id': f"ADM-{request.user.id:04d}", 'designation': 'Administrator', 'department': 'Executive Management'}
    )
    all_employees = EmployeeProfile.objects.all().select_related('user').order_by('-id')
    all_projects = ProjectExperience.objects.all().select_related('employee__user').order_by('-start_date')
    pending_validations = CompetencyRating.objects.filter(validation_status='PENDING').select_related('employee__user', 'skill')
    all_skills = Skill.objects.all().order_by('dimension', 'name')

    return render(request, 'talent/dashboard.html', {
        'profile': profile,
        'all_employees': all_employees,
        'all_projects': all_projects,
        'pending_validations': pending_validations,
        'total_employees': all_employees.count(),
        'total_projects_count': all_projects.count(),
        'total_pending_count': pending_validations.count(),
        'total_skills_count': all_skills.count(),
        'all_skills': all_skills,
    })

@csrf_exempt
def competency_validate(request, pk):
    if request.method in ['POST', 'GET']:
        comp = get_object_or_404(CompetencyRating, id=pk)
        action = request.POST.get('action') or request.GET.get('action', 'approve')
        if action == 'approve':
            comp.validation_status = 'APPROVED'
            comp.approved_rating = comp.self_assessed_rating
            comp.manager_feedback = request.POST.get('feedback') or 'Approved by administrator.'
        elif action == 'reject':
            comp.validation_status = 'REJECTED'
            comp.manager_feedback = request.POST.get('feedback') or 'Needs further project evidence.'
        comp.save()
        if is_api_request(request): return JsonResponse({'message': f'Rating {comp.validation_status.lower()}.'})
        messages.success(request, f'Skill "{comp.skill.name}" marked as {comp.validation_status}.')
    return redirect('dashboard')

@csrf_exempt
def profile_update(request):
    if request.method in ['POST', 'PUT', 'PATCH']:
        data = parse_body(request)
        profile = get_target_profile(request, data)
        if not profile:
            if is_api_request(request): return JsonResponse({'error': 'Profile not found.'}, status=401)
            return redirect('dashboard')
        u = profile.user
        if 'first_name' in data: u.first_name = data['first_name']
        if 'last_name' in data: u.last_name = data['last_name']
        if 'email' in data: u.email = data['email']
        u.save()
        if 'designation' in data: profile.designation = data['designation']
        if 'department' in data: profile.department = data['department']
        profile.save()
        if is_api_request(request):
            return JsonResponse({'message': 'Profile updated successfully.', 'profile': EmployeeProfileSerializer(profile).data})
        messages.success(request, 'Profile details updated.')
    return redirect('dashboard')

@csrf_exempt
def project_add(request):
    if request.method == 'POST':
        data = parse_body(request)
        profile = get_target_profile(request, data)
        if not profile:
            if is_api_request(request): return JsonResponse({'error': 'Profile not found. Please log in.'}, status=401)
            return redirect('login')
        name = data.get('project_name')
        if not name:
            if is_api_request(request): return JsonResponse({'error': 'Project name is required.'}, status=400)
            return redirect('dashboard')
        proj = ProjectExperience.objects.create(
            employee=profile, project_name=name,
            customer_or_employer=data.get('customer_or_employer', ''),
            industry=data.get('industry', 'Technology'),
            start_date=data.get('start_date') or '2024-01-01',
            end_date=data.get('end_date') or None,
            business_problem=data.get('business_problem', ''),
            technology_stack=data.get('technology_stack', ''),
            individual_responsibilities=data.get('individual_responsibilities', ''),
            measurable_achievements=data.get('measurable_achievements', '')
        )
        if is_api_request(request): return JsonResponse(ProjectExperienceSerializer(proj).data, status=201)
        messages.success(request, f'Project "{name}" added.')
    return redirect('dashboard')

@csrf_exempt
def project_delete(request, pk):
    if request.method in ['POST', 'DELETE']:
        data = parse_body(request)
        profile = get_target_profile(request, data)
        qs = ProjectExperience.objects.filter(id=pk)
        if profile and not (request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)):
            qs = qs.filter(employee=profile)
        proj = qs.first()
        if proj:
            p_name = proj.project_name
            proj.delete()
            if is_api_request(request): return JsonResponse({'message': f'Project "{p_name}" deleted.'})
            messages.success(request, f'Project "{p_name}" deleted.')
        elif is_api_request(request):
            return JsonResponse({'message': 'Project not found or already deleted.'}, status=200)
    return redirect('dashboard')

@csrf_exempt
def skill_add(request):
    if request.method == 'POST':
        data = parse_body(request)
        profile = get_target_profile(request, data)
        if not profile:
            if is_api_request(request): return JsonResponse({'error': 'Profile not found. Please log in.'}, status=401)
            return redirect('login')
        skill_id = data.get('skill_id') or data.get('skill')
        rating = data.get('rating') or data.get('self_assessed_rating')
        if skill_id and rating:
            skill = get_object_or_404(Skill, id=skill_id)
            comp, _ = CompetencyRating.objects.get_or_create(
                employee=profile, skill=skill, defaults={'self_assessed_rating': rating, 'validation_status': 'PENDING'}
            )
            comp.self_assessed_rating = rating
            comp.validation_status = 'PENDING'
            comp.save()
            evidence = data.get('project_evidence') or []
            if evidence:
                ids = [p['id'] if isinstance(p, dict) else p for p in evidence]
                comp.project_evidence.set(ProjectExperience.objects.filter(id__in=ids, employee=profile))
            if is_api_request(request): return JsonResponse(CompetencyRatingSerializer(comp).data, status=201)
            messages.success(request, f'Rating for "{skill.name}" submitted.')
    return redirect('dashboard')

@csrf_exempt
def skill_delete(request, pk):
    if request.method in ['POST', 'DELETE']:
        data = parse_body(request)
        profile = get_target_profile(request, data)
        qs = CompetencyRating.objects.filter(id=pk)
        if profile and not (request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)):
            qs = qs.filter(employee=profile)
        comp = qs.first()
        if comp: comp.delete()
        if is_api_request(request): return JsonResponse({'message': 'Rating removed.'})
        messages.success(request, 'Rating removed.')
    return redirect('dashboard')
