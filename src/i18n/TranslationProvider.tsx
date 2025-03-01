import { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { translations, Locale } from "@/i18n";

interface TranslationProviderProps {
  children: ReactNode;
  locale: Locale;
}

function flattenMessages(
  nestedMessages: Record<string, string | Record<string, string>>,
  prefix = ""
) {
  if (!nestedMessages) {
    return {};
  }

  return Object.keys(nestedMessages).reduce<Record<string, string>>(
    (messages, key) => {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        messages[prefixedKey] = value; // Якщо значення - рядок, зберігаємо в об'єкті
      } else {
        Object.assign(messages, flattenMessages(value, prefixedKey)); // Якщо значення - об'єкт, рекурсивно розкриваємо його
      }

      return messages;
    },
    {}
  );
}

export const TranslationProvider = ({
  locale,
  children,
}: TranslationProviderProps) => {
  const messages = flattenMessages(translations[locale]);

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};
