"use client";

import { LinkType } from "@/schema/navigation";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type LinkButtonProps = Omit<LinkType, "label"> & {
  children: React.ReactNode;
};

export function LinkButton({
  children,
  link: href,
  size,
  variant,
  classname,
}: LinkButtonProps) {
  const router = useRouter();

  return (
    <Button
      className={clsx("cursor-pointer", classname)}
      size={size ?? "default"}
      variant={variant ?? "default"}
      onClick={() => router.push(href)}
    >
      {children}
    </Button>
  );
}
