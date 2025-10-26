// Curriculum data for 24-week AI Deployment Learning Plan
// Wednesday: Tools Kit - hands-on enterprise workflows
// Sunday: Concepts Clarity - deep theory and reasoning for regulated BFSI environments

export interface CurriculumItem {
  week: number
  phase: string
  title: string
  description: string
}

export const curriculum: CurriculumItem[] = [
  // Phase 1 — Foundations of Enterprise AI Deployment (Weeks 1–4)
  {
    week: 1,
    phase: 'Phase 1 — Foundations of Enterprise AI Deployment',
    title: 'Model Monitoring and Audit Dashboards',
    description: 'Implement model metrics and evidence logs for operational oversight.',
  },
  {
    week: 2,
    phase: 'Phase 1 — Foundations of Enterprise AI Deployment',
    title: 'Retrieval Pipelines for Regulated Workflows',
    description: 'Build retrieval workflows with traceability controls for financial processes.',
  },
  {
    week: 3,
    phase: 'Phase 1 — Foundations of Enterprise AI Deployment',
    title: 'Vector Search with Privacy Filtering',
    description: 'Enable semantic search while preventing exposure of sensitive records.',
  },
  {
    week: 4,
    phase: 'Phase 1 — Foundations of Enterprise AI Deployment',
    title: 'Explainability Reports for Model Oversight',
    description: 'Generate structured rationales required for audit and committee review.',
  },

  // Phase 2 — Data Governance & Security Controls (Weeks 5–8)
  {
    week: 5,
    phase: 'Phase 2 — Data Governance & Security Controls',
    title: 'Data Redaction and Classification Controls',
    description: 'Mask sensitive attributes while preserving operational decision usefulness.',
  },
  {
    week: 6,
    phase: 'Phase 2 — Data Governance & Security Controls',
    title: 'Zero-Trust AI Access Gateways',
    description: 'Restrict model access and prevent unapproved data or output usage.',
  },
  {
    week: 7,
    phase: 'Phase 2 — Data Governance & Security Controls',
    title: 'Drift Detection and Output Stability Alerts',
    description: 'Monitor model shifts and trigger review when behavior changes.',
  },
  {
    week: 8,
    phase: 'Phase 2 — Data Governance & Security Controls',
    title: 'Role-Based Access and Secret Management',
    description: 'Enforce identity controls and secure credential distribution.',
  },

  // Phase 3 — Model Lifecycle & Operational Oversight (Weeks 9–12)
  {
    week: 9,
    phase: 'Phase 3 — Model Lifecycle & Operational Oversight',
    title: 'Model Versioning and Rollback Workflows',
    description: 'Track model versions and revert deployments safely when required.',
  },
  {
    week: 10,
    phase: 'Phase 3 — Model Lifecycle & Operational Oversight',
    title: 'Document Intelligence and Claims Automation',
    description: 'Extract structured meaning from documents to support case operations.',
  },
  {
    week: 11,
    phase: 'Phase 3 — Model Lifecycle & Operational Oversight',
    title: 'Chain-of-Custody Audit Logging',
    description: 'Maintain tamper-evident logs of model decisions and inputs.',
  },
  {
    week: 12,
    phase: 'Phase 3 — Model Lifecycle & Operational Oversight',
    title: 'Validation and Challenger Model Evaluation',
    description: 'Compare candidate models under consistent evaluation criteria.',
  },

  // Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces (Weeks 13–16)
  {
    week: 13,
    phase: 'Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces',
    title: 'Enterprise Embedding and Retrieval Workflow',
    description: 'Index and retrieve enterprise knowledge while maintaining access boundaries.',
  },
  {
    week: 14,
    phase: 'Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces',
    title: 'Guardrails and Output Moderation Policies',
    description: 'Control generated responses to align with compliance requirements.',
  },
  {
    week: 15,
    phase: 'Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces',
    title: 'Internal Search and Knowledge Assistant Console',
    description: 'Provide controlled internal access to organizational information repositories.',
  },
  {
    week: 16,
    phase: 'Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces',
    title: 'Incident Response Playbooks for AI Systems',
    description: 'Define operational steps when model behavior needs intervention.',
  },

  // Phase 5 — Deployment Governance & Fairness Oversight (Weeks 17–20)
  {
    week: 17,
    phase: 'Phase 5 — Deployment Governance & Fairness Oversight',
    title: 'Deployment Approval and Evidence Packs',
    description: 'Compile documentation required for governance and production release.',
  },
  {
    week: 18,
    phase: 'Phase 5 — Deployment Governance & Fairness Oversight',
    title: 'Fairness and Bias Monitoring Dashboards',
    description: 'Track performance differences across groups to ensure equity.',
  },
  {
    week: 19,
    phase: 'Phase 5 — Deployment Governance & Fairness Oversight',
    title: 'Secure and Isolated Inference Execution',
    description: 'Execute models in controlled environments with restricted network access.',
  },
  {
    week: 20,
    phase: 'Phase 5 — Deployment Governance & Fairness Oversight',
    title: 'Regulatory QA and Document Review Bots',
    description: 'Use retrieval systems to analyze compliance and regulatory text.',
  },

  // Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy (Weeks 21–24)
  {
    week: 21,
    phase: 'Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy',
    title: 'Model Performance and Audit Analytics',
    description: 'Present trends and exceptions for oversight and supervisory review.',
  },
  {
    week: 22,
    phase: 'Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy',
    title: 'Multi-Model Selection and Routing Policies',
    description: 'Choose model paths based on confidence and business risk.',
  },
  {
    week: 23,
    phase: 'Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy',
    title: 'Data Lineage and Provenance Mapping',
    description: 'Trace how data sources influence model outputs and decisions.',
  },
  {
    week: 24,
    phase: 'Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy',
    title: 'On-Prem and Sovereign AI Deployment Models',
    description: 'Operate AI systems within geographic and regulatory boundaries.',
  },
]
