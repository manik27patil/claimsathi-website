export interface PageRoute {
  file: string;
  label: string;
  group: "desktop" | "mobile";
  description: string;
}

export const routes: Record<string, PageRoute> = {
  // Desktop - public site
  home: { file: "home.html", label: "Home", group: "desktop", description: "Landing page with hero, services, and overview" },
  services: { file: "home.html", label: "Services", group: "desktop", description: "Services section (on home page)" },
  fees: { file: "transparent-fees.html", label: "Transparent Fees", group: "desktop", description: "Fee structure and pricing transparency" },
  "how-we-work": { file: "how-we-work.html", label: "How We Work", group: "desktop", description: "Process and methodology explanation" },
  contact: { file: "contact.html", label: "Contact & Enquiries", group: "desktop", description: "Contact form and office information" },
  login: { file: "login.html", label: "Policyholder Login", group: "desktop", description: "Login screen for policyholders" },
  "register-a-claim": { file: "register-new-claim.html", label: "Register a Claim", group: "desktop", description: "New claim registration form" },
  "register-new-claim": { file: "register-new-claim.html", label: "Register New Claim", group: "desktop", description: "New claim registration form" },
  "registration-confirmation": { file: "registration-confirmation.html", label: "Registration Confirmation", group: "desktop", description: "Claim registration confirmation page" },
  dashboard: { file: "dashboard.html", label: "Customer Dashboard", group: "desktop", description: "Policyholder dashboard with case overview" },
  "client-dashboard": { file: "dashboard.html", label: "Customer Dashboard", group: "desktop", description: "Policyholder dashboard with case overview" },
  "my-claims": { file: "my-claims.html", label: "My Claims - Status Tracking", group: "desktop", description: "Claims status tracking and timeline" },
  "profile-completion": { file: "profile-completion.html", label: "Profile Completion", group: "desktop", description: "Profile completion form" },
  "admin-portal": { file: "admin-portal.html", label: "Admin Portal", group: "desktop", description: "Owner/case custodian admin portal" },
  "overview-and-triage": { file: "admin-portal.html", label: "Admin Portal - Overview", group: "desktop", description: "Overview and triage (admin portal)" },
  "all-claims-register": { file: "all-claims-register.html", label: "All Claims Register", group: "desktop", description: "Statutory master docket of all claims" },
  "fee-reconciliation": { file: "fee-reconciliation.html", label: "Fee Reconciliation Ledger", group: "desktop", description: "Settlement accounting ledger" },
  "fee-reconciliation-ledger": { file: "fee-reconciliation.html", label: "Fee Reconciliation Ledger", group: "desktop", description: "Settlement accounting ledger" },

  // Mobile variants
  "home-mobile": { file: "home-mobile.html", label: "Home (Mobile)", group: "mobile", description: "Mobile landing page" },
  "client-home": { file: "home-mobile.html", label: "Home (Mobile)", group: "mobile", description: "Mobile landing page" },
  "how-we-work-mobile": { file: "how-we-work-mobile-1.html", label: "How We Work (Mobile) - Part 1", group: "mobile", description: "Mobile process page - part 1" },
  "how-we-work-mobile-1": { file: "how-we-work-mobile-1.html", label: "How We Work (Mobile) - Part 1", group: "mobile", description: "Mobile process page - part 1" },
  "how-we-work-mobile-2": { file: "how-we-work-mobile-2.html", label: "How We Work (Mobile) - Part 2", group: "mobile", description: "Mobile process page - part 2" },
  "transparent-fees-mobile": { file: "transparent-fees-mobile.html", label: "Transparent Fees (Mobile)", group: "mobile", description: "Mobile fee structure page" },
  "contact-mobile": { file: "contact-mobile.html", label: "Contact (Mobile)", group: "mobile", description: "Mobile contact page" },
  "contact-enquiries": { file: "contact-mobile.html", label: "Contact (Mobile)", group: "mobile", description: "Mobile contact page" },
  "login-mobile": { file: "login-mobile.html", label: "Login (Mobile)", group: "mobile", description: "Mobile login screen" },
  "register-new-claim-mobile": { file: "register-new-claim-mobile.html", label: "Register Claim (Mobile)", group: "mobile", description: "Mobile claim registration form" },
  "registration-confirmation-mobile": { file: "registration-confirmation-mobile.html", label: "Confirmation (Mobile)", group: "mobile", description: "Mobile registration confirmation" },
  "dashboard-mobile": { file: "dashboard-mobile.html", label: "Dashboard (Mobile)", group: "mobile", description: "Mobile customer dashboard" },
  "my-claims-mobile": { file: "my-claims-mobile.html", label: "My Claims (Mobile)", group: "mobile", description: "Mobile claims status tracking" },
  "profile-completion-mobile": { file: "profile-completion-mobile.html", label: "Profile Completion (Mobile)", group: "mobile", description: "Mobile profile completion form" },
  "admin-portal-mobile": { file: "admin-portal-mobile.html", label: "Admin Portal (Mobile)", group: "mobile", description: "Mobile admin portal" },
  "all-claims-register-mobile": { file: "all-claims-register-mobile.html", label: "All Claims Register (Mobile)", group: "mobile", description: "Mobile statutory docket" },
  "fee-reconciliation-mobile": { file: "fee-reconciliation-mobile.html", label: "Fee Reconciliation (Mobile)", group: "mobile", description: "Mobile settlement ledger" },
};

// Pages that have no data-path equivalent in the originals — map to closest match
const fallbackMap: Record<string, string> = {
  "about-us": "home",
  "our-clients": "home",
  disclaimer: "home",
  "privacy-policy": "home",
  "terms-and-conditions": "home",
  "terms-of-advocacy": "home",
  "refund-and-cancellation": "home",
  "compliance-and-grievance": "home",
  "security-protocols": "login",
  "support-and-contact": "contact",
  "nri-concierge-desk": "home",
  "health-insurance-claims": "home",
  "life-term-claims": "home",
  "motor-accident-claims": "home",
  "property-losses": "home",
  "travel-disputes": "home",
  "policyholders-and-clients": "admin-portal",
  "statutory-escalations": "all-claims-register",
  "advisory-roster": "admin-portal",
  "advocacy-case-action": "admin-portal",
  "emergency-hospital-cashless": "admin-portal",
  "ombudsman-appeals": "all-claims-register",
  "admin-dossier": "admin-portal",
};

export function resolveRoute(path: string): PageRoute {
  if (routes[path]) return routes[path];
  const fallback = fallbackMap[path];
  if (fallback && routes[fallback]) return routes[fallback];
  return routes["home"];
}
