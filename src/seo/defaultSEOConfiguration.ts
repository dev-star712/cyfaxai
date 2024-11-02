import { DefaultSeoProps } from "next-seo";
const defaultSEOConfiguration: DefaultSeoProps = {
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: process.env.NEXT_PUBLIC_APP_BASE_URL,
    siteName: "Cyfax",
  },
  title:
    "Run Your Cyfax Report: Comprehensive Cybersecurity Weakness and Data Leak Analysis",
  description:
    "Discover your firm's cyber vulnerabilities and leaked data with the Cyfax External Surveillance Platform. Get a 360° view of surface, deep, and dark web threats, plus check for poor email settings, exposed services, and more. Protect your business with instant insights and proactive cybersecurity measures.",
  // twitter: {
  //   handle: "@cyfax",
  //   site: "@cyfax",
  //   cardType: "summary_large_image",
  // },
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
  ],
};

export default defaultSEOConfiguration;
