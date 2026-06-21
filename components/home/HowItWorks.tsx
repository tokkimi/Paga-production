"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Headphones, Calendar, Star } from "lucide-react";

const icons = [Headphones, Calendar, Star];
const stepKeys = ["step1", "step2", "step3"] as const;

export default function HowItWorks() {
  const t = useTranslations("home.how_it_works");

  return (
    <section className="border-y border-white/[0.06] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-left sm:text-center"
        >
          <h2 className="section-title">{t("title")}</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
          {stepKeys.map((step, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative min-w-0"
              >
                <div className="flex h-full gap-5 border-b border-white/[0.07] py-7 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-300/[0.06]">
                    <Icon size={19} className="text-cyan-300" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300/65">
                      0{i + 1}
                    </span>
                    <h3 className="mt-2 text-lg font-bold">{t(`${step}_title` as "step1_title")}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/48">
                      {t(`${step}_desc` as "step1_desc")}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
