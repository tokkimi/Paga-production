"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Music,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "artists", href: "/artistes" },
  { key: "dates", href: "/dates" },
  { key: "music", href: "#musique" },
  { key: "sponsors", href: "/sponsors" },
  { key: "join", href: "/rejoindre" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  const getLocalePath = (href: string) => `/${locale}${href}`;

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false;
    return pathname.includes(href);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass-nav py-3" : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href={getLocalePath("/")}
            className="flex flex-col leading-none group"
          >
            <span className="text-xl font-black tracking-[0.15em] uppercase text-white group-hover:text-primary transition-colors duration-200">
              PAGA
            </span>
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary">
              PRODUCTION
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const href = link.href.startsWith("#")
                ? link.href
                : getLocalePath(link.href);
              return (
                <Link
                  key={link.key}
                  href={href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors duration-200",
                    isActive(link.href)
                      ? "text-primary"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  {t(link.key as "artists")}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="hidden md:flex items-center gap-1 glass-card px-3 py-1.5 rounded-full">
              <button
                onClick={() => switchLocale("fr")}
                className={cn(
                  "text-xs font-bold uppercase tracking-wider transition-colors",
                  locale === "fr" ? "text-primary" : "text-white/50 hover:text-white"
                )}
              >
                FR
              </button>
              <span className="text-white/20 text-xs">|</span>
              <button
                onClick={() => switchLocale("en")}
                className={cn(
                  "text-xs font-bold uppercase tracking-wider transition-colors",
                  locale === "en" ? "text-primary" : "text-white/50 hover:text-white"
                )}
              >
                EN
              </button>
            </div>

            {/* Auth */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 glass-card px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={14} className="text-primary" />
                  </div>
                  <span className="text-sm text-white/90 max-w-[100px] truncate hidden sm:block">
                    {session.user.name || session.user.email}
                  </span>
                  <ChevronDown size={14} className="text-white/60" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-strong rounded-xl overflow-hidden"
                    >
                      <div className="p-2">
                        <Link
                          href={getLocalePath("/profil")}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm text-white/90"
                        >
                          <User size={15} />
                          {t("profile")}
                        </Link>
                        {session.user.role === "BRAND" && (
                          <Link
                            href={getLocalePath("/marque")}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm text-white/90"
                          >
                            <Briefcase size={15} />
                            {t("brand")}
                          </Link>
                        )}
                        {session.user.role === "ADMIN" && (
                          <Link
                            href={getLocalePath("/admin")}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm text-white/90"
                          >
                            <Settings size={15} />
                            {t("admin")}
                          </Link>
                        )}
                        <hr className="border-white/10 my-1" />
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut({ callbackUrl: `/${locale}` });
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-red-400 w-full text-left"
                        >
                          <LogOut size={15} />
                          {t("logout")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href={getLocalePath("/connexion")}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-2"
                >
                  {t("login")}
                </Link>
                <Link
                  href={getLocalePath("/inscription")}
                  className="btn-primary text-sm py-2 px-4"
                >
                  {t("signup")}
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? (
                <X size={22} className="text-white" />
              ) : (
                <Menu size={22} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const href = link.href.startsWith("#")
                  ? link.href
                  : getLocalePath(link.href);
                return (
                  <Link
                    key={link.key}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-medium uppercase tracking-wider transition-colors",
                      isActive(link.href)
                        ? "bg-primary/20 text-primary"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {t(link.key as "artists")}
                  </Link>
                );
              })}

              <div className="flex items-center gap-3 px-4 py-3">
                <button
                  onClick={() => { switchLocale("fr"); setMobileOpen(false); }}
                  className={cn(
                    "text-sm font-bold uppercase",
                    locale === "fr" ? "text-primary" : "text-white/50"
                  )}
                >
                  FR
                </button>
                <span className="text-white/20">|</span>
                <button
                  onClick={() => { switchLocale("en"); setMobileOpen(false); }}
                  className={cn(
                    "text-sm font-bold uppercase",
                    locale === "en" ? "text-primary" : "text-white/50"
                  )}
                >
                  EN
                </button>
              </div>

              {!session && (
                <div className="flex gap-2 pt-2">
                  <Link
                    href={getLocalePath("/connexion")}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center btn-secondary text-sm py-2.5"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href={getLocalePath("/inscription")}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center btn-primary text-sm py-2.5"
                  >
                    {t("signup")}
                  </Link>
                </div>
              )}

              {session && (
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 px-4 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User size={14} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {session.user.name}
                      </div>
                      <div className="text-xs text-white/50">{session.user.email}</div>
                    </div>
                  </div>
                  <Link
                    href={getLocalePath("/profil")}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80"
                  >
                    <Music size={14} /> {t("profile")}
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link
                      href={getLocalePath("/admin")}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80"
                    >
                      <Settings size={14} /> {t("admin")}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: `/${locale}` });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 w-full"
                  >
                    <LogOut size={14} /> {t("logout")}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
