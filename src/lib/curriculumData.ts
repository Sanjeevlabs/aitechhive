// curriculumData.ts
// 24-week plan for AITECHHIVE
// Wednesday = Tools & Workflows (tool-first, hands-on)
// Sunday = Theory & Governance (calm, structured, BFSI-focused)

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
  // Phase 1 — Enterprise AI Deployment Toolkit (Weeks 1–4)
  { week: 1, phase: 'Phase 1 — Enterprise AI Deployment Toolkit', topic: 'Prometheus + Loki + Grafana Monitoring Stack', description: 'Monitor model performance with evidence logs and audit-ready dashboards.' },
  { week: 2, phase: 'Phase 1 — Enterprise AI Deployment Toolkit', topic: 'LangChain + Postgres Vector Retrieval Pipeline', description: 'Build compliant retrieval workflows for KYC and claims processing.' },
  { week: 3, phase: 'Phase 1 — Enterprise AI Deployment Toolkit', topic: 'Qdrant / Weaviate Vector Indexing with PII Controls', description: 'Enable semantic search while filtering regulated or sensitive attributes.' },
  { week: 4, phase: 'Phase 1 — Enterprise AI Deployment Toolkit', topic: 'SHAP + LIME Explainability Dashboard Toolkit', description: 'Generate visual feature attributions suitable for audit and review.' },

  // Phase 2 — Data Controls & Security Enforcement (Weeks 5–8)
  { week: 5, phase: 'Phase 2 — Data Controls & Security Enforcement', topic: 'Presidio + spaCy Data Redaction Pipeline', description: 'Remove sensitive fields while preserving operational data usefulness.' },
  { week: 6, phase: 'Phase 2 — Data Controls & Security Enforcement', topic: 'Reverse-Proxy Zero-Trust AI Gateway', description: 'Enforce no-store, no-train boundaries for internal and external models.' },
  { week: 7, phase: 'Phase 2 — Data Controls & Security Enforcement', topic: 'Drift Detection with Evidently AI', description: 'Detect behavior changes across time windows and trigger review.' },
  { week: 8, phase: 'Phase 2 — Data Controls & Security Enforcement', topic: 'HashiCorp Vault RBAC + Secrets Rotation', description: 'Manage identities, permissions, and credential lifecycle across pipelines.' },

  // Phase 3 — Model Lifecycle & Operational Reliability (Weeks 9–12)
  { week: 9, phase: 'Phase 3 — Model Lifecycle & Operational Reliability', topic: 'MLflow Model Versioning + Deployment Rollback', description: 'Promote and revert models with traceable governance checkpoints.' },
  { week: 10, phase: 'Phase 3 — Model Lifecycle & Operational Reliability', topic: 'Tesseract OCR + NER + RAG Claims Automation', description: 'Extract structured meaning from documents for adjudication workflows.' },
  { week: 11, phase: 'Phase 3 — Model Lifecycle & Operational Reliability', topic: 'SHA-256 Chain-Linked Evidence Logging', description: 'Maintain tamper-evident records of model actions and inputs.' },
  { week: 12, phase: 'Phase 3 — Model Lifecycle & Operational Reliability', topic: 'Challenger Model Harness & Comparison Bench', description: 'Evaluate candidate models under stable, repeatable conditions.' },

  // Phase 4 — Safe Internal AI Interfaces (Weeks 13–16)
  { week: 13, phase: 'Phase 4 — Safe Internal AI Interfaces', topic: 'Enterprise Embedding Pipeline (BGE / Instructor)', description: 'Encode organization knowledge with controlled semantic indexing boundaries.' },
  { week: 14, phase: 'Phase 4 — Safe Internal AI Interfaces', topic: 'Guardrails + Regex + Policy-Filter Stack', description: 'Prevent unsafe or non-compliant outputs at runtime.' },
  { week: 15, phase: 'Phase 4 — Safe Internal AI Interfaces', topic: 'Internal RAG Search Console UI', description: 'Provide safe internal search and decision-support for teams.' },
  { week: 16, phase: 'Phase 4 — Safe Internal AI Interfaces', topic: 'AI Incident Response Runbook + Escalation Matrix', description: 'Define override workflows when AI outputs need intervention.' },

  // Phase 5 — Governance, Fairness & Deployment Controls (Weeks 17–20)
  { week: 17, phase: 'Phase 5 — Governance, Fairness & Deployment Controls', topic: 'Deployment Gate Pack Generator (Evidence Templates)', description: 'Assemble documentation required for governed production release.' },
  { week: 18, phase: 'Phase 5 — Governance, Fairness & Deployment Controls', topic: 'Fairness & Demographic Slice Monitoring (AIF360 / Giskard)', description: 'Track outcome differences across groups to ensure equity.' },
  { week: 19, phase: 'Phase 5 — Governance, Fairness & Deployment Controls', topic: 'VPC-Isolated Inference Gateway (Nginx / Envoy)', description: 'Execute inference inside controlled perimeter with minimal exposure.' },
  { week: 20, phase: 'Phase 5 — Governance, Fairness & Deployment Controls', topic: 'Regulatory Document QA Bot (RAG + Citation Mode)', description: 'Analyze policies and guidance with verifiable references.' },

  // Phase 6 — Audit Transparency & Strategic Control (Weeks 21–24)
  { week: 21, phase: 'Phase 6 — Audit Transparency & Strategic Control', topic: 'Grafana + SQL Evidence Dashboarding', description: 'Present performance, drift and exceptions for oversight review.' },
  { week: 22, phase: 'Phase 6 — Audit Transparency & Strategic Control', topic: 'Multi-Model Router (Confidence + Cost Policies)', description: 'Route queries based on trust levels and risk tolerance.' },
  { week: 23, phase: 'Phase 6 — Audit Transparency & Strategic Control', topic: 'OpenLineage Data Provenance Mapping', description: 'Visualize data movement and downstream decision influence.' },
  { week: 24, phase: 'Phase 6 — Audit Transparency & Strategic Control', topic: 'Local LLM / On-Prem Compute Deployment Playbook', description: 'Run inference environments fully under organizational control.' },
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
