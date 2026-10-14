// Runs on Vercel with server routes (payments, webhooks, scheduling access),
// so this must NOT use `output: "export"`.

// Keep in sync with legacyServicePaths() in config/services.ts (covered by tests/services.test.mjs).
const legacyServiceSlugs = {
  mobileInk: "mobile-ink",
  fbiCard: "fbi-card",
  personalRecordReview: "personal-record-review",
  nursingLicense: "nursing-license",
  teacherCertification: "teacher-certification",
  securityGuard: "security-guard",
  realEstateLicense: "real-estate-license",
  onSiteBusiness: "on-site-business",
  staffingAgency: "staffing-agency",
  governmentContractor: "government-contractor",
};

const privateHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "Cache-Control", value: "private, no-store" },
  // Scheduling links carry a bearer token in the query string.
  { key: "Referrer-Policy", value: "no-referrer" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      ...Object.entries(legacyServiceSlugs).map(([from, to]) => ({
        source: `/services/${from}`,
        destination: `/services/${to}`,
        permanent: true,
      })),
      // The old fixed-price checkout trusted browser-supplied amounts and has been retired.
      { source: "/checkout", destination: "/pay", permanent: true },
      { source: "/checkout/:path*", destination: "/pay", permanent: true },
      { source: "/payment-success", destination: "/resume", permanent: false },
    ];
  },
  async headers() {
    return [
      { source: "/schedule", headers: privateHeaders },
      { source: "/resume", headers: privateHeaders },
      { source: "/api/:path*", headers: privateHeaders },
    ];
  },
};

export default nextConfig;
