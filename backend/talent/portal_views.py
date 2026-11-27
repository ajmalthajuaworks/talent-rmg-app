import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.http import JsonResponse
from .models import EmployeeProfile, Skill, ProjectExperience, CompetencyRating
from .serializers import EmployeeProfileSerializer, ProjectExperienceSerializer, CompetencyRatingSerializer
from .taxonomy_skill_data import ensure_skills_seeded
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
    for k in ['employee_id', 'employee']:
        val = data.get(k)
        if val:
            p = EmployeeProfile.objects.filter(employee_id=val).first() or EmployeeProfile.objects.filter(id=val).first()
            if p: return p
    return EmployeeProfile.objects.first() if is_api_request(request) else None

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
    emps = EmployeeProfile.objects.all().select_related('user').order_by('-id')
    projs = ProjectExperience.objects.all().select_related('employee__user').order_by('-start_date')
    pending = CompetencyRating.objects.filter(validation_status='PENDING').select_related('employee__user', 'skill')
    all_skills = Skill.objects.all().order_by('dimension', 'name')
    return render(request, 'talent/dashboard.html', {
        'profile': profile, 'all_employees': emps, 'all_projects': projs,
        'pending_validations': pending, 'total_employees': emps.count(),
        'total_projects_count': projs.count(), 'total_pending_count': pending.count(),
        'total_skills_count': all_skills.count(), 'all_skills': all_skills,
    })

@csrf_exempt
def competency_validate(request, pk):
    """Update competency validation status, manager notes, and accept approved_rating from admin."""
    if request.method in ['POST', 'GET']:
        comp = get_object_or_404(CompetencyRating, id=pk)
        data = parse_body(request) if request.method == 'POST' else request.GET
        action = str(data.get('action') or request.GET.get('action', 'approve')).lower()
        feedback = data.get('feedback') or data.get('manager_feedback') or request.GET.get('feedback', '')
        approved_rating = data.get('approved_rating') or request.GET.get('approved_rating', '')
        if approved_rating:
            comp.approved_rating = approved_rating
        if action in ['approve', 'approved']:
            comp.validation_status = 'APPROVED'
            comp.approved_rating = comp.approved_rating or comp.self_assessed_rating
            comp.manager_feedback = feedback or 'Approved by administrator.'
        elif action in ['reject', 'rejected']:
            comp.validation_status = 'REJECTED'
            comp.manager_feedback = feedback or 'Needs further project evidence.'
        elif action in ['revise', 'revised']:
            comp.validation_status = 'REVISED'
            comp.approved_rating = comp.approved_rating or comp.self_assessed_rating
            comp.manager_feedback = feedback or 'Rating revised with manager feedback.'
        if feedback: comp.manager_feedback = feedback
        comp.save()
        messages.success(request, f'Skill "{comp.skill.name}" for {comp.employee.user.username} marked as {comp.validation_status}.')
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or is_api_request(request):
            return JsonResponse({
                'message': f'Rating {comp.validation_status.lower()}.', 'status': comp.validation_status,
                'rating': comp.approved_rating, 'feedback': comp.manager_feedback, 'competency': CompetencyRatingSerializer(comp).data
            })
    return redirect('/dashboard/?tab=admin-validations')

@csrf_exempt
def project_validate(request, pk):
    if request.method in ['POST', 'GET']:
        proj = get_object_or_404(ProjectExperience, id=pk)
        action = request.POST.get('action') or request.GET.get('action', 'approve')
        proj.validation_status = 'APPROVED' if action == 'approve' else 'REJECTED'
        proj.save()
        messages.success(request, f'Project "{proj.project_name}" marked as {proj.validation_status}.')
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'message': f'Project {proj.validation_status.lower()}.', 'status': proj.validation_status})
    return redirect('/dashboard/?tab=admin-projects')

@csrf_exempt
def profile_update(request):
    if request.method in ['POST', 'PUT', 'PATCH']:
        data = parse_body(request)
        profile = get_target_profile(request, data)
        if not profile:
            if is_api_request(request): return JsonResponse({'error': 'Profile not found.'}, status=401)
            return redirect('dashboard')
        u, ud = profile.user, data.get('user', {})
        for f in ['first_name', 'last_name', 'email']:
            if f in data or f in ud: setattr(u, f, data.get(f, ud.get(f)))
        u.save()
        for f in ['designation', 'department', 'phone', 'location', 'summary', 'years_of_experience', 'linkedin_url']:
            if f in data: setattr(profile, f, data[f])
        profile.save()
        if is_api_request(request): return JsonResponse({'message': 'Profile updated successfully.', 'profile': EmployeeProfileSerializer(profile).data})
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
            employee=profile, project_name=name, customer_or_employer=data.get('customer_or_employer', ''),
            industry=data.get('industry', 'Technology'), start_date=data.get('start_date') or '2024-01-01',
            end_date=data.get('end_date') or None, business_problem=data.get('business_problem', ''),
            technology_stack=data.get('technology_stack', ''), individual_responsibilities=data.get('individual_responsibilities', ''),
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
        if profile and request.user.is_authenticated and not (request.user.is_staff or request.user.is_superuser):
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
        s_val = data.get('skill_id') or data.get('skill')
        code = data.get('skill_code') or data.get('code')
        name = data.get('skill_name') or data.get('name')
        rating = data.get('rating') or data.get('self_assessed_rating')
        if (s_val or code or name) and rating:
            skill = (Skill.objects.filter(skill_code=code).first() if code else None) or \
                    (Skill.objects.filter(name__iexact=name).first() if name else None) or \
                    (Skill.objects.filter(skill_code=str(s_val)).first() if s_val else None) or \
                    (Skill.objects.filter(id=int(s_val)).first() if str(s_val).isdigit() else None) or \
                    (Skill.objects.filter(name__iexact=str(s_val)).first() if s_val else None)
            if not skill:
                skill = Skill.objects.create(name=name or str(s_val), skill_code=code or f"SKL-{Skill.objects.count()+1:03d}", dimension=data.get('dimension', 'TECHNICAL'))
            comp, _ = CompetencyRating.objects.get_or_create(employee=profile, skill=skill, defaults={'self_assessed_rating': rating, 'validation_status': 'PENDING'})
            comp.self_assessed_rating = rating
            comp.validation_status = 'PENDING'
            if 'manager_feedback' in data: comp.manager_feedback = data['manager_feedback']
            comp.save()
            ev = data.get('project_evidence') or data.get('evidence_ids') or []
            if ev: comp.project_evidence.set(ProjectExperience.objects.filter(id__in=[p['id'] if isinstance(p, dict) else p for p in ev], employee=profile))
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
