import Intl from "@/components/intl";
import Layout from "@/components/layout";
import defaultSEOConfiguration from "@/seo/defaultSEOConfiguration";
import "@/styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { Inter, Mulish, Poppins } from "next/font/google";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SelectedValueProvider } from '@/context/selectedValueContext';
import { AlertProvider } from '@/context/alertContext';
import { DataProvider } from "@/context/DataContext";
import { PlanProvider } from '@/context/selectedPriceContext';
import { SearchProvider } from '@/context/searchContext'; 

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function MyCustomApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <>
      <style jsx global>{`
        :root {
          --font-mulish: ${mulish.style.fontFamily};
          --font-poppins: ${poppins.style.fontFamily};
          --font-inter: ${inter.style.fontFamily};
        }
      `}</style>
      <QueryClientProvider client={queryClient}>
        <SearchProvider>
        <PlanProvider>
        <SelectedValueProvider>
          <DataProvider>
          <AlertProvider>
            <Intl>
              <Layout>
                <DefaultSeo {...defaultSEOConfiguration} />
                <Component {...pageProps} />
                <GoogleAnalytics gaId="G-JPQQNPQ5PG" />
              </Layout>
            </Intl>
            <ToastContainer stacked position="top-right" />
          </AlertProvider>
          </DataProvider>
        </SelectedValueProvider>
        </PlanProvider>
        </SearchProvider>
      </QueryClientProvider>
    </>
  );
}
