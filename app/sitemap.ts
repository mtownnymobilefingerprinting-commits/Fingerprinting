import type { MetadataRoute } from "next";
import { industryPages, serviceAreaPages } from "../config/content";
import { services } from "../config/services";
import { siteConfig } from "../config/site";

// Public, indexable pages only. Payment and scheduling pages are intentionally excluded.
const staticPaths = [
  "/",
  "/services",
  "/business-solutions",
  "/industries",
  "/appointments",
  "/service-areas",
  "/faq",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...services.map((s) => `/services/${s.slug}`),
    ...industryPages.map((i) => `/industries/${i.id}`),
    ...serviceAreaPages.map((a) => `/service-areas/${a.id}`),
  ];
  return paths.map((path) => ({ url: new URL(path, siteConfig.url).toString() }));
}
