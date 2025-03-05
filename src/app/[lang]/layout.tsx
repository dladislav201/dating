"use client";

import { useParams } from "next/navigation";
import { TranslationProvider } from "@/i18n/TranslationProvider";
import { ReactNode } from "react";
import { Locale } from "@/i18n";
import { ReduxProvider } from "@/store/provider";
import { Footer, GlobalNav } from "@/components";
import { SessionProvider } from "next-auth/react";

interface LangLayoutProps {
  children: ReactNode;
}

export default function LangLayout({ children }: LangLayoutProps) {
  const params = useParams();
  const locale = params.lang as Locale;

  return (
    <TranslationProvider locale={locale}>
      <ReduxProvider>
        <SessionProvider>
          <GlobalNav />
          {children}
          <Footer />
        </SessionProvider>
      </ReduxProvider>
    </TranslationProvider>
  );
}
