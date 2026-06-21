"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Headphones, Calendar, Star } from "lucide-react";

const icons = [Headphones, Calendar, Star];
const stepKeys = ["step1", "step2", "step3"] as const;

export default function HowItWorks() {
  const t = useTranslations("home.how_it_works");

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t("title")}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stepKeys.map((step, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-primary/40 to-transparent z-0" />
                )}

                <div className="glass-card p-8 text-center relative z-10 hover:border-primary/15 transition-colors">
                  {/* Step number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-black uppercase tracking-widest text-primary/60 bg-[#0a0a0a] px-3">
                      0{i + 1}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/30 transition-colors">
                    <Icon size={28} className="text-primary" />
                  </div>

                  <h3 className="text-xl font-bold mb-3">
                    {t(`${step}_title` as "step1_title")}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {t(`${step}_desc` as "step1_desc")}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
