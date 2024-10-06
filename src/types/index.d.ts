export interface PageSEO {
  title?: string;
  meta?: {
    lang: string;
    title: string;
    description: string;
    author: string;
    color: string;
  };
}

export interface Nav {
  name: string;
  href: string;
  children?: Nav[];
}
