export type ServiceConfig = {
  id: string;
  title: string;
  description: string;
  idealCustomer: string;
  price: string;
  seoTitle: string;
  seoDescription: string;
  appointmentId: keyof typeof import("./appointments").calendlyLinks;
  paymentWorkflow: "payFirst";
};

export const services: ServiceConfig[] = [
  {
    id: "mobile-ink",
    title: "Mobile Ink Fingerprinting",
    description:
      "Professional mobile ink fingerprinting services delivered to your home, office, or business.",
    idealCustomer:
      "Individuals, employers, organizations, and professionals requiring ink fingerprinting.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Mobile Ink Fingerprinting Middletown NY",
    seoDescription:
      "Professional mobile ink fingerprinting services for individuals, businesses, and organizations throughout Middletown, Orange County, and the Hudson Valley.",
    appointmentId: "mobileInk",
    paymentWorkflow: "payFirst",
  },

  {
    id: "fd258",
    title: "FD-258 Fingerprint Cards",
    description:
      "Full-service FD-258 fingerprint card processing for employers, licensing, and government record checks.",
    idealCustomer:
      "HR teams and regulated organizations that require FD-258 fingerprint cards.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "FD-258 Fingerprint Cards Middletown NY",
    seoDescription:
      "Professional FD-258 fingerprint card services for Orange County businesses and government contractors.",
    appointmentId: "fd258",
    paymentWorkflow: "payFirst",
  },

  {
    id: "fbiCard",
    title: "FBI Fingerprint Cards",
    description:
      "Reliable FBI fingerprint card service for background checks, licensing, and federal requirements.",
    idealCustomer:
      "Law firms, government contractors, and healthcare employers needing FBI clearance.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "FBI Fingerprint Cards Middletown NY",
    seoDescription:
      "Trusted FBI fingerprint card service for businesses and professionals across the Hudson Valley.",
    appointmentId: "fbiCard",
    paymentWorkflow: "payFirst",
  },

  {
    id: "immigration",
    title: "Immigration Fingerprinting",
    description:
      "Fingerprinting support for immigration petitions, naturalization, and visa-related background checks.",
    idealCustomer:
      "Immigration law firms, paralegals, and families preparing federal filings.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Immigration Fingerprinting Middletown NY",
    seoDescription:
      "Professional immigration fingerprinting services for applicants in Middletown, Orange County, and the Hudson Valley.",
    appointmentId: "immigration",
    paymentWorkflow: "payFirst",
  },

  {
    id: "adoption",
    title: "Adoption Fingerprinting",
    description:
      "Confidential fingerprinting for adoption home studies, guardianship filings, and family court requirements.",
    idealCustomer:
      "Adoption agencies, families, and attorneys arranging court-ready fingerprinting.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Adoption Fingerprinting Middletown NY",
    seoDescription:
      "Mobile adoption fingerprinting that comes to you, serving Orange County and Hudson Valley families.",
    appointmentId: "adoption",
    paymentWorkflow: "payFirst",
  },

  {
    id: "personalRecordReview",
    title: "Personal Record Review",
    description:
      "Personal record review and fingerprinting consultation for applicants and record clearance requests.",
    idealCustomer:
      "Individuals preparing applications that require a fingerprint-based record review.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Personal Record Review Middletown NY",
    seoDescription:
      "Personal record review services with fingerprinting guidance for local individuals and professionals.",
    appointmentId: "personalRecordReview",
    paymentWorkflow: "payFirst",
  },

  {
    id: "employment",
    title: "Employment Fingerprinting",
    description:
      "Complete employment fingerprinting for hiring, onboarding, and workplace compliance.",
    idealCustomer:
      "HR managers, staffing agencies, and business owners hiring new employees.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Employment Fingerprinting Middletown NY",
    seoDescription:
      "Mobile employment fingerprinting for businesses, staffing firms, and recruiters throughout Orange County.",
    appointmentId: "employment",
    paymentWorkflow: "payFirst",
  },

  {
    id: "nursingLicense",
    title: "Nursing License Fingerprinting",
    description:
      "Mobile fingerprinting for nursing license applications, renewals, and healthcare workforce clearance.",
    idealCustomer:
      "Healthcare employers, nursing schools, and licensed professionals in the Hudson Valley.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Nursing License Fingerprinting Middletown NY",
    seoDescription:
      "Professional fingerprinting for nursing license applications, renewals, and credentialing.",
    appointmentId: "nursingLicense",
    paymentWorkflow: "payFirst",
  },

  {
    id: "teacherCertification",
    title: "Teacher Certification Fingerprinting",
    description:
      "Fingerprinting services designed for teacher certification, school staff background checks, and education licensing.",
    idealCustomer:
      "School administrators, teachers, and childcare providers in Orange County and Sullivan County.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Teacher Certification Fingerprinting Middletown NY",
    seoDescription:
      "On-site fingerprinting for teacher certification, daycare staff, and school employment in the Hudson Valley.",
    appointmentId: "teacherCertification",
    paymentWorkflow: "payFirst",
  },

  {
    id: "securityGuard",
    title: "Security Guard Fingerprinting",
    description:
      "Reliable fingerprinting for security guard licensing, renewals, and Department of State applications.",
    idealCustomer:
      "Security firms, training providers, and licensed guards requiring timely fingerprint capture.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Security Guard Fingerprinting Middletown NY",
    seoDescription:
      "Fast, mobile fingerprinting for security guard license requirements across Orange County and the Hudson Valley.",
    appointmentId: "securityGuard",
    paymentWorkflow: "payFirst",
  },

  {
    id: "realEstateLicense",
    title: "Real Estate License Fingerprinting",
    description:
      "Mobile fingerprinting support for real estate license applications, broker registration, and renewals.",
    idealCustomer:
      "Real estate firms, brokers, and agents preparing license filings in New York.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Real Estate License Fingerprinting Middletown NY",
    seoDescription:
      "Convenient fingerprinting for real estate license applicants in Middletown and surrounding communities.",
    appointmentId: "realEstateLicense",
    paymentWorkflow: "payFirst",
  },

  {
    id: "finra",
    title: "FINRA Fingerprinting",
    description:
      "Fingerprinting services for FINRA registration, securities licensing, and financial services employer onboarding.",
    idealCustomer:
      "Financial institutions, broker-dealers, and compliance teams in the Hudson Valley.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "FINRA Fingerprinting Middletown NY",
    seoDescription:
      "Trusted fingerprinting for FINRA registration and financial services compliance in Orange County.",
    appointmentId: "finra",
    paymentWorkflow: "payFirst",
  },

  {
    id: "corporate",
    title: "Corporate Fingerprinting",
    description:
      "On-site corporate fingerprinting for teams, HR departments, and staffing partners.",
    idealCustomer:
      "Corporate HR, staffing agencies, and legal departments needing group fingerprinting solutions.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Corporate Fingerprinting Middletown NY",
    seoDescription:
      "Corporate mobile fingerprinting for businesses and staffing agencies throughout Orange County and Sullivan County.",
    appointmentId: "corporate",
    paymentWorkflow: "payFirst",
  },

  {
    id: "onSiteBusiness",
    title: "On-Site Business Fingerprinting",
    description:
      "Mobile fingerprinting at your office for hiring, compliance, and employee onboarding.",
    idealCustomer:
      "Business owners and facilities that need fingerprinting for staff, contractors, and teams.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "On-Site Business Fingerprinting Middletown NY",
    seoDescription:
      "On-site fingerprinting for businesses across Middletown, Orange County, and the Hudson Valley.",
    appointmentId: "onSiteBusiness",
    paymentWorkflow: "payFirst",
  },

  {
    id: "group",
    title: "Group Fingerprinting",
    description:
      "Group fingerprinting for teams, staffing events, and multi-employee appointments.",
    idealCustomer:
      "Staffing agencies, businesses, and organizations scheduling fingerprinting for multiple employees.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Group Fingerprinting Middletown NY",
    seoDescription:
      "Flexible group fingerprinting solutions for businesses, schools, and healthcare teams in the Hudson Valley.",
    appointmentId: "group",
    paymentWorkflow: "payFirst",
  },

  {
    id: "staffingAgency",
    title: "Staffing Agency Fingerprinting",
    description:
      "Staffing agency fingerprinting for temporary hires, contract workers, and client placements.",
    idealCustomer:
      "Staffing agencies and recruiters serving corporate, healthcare, and education clients.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Staffing Agency Fingerprinting Middletown NY",
    seoDescription:
      "Mobile fingerprinting solutions for staffing agencies and recruiting teams in Orange County.",
    appointmentId: "staffingAgency",
    paymentWorkflow: "payFirst",
  },

  {
    id: "healthcare",
    title: "Healthcare Facility Fingerprinting",
    description:
      "Mobile fingerprinting for healthcare workers, credentialing, and facility compliance.",
    idealCustomer:
      "Healthcare organizations, clinics, and staffing partners needing on-site fingerprinting.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Healthcare Facility Fingerprinting Middletown NY",
    seoDescription:
      "On-site fingerprinting for healthcare organizations, hospitals, and credentialing teams.",
    appointmentId: "healthcare",
    paymentWorkflow: "payFirst",
  },

  {
    id: "governmentContractor",
    title: "Government Contractor Fingerprinting",
    description:
      "Mobile fingerprinting for government contractors and cleared personnel requiring secure compliance.",
    idealCustomer:
      "Government contractors, prime vendors, and security-cleared teams in the Hudson Valley.",
    price: "$125 per person within 20 miles of Middletown, NY",
    seoTitle: "Government Contractor Fingerprinting Middletown NY",
    seoDescription:
      "Reliable fingerprinting for government contractors, facility clearance, and contract compliance.",
    appointmentId: "governmentContractor",
    paymentWorkflow: "payFirst",
  },
]; 