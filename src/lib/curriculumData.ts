// Curriculum data for 24-week AI Deployment Learning Plan (FINAL)
// Wednesday: Tools & Workflows (hands-on, enterprise-grade)
// Sunday: Theory & Governance (regulated BFSI fluency)

export interface CurriculumTopic {
  week: number
  phase: string
  topic: string
  description: string
}

/* ------------------------------
   WEDNESDAY — Tools & Workflows
   ------------------------------ */
export const wednesdayTopics: CurriculumTopic[] = [
  // Phase 1 — Foundations of Enterprise AI Deployment (Weeks 1–4)
  { week: 1, phase: 'Phase 1 — Foundations of Enterprise AI Deployment', topic: 'Model Monitoring and Audit Dashboards', description: 'Implement model metrics and evidence logs for operational oversight.' },
  { week: 2, phase: 'Phase 1 — Foundations of Enterprise AI Deployment', topic: 'Retrieval Pipelines for Regulated Workflows', description: 'Build retrieval workflows with traceability controls for financial processes.' },
  { week: 3, phase: 'Phase 1 — Foundations of Enterprise AI Deployment', topic: 'Vector Search with Privacy Filtering', description: 'Enable semantic search while preventing exposure of sensitive records.' },
  { week: 4, phase: 'Phase 1 — Foundations of Enterprise AI Deployment', topic: 'Explainability Reports for Model Oversight', description: 'Generate structured rationales required for audit and committee review.' },

  // Phase 2 — Data Governance & Security Controls (Weeks 5–8)
  { week: 5, phase: 'Phase 2 — Data Governance & Security Controls', topic: 'Data Redaction and Classification Controls', description: 'Mask sensitive attributes while preserving operational decision usefulness.' },
  { week: 6, phase: 'Phase 2 — Data Governance & Security Controls', topic: 'Zero-Trust AI Access Gateways', description: 'Restrict model access and prevent unapproved data or output usage.' },
  { week: 7, phase: 'Phase 2 — Data Governance & Security Controls', topic: 'Drift Detection and Output Stability Alerts', description: 'Monitor model shifts and trigger review when behavior changes.' },
  { week: 8, phase: 'Phase 2 — Data Governance & Security Controls', topic: 'Role-Based Access and Secret Management', description: 'Enforce identity controls and secure credential distribution.' },

  // Phase 3 — Model Lifecycle & Operational Oversight (Weeks 9–12)
  { week: 9, phase: 'Phase 3 — Model Lifecycle & Operational Oversight', topic: 'Model Versioning and Rollback Workflows', description: 'Track model versions and revert deployments safely when required.' },
  { week: 10, phase: 'Phase 3 — Model Lifecycle & Operational Oversight', topic: 'Document Intelligence and Claims Automation', description: 'Extract structured meaning from documents to support case operations.' },
  { week: 11, phase: 'Phase 3 — Model Lifecycle & Operational Oversight', topic: 'Chain-of-Custody Audit Logging', description: 'Maintain tamper-evident logs of model decisions and inputs.' },
  { week: 12, phase: 'Phase 3 — Model Lifecycle & Operational Oversight', topic: 'Validation and Challenger Model Evaluation', description: 'Compare candidate models under consistent evaluation criteria.' },

  // Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces (Weeks 13–16)
  { week: 13, phase: 'Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces', topic: 'Enterprise Embedding and Retrieval Workflow', description: 'Index and retrieve enterprise knowledge while maintaining access boundaries.' },
  { week: 14, phase: 'Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces', topic: 'Guardrails and Output Moderation Policies', description: 'Control generated responses to align with compliance requirements.' },
  { week: 15, phase: 'Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces', topic: 'Internal Search and Knowledge Assistant Console', description: 'Provide controlled internal access to organizational information repositories.' },
  { week: 16, phase: 'Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces', topic: 'Incident Response Playbooks for AI Systems', description: 'Define operational steps when model behavior needs intervention.' },

  // Phase 5 — Deployment Governance & Fairness Oversight (Weeks 17–20)
  { week: 17, phase: 'Phase 5 — Deployment Governance & Fairness Oversight', topic: 'Deployment Approval and Evidence Packs', description: 'Compile documentation required for governance and production release.' },
  { week: 18, phase: 'Phase 5 — Deployment Governance & Fairness Oversight', topic: 'Fairness and Bias Monitoring Dashboards', description: 'Track performance differences across groups to ensure equity.' },
  { week: 19, phase: 'Phase 5 — Deployment Governance & Fairness Oversight', topic: 'Secure and Isolated Inference Execution', description: 'Execute models in controlled environments with restricted network access.' },
  { week: 20, phase: 'Phase 5 — Deployment Governance & Fairness Oversight', topic: 'Regulatory QA and Document Review Bots', description: 'Use retrieval systems to analyze compliance and regulatory text.' },

  // Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy (Weeks 21–24)
  { week: 21, phase: 'Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy', topic: 'Model Performance and Audit Analytics', description: 'Present trends and exceptions for oversight and supervisory review.' },
  { week: 22, phase: 'Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy', topic: 'Multi-Model Selection and Routing Policies', description: 'Choose model paths based on confidence and business risk.' },
  { week: 23, phase: 'Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy', topic: 'Data Lineage and Provenance Mapping', description: 'Trace how data sources influence model outputs and decisions.' },
  { week: 24, phase: 'Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy', topic: 'On-Prem and Sovereign AI Deployment Models', description: 'Operate AI systems within geographic and regulatory boundaries.' },
]

/* ------------------------------
   SUNDAY — Theory & Governance
   ------------------------------ */
export const sundayTopics: CurriculumTopic[] = [
  // Phase 1 — Foundations of Enterprise AI Deployment (Weeks 1–4)
  { week: 1, phase: 'Phase 1 — Foundations of Enterprise AI Deployment', topic: 'Governance Lifecycle for AI in Financial Institutions', description: 'Map approval gates from concept to production in regulated settings.' },
  { week: 2, phase: 'Phase 1 — Foundations of Enterprise AI Deployment', topic: 'Why Retrieval Beats Fine-Tuning in Regulated Environments', description: 'Assess risk, leakage, and governance trade-offs favoring retrieval approaches.' },
  { week: 3, phase: 'Phase 1 — Foundations of Enterprise AI Deployment', topic: 'How Embeddings Represent Meaning and Similarity', description: 'Understand semantic space behavior and implications for enterprise search.' },
  { week: 4, phase: 'Phase 1 — Foundations of Enterprise AI Deployment', topic: 'Interpretability as Evidence for Oversight', description: 'Use explanations to justify model behavior to audit and committees.' },

  // Phase 2 — Data Governance & Security Controls (Weeks 5–8)
  { week: 5, phase: 'Phase 2 — Data Governance & Security Controls', topic: 'Data Privacy in Financial Services', description: 'Contrast reversible and irreversible de-identification under compliance rules.' },
  { week: 6, phase: 'Phase 2 — Data Governance & Security Controls', topic: 'Vendor Risk and AI Supply-Chain Governance', description: 'Define obligations when models or services come from external providers.' },
  { week: 7, phase: 'Phase 2 — Data Governance & Security Controls', topic: 'Distribution Shift and Model Degradation', description: 'Explain stability expectations and operational responses to drift.' },
  { week: 8, phase: 'Phase 2 — Data Governance & Security Controls', topic: 'Access Governance and System Trust Boundaries', description: 'Relate identity, authorization, and isolation to AI safety.' },

  // Phase 3 — Model Lifecycle & Operational Oversight (Weeks 9–12)
  { week: 9, phase: 'Phase 3 — Model Lifecycle & Operational Oversight', topic: 'Why Model Lifecycle Differs from Software Lifecycle', description: 'Describe re-validation needs, change control, and monitoring feedback loops.' },
  { week: 10, phase: 'Phase 3 — Model Lifecycle & Operational Oversight', topic: 'How Machines Understand Documents', description: 'Outline transformer context, tokens, and sequence handling for documents.' },
  { week: 11, phase: 'Phase 3 — Model Lifecycle & Operational Oversight', topic: 'Chain-of-Custody and Traceable Decisions', description: 'Show how provenance supports accountability in regulated decision systems.' },
  { week: 12, phase: 'Phase 3 — Model Lifecycle & Operational Oversight', topic: 'Supervised Learning via Credit Scoring', description: 'Apply supervised learning concepts within audited credit risk workflows.' },

  // Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces (Weeks 13–16)
  { week: 13, phase: 'Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces', topic: 'Vectorization and Enterprise Indexing Theory', description: 'Connect embedding pipelines to trustworthy search over internal knowledge.' },
  { week: 14, phase: 'Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces', topic: 'Why Large Models Hallucinate', description: 'Discuss inductive bias, approximation behavior, and mitigation approaches.' },
  { week: 15, phase: 'Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces', topic: 'Precision, Recall, and Business Risk Trade-offs', description: 'Balance search metrics with real exposure in financial operations.' },
  { week: 16, phase: 'Phase 4 — Safe Retrieval, Guardrails & Internal AI Interfaces', topic: 'Human-in-the-Loop Reliability Design', description: 'Define escalation paths, overrides, and decision accountability structures.' },

  // Phase 5 — Deployment Governance & Fairness Oversight (Weeks 17–20)
  { week: 17, phase: 'Phase 5 — Deployment Governance & Fairness Oversight', topic: 'What Audit Needs Before Production Release', description: 'List documentation, ownership, and monitoring commitments for approval.' },
  { week: 18, phase: 'Phase 5 — Deployment Governance & Fairness Oversight', topic: 'Fairness Metrics and Bias Ratios in Finance', description: 'Explain measurement choices and policy boundaries for equitable outcomes.' },
  { week: 19, phase: 'Phase 5 — Deployment Governance & Fairness Oversight', topic: 'Security Architecture for AI Systems', description: 'Relate threat models and isolation to dependable AI operations.' },
  { week: 20, phase: 'Phase 5 — Deployment Governance & Fairness Oversight', topic: 'Unsupervised Learning for AML Pattern Detection', description: 'Use clustering logic to support investigations and anomaly grouping.' },

  // Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy (Weeks 21–24)
  { week: 21, phase: 'Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy', topic: 'How Risk Committees Interpret AI Outputs', description: 'Translate dashboards and exceptions into governance-friendly narratives.' },
  { week: 22, phase: 'Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy', topic: 'Model Selection as Strategic Decision-Making', description: 'Weigh explainability, cost, and risk when choosing among models.' },
  { week: 23, phase: 'Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy', topic: 'The Data Trust Layer Across Institutions', description: 'Show how lineage and provenance maintain confidence over time.' },
  { week: 24, phase: 'Phase 6 — Audit, Risk Transparency & Enterprise AI Strategy', topic: 'Why Banks Won’t Go Cloud-Only for AI', description: 'Discuss sovereignty, regulation, and jurisdictional operating requirements.' },
]
