"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-3">
            Booking &amp; Pro
          </p>
          <h2 className="section-title mb-4">Contact</h2>
          <p className="text-white/40 text-sm mb-10">
            Pour toute demande de booking ou partenariat
          </p>

          <a
            href="mailto:booking@pagaproduction.fr"
            className="btn-primary text-sm px-8 py-3 justify-center inline-flex"
          >
            <Mail size={16} />
            booking@pagaproduction.fr
          </a>

          <div className="flex items-center justify-center gap-6 mt-10">
            <a
              href="https://www.instagram.com/pagaproduction"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
            >
              <ExternalLink size={14} />
              <span>Instagram</span>
            </a>
            <a
              href="https://www.youtube.com/@pagaproduction"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
            >
              <ExternalLink size={14} />
              <span>YouTube</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
