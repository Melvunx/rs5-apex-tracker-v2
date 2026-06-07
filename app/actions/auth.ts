"use server";

import { auth } from "@/lib/auth";
import { SignInSchema } from "@/schema/auth";

export async function signInWithProvider(provider: unknown) {
  const parsed = SignInSchema.shape.provider.safeParse(provider);

  if (!parsed.success) {
    return { success: false, error: "Provider invalide" };
  }

  await auth.api.signInSocial({
    body: { provider: parsed.data, callbackURL: "/dashboard" },
  });
}
