"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "@/lib/auth-client";
import { SiDiscord, SiGoogle } from "@icons-pack/react-simple-icons";
import { motion } from "motion/react";

export function LoginForm() {
  const handleSignIn = async (provider: "google" | "discord") => {
    await signIn.social({ provider, callbackURL: "/dashboard" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            R5 <span className="text-primary">Melvunx</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Connecte-toi pour accéder à tes stats
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleSignIn("google")}
          >
            <SiGoogle className="h-4 w-4" />
            Continuer avec Google
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleSignIn("discord")}
          >
            <SiDiscord className="h-4 w-4 text-indigo-400" />
            Continuer avec Discord
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
