// frontend/src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/auth/", "/_next/"],
      crawlDelay: 1,
    },
    sitemap: "https://laveladazone.com/sitemap.xml",
  };
}
