import { getDomain } from "@/app/constants/seo";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/*", "/api", "/api/*"],
    },
    sitemap: getDomain() + "/sitemap.xml",
  };
}
