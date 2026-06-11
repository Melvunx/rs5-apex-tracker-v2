"use client";

import { LinkButton } from "@/components/LinkButton";
import { Navbar } from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut, useSession } from "@/lib/auth-client";
import { NAV_LINKS } from "@/schema/navigation";
import { CrosshairIcon, LogOutIcon, UserIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOnTop, setIsOnTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleNavigation = (href: string) => {
    setSheetOpen(false);
    router.push(href);
  };

  const handleSignOut = async () => {
    setSheetOpen(false);
    await signOut();
    router.push("/login");
  };

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

          {/* Liens + menu utilisateur */}
          <div className="flex items-center gap-2">
            <ul className="flex items-center gap-2">
              {NAV_LINKS.map(({ link, label }, index) => (
                <motion.li
                  key={link}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.15 + index * 0.08,
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

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger
                render={
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.35, ease: "easeOut" }}
                    className="cursor-pointer rounded-full"
                  />
                }
              >
                <Avatar>
                  <AvatarImage
                    src={user?.image ?? undefined}
                    alt={user?.name ?? "User"}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </SheetTrigger>

              <SheetContent side="right" className="w-72 flex flex-col">
                <SheetHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarImage
                        src={user?.image ?? undefined}
                        alt={user?.name ?? "User"}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <SheetTitle className="text-sm truncate">
                        {user?.name ?? "Utilisateur"}
                      </SheetTitle>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </SheetHeader>

                <Separator />

                <nav className="flex flex-col gap-1 py-4 flex-1">
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 w-full"
                    onClick={() => handleNavigation("/account")}
                  >
                    <UserIcon className="size-4" />
                    Mon compte
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 w-full"
                    onClick={() => handleNavigation("/sensitivity")}
                  >
                    <CrosshairIcon className="size-4" />
                    Sensibilités
                  </Button>
                </nav>

                <Separator />

                <div className="pt-4">
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleSignOut}
                  >
                    <LogOutIcon className="size-4" />
                    Se déconnecter
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.nav>

      <Navbar visible={isVisible} />
    </header>
  );
}
