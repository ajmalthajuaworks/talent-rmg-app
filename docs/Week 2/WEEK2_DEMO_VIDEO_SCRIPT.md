# Week 2 Working Demonstration Video Script & Walkthrough

> **Application:** Talent Resource Management System (TalentRMG)  
> **Presenter:** Ajmal Thaju (Engineer / Employee & RMG Admin)  
> **Target Duration:** ~4 to 5 Minutes  
> **Evaluation Rubric Reference:** Section 6 (Demonstration of actual running functionality)

---

## 1. What is the Demo & What is Really Shown?

### High-Level Summary of the Demo
This demonstration shows the **end-to-end integration between Actor 1 (Engineer Portal) and Actor 2 (Manager / RMG Admin Portal)** delivered in Week 2. It demonstrates the live lifecycle of competency validation, multi-skill bulk assessment, automated resume extraction, and bidirectional reminder workflows.

### What is Really Shown On-Screen (Live Flow)
1. **Automated Resume & Skill Extraction:** Real-time regex and dictionary extraction from unstructured resume text, extracting contact information, employment history, and technical competencies without hardcoded fallbacks.
2. **Standardized Profile Setup & Employment History:** Navigating the tabbed setup (`Upload Resume`, `Manual Entry`, `Personal Info`) and adding employment history with dynamic multi-row employment forms.
3. **Validation Status & Evidence Actions:** The dedicated *Validation Status* dashboard showing status filters (`All`, `Approved`, `Pending`, `Action Required`), interactive *Resubmit* modal with evidence justification, and dynamic pending badges on the sidebar.
4. **Actor 2 (Manager / Admin) Review Workflows:** Logging into the executive manager portal (`/dashboard/`), reviewing competency queues, providing written manager feedback notes, and overriding approved ratings (`ADVANCED` -> `REVISED` to `BEGINNER`).
5. **Bidirectional Reminders & Acknowledgment:** Admin triggering a project portfolio update reminder (`ACTION_REQUIRED`), the engineer viewing the high-priority banner with custom feedback, acknowledging via **"✓ Mark as Completed"**, and the admin withdrawing notifications.

---

## 2. Minute-by-Minute Demonstration Script

| Timestamp | Demonstrated Feature | Functional ID | Screen Action & Spoken Description |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:40** | **Introduction & Milestone Overview** | Project Scope | **Screen:** Engineer Dashboard (`http://localhost:5173`).<br>**Narration:** *"Welcome to the Week 2 demonstration of TalentRMG. This week, we expanded our architecture into clean modular domains and integrated Actor 1 (Engineer) with Actor 2 (Manager) validation feedback loops."* |
| **0:40 – 1:25** | **Profile Setup & Multi-Employment History** | `ENG-O10`–`ENG-O12` | **Screen:** Profile Setup tab.<br>**Action:** Click `Personal Info` tab. Demonstrate two-column employment form with Company, Role, Start Date, End Date. Click `+ Add Another Employment`, fill details, and click `Save Employment`.<br>**Narration:** *"Here in Profile Setup, engineers manage career history through responsive two-column employment cards with dynamic row creation and instant backend persistence."* |
| **1:25 – 2:15** | **Resume Parsing & Skill Recognition** | `ENG-O02` | **Screen:** AI Recommendations & Resume Parsing.<br>**Action:** Paste realistic unstructured resume text. Show real-time extraction of skills (Python, Docker, React, Kafka) via regex word boundaries without hardcoded fallbacks. Click `Apply Extracted Data`.<br>**Narration:** *"The resume parser extracts exact taxonomy matches and project roles directly from raw text, eliminating manual entry friction."* |
| **2:15 – 3:00** | **Competency Validation Status & Evidence Actions** | `ENG-O05`, `ENG-O11` | **Screen:** Validation Status view (`/validation-status`).<br>**Action:** Toggle filter tabs (`All`, `Approved`, `Pending`, `Action Required`). Show Kubernetes with status `REJECTED` and Azure DevOps with `REVISED`. Click `+ Add Evidence` to open the evidence modal and submit supporting project links.<br>**Narration:** *"In Validation Status, engineers can inspect written manager feedback separately from self-assessments and attach verifiable project evidence to rejected or revised ratings."* |
| **3:00 – 3:50** | **Manager Review Portal & Rating Overrides** | `ADM-O01`–`ADM-O03` | **Screen:** Admin Portal (`http://127.0.0.1:8000/dashboard/`).<br>**Action:** Show the live validation queue. Click `Approve` or open review modal to enter validated level (e.g. `ADVANCED`) and written manager notes. Submit and verify status update in real-time.<br>**Narration:** *"Switching to Actor 2: Managers can approve, reject, or revise ratings with custom validated levels and written audit notes in a single click."* |
| **3:50 – 4:30** | **Bidirectional Reminders & Acknowledgment** | `ADM-O04`, `ADM-O05` | **Screen:** Admin Employee Directory -> Engineer Portal.<br>**Action:** In admin directory, click `📝 Feedback / Reminder`, toggle `Project Update Reminder Required`, and submit. In Engineer Portal, show the alert banner with manager feedback. Click `✓ Mark as Completed`. In Admin, show the `Withdraw Notification` button.<br>**Narration:** *"Admins can dispatch targeted project reminders. The engineer receives an alert banner and marks it completed, while the manager retains the ability to withdraw the notification."* |
| **4:30 – 4:50** | **4-Week Delivery Roadmap & Conclusion** | Deliverables | **Screen:** Click `📅 Roadmap` in top navbar to open `RoadmapModal`.<br>**Narration:** *"Here is our interactive 4-Week Delivery Roadmap mapping all 19 functional objectives. Week 2 deliverables are complete and verified by 39 automated tests."* |
