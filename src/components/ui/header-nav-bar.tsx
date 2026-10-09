"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
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

const LABEL_MAX_WIDTH = 140;

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

  // Determine active index based on current window location or currentPath
  const getIndexFromUrl = useCallback(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash && (hash.includes("calc") || hash === "#calculators")) {
        return 2;
      }

      const path = window.location.pathname.replace(/\/$/, "");
      const idx = NAV_LINKS.findIndex((link) => {
        if (link.isHash) return false;
        const target = `${cleanBase}${link.path}`.replace(/\/$/, "");
        if (link.path === "/") {
          return path === cleanBase || path === "" || path === "/";
        }
        return path === target || path.startsWith(target + "/");
      });
      return idx !== -1 ? idx : 0;
    }

    const current = currentPath.replace(/\/$/, "");
    const idx = NAV_LINKS.findIndex((link) => {
      if (link.isHash) return false;
      const target = `${cleanBase}${link.path}`.replace(/\/$/, "");
      if (link.path === "/") {
        return current === cleanBase || current === "" || current === "/";
      }
      return current === target || current.startsWith(target + "/");
    });
    return idx !== -1 ? idx : 0;
  }, [cleanBase, currentPath]);

  const [activeIndex, setActiveIndex] = useState(getIndexFromUrl);

  // Sync with browser navigation and scroll position
  useEffect(() => {
    // Immediately sync index on mount (fixes SSR hydration difference)
    setActiveIndex(getIndexFromUrl());

    const handleUrlChange = () => {
      setActiveIndex(getIndexFromUrl());
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);

    // Scroll-spy observer for the calculators section on homepage
    const calcEl = document.getElementById("calculators");
    let observer: IntersectionObserver | null = null;

    if (calcEl) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(2);
            } else {
              // If user scrolled back up towards hero / top of page
              if (window.scrollY < 350) {
                setActiveIndex(0);
              }
            }
          });
        },
        { rootMargin: "-10% 0px -40% 0px", threshold: 0.1 }
      );
      observer.observe(calcEl);
    }

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
      if (observer && calcEl) observer.unobserve(calcEl);
    };
  }, [getIndexFromUrl]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavLink, idx: number) => {
    if (typeof window === "undefined") return;

    const currentPathClean = window.location.pathname.replace(/\/$/, "");
    const isHomePage = currentPathClean === cleanBase || currentPathClean === "" || currentPathClean === "/";

    if (item.isHash && isHomePage) {
      e.preventDefault();
      setActiveIndex(idx);
      const calcEl = document.getElementById("calculators");
      if (calcEl) {
        calcEl.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `${cleanBase}/#calculators`);
      }
      return;
    }

    if (item.path === "/") {
      const isCurrentHome = currentPathClean === cleanBase || currentPathClean === "" || currentPathClean === "/";
      if (isCurrentHome) {
        e.preventDefault();
        setActiveIndex(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", `${cleanBase}/`);
        return;
      }
    }

    setActiveIndex(idx);
  };

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
            onClick={(e) => handleLinkClick(e, item, idx)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 2.1 : 1.8}
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
                marginRight: isActive ? "7px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.18 },
                marginRight: { duration: 0.18 },
              }}
              className="overflow-hidden flex items-center justify-center"
              style={{
                maxWidth: isMobileFloating ? "85px" : `${LABEL_MAX_WIDTH}px`,
              }}
            >
              <span
                className={cn(
                  "text-xs whitespace-nowrap select-none transition-opacity duration-200 leading-none py-0.5",
                  isActive
                    ? "text-primary-950 font-extrabold"
                    : "opacity-0 text-slate-400 font-medium",
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
