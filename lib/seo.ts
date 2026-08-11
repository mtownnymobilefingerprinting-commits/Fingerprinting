export function generatePageMetadata({
  title,
  description,
  url,
  image
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    title,
    description,
    metadataBase: new URL(url),
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: image ? [image] : []
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : []
    }
  };
}

export function generateJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data, null, 2);
}
