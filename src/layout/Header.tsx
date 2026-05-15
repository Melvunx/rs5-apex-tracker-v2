// components/Header.tsx
"use client";

import { LinkButton } from "@/components/LinkButton";
import { Navbar } from "@/components/Navbar";
import { NAV_LINKS } from "@/schema/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOnTop, setIsOnTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 70) {
        setIsOnTop(false);
        setIsVisible(currentScrollY < lastScrollY); // visible si on remonte
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
      <nav
        className={`fixed top-0 left-0 right-0 transition-transform duration-300 z-50 backdrop-blur-sm border-b border-border/40 ${
          isOnTop ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-xl font-bold tracking-tight">
            R5 <span className="text-primary">Melvunx</span>{" "}
            <span className="text-muted-foreground font-normal text-sm">
              tracker
            </span>
          </h1>
          <ul className="flex items-center gap-2">
            {NAV_LINKS.map(({ link, label }) => (
              <li key={link}>
                <LinkButton
                  variant="outline"
                  classname="backdrop-blur-sm"
                  link={link}
                >
                  {label}
                </LinkButton>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <Navbar visible={isVisible} />
    </header>
  );
}
