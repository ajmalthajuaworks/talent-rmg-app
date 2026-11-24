import json
from django.shortcuts import get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import EmployeeProfile
from .serializers import EmployeeProfileSerializer
from .auth_views import is_api_request

def parse_feedback_data(request):
    if request.content_type == 'application/json':
        try: return json.loads(request.body)
        except Exception: return {}
    return request.POST

@csrf_exempt
def send_employee_feedback(request, employee_id):
    """
    Receives is_profile_complete toggle, needs_project_update flag, and feedback_text.
    Saves to EmployeeProfile and records reminder timestamp.
    """
    if request.method not in ['POST', 'PUT', 'PATCH']:
        return JsonResponse({'error': 'POST method required'}, status=405)

    if request.user.is_authenticated and not (request.user.is_staff or request.user.is_superuser):
        if is_api_request(request):
            return JsonResponse({'error': 'Unauthorized: Admin access required.'}, status=403)
        messages.error(request, 'Unauthorized: Admin access required.')
        return redirect('admin_login')

    profile = EmployeeProfile.objects.filter(id=employee_id).first()
    if not profile:
        profile = get_object_or_404(EmployeeProfile, employee_id=str(employee_id))

    data = parse_feedback_data(request)

    feedback_text = data.get('feedback_text') or data.get('admin_feedback') or ''
    profile.admin_feedback = feedback_text.strip() if feedback_text else ''

    if 'needs_project_update' in data:
        val = data.get('needs_project_update')
        needs_update = str(val).lower() in ['true', '1', 'on', 'yes'] if isinstance(val, (str, int)) else bool(val)
        profile.needs_project_update = needs_update
        if needs_update:
            profile.project_reminder_sent_at = timezone.now()

    if 'is_profile_complete' in data:
        val = data.get('is_profile_complete')
        is_complete = str(val).lower() in ['true', '1', 'on', 'yes'] if isinstance(val, (str, int)) else bool(val)
        profile.is_profile_complete = is_complete

    profile.save()
    emp_name = profile.user.get_full_name() or profile.user.username
    messages.success(request, f'Admin feedback and reminder preferences updated for {emp_name}.')

    if is_api_request(request) or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'status': 'success',
            'message': f'Feedback updated for {emp_name}.',
            'profile': EmployeeProfileSerializer(profile).data
        })
    return redirect('/dashboard/?tab=admin-employees')
