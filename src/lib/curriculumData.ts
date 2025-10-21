// Curriculum data for bi-weekly newsletter
// Wednesday: Tools and Skills
// Sunday: Core Topics

export interface CurriculumTopic {
  week: number
  date: string
  topic: string
  description: string
}

export const wednesdayTopics: CurriculumTopic[] = [
  { week: 1, date: 'Oct 23', topic: 'MLOps Principles, Governance Frameworks, Introduction to the MLOps Toolchain', description: 'Foundation of MLOps practices and governance' },
  { week: 2, date: 'Oct 30', topic: 'Docker, Kubernetes', description: 'Containerization and orchestration tools' },
  { week: 3, date: 'Nov 6', topic: 'Terraform, CI/CD Pipeline Design', description: 'Infrastructure as code and deployment automation' },
  { week: 4, date: 'Nov 13', topic: 'MLflow', description: 'ML lifecycle management platform' },
  { week: 5, date: 'Nov 20', topic: 'Prometheus, Grafana', description: 'Monitoring and visualization tools' },
  { week: 6, date: 'Nov 27', topic: 'Advanced Prompt Engineering Techniques', description: 'Mastering AI prompt strategies' },
  { week: 7, date: 'Dec 4', topic: 'Retrieval-Augmented Generation (RAG) Architecture', description: 'Building RAG systems' },
  { week: 8, date: 'Dec 11', topic: 'Vector Databases (e.g., Pinecone, Milvus)', description: 'Managing embeddings and similarity search' },
  { week: 9, date: 'Dec 18', topic: 'LangChain', description: 'Framework for LLM applications' },
  { week: 10, date: 'Dec 25', topic: 'Quantitative Modeling, C++, Advanced Python', description: 'Programming for quantitative analysis' },
  { week: 11, date: 'Jan 1', topic: 'AWS SageMaker, Azure ML (incl. Azure OpenAI), Google Vertex AI', description: 'Cloud ML platforms' },
  { week: 12, date: 'Jan 8', topic: 'SHAP, LIME', description: 'Model explainability tools' },
  { week: 13, date: 'Jan 15', topic: 'Federated Learning Principles, TensorFlow Federated', description: 'Distributed learning approaches' },
  { week: 14, date: 'Jan 22', topic: 'Apache Spark', description: 'Large-scale data processing' },
  { week: 15, date: 'Jan 29', topic: 'Apache Kafka', description: 'Real-time data streaming' },
  { week: 16, date: 'Feb 5', topic: 'GPU Cluster Architecture & Management', description: 'High-performance computing infrastructure' },
  { week: 17, date: 'Feb 12', topic: 'Feature Stores (e.g., Feast, Tecton)', description: 'Managing ML features' },
  { week: 18, date: 'Feb 19', topic: 'Python for Backtesting, Algorithmic Strategy', description: 'Quantitative trading systems' },
  { week: 19, date: 'Feb 26', topic: 'Algorithmic Fairness, Bias Detection Tools (AIF360)', description: 'Building fair AI systems' },
  { week: 20, date: 'Mar 5', topic: 'Real-Time Anomaly Detection', description: 'Detecting unusual patterns in real-time' },
  { week: 21, date: 'Mar 12', topic: 'Robo-Advisory Model Design', description: 'Automated investment advisory' },
  { week: 22, date: 'Mar 19', topic: 'NLP for Document Processing, Computer Vision for Claims', description: 'AI for insurance and finance' },
  { week: 23, date: 'Mar 26', topic: 'Multimodal Models (GPT-4o, Gemini)', description: 'Understanding multimodal AI' },
  { week: 24, date: 'Apr 2', topic: 'Agentic AI Frameworks (AutoGen, CrewAI)', description: 'Building autonomous AI agents' },
  { week: 25, date: 'Apr 9', topic: 'Quantum Machine Learning Concepts', description: 'Quantum computing meets ML' },
  { week: 26, date: 'Apr 16', topic: 'AI Coding Assistants (GitHub Copilot)', description: 'AI-powered development tools' },
  { week: 27, date: 'Apr 23', topic: 'Career Strategy, AWS/Azure/GCP Certification Paths', description: 'Building your AI career' },
  { week: 28, date: 'Apr 30', topic: 'Portfolio Development, GitHub, Kaggle', description: 'Showcasing your AI skills' },
  { week: 29, date: 'May 7', topic: 'Resume Building, Interview Preparation', description: 'Landing your AI role' },
  { week: 30, date: 'May 14', topic: 'Strategic Communication, "T-Shaped" Skill Development', description: 'Professional growth strategies' },
]

export const sundayTopics: CurriculumTopic[] = [
  { week: 1, date: 'Oct 27', topic: 'Linear Algebra for AI', description: 'Mathematical foundations for AI' },
  { week: 2, date: 'Nov 3', topic: 'Probability for AI', description: 'Statistical reasoning in AI' },
  { week: 3, date: 'Nov 10', topic: 'Calculus for AI: Gradient Descent', description: 'Optimization fundamentals' },
  { week: 4, date: 'Nov 17', topic: 'Supervised Learning', description: 'Learning from labeled data' },
  { week: 5, date: 'Nov 24', topic: 'Unsupervised Learning', description: 'Discovering patterns in data' },
  { week: 6, date: 'Dec 1', topic: 'Reinforcement Learning', description: 'Learning through trial and error' },
  { week: 7, date: 'Dec 8', topic: 'Neural Networks & Backpropagation', description: 'Training deep learning models' },
  { week: 8, date: 'Dec 15', topic: 'Convolutional Neural Networks (CNNs)', description: 'Deep learning for computer vision' },
  { week: 9, date: 'Dec 22', topic: 'Recurrent Neural Networks (LSTMs)', description: 'Sequential data processing' },
  { week: 10, date: 'Dec 29', topic: 'The Transformer Architecture', description: 'Modern NLP foundation' },
  { week: 11, date: 'Jan 5', topic: 'Embeddings & Vector Space', description: 'Representing data in vector space' },
  { week: 12, date: 'Jan 12', topic: 'Vector Databases', description: 'Storing and querying embeddings' },
  { week: 13, date: 'Jan 19', topic: 'Retrieval-Augmented Generation (RAG)', description: 'Combining retrieval with generation' },
  { week: 14, date: 'Jan 26', topic: 'Diffusion Models', description: 'Generative models for image synthesis' },
  { week: 15, date: 'Feb 2', topic: 'Multimodal AI (GPT-4o, Gemini)', description: 'AI that processes multiple modalities' },
  { week: 16, date: 'Feb 9', topic: 'AI Agents & The ReAct Framework', description: 'Building reasoning and acting agents' },
  { week: 17, date: 'Feb 16', topic: 'The Alignment Problem', description: 'Ensuring AI aligns with human values' },
]
