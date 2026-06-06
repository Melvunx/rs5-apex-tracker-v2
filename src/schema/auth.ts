import { z } from "zod";

export const SignInSchema = z.object({
  provider: z.enum(["google", "discord"]),
});

export type SignIn = z.infer<typeof SignInSchema>;
