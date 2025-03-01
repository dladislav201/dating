import { NextResponse, NextRequest  } from "next/server";
import Negotiator from "negotiator";
import { locales, defaultLocale } from "@/i18n/config";

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/socket.io") ||
    pathname.startsWith("/img") ||
    pathname.startsWith("/video") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const negotiator = new Negotiator({ headers: { "accept-language": acceptLanguage } });
    const locale = negotiator.language(locales) || defaultLocale;

    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}
