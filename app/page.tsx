import HomePage from "../components/HomePage";
import { siteConfig } from "../config/site";
import { jsonLd, pageMetadata } from "../lib/seo";

export const metadata = pageMetadata({
  title: "Mobile Fingerprinting Middletown NY | Ink & FD-258, We Come to You",
  description:
    "Mobile ink and FD-258 fingerprinting at your home or business in Middletown, Orange County, Sullivan County, and the Hudson Valley. $125 per person within 20 miles.",
  path: "/",
});

// Only verified, published details: no street address, ratings, or credentials.
const business = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.title,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  image: `${siteConfig.url}/images/logo12.jpg`,
  areaServed: siteConfig.serviceAreas,
  openingHours: "Mo-Su 07:00-20:00",
  sameAs: [siteConfig.facebookUrl, siteConfig.instagramUrl],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(business)} />
      <HomePage />
    </>
  );
}
