import routes from "@/constants/routes";
import { GetServerSideProps } from "next";

async function generateSiteMap() {
  const urls: string[] = [];

  const publicRoutes = Object.values(routes).filter(
    (route) => typeof route === "string",
  );

  publicRoutes.forEach((route) => {
    urls.push(`
    <url>
        <loc>${process.env.NEXT_PUBLIC_APP_BASE_URL! + route}</loc>
        <lastmod>2024-06-06</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>${process.env.NEXT_PUBLIC_APP_BASE_URL! + route + "es"}</loc>
        <lastmod>2024-06-06</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>${process.env.NEXT_PUBLIC_APP_BASE_URL! + route + "fr"}</loc>
        <lastmod>2024-06-06</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>
    `);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   ${urls.join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = await generateSiteMap();

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
