# auth_views.py — Authentication & Registration Controllers
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import EmployeeProfile
from .serializers import EmployeeProfileSerializer

def is_api_request(request):
    accept = request.headers.get('Accept', '')
    content_type = request.headers.get('Content-Type', '')
    return 'application/json' in accept or 'application/json' in content_type or request.path.startswith('/api/')

@csrf_exempt
def login_page(request):
    """Handles both HTML browser login and JSON API login. Enforces manual sign-in."""
    error = None
    username_val = ''

    if request.method == 'POST':
        if request.content_type == 'application/json':
            import json
            try:
                data = json.loads(request.body)
            except Exception:
                data = {}
        else:
            data = request.POST

        username = data.get('username', '').strip()
        password = data.get('password', '')
        username_val = username
        next_url = data.get('next') or request.GET.get('next') or '/dashboard/'

        if not username or not password:
            error = 'Please enter both username and password.'
            err_status = 400
        else:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                if is_api_request(request):
                    try:
                        profile = EmployeeProfile.objects.get(user=user)
                        profile_data = EmployeeProfileSerializer(profile).data
                    except EmployeeProfile.DoesNotExist:
                        profile_data = None
                    return JsonResponse({
                        'message': 'Login successful.',
                        'user_id': user.id,
                        'username': user.username,
                        'profile': profile_data
                    })
                return redirect(next_url)
            else:
                error = 'Invalid username or password. Please try again.'
                err_status = 401

        if is_api_request(request):
            return JsonResponse({'error': error}, status=err_status)

    return render(request, 'talent/login.html', {
        'error': error,
        'username': username_val,
        'next': request.GET.get('next', '')
    })

@csrf_exempt
def signup_page(request):
    """Handles both HTML browser signup and JSON API signup."""
    if request.user.is_authenticated and request.method == 'GET':
        return redirect('/dashboard/')

    error = None
    form_data = {}

    if request.method == 'POST':
        if request.content_type == 'application/json':
            import json
            try:
                data = json.loads(request.body)
            except Exception:
                data = {}
        else:
            data = request.POST

        form_data = {
            'username': data.get('username', '').strip(),
            'email': data.get('email', '').strip(),
            'first_name': data.get('first_name', '').strip(),
            'last_name': data.get('last_name', '').strip(),
            'employee_id': data.get('employee_id', '').strip(),
            'designation': data.get('designation', '').strip(),
            'department': data.get('department', '').strip(),
        }
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')

        if not form_data['username']:
            error = 'Username is required.'
        elif User.objects.filter(username=form_data['username']).exists():
            error = f"Username '{form_data['username']}' already exists."
        elif not password or len(password) < 6:
            error = 'Password must be at least 6 characters long.'
        elif password != confirm_password:
            error = 'Passwords do not match.'
        elif not form_data['employee_id'] or not form_data['designation'] or not form_data['department']:
            error = 'Employee ID, Designation, and Department are mandatory.'
        elif EmployeeProfile.objects.filter(employee_id=form_data['employee_id']).exists():
            error = f"Employee ID '{form_data['employee_id']}' is already in use."
        else:
            user = User.objects.create_user(
                username=form_data['username'],
                email=form_data['email'],
                password=password,
                first_name=form_data['first_name'],
                last_name=form_data['last_name']
            )
            profile = EmployeeProfile.objects.create(
                user=user,
                employee_id=form_data['employee_id'],
                designation=form_data['designation'],
                department=form_data['department']
            )
            login(request, user)
            if is_api_request(request):
                return JsonResponse({
                    'message': 'Account created successfully.',
                    'user_id': user.id,
                    'username': user.username,
                    'profile': EmployeeProfileSerializer(profile).data
                }, status=201)
            messages.success(request, f"Welcome to TalentRMG, {user.first_name or user.username}!")
            return redirect('/dashboard/')

        if is_api_request(request):
            return JsonResponse({'error': error}, status=400)

    return render(request, 'talent/signup.html', {'error': error, 'form_data': form_data})

@csrf_exempt
def logout_view(request):
    """Logs the user out and redirects to login."""
    logout(request)
    if is_api_request(request):
        return JsonResponse({'message': 'Logged out successfully.'})
    messages.success(request, 'You have been signed out.')
    return redirect('login')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Returns the profile of the logged-in employee."""
    try:
        profile = EmployeeProfile.objects.get(user=request.user)
        return Response(EmployeeProfileSerializer(profile).data)
    except EmployeeProfile.DoesNotExist:
        return Response({'detail': 'Employee profile not found.'}, status=status.HTTP_404_NOT_FOUND)
