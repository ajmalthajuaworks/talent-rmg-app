from django.db import models
from django.contrib.auth.models import User

# --- CHOICES DEFINED IN THE PROJECT SPECIFICATION ---

RATING_CHOICES = [
    ('ZERO', 'Zero Skill'),
    ('TRAINED', 'Trained'),
    ('BEGINNER', 'Beginner'),
    ('INTERMEDIATE', 'Intermediate'),
    ('ADVANCED', 'Advanced'),
    ('EXPERT', 'Expert'),
]

SKILL_DIMENSION_CHOICES = [
    ('TECHNICAL', 'Technical'),
    ('DOMAIN', 'Domain'),
    ('FUNCTIONAL', 'Functional'),
]

VALIDATION_STATUS_CHOICES = [
    ('DRAFT', 'Draft / Unsubmitted'),
    ('PENDING', 'Pending Manager Validation'),
    ('APPROVED', 'Approved'),
    ('REJECTED', 'Rejected'),
    ('REVISED', 'Revised by Manager'),
]

REMINDER_STATUS_CHOICES = [
    ('NONE', 'None'),
    ('ACTION_REQUIRED', 'Action Required'),
    ('COMPLETED_BY_EMPLOYEE', 'Completed by Employee'),
]


# --- MODELS ---

class EmployeeProfile(models.Model):
    """
    Maintains the standardized employee profile.
    Linked one-to-one with Django's built-in User model for authentication.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=20, unique=True)
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    phone = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=150, blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    years_of_experience = models.CharField(max_length=50, blank=True, null=True)
    linkedin_url = models.CharField(max_length=255, blank=True, null=True)
    
    # Profile Status tracking
    is_profile_complete = models.BooleanField(default=False)
    last_substantive_update = models.DateTimeField(auto_now=True)
    
    # Admin Communication & Reminder tracking
    admin_feedback = models.TextField(blank=True, null=True)
    needs_project_update = models.BooleanField(default=False)
    project_reminder_sent_at = models.DateTimeField(null=True, blank=True)
    reminder_status = models.CharField(max_length=30, choices=REMINDER_STATUS_CHOICES, default='NONE')
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.employee_id}"


class Skill(models.Model):
    """
    The central taxonomy for all skills across the organization.
    """
    name = models.CharField(max_length=100)
    skill_code = models.CharField(max_length=50, unique=True)
    dimension = models.CharField(max_length=20, choices=SKILL_DIMENSION_CHOICES)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.skill_code} - {self.name} ({self.get_dimension_display()})"


class ProjectExperience(models.Model):
    """
    Past and current project experiences added by the employee (like a resume).
    Distinct from the RMG app's internal project allocations.
    """
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='project_experiences')
    project_name = models.CharField(max_length=200)
    customer_or_employer = models.CharField(max_length=200)
    industry = models.CharField(max_length=100)
    
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True) # Blank if current project
    
    business_problem = models.TextField(blank=True, null=True)
    technology_stack = models.TextField(help_text="Comma separated list of technologies used")
    individual_responsibilities = models.TextField()
    measurable_achievements = models.TextField(blank=True, null=True)
    validation_status = models.CharField(max_length=20, choices=VALIDATION_STATUS_CHOICES, default='PENDING')

    def __str__(self):
        return f"{self.project_name} ({self.employee.user.username})"


class CompetencyRating(models.Model):
    """
    Maps an employee to a skill, storing self-assessments separately from approved ratings.
    """
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='competencies')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    
    # AI or System Recommendations
    is_ai_recommended = models.BooleanField(default=False)
    
    # Self Assessment
    self_assessed_rating = models.CharField(max_length=20, choices=RATING_CHOICES, null=True, blank=True)
    
    # Manager Validation
    approved_rating = models.CharField(max_length=20, choices=RATING_CHOICES, null=True, blank=True)
    validation_status = models.CharField(max_length=20, choices=VALIDATION_STATUS_CHOICES, default='DRAFT')
    manager_feedback = models.TextField(blank=True, null=True)
    
    # Linking evidence (An employee can select multiple projects to prove a skill)
    project_evidence = models.ManyToManyField(ProjectExperience, blank=True, related_name='proven_skills')

    class Meta:
        # Prevent duplicate ratings for the same skill per employee
        unique_together = ('employee', 'skill')

    def __str__(self):
        return f"{self.employee.user.username} - {self.skill.name} ({self.validation_status})"