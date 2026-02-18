import { ENV } from "@/config/env.config";

const globalSeoKeywords: string[] = ENV.SEO_KEYWORDS?.split(",") || [];

const globalSeoCreator: string = ENV.SEO_CREATORS || "Blog App";

const globalSeoDescription: string =
  ENV.SEO_DESCRIPTION ||
  "A modern blog application for sharing ideas and thoughts";

const globalSeoAuthors: string[] = ENV.SEO_AUTHORS?.split(",") || [];

const globalSeoOpenGraphDescription: string =
  ENV.SEO_OPENGRAPH_DESCRIPTION ||
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
