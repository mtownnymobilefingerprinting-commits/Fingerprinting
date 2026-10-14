import type { MetadataRoute } from "next";
import { siteConfig } from "../config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Private pages (/schedule, /resume) are excluded with noindex headers rather
    // than Disallow, so crawlers can actually see the noindex.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
