"use client";

import { useParams } from "next/navigation";
import { TranslationProvider } from "@/i18n/TranslationProvider";
import { ReactNode } from "react";
import { Locale } from "@/i18n";
import { ReduxProvider } from "@/store/provider";
import { Footer, GlobalNav } from "@/components";

interface LangLayoutProps {
  children: ReactNode;
}

export default function LangLayout({ children }: LangLayoutProps) {
  const params = useParams();
  const locale = params.lang as Locale;

  return (
    <TranslationProvider locale={locale}>
      <ReduxProvider>
        <GlobalNav />
        {children}
        <Footer />
      </ReduxProvider>
    </TranslationProvider>
  );
}
