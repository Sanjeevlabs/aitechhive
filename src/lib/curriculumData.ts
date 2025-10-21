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
  { week: 1, date: 'Oct 23', topic: 'ChatGPT Basics', description: 'Getting started with AI conversations' },
  { week: 2, date: 'Oct 30', topic: 'Prompt Engineering', description: 'Crafting effective AI prompts' },
  { week: 3, date: 'Nov 6', topic: 'GitHub Copilot', description: 'AI-powered code completion' },
  { week: 4, date: 'Nov 13', topic: 'Midjourney', description: 'AI image generation tools' },
  { week: 5, date: 'Nov 20', topic: 'Claude AI', description: 'Advanced AI assistant capabilities' },
  { week: 6, date: 'Nov 27', topic: 'AI Writing Tools', description: 'Content creation with AI' },
  { week: 7, date: 'Dec 4', topic: 'Voice AI', description: 'Speech recognition and synthesis' },
  { week: 8, date: 'Dec 11', topic: 'AI Analytics', description: 'Data analysis with AI tools' },
  { week: 9, date: 'Dec 18', topic: 'AI Automation', description: 'Workflow automation tools' },
  { week: 10, date: 'Dec 25', topic: 'AI Video Tools', description: 'Video editing with AI' },
  { week: 11, date: 'Jan 1', topic: 'AI Research Tools', description: 'Research assistance with AI' },
  { week: 12, date: 'Jan 8', topic: 'AI Design Tools', description: 'Design automation and assistance' },
  { week: 13, date: 'Jan 15', topic: 'AI Collaboration', description: 'Team productivity with AI' },
  { week: 14, date: 'Jan 22', topic: 'AI Testing Tools', description: 'Quality assurance with AI' },
  { week: 15, date: 'Jan 29', topic: 'AI Monitoring', description: 'Performance tracking with AI' },
  { week: 16, date: 'Feb 5', topic: 'AI Security Tools', description: 'Cybersecurity with AI' },
  { week: 17, date: 'Feb 12', topic: 'Future AI Tools', description: 'Emerging AI technologies' },
]

export const sundayTopics: CurriculumTopic[] = [
  { week: 1, date: 'Oct 27', topic: 'What is AI?', description: 'Fundamentals of artificial intelligence' },
  { week: 2, date: 'Nov 3', topic: 'Machine Learning', description: 'How machines learn from data' },
  { week: 3, date: 'Nov 10', topic: 'Neural Networks', description: 'Brain-inspired computing' },
  { week: 4, date: 'Nov 17', topic: 'Deep Learning', description: 'Advanced neural network architectures' },
  { week: 5, date: 'Nov 24', topic: 'Natural Language Processing', description: 'Teaching machines to understand language' },
  { week: 6, date: 'Dec 1', topic: 'Computer Vision', description: 'AI for image and video understanding' },
  { week: 7, date: 'Dec 8', topic: 'Generative AI', description: 'AI that creates new content' },
  { week: 8, date: 'Dec 15', topic: 'AI Ethics', description: 'Responsible AI development and use' },
  { week: 9, date: 'Dec 22', topic: 'AI in Healthcare', description: 'Medical applications of AI' },
  { week: 10, date: 'Dec 29', topic: 'AI in Finance', description: 'Financial applications of AI' },
  { week: 11, date: 'Jan 5', topic: 'Reinforcement Learning', description: 'AI that learns through trial and error' },
  { week: 12, date: 'Jan 12', topic: 'AI Model Training', description: 'How AI models are built and trained' },
  { week: 13, date: 'Jan 19', topic: 'AI Deployment', description: 'Bringing AI models to production' },
  { week: 14, date: 'Jan 26', topic: 'AI Bias & Fairness', description: 'Ensuring equitable AI systems' },
  { week: 15, date: 'Feb 2', topic: 'AI Explainability', description: 'Understanding AI decision-making' },
  { week: 16, date: 'Feb 9', topic: 'AGI & Future', description: 'Artificial general intelligence and beyond' },
  { week: 17, date: 'Feb 16', topic: 'AI Career Paths', description: 'Building a career in AI' },
]
