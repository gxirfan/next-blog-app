import { MetadataRoute } from "next";
import { getDomain } from "@/app/constants/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: getDomain() + "/sitemap.xml",
  };
}
