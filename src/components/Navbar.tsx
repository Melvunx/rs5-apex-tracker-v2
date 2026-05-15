"use client";

import { NAV_LINKS } from "@/schema/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { LinkButton } from "./LinkButton";
import { ButtonGroup } from "./ui/button-group";

const SECTION_IDS = NAV_LINKS.map((l) => l.link.replace("#", ""));

type NavbarProps = {
  visible: boolean;
};

export function Navbar({ visible }: NavbarProps) {
  const [activeSection, setActiveSection] = useState(NAV_LINKS[0].link);

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
    <ButtonGroup
      className={`fixed top-3 right-1/2 translate-x-1/2 transition-all duration-500 z-50 ${
        visible ? "translate-y-0" : "-translate-y-16"
      }`}
    >
      {NAV_LINKS.map(({ link, label, classname }) => (
        <LinkButton
          key={link}
          link={link}
          variant="outline"
          size="lg"
          classname={clsx(
            "backdrop-blur-sm italic transition-colors",
            activeSection === link && classname,
          )}
        >
          {label}
        </LinkButton>
      ))}
    </ButtonGroup>
  );
}
