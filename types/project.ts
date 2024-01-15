export type Project = {
  id: string;
  name: string;
  description: string;
  images?: { src: string; alt: string }[];
  skills?: string[];
  links?: { label: string; href: string }[];
};
