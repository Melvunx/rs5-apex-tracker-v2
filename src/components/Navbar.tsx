// components/Navbar.tsx
"use client";

import { NAV_LINKS } from "@/schema/navigation";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { LinkButton } from "./LinkButton";
import { ButtonGroup } from "./ui/button-group";

const SECTION_IDS = NAV_LINKS.map((l) => l.link.replace("#", ""));

type NavbarProps = {
  visible: boolean;
};

export function Navbar({ visible }: NavbarProps) {
  const [activeSection, setActiveSection] = useState(NAV_LINKS[0].link);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      for (const id of SECTION_IDS) {
        const element = document.getElementById(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(`#${id}`);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-3 right-1/2 translate-x-1/2 z-50"
          initial={{ y: reduceMotion ? 0 : -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{   y: reduceMotion ? 0 : -24, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ButtonGroup>
            {NAV_LINKS.map(({ link, label, classname }, index) => {
              const isActive = activeSection === link;

              return (
                <motion.div
                  key={link}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay:    index * 0.06, // cascade légère
                    ease:     "easeOut",
                  }}
                >
                  {/* Indicateur de section active */}
                  <div className="relative">
                    <LinkButton
                      link={link}
                      variant="outline"
                      size="lg"
                      classname={clsx(
                        "backdrop-blur-sm italic transition-colors",
                        isActive && classname,
                      )}
                    >
                      {label}
                    </LinkButton>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4/5 rounded-full bg-current"
                          layoutId="active-underline" // anime la barre entre les sections
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          exit={{   opacity: 0, scaleX: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </ButtonGroup>
        </motion.div>
      )}
    </AnimatePresence>
  );
}