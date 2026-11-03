// Everything the company still has to confirm lives here, so an answer from the
// SEO/ads questionnaire is a one-line edit instead of a hunt through pages.
// `null` means "not confirmed yet": anything that depends on it stays hidden.
// The comment on each line is the questionnaire item it comes from.

export const site = {
  name: 'ChaloSchools',

  // Contact (Q6.3). The WhatsApp number is the one the floating button already
  // uses; confirm it is the number the ads should send people to.
  whatsapp: '919962228160' as string | null,
  phone: '+91 99622 28160' as string | null, // call button on the ads page; set to null to hide it

  // The public contact email (footer, contact page, policies, search data), and where
  // new website leads (contact and demo forms) are sent.
  email: 'enquiry@chaloschools.com',
  leadEmail: 'enquiry@chaloschools.com',

  // Proof points (Q3.1). Taken from the existing site copy, so confirm before ads use them.
  schoolsCount: '200+',
  studentsCount: '1.5M+',

  // The count plan (confirmed by the company, 2026-10-29). Use these three and
  // nothing else, so every page agrees:
  //   14 modules      = 8 core + 6 add-ons (the menu groups)
  //    5 integrations = Biometric attendance, GPS fleet tracking, Tally ERP,
  //                     online payment gateway, WhatsApp
  //   19 together     = the old "19+" figure, always worded "modules and integrations"
  // Never write "19 modules" on its own. Reports & Analytics and the apps are
  // included with every plan and are not counted in the 14.
  modulesCount: '14',
  integrationsCount: '5',
  modulesAndIntegrationsCount: '19',

  // Pricing and offers (Q3.9, Q3.10). `null` hides the line.
  priceFrom: null as string | null, // e.g. 'From ₹X per student per year'
  launchOffer: null as string | null,

  // Tracking IDs (Q4.1 to Q4.4). The Google Analytics ID is still read from
  // NEXT_PUBLIC_GA_ID; these are for Tag Manager, Meta and Google Ads, which
  // are not wired up yet.
  gtmId: null as string | null,
  metaPixelId: null as string | null,
  googleAdsId: null as string | null,

  // Tamil Nadu content that is only true if the product supports it (Q3.5 to Q3.8).
  // Keep each `false` until the company confirms; pages hide the matching claims.
  flags: {
    emisSupported: false, // EMIS export / ID matching
    samacheerFormats: false, // Samacheer Kalvi report cards and exam patterns
    tamilMessaging: false, // Tamil in the app, SMS, WhatsApp and circulars
    rteAdmissions: false, // RTE admission and seat tracking
    tamilTcFormats: false, // Tamil transfer certificate formats
  },
};

export type SiteFlags = typeof site.flags;
