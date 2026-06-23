import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const localePattern = /^\/(fr|en|ko)(\/|$)/;

function getLocale(pathname: string) {
  const match = pathname.match(localePattern);
  return match?.[1] || routing.defaultLocale;
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.includes("/admin")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      const locale = getLocale(pathname);
      return NextResponse.redirect(new URL(`/${locale}/connexion`, request.url));
    }
  }

  if (pathname.includes("/marque")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || (token.role !== "BRAND" && token.role !== "ADMIN")) {
      const locale = getLocale(pathname);
      return NextResponse.redirect(new URL(`/${locale}/connexion`, request.url));
    }
  }

  if (pathname.includes("/profil")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const locale = getLocale(pathname);
      return NextResponse.redirect(new URL(`/${locale}/connexion`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"
  ],
};
