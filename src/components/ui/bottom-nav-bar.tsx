"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  LineChart,
  CreditCard,
  MessageCircle,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type NavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
};

const defaultNavItems: NavItem[] = [
  { label: "Home", icon: Home },
  { label: "Portfolio", icon: LineChart },
  { label: "Transactions", icon: CreditCard },
  { label: "Messages", icon: MessageCircle },
  { label: "Rewards", icon: Trophy },
  { label: "Profile", icon: User },
];

const MOBILE_LABEL_WIDTH = 84;

export type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  stickyBottom?: boolean;
  items?: NavItem[];
  currentPath?: string;
};

export function BottomNavBar({
  className,
  defaultIndex = 0,
  stickyBottom = false,
  items = defaultNavItems,
  currentPath,
}: BottomNavBarProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  // Sync activeIndex with currentPath if provided
  useEffect(() => {
    if (!currentPath) return;
    const cleanCurrent = currentPath.replace(/\/$/, "");
    const foundIdx = items.findIndex((item) => {
      if (!item.href) return false;
      const cleanHref = item.href.replace(/\/$/, "");
      if (cleanHref === "" || cleanHref.endsWith("/")) {
        return cleanCurrent === cleanHref;
      }
      return cleanCurrent.endsWith(cleanHref);
    });
    if (foundIdx !== -1) {
      setActiveIndex(foundIdx);
    }
  }, [currentPath, items]);

  return (
    <motion.nav
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      role="navigation"
      aria-label="Navigation"
      className={cn(
        "bg-slate-900/90 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-full flex items-center p-1.5 sm:p-2 shadow-2xl shadow-black/60 space-x-1 sm:space-x-1.5 w-fit max-w-[96vw] h-[52px]",
        stickyBottom && "fixed inset-x-0 bottom-4 mx-auto z-40 w-fit",
        className,
      )}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeIndex === idx;

        const content = (
          <>
            <Icon
              size={20}
              strokeWidth={isActive ? 2.3 : 1.9}
              aria-hidden="true"
              className={cn(
                "transition-colors duration-200 shrink-0",
                isActive
                  ? "text-primary-950"
                  : "text-slate-400 group-hover:text-white",
              )}
            />

            <motion.div
              initial={false}
              animate={{
                width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                opacity: isActive ? 1 : 0,
                marginRight: isActive ? "6px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.18 },
                marginRight: { duration: 0.18 },
              }}
              className="overflow-hidden flex items-center max-w-[90px]"
            >
              <span
                className={cn(
                  "font-bold text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis leading-tight",
                  isActive
                    ? "text-primary-950"
                    : "opacity-0 text-slate-400",
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </>
        );

        const commonClasses = cn(
          "group flex items-center gap-0 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full transition-all duration-200 relative h-9 sm:h-10 min-w-[38px] sm:min-w-[42px] max-h-[42px] cursor-pointer",
          isActive
            ? "bg-gradient-to-r from-accent-400 to-accent-500 text-primary-950 shadow-md shadow-accent-500/25 font-bold"
            : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/80",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400",
        );

        if (item.href) {
          return (
            <motion.a
              key={item.label}
              href={item.href}
              whileTap={{ scale: 0.96 }}
              className={commonClasses}
              onClick={() => setActiveIndex(idx)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {content}
            </motion.a>
          );
        }

        return (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.96 }}
            className={commonClasses}
            onClick={() => setActiveIndex(idx)}
            aria-label={item.label}
            type="button"
          >
            {content}
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

export default BottomNavBar;
