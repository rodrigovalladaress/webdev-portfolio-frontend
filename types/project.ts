export type Project = {
  id: string;
  name: string;
  client?: string;
  clientLink?: string;
  description: string;
  images?: { src: string; alt: string; query?: Record<string, string> }[];
  skills?: string[];
  links?: { label: string; href: string }[];
};
