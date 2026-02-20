export const ENV = {
  SITE_URL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "http://localhost:3000",

  API_URL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_PRODUCTION_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",

  API_IMAGE_URL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_PRODUCTION_IMAGE_URL
      : process.env.NEXT_PUBLIC_API_IMAGE_URL || "http://localhost:3000",

  CONTACT_EMAIL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_CONTACT_EMAIL
      : "contact@example.com",

  SEO_DESCRIPTION:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SEO_DESCRIPTION
      : "Default SEO description",

  SEO_OPENGRAPH_DESCRIPTION:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SEO_OPENGRAPH_DESCRIPTION
      : "Default SEO OpenGraph description",

  SEO_AUTHORS:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SEO_AUTHORS
      : "Default SEO authors",

  SEO_CREATORS:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SEO_CREATORS
      : "Default SEO creators",

  SEO_KEYWORDS:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SEO_KEYWORDS
      : "Default SEO keywords",

  PROJECT_NAME: process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog App",
  VERSION: process.env.NEXT_PUBLIC_VERSION_TEST || "stable",
  IS_PROD: process.env.NODE_ENV === "production",
};
