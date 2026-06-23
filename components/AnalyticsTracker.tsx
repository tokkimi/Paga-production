"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

function getSessionId() {
  const key = "paga_session_id";
  let value = sessionStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    sessionStorage.setItem(key, value);
  }
  return value;
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
  } else {
    fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    send({
      type: "page_view",
      path: pathname,
      locale,
      referrer: document.referrer || null,
      sessionId: getSessionId(),
    });
  }, [pathname, locale]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("a,button") as HTMLElement | null;
      if (!target || target.closest("[data-no-track]")) return;
      const label = target.getAttribute("data-track") || target.textContent?.trim().replace(/\s+/g, " ").slice(0, 160);
      const href = target instanceof HTMLAnchorElement ? target.href : null;
      send({ type: "click", path: location.pathname, locale, label, target: href, sessionId: getSessionId() });
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [locale]);

  return null;
}
