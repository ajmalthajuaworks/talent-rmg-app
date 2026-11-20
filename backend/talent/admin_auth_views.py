# admin_auth_views.py — Dedicated Admin Authentication Controllers
import json
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.http import JsonResponse
from .auth_views import is_api_request

def parse_auth_data(request):
    if request.content_type == 'application/json':
        try: return json.loads(request.body)
        except Exception: return {}
    return request.POST

@csrf_exempt
def admin_login_page(request):
    """Dedicated Admin & Management Login Page. Enforces manual sign-in."""
    error = None
    if request.method == 'POST':
        data = parse_auth_data(request)
        username = data.get('username', '').strip()
        password = data.get('password', '')

        if not username or not password:
            error = 'Please enter both username/email and password.'
        else:
            user = authenticate(request, username=username, password=password)
            if user is None and '@' in username:
                u_obj = User.objects.filter(email__iexact=username).first()
                if u_obj:
                    user = authenticate(request, username=u_obj.username, password=password)

            if user is not None:
                if user.is_staff or user.is_superuser:
                    login(request, user)
                    if is_api_request(request):
                        return JsonResponse({'message': 'Admin login successful ! Redirecting to dashboard....','redirect':'/dashboard/'})
                    return redirect('dashboard')
                else:
                    error = 'Unauthorized: Admin access required.'
            else:
                error = 'Invalid username or password. Please try again.'

        if is_api_request(request):
            status_code = 403 if 'Unauthorized' in (error or '') else 400
            return JsonResponse({'error': error}, status=status_code)

    return render(request, 'talent/admin_login.html', {'error': error})

@csrf_exempt
def admin_logout_view(request):
    """Logs out admin and redirects back to the dedicated Admin Login page."""
    logout(request)
    messages.success(request, 'You have been signed out of the Admin Portal.')
    return redirect('admin_login')
