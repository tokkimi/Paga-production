"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const t = useTranslations("cookies");
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setTimeout(() => setVisible(true), 1500);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
        >
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Cookie size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/80 leading-relaxed">
                  {t("message")}{" "}
                  <Link
                    href={`/${locale}/cookies`}
                    className="text-primary hover:underline"
                  >
                    {t("policy")}
                  </Link>
                  .
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={accept}
                    className="btn-primary text-xs py-2 px-4 flex-1 justify-center"
                  >
                    {t("accept")}
                  </button>
                  <button
                    onClick={decline}
                    className="btn-secondary text-xs py-2 px-4 flex-1 justify-center"
                  >
                    {t("decline")}
                  </button>
                </div>
              </div>
              <button
                onClick={decline}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
