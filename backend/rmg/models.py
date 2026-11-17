from django.db import models
from talent.models import EmployeeProfile, Skill

# --- CHOICES DEFINED IN THE PROJECT SPECIFICATION ---

DEMAND_STATUS_CHOICES = [
    ('OPEN', 'Open'),
    ('PARTIAL', 'Partially Fulfilled'),
    ('FULFILLED', 'Fulfilled'),
    ('CLOSED', 'Closed'),
]

ALLOCATION_STATUS_CHOICES = [
    ('RESERVED', 'Reserved'),
    ('ALLOCATED', 'Allocated'),
    ('RELEASED', 'Released'),
]

# --- MODELS ---

class InternalProject(models.Model):
    """
    Maintains the internal project records and team requirements.
    """
    name = models.CharField(max_length=200)
    customer = models.CharField(max_length=200)
    practice = models.CharField(max_length=100)
    delivery_unit = models.CharField(max_length=100)
    
    start_date = models.DateField()
    expected_end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.customer})"


class ProjectDemand(models.Model):
    """
    Registers a customer or internal project staffing requirement (open positions).
    """
    project = models.ForeignKey(InternalProject, on_delete=models.CASCADE, related_name='demands')
    functional_role = models.CharField(max_length=100, help_text="e.g., Developer, Tech Lead, Architect")
    
    # Connecting the required technical and domain skills from the Talent app
    required_skills = models.ManyToManyField(Skill, related_name='demanded_for')
    
    positions_count = models.PositiveIntegerField(default=1)
    target_joining_date = models.DateField()
    status = models.CharField(max_length=20, choices=DEMAND_STATUS_CHOICES, default='OPEN')

    def __str__(self):
        return f"{self.project.name} - {self.functional_role} ({self.status})"


class ResourceAllocation(models.Model):
    """
    Tracks the deployment and availability of an employee on a specific project.
    """
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='allocations')
    project = models.ForeignKey(InternalProject, on_delete=models.CASCADE, related_name='team_members')
    
    # Links the allocation back to the original demand that requested it
    demand = models.ForeignKey(ProjectDemand, on_delete=models.SET_NULL, null=True, blank=True)
    
    allocation_percentage = models.PositiveIntegerField(default=100, help_text="Percentage of time allocated (e.g., 50, 100)")
    start_date = models.DateField()
    expected_end_date = models.DateField()
    
    status = models.CharField(max_length=20, choices=ALLOCATION_STATUS_CHOICES, default='RESERVED')

    def __str__(self):
        return f"{self.employee.user.last_name} -> {self.project.name} ({self.allocation_percentage}%)"