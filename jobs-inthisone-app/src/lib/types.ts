export interface InterviewQuestion {
  question: string;
  answer: string;
  storyExample: string;
  skill: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  applyDate: string | null;
  description: string | null;
  coverLetter: string | null;
  payRange: string | null;
  jobUrl: string | null;
  source: string | null;
  fitScore: string | null;
  fitAnalysisHtml: string | null;
  whyCompanyAnswers: string | null;
  interviewQA: string | null; // JSON string of InterviewQuestion[]
  favorite: boolean;
  resumeId: string | null;
  resume?: {
    id: string;
    title: string;
    content?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  title: string;
  jobTitle: string | null;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  jobs?: {
    id: string;
    title: string;
    company: string;
    applyDate: string | null;
  }[];
  _count?: {
    jobs: number;
  };
}

export interface Note {
  id: string;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionUser {
  id: string;
  username: string;
}

export interface SessionData {
  isLoggedIn: boolean;
  user?: SessionUser;
}
