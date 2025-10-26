// Curriculum data for 24-week AI Deployment Learning Plan
// Wednesday: Tools Kit - hands-on enterprise workflows
// Sunday: Concepts Clarity - deep theory and reasoning for regulated BFSI environments

export interface CurriculumTopic {
  week: number
  phase: string
  topic: string
  description: string
}

// Wednesday Topics - Tools Kit
export const wednesdayTopics: CurriculumTopic[] = [
  // Week 1-4: Foundations
  { week: 1, phase: 'Foundations', topic: 'Prometheus + Loki + Grafana for Model Monitoring & Audit Trails', description:'' },
  { week: 2, phase: 'Foundations', topic: 'LangChain Retrieval Pipeline for KYC/Claims', description:'' },
  { week: 3, phase: 'Foundations', topic: 'Vector DB Setup (Qdrant / Weaviate) + PII Filtering', description:'' },
  { week: 4, phase: 'Foundations', topic: 'SHAP + LIME Explainability Reports for Audit Committees', description:'' },
  
  // Week 5-8: Data & Infrastructure
  { week: 5, phase: 'Data & Infrastructure', topic: 'Data Quality Assessment Tools', description: 'Ensuring data quality in AI systems' },
  { week: 6, phase: 'Data & Infrastructure', topic: 'Privacy Tools and Libraries', description: 'Implementing privacy-preserving techniques' },
  { week: 7, phase: 'Data & Infrastructure', topic: 'Lineage Tracking Implementation', description: 'Tracking data flow and transformations' },
  { week: 8, phase: 'Data & Infrastructure', topic: 'Security Scanning for AI Systems', description: 'Securing AI infrastructure and deployments' },
  
  // Week 9-12: Model Development
  { week: 9, phase: 'Model Development', topic: 'MLOps Pipeline Setup', description: 'Building automated ML pipelines' },
  { week: 10, phase: 'Model Development', topic: 'Automated Testing Frameworks', description: 'Testing ML models systematically' },
  { week: 11, phase: 'Model Development', topic: 'Fairness Testing Tools', description: 'Detecting and mitigating bias in models' },
  { week: 12, phase: 'Model Development', topic: 'Explainability Libraries', description: 'Making AI decisions interpretable' },
  
  // Week 13-16: Risk Management
  { week: 13, phase: 'Risk Management', topic: 'Risk Assessment Frameworks', description: 'Evaluating and managing model risks' },
  { week: 14, phase: 'Risk Management', topic: 'Monitoring Dashboard Setup', description: 'Real-time monitoring of AI systems' },
  { week: 15, phase: 'Risk Management', topic: 'Alert Management Tools', description: 'Managing incidents and responses' },
  { week: 16, phase: 'Risk Management', topic: 'Vendor Assessment Templates', description: 'Evaluating third-party AI solutions' },
  
  // Week 17-20: Deployment & Operations
  { week: 17, phase: 'Deployment & Operations', topic: 'CI/CD for ML Models', description: 'Continuous integration and deployment for ML' },
  { week: 18, phase: 'Deployment & Operations', topic: 'Configuration Management', description: 'Managing configurations across environments' },
  { week: 19, phase: 'Deployment & Operations', topic: 'Performance Tracking Tools', description: 'Monitoring model performance in production' },
  { week: 20, phase: 'Deployment & Operations', topic: 'Business Continuity Planning', description: 'Ensuring operational resilience' },
  
  // Week 21-24: Governance & Future
  { week: 21, phase: 'Governance & Future', topic: 'Ethics Assessment Frameworks', description: 'Implementing responsible AI practices' },
  { week: 22, phase: 'Governance & Future', topic: 'Reporting Templates', description: 'Communicating with stakeholders' },
  { week: 23, phase: 'Governance & Future', topic: 'Compliance Documentation', description: 'Meeting regulatory reporting requirements' },
  { week: 24, phase: 'Governance & Future', topic: 'Emerging Technology Assessment', description: 'Staying ahead of AI developments' },
]

// Sunday Topics - Concepts Clarity
export const sundayTopics: CurriculumTopic[] = [
  // Week 1-4: Foundations
  { week: 1, phase: 'Foundations', topic: 'AI Governance Frameworks in Banking', description: 'Understanding regulatory frameworks for AI in financial services' },
  { week: 2, phase: 'Foundations', topic: 'Model Risk Management Fundamentals', description: 'Core principles of managing AI model risks                       ' },
  { week: 3, phase: 'Foundations', topic: 'Regulatory Landscape (UK/EU)', description: 'Navigating UK and EU AI regulations                                    ' },
  { week: 4, phase: 'Foundations', topic: 'Enterprise AI Architecture Patterns', description: 'Designing scalable AI systems for enterprises                   ' },
  
  // Week 5-8: Data & Infrastructure
  { week: 5, phase: 'Data & Infrastructure', topic: 'Data Governance in Regulated Environments', description: 'Managing data in compliance with regulations    ' },
  { week: 6, phase: 'Data & Infrastructure', topic: 'Privacy-Preserving AI Techniques', description: 'Protecting privacy while leveraging AI                   ' },
  { week: 7, phase: 'Data & Infrastructure', topic: 'Data Lineage and Audit Trails', description: 'Tracking data provenance and usage' },
  { week: 8, phase: 'Data & Infrastructure', topic: 'Infrastructure Security Standards', description: 'Securing AI infrastructure in financial services' },
  
  // Week 9-12: Model Development
  { week: 9, phase: 'Model Development', topic: 'Model Development Lifecycle', description: 'End-to-end ML model development process' },
  { week: 10, phase: 'Model Development', topic: 'Testing and Validation Frameworks', description: 'Rigorous testing and validation approaches' },
  { week: 11, phase: 'Model Development', topic: 'Bias Detection and Mitigation', description: 'Identifying and addressing algorithmic bias' },
  { week: 12, phase: 'Model Development', topic: 'Explainability Requirements', description: 'Meeting explainability standards in BFSI' },
  
  // Week 13-16: Risk Management
  { week: 13, phase: 'Risk Management', topic: 'Model Risk Assessment', description: 'Comprehensive model risk evaluation' },
  { week: 14, phase: 'Risk Management', topic: 'Monitoring and Alerting Strategies', description: 'Proactive monitoring and incident detection' },
  { week: 15, phase: 'Risk Management', topic: 'Incident Response Planning', description: 'Preparing for and responding to AI incidents' },
  { week: 16, phase: 'Risk Management', topic: 'Third-Party AI Risk', description: 'Managing risks from external AI providers' },
  
  // Week 17-20: Deployment & Operations
  { week: 17, phase: 'Deployment & Operations', topic: 'Production Deployment Standards', description: 'Best practices for deploying AI in production' },
  { week: 18, phase: 'Deployment & Operations', topic: 'Change Management Processes', description: 'Managing changes to AI systems safely' },
  { week: 19, phase: 'Deployment & Operations', topic: 'Performance Monitoring', description: 'Continuous performance assessment' },
  { week: 20, phase: 'Deployment & Operations', topic: 'Operational Resilience', description: 'Building resilient AI operations' },
  
  // Week 21-24: Governance & Future
  { week: 21, phase: 'Governance & Future', topic: 'AI Ethics and Responsible AI', description: 'Ethical considerations in AI deployment' },
  { week: 22, phase: 'Governance & Future', topic: 'Stakeholder Communication', description: 'Effective communication about AI systems' },
  { week: 23, phase: 'Governance & Future', topic: 'Regulatory Reporting', description: 'Meeting regulatory reporting obligations' },
  { week: 24, phase: 'Governance & Future', topic: 'Future Trends and Adaptations', description: 'Preparing for future AI developments' },
]
