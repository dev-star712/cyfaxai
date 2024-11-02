import Home from "@/views/home";
import { NextSeo } from "next-seo";

export default function HomePage() {
  return (
    <>
      <NextSeo canonical={process.env.NEXT_PUBLIC_APP_BASE_URL} />
      <Home />
    </>
  );
}
