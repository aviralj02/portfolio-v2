interface Experience {
  companyName: string;
  currentlyWorking: boolean;
  endDate: Date;
  role: string;
  startDate: Date;
  url: string;
}

interface Skill {
  competencies: string[];
  priority: number;
  skillType: string;
}

interface Project {
  backgroundColor: string;
  codebase: string;
  description: string;
  live: string;
  priority: number;
  stack: string[];
  title: string;
  icon: Icon;
}

interface Blog {
  description: string;
  link: string;
  publishDate: string;
  readTime: number;
  title: string;
}

interface Icon {
  fileName: string;
  url: string;
}
