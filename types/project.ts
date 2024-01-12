export type Project = {
  id: string;
  name: string;
  description: string;
  images?: string[];
  skills?: string[];
  links?: { label: string; href: string }[];
};
