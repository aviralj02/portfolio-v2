interface Experience {
  companyName: string;
  currentlyWorking: boolean;
  endDate: Date;
  role: string;
  startDate: Date;
  url: string;
  logo: Asset;
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
  live?: string;
  priority: number;
  stack: string[];
  title: string;
  icon: Asset;
}

interface Blog {
  description: string;
  link: string;
  publishDate: string;
  readTime: number;
  title: string;
}

interface Social {
  name: string;
  priority: number;
  url: string;
}

interface Asset {
  fileName: string;
  url: string;
}

type FooterLink = {
  label: string;
  to: string;
};

type LocationData = {
  id: string;
  city: string;
  country: string;
};
