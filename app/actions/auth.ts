"use server";

import { auth } from "@/lib/auth";
import { SignInSchema } from "@/schema/auth";
import { headers } from "next/headers";

export async function signInWithProvider(provider: unknown) {
  const parsed = SignInSchema.shape.provider.safeParse(provider);

  if (!parsed.success) {
    return { success: false, error: "Provider invalide" };
  }

  await auth.api.signInSocial({
    body: { provider: parsed.data, callbackURL: "/dashboard" },
  });
}

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
