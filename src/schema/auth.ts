import { z } from "zod";

export const SignInSchema = z.object({
  provider: z.enum(["google", "discord"]),
});

export const RoleSchema = z.enum(["USER", "ADMIN"]);

export const userIdSchema = z.cuid2();
export const challengeIdSchema = z.cuid2();

// --- Types publics ---

export const AdminUserSchema = z.object({
  id: userIdSchema,
  name: z.string().min(1),
  email: z.email().min(1),
  image: z.string().nullish(),
  role: RoleSchema,
  createdAt: z.date(),
  _count: z.object({ challenges: z.number() }),
  accounts: z.array(z.object({ providerId: z.cuid2() })),
});

export type SignIn = z.infer<typeof SignInSchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
