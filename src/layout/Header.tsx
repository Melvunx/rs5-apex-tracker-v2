"use client";

import { LinkButton } from "@/components/LinkButton";
import { Navbar } from "@/components/Navbar";
import { NAV_LINKS } from "@/schema/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOnTop, setIsOnTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 70) {
        setIsOnTop(false);
        setIsVisible(currentScrollY < lastScrollY);
      } else {
        setIsOnTop(true);
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className="mb-14">
      {/* Nav principale — visible en haut de page */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-border/40"
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: isOnTop ? 0 : -80,
          opacity: isOnTop ? 1 : 0,
        }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
      >
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <motion.h1
            className="text-xl font-bold tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
            R5 <span className="text-primary">Melvunx</span>{" "}
            <span className="text-muted-foreground font-normal text-sm">
              tracker
            </span>
          </motion.h1>

          {/* Liens */}
          <ul className="flex items-center gap-2">
            {NAV_LINKS.map(({ link, label }, index) => (
              <motion.li
                key={link}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.15 + index * 0.08, // décalage en cascade
                  ease: "easeOut",
                }}
              >
                <LinkButton
                  variant="outline"
                  classname="backdrop-blur-sm"
                  link={link}
                >
                  {label}
                </LinkButton>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.nav>

      <Navbar visible={isVisible} />
    </header>
  );
}
