export type Project = {
  id: string;
  name: string;
  type: "personal" | "client";
  client?: string;
  clientLink?: string;
  description: string;
  images?: { src: string; alt: string; query?: Record<string, string> }[];
  skills?: string[];
  links?: { label: string; href: string }[];
};
