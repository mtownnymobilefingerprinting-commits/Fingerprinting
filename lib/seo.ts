import type { Metadata } from "next";
import { siteConfig } from "../config/site";

const DEFAULT_IMAGE = "/images/logo12.jpg";

/** Page-specific title, description, canonical URL, and social metadata. `path` must start with "/". */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.title,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export const privatePageMetadata: Metadata = {
  robots: { index: false, follow: false },
};

export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
