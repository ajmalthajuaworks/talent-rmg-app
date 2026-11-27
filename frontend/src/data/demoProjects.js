// demoProjects.js — Realistic demo projects matching Actor 1 specifications
export const INITIAL_DEMO_PROJECTS = [
  {
    id: 1,
    project_name: 'Healthcare Claims Automation Platform',
    customer_or_employer: 'Apollo Hospitals',
    industry: 'Healthcare',
    start_date: '2024-01-01',
    end_date: '',
    date_display: 'Jan 2024 – Present · 2 yrs 10 mos',
    business_problem: 'Built a real-time insurance claims validation and processing platform. Designed REST APIs, integrated ML-based fraud detection, and implemented CI/CD pipelines.',
    individual_responsibilities: 'Designed REST APIs, integrated ML-based fraud detection, and implemented CI/CD pipelines.',
    measurable_achievements: 'Processed 50k daily claims with 99.9% uptime and 40% latency reduction.',
    technology_stack: 'Python, FastAPI, PostgreSQL, Kafka, Docker, Kubernetes, Azure',
    validation_status: 'APPROVED',
    is_current: true
  },
  {
    id: 2,
    project_name: 'Industrial IoT Monitoring System',
    customer_or_employer: 'Siemens AG',
    industry: 'Industrial',
    start_date: '2022-03-01',
    end_date: '2023-12-31',
    date_display: 'Mar 2022 – Dec 2023 · 1 yr 9 mos',
    business_problem: 'Developed a time-series data ingestion pipeline for 10,000+ IoT sensors across manufacturing floors. Implemented alerting and anomaly detection.',
    individual_responsibilities: '', // Triggers "⚠️ Missing individual responsibilities"
    measurable_achievements: 'Scaled telemetry ingestion pipeline to 10k sensors.',
    technology_stack: 'Python, InfluxDB, Grafana, MQTT, React, AWS',
    validation_status: 'PENDING',
    is_current: false
  },
  {
    id: 3,
    project_name: 'E-Commerce Analytics Dashboard',
    customer_or_employer: 'Flipkart Internet Pvt. Ltd.',
    industry: 'Retail',
    start_date: '2019-07-01',
    end_date: '2022-02-28',
    date_display: 'Jul 2019 – Feb 2022 · 2 yrs 7 mos',
    business_problem: 'Built data visualisation dashboards for sales and inventory analytics. Worked on ETL pipelines and real-time reporting.',
    individual_responsibilities: 'Worked on ETL pipelines and real-time reporting.',
    measurable_achievements: 'Decreased report generation latency from 15 minutes to 30 seconds.',
    technology_stack: 'Python, PySpark, Tableau, Redshift, Airflow',
    validation_status: 'DRAFT',
    is_current: false
  }
]
