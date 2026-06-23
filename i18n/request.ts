import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  const locales = routing.locales as readonly string[];
  if (!locale || !locales.includes(locale)) locale = routing.defaultLocale;
  return {
    locale,
    timeZone: "Europe/Paris",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
