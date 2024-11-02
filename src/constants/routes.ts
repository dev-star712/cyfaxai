const routes = {
  home: "/",
  publicReportResults: (domain: string) => `/results/${domain}`,
  dashboard: "/dashboard",
  currentRisk: "/dashboard/current-risk",
  management: "/dashboard/management",
  alertManagement: "/dashboard/alert-management",
  alertType: "/dashboard/alert-management/alert-type",
  createAlert: "/dashboard/alert-management/create-new-alert",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password/[slug]/[token]",
  leakedCredentials: "/dashboard/current-risk/leaked-credentials",
  selfAttestation: "/dashboard/current-risk/leaked-credentials/self-attestation",
  company_exposed_ports: "/dashboard/current-risk/company-exposed-ports",
  sub_domain_exploitable_services: "/dashboard/current-risk/sub-domain-exploitable-services",
  domain_name_variations: "/dashboard/current-risk/domain-name-variations",
  email_weaknesses: "/dashboard/current-risk/email-weaknesses",
  stealer_logs_for_sale: "/dashboard/current-risk/stealer-logs-for-sale",
  logs_infected_machine: "/dashboard/current-risk/logs-infected-machine",
  dark_web_mentions: "/dashboard/current-risk/dark-web-mentions",
  hacker_channel_mention: "/dashboard/current-risk/hacker-channel-mention",
  userManagement: "/dashboard/management/user-management",
  orgManagement: "/dashboard/management/org-management",
  vipManagement: "/dashboard/management/vip-management",
  see_all_vips: (slug: string) => `/dashboard/management/vip-management/seeAll/${slug}`,
  createOrgManagement: "/dashboard/management/org-management/create-organization",
  contactUs: "/contact-us",
  result: "/result",
  prices: "/plans-pricing"
};

export default routes;

export const authenticatedRoutes = [
  routes.dashboard,
  routes.currentRisk,
  routes.management,
  routes.alertManagement,
  routes.alertType,
  routes.createAlert,
  routes.company_exposed_ports,
  routes.sub_domain_exploitable_services,
  routes.domain_name_variations,
  routes.email_weaknesses,
  routes.stealer_logs_for_sale,
  routes.resetPassword,
  routes.leakedCredentials,
  routes.selfAttestation,
  routes.logs_infected_machine,
  routes.dark_web_mentions,
  routes.hacker_channel_mention,
  routes.userManagement,
  routes.orgManagement,
  routes.vipManagement,
  routes.see_all_vips,
  routes.createOrgManagement
];

export const unAuthenticatedRoutes = [
  routes.login,
  routes.signup,
  routes.forgotPassword,
  routes.contactUs
];
export const publicRoutes = [
  routes.home, 
  routes.publicReportResults(""),
  routes.result,
  routes.prices
];
