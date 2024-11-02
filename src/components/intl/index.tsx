import { useRouter } from "next/router";
import { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import enTranslations from "../../../public/translations/en.json";
import esTranslations from "../../../public/translations/es.json";
import frTranslations from "../../../public/translations/fr.json";

const messages = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
};

export default function Intl({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { locale } = router;
  const messagesInLocale = messages[locale as never] as any;

  return (
    <IntlProvider locale={locale || "en"} messages={messagesInLocale}>
      <>{children}</>
    </IntlProvider>
  );
}
