"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Building2,
  Calculator,
  BookOpen,
  Users,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  icon: LucideIcon;
  path: string;
  isHash?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { label: "خانه", icon: Home, path: "/" },
  { label: "املاک گلستان", icon: Building2, path: "/properties/" },
  { label: "محاسبه کمیسیون", icon: Calculator, path: "/#calculators", isHash: true },
  { label: "وبلاگ", icon: BookOpen, path: "/blog/" },
  { label: "درباره ما", icon: Users, path: "/about/" },
  { label: "تماس با ما", icon: PhoneCall, path: "/contact/" },
];

const LABEL_MAX_WIDTH = 110;

type HeaderNavBarProps = {
  baseUrl?: string;
  currentPath?: string;
  className?: string;
  isMobileFloating?: boolean;
};

export function HeaderNavBar({
  baseUrl = "",
  currentPath = "",
  className,
  isMobileFloating = false,
}: HeaderNavBarProps) {
  const cleanBase = baseUrl.replace(/\/$/, "");
  
  // Find initial active index
  const getInitialIndex = () => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (hash === "#calculators") return 2;
      const idx = NAV_LINKS.findIndex((link) => {
        if (link.isHash) return false;
        const target = `${cleanBase}${link.path}`.replace(/\/$/, "");
        const current = path.replace(/\/$/, "");
        if (link.path === "/") return current === cleanBase || current === "";
        return current.includes(target);
      });
      return idx !== -1 ? idx : 0;
    }
    const idx = NAV_LINKS.findIndex((link) => {
      if (link.isHash) return false;
      const target = `${cleanBase}${link.path}`.replace(/\/$/, "");
      const current = currentPath.replace(/\/$/, "");
      if (link.path === "/") return current === cleanBase || current === "";
      return current.includes(target);
    });
    return idx !== -1 ? idx : 0;
  };

  const [activeIndex, setActiveIndex] = useState(getInitialIndex);

  // Sync with browser navigation
  useEffect(() => {
    const handleUrlChange = () => {
      setActiveIndex(getInitialIndex());
    };
    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
    };
  }, [cleanBase]);

  return (
    <motion.nav
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      role="navigation"
      aria-label="منوی اصلی"
      dir="rtl"
      className={cn(
        "bg-[#0a0f1d]/90 dark:bg-[#0a0f1d]/95 backdrop-blur-xl border border-slate-700/80 rounded-full flex items-center p-1 sm:p-1.5 shadow-2xl shadow-black/70 gap-1",
        isMobileFloating && "fixed inset-x-0 bottom-4 mx-auto z-50 w-fit max-w-[96vw] shadow-accent-500/10",
        className,
      )}
    >
      {NAV_LINKS.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeIndex === idx;
        const fullHref = `${cleanBase}${item.path}`;

        return (
          <motion.a
            key={item.label}
            href={fullHref}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "group flex items-center px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full transition-all duration-200 relative h-9 sm:h-10 min-w-[38px] sm:min-w-[42px] max-h-[42px] cursor-pointer whitespace-nowrap",
              isActive
                ? "bg-gradient-to-r from-accent-400 to-accent-600 text-primary-950 font-black shadow-lg shadow-accent-500/30"
                : "bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/80",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400",
            )}
            onClick={() => setActiveIndex(idx)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              size={19}
              strokeWidth={isActive ? 2.4 : 1.9}
              aria-hidden="true"
              className={cn(
                "transition-colors duration-200 shrink-0",
                isActive
                  ? "text-primary-950"
                  : "text-slate-400 group-hover:text-accent-400",
              )}
            />

            <motion.div
              initial={false}
              animate={{
                width: isActive ? "auto" : "0px",
                opacity: isActive ? 1 : 0,
                marginRight: isActive ? "6px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.18 },
                marginRight: { duration: 0.18 },
              }}
              className="overflow-hidden flex items-center"
              style={{ maxWidth: `${LABEL_MAX_WIDTH}px` }}
            >
              <span
                className={cn(
                  "font-bold text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis leading-tight",
                  isActive
                    ? "text-primary-950 font-black"
                    : "opacity-0 text-slate-400",
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </motion.a>
        );
      })}
    </motion.nav>
  );
}

export default HeaderNavBar;
