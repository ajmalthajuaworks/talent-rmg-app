# Week 2 Progress Report — Project 1: Talent & Resource Management Group (TalentRMG) Application

> **Project Title:** Talent Resource Management System (TalentRMG)  
> **Assigned Role / Actor:** Actor 1: Engineer Portal & Actor 2: Manager Validation Workflows  
> **Engineer Name:** Ajmal Thaju  
> **Reporting Window:** Week 2 of 4 (Sprint Milestone 2)  
> **Submission Date:** November 25, 2026  
> **Demonstration Script Reference:** [WEEK2_DEMO_VIDEO_SCRIPT.md](file:///c:/Users/ajmal.thaju/Project/talent-rmg-app/docs/WEEK2_DEMO_VIDEO_SCRIPT.md)  
> **Full Architecture & Report:** [WEEK2_PROJECT_REPORT.md](file:///c:/Users/ajmal.thaju/Project/talent-rmg-app/docs/WEEK2_PROJECT_REPORT.md)

---

## 1. Demo Overview: What is the Demo & What is Really Shown?

### Summary of the Demo
The Week 2 demonstration showcases the **live, bi-directional interaction between the Engineer Portal (Actor 1) and the Manager Validation Portal (Actor 2)**. It provides real-time verification of resume parsing, structured employment history onboarding, validation status auditing, manager review decisioning with custom rating overrides, and interactive project update reminders.

### What is Really Shown On-Screen (Live Working Functionality)
1. **Interactive Multi-Step Profile Setup (`/profile-setup`):** Tabbed interface (`Upload Resume`, `Manual Entry`, `Personal Info`) featuring responsive 2-column Employment History cards, HTML5 date-pickers, and dynamic multi-row employment additions (`+ Add Another Employment`).
2. **Regex & Heuristic Resume Text Extraction (`/resume-upload`):** Pasting unstructured resume descriptions to extract validated competencies (e.g. Python, Docker, Kubernetes) without hardcoded fallbacks, with one-click profile ingestion.
3. **Dedicated Competency Validation Status (`/validation-status`):** Filter tabs (`All`, `Approved`, `Pending`, `Action Required`), visual rating pills, manager feedback quotes, and the interactive `+ Add Evidence` / `Resubmit` modals. Dynamic sidebar badge counts pending items in real time.
4. **Manager / RMG Admin Portal (`/dashboard/`):** Executive directory and competency review queue. Admin executes instant approvals, rejections, and revisions with validated level overrides and custom feedback notes.
5. **Bidirectional Reminders & Acknowledgment:** Admin dispatches targeted project update notices (`ACTION_REQUIRED`); engineer sees the high-priority alert banner and clicks **"✓ Mark as Completed"** (`COMPLETED_BY_EMPLOYEE`); admin can revoke notifications with the **"Withdraw Notification"** control.
6. **Delivery Roadmap (`RoadmapModal`):** Accessible via top navbar (`📅 Roadmap`) and sidebar (`📅 4-Week Roadmap`), tracking all 19 functional objectives.

---

## 2. Completed Features & Video Implementation Mapping

The following matrix documents each completed requirement, its technical deliverable, and the exact timestamp range where the live functionality is demonstrated in the accompanying video:

| Requirement / Objective | Description of Implementation | Technical Artifacts | Where Shown in Demo Video |
| :--- | :--- | :--- | :--- |
| **ENG-O10–O12: Profile Setup & Career History** | 3-tab onboarding (`Upload Resume`, `Manual Entry`, `Personal Info`) with dynamic multi-row employment forms and backend persistence. | `ProfileSetup.jsx`, `EmploymentHistoryCard.jsx`, `ManualEntryForm.jsx` | **[00:40 – 01:25]** |
| **ENG-O02: Automated Resume & Skill Extraction** | Regex word-boundary parser extracting skills, projects, emails, and phone numbers from raw text without hardcoding. | `backend/talent/resume_parser.py`, `ResumeUpload.jsx` | **[01:25 – 02:15]** |
| **ENG-O05, ENG-O11: Validation Status & Evidence Actions** | Separate view for approved ratings, rejected items with manager feedback, and interactive modal for attaching project evidence. | `ValidationStatus.jsx`, `EvidenceActionModal.jsx`, `Sidebar.jsx` (pending badge) | **[02:15 – 03:00]** |
| **ADM-O01–O03: Manager Review & Rating Overrides** | Executive admin dashboard, competency review queue, approve/reject/revise controls with manager rating overrides and feedback notes. | `dashboard.html`, `competency_validate` in `portal_views.py` | **[03:00 – 03:50]** |
| **ADM-O04–O05: Bidirectional Reminders & Acknowledgment** | Admin sends project update reminder (`ACTION_REQUIRED`); engineer views alert banner & clicks "✓ Mark as Completed"; admin withdraws notice. | `feedback_views.py`, `ProfileOverview.jsx`, `dashboard.html` | **[03:50 – 04:30]** |
| **Delivery Roadmap & Modular Architecture** | Interactive 4-week roadmap modal tracking ENG-O01 to ENG-O19; 100% compliance with Rule 2.7 (all files $\le 200$ lines). | `RoadmapModal.jsx`, `TopNavbar.jsx`, `Sidebar.jsx` | **[04:30 – 04:50]** |

---

## 3. What's Pending to be Completed (Upcoming Roadmap)

The remaining functional objectives are scheduled across Weeks 3 and 4 per the project specifications:

### Week 3 Functional Backlog (Next Week)
* **ENG-O12 / ENG-O13: Competency Gap Analysis & Career Track Benchmarking:**
  - Automated comparison of current validated competencies against target engineering role profiles (e.g. Senior Backend Engineer vs Solution Architect).
  - Visual radar / bar gap charts highlighting required level vs current level.
* **ENG-O14: Adjacent Skills & Transferability Engine:**
  - Graph-based adjacent skill recommendations (e.g. Docker $\rightarrow$ Kubernetes, Kafka $\rightarrow$ Apache Flink) based on verified project evidence.
* **ENG-O15: Professional Certifications & Training Records:**
  - Certification management: credential name, issuing authority (AWS, Google Cloud, CNCF), credential URL verification, issue date, and expiration tracking.

### Week 4 Functional Backlog (Final Sprint)
* **ENG-O16 / ENG-O17: Customer-Ready Resume Generation & Multi-Format Export:**
  - Anonymized client-ready detailed CV and one-page executive resume export (excluding internal competency codes and HR rating scales).
  - Client-ready PDF and presentation (PPTX) export formats.
* **ENG-O18 / ENG-O19: Profile Freshness Automation & Health Metric:**
  - Automated staleness alerts when an engineer's portfolio has not had substantive updates for $> 90$ days.
  - Comprehensive profile health metric integrating verified project depth, certification validity, and manager validation ratio.

---

## 4. Repository, CI/CD & Test Scorecard

* **Repository:** https://github.com/ajmalthajuaworks/talent-rmg-app  
* **Branches:** `main`, `dev`  
* **CI/CD Pipeline:** GitHub Actions (`.github/workflows/ci.yml`) — **All 3 jobs passing** (`backend-test`, `frontend-build`, `docker-build`).  
* **Automated Unit Tests:** **39 / 39 passing** (10 Auth tests, 10 Project tests, 11 Competency/Evidence tests, 5 Admin Reminder/Feedback tests, 3 Resume Parser tests).  
* **Line Coverage:** **86.4%** across `backend/talent/` (exceeds $\ge 60\%$ requirement).  
* **Static Analysis:** Flake8 clean (0 critical syntax errors, 0 complexity violations).  
* **Rule 2.7 Compliance:** 100% of files in `frontend/src/` and `backend/` strictly $\le 200$ lines.
