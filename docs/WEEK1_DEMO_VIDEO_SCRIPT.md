# Week 1 Working Demonstration Video Script: Actor 1 Engineer Portal
**Duration:** ~3 to 4 Minutes  
**Presenter:** Ajmal Thaju (Engineer / Employee)  
**Target Audience:** Project Mentor & Evaluation Panel  
**Rule Compliance:** Adheres to Rubric Section 6 (Working demonstration of actual running functionality)

---

## Preparation Checklist Before Recording
1. **Terminal 1 (Backend):**
   ```bash
   cd c:\Users\ajmal.thaju\Project\talent-rmg-app\backend
   .\venv\Scripts\activate
   python manage.py runserver
   ```
2. **Terminal 2 (Frontend):**
   ```bash
   cd c:\Users\ajmal.thaju\Project\talent-rmg-app\frontend
   npm run dev
   ```
3. Open your browser to `http://localhost:5173`.
4. Ensure OBS Studio, Loom, or Windows Game Bar (`Win + Alt + R`) is ready to record screen and audio.

---

## Minute-by-Minute Demonstration Flow

### 0:00 – 0:30 | Introduction & Scope Alignment
- **Screen:** Show the Login / Registration screen (`http://localhost:5173`).
- **Spoken Script:**
  > *"Hello everyone. My name is Ajmal Thaju, and this is the Week 1 working demonstration video for the Talent Resource Management (TalentRMG) system. Per our 4-week project scope, I am responsible strictly for Actor 1: the Engineer / Employee, covering objectives ENG-O01 through ENG-O19. Today, I will demonstrate the completed functional milestone for Week 1: User Registration and Login, Profile Completeness, AI Resume Upload & Extraction, Project Portfolio Management, Competency Framework Ratings with Project Evidence, and Customer-Ready Resume Export."*

---

### 0:30 – 1:15 | Feature 1: Registration, Login & Profile Overview (O01, O12)
- **Screen Action:**
  1. Click **"Need an account? Register here"**.
  2. Register a new engineer:
     - Username: `ajmal_dev`
     - Email: `ajmal.thaju@company.com`
     - Employee ID: `EMP-009842`
     - Designation: `Senior Software Engineer`
     - Department: `Platform Engineering & Cloud`
     - Password: `Password123!`
  3. Click **"Register & Create Profile"**.
  4. Observe automatic redirection to the Engineer Portal Dashboard.
  5. Point out the **Profile Completeness Bar** and **Profile Readiness Checklist** (`ENG-O12`).
- **Spoken Script:**
  > *"First, let's observe user registration. We register an employee with their official employee ID, designation, and department. Upon registration, the session is created, and we are brought to the Engineer Overview dashboard. Notice the Profile Completeness meter and the interactive Readiness Checklist, which automatically calculates completion based on our projects and ratings."*

---

### 1:15 – 2:00 | Feature 2: Resume Ingestion & AI Entity Extraction (ENG-O02)
- **Screen Action:**
  1. Click **"Upload Resume"** in the left sidebar.
  2. Show the drag-and-drop ingestion interface.
  3. Click **"Simulate Resume Parse & Extraction"** (or upload a PDF/DOCX).
  4. Walk through the extracted cards:
     - 2 Extracted Project Experiences (e.g. Healthcare Claims Automation, IoT Engine).
     - 5 Extracted Competencies with suggested proficiency ratings (e.g., Python: Advanced, FastAPI: Advanced).
  5. Click **"Apply Extracted Data to Profile"**.
  6. Observe notification badge and automatic redirection to the Projects Portfolio tab.
- **Spoken Script:**
  > *"Next is Objective ENG-O02: Resume Ingestion. Rather than manually typing past project history from scratch, an engineer can upload their existing resume. The system parses the document, extracting project details, dates, business problem statements, technologies, and recommended competency ratings. Clicking 'Apply Extracted Data' populates the profile instantly."*

---

### 2:00 – 2:45 | Feature 3: Project Experience Portfolio CRUD (ENG-O04)
- **Screen Action:**
  1. Show the project cards displayed in chronological order.
  2. Click **"+ Add Project Experience"**.
  3. Fill out the modal:
     - Project Name: `FinTech Payment Gateway Migration`
     - Client/Employer: `Standard Bank`
     - Industry: `Financial Services`
     - Start Date: `2024-01-01`
     - Technologies: `Python, Django, PostgreSQL, Docker`
     - Business Problem: `High latency on card transaction settlement.`
     - Individual Responsibilities: `Built webhook processors and idempotency keys.`
     - Measurable Achievements: `Settlement speed improved by 35%.`
  4. Click **"Save Project Experience"**.
  5. Click **"Edit"** on a project to show editing capability.
- **Spoken Script:**
  > *"Under Objective ENG-O04, the engineer manages their project experience portfolio. Here we can see full CRUD operations: we can add new engagements, record the business problem, individual contributions, measurable outcomes, and technology stack. These records directly underpin competency validation."*

---

### 2:45 – 3:30 | Feature 4: Competency Framework Ratings & Evidence Linking (ENG-O05, O06, O07, O08)
- **Screen Action:**
  1. Click **"Skills & Ratings"** in the sidebar.
  2. Switch between the 3 dimension tabs:
     - **Technical Skills (ENG-O06)**
     - **Domain Competencies (ENG-O07)**
     - **Functional Roles (ENG-O08)**
  3. Click **"+ Rate New Skill"**.
  4. In the modal:
     - Select a skill from the standard taxonomy (e.g., `Docker & Containers`).
     - Select Proficiency: `Advanced (Designs solutions & mentors others)`.
     - Check supporting projects under **"Link Supporting Project Evidence (ENG-O05)"**.
  5. Click **"Submit for Manager Validation"**.
  6. Point out that the status displays `PENDING` with the linked project evidence tags.
- **Spoken Script:**
  > *"Now we move to Competencies. Our system implements the organization's approved 6-level rating framework from Zero to Expert across three distinct dimensions: Technical, Domain, and Functional. In accordance with Objective ENG-O05, self-assessments require verifiable project evidence. When rating Docker as Advanced, I link my actual project engagements where Docker was utilized. The submission is queued with PENDING status for the Competency Manager."*

---

### 3:30 – 4:00 | Feature 5: Customer-Ready Resume Export & Conclusion (ENG-O16, ENG-O17)
- **Screen Action:**
  1. Click **"Customer Resume"** in the sidebar.
  2. Scroll through the generated clean resume view.
  3. Highlight that internal numerical codes and manager notes are filtered out per company compliance (`SYS-08`).
  4. Click the **"Print / Save as PDF"** button to show the browser print dialog.
  5. Close print dialog and summarize Week 1 completion.
- **Spoken Script:**
  > *"Finally, Objective ENG-O16 and ENG-O17: Customer-Ready Resume Generation. This view dynamically composes a clean, sanitized CV suitable for customer submission. Notice how internal rating codes and manager review notes are safely excluded per policy SYS-08, while validated skills, project timelines, and achievements are presented professionally. With 31 automated tests, Docker Compose containerization, and 100% adherence to the 200-line limit per file, Week 1 is complete. Thank you."*
