"use client";

import { motion, useReducedMotion } from "motion/react";

type SectionRevealProps = {
  children: React.ReactNode;
  id: string;
  className?: string;
  delay?: number;
};

export function SectionReveal({
  children,
  id,
  className,
  delay = 0,
}: SectionRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }} // se déclenche 80px avant d'entrer dans le viewport
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.section>
  );
}
