const globalSeoKeywords: string[] =
  process.env.NEXT_PUBLIC_SEO_KEYWORDS?.split(",") || [];

const globalSeoCreator: string =
  process.env.NEXT_PUBLIC_SEO_CREATOR || "Blog App";

const globalSeoDescription: string =
  process.env.NEXT_PUBLIC_SEO_DESCRIPTION ||
  "A modern blog application for sharing ideas and thoughts";

const globalSeoAuthors: string[] =
  process.env.NEXT_PUBLIC_SEO_AUTHOR?.split(",") || [];

const globalSeoOpenGraphDescription: string =
  process.env.NEXT_PUBLIC_SEO_OPENGRAPH_DESCRIPTION ||
  "A modern blog application for sharing ideas and thoughts.";

// functions
export const getSeoKeywords = (): string[] => {
  return globalSeoKeywords;
};

export const getSeoCreator = (): string => {
  return globalSeoCreator;
};

export const getSeoDescription = (): string => {
  return globalSeoDescription;
};

export const getSeoAuthors = (): string[] => {
  return globalSeoAuthors;
};

export const getSeoOpenGraphDescription = (): string => {
  return globalSeoOpenGraphDescription;
};
