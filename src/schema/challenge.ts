// schema/challenge.ts
import { z } from "zod";
import { WeaponSchema } from "../config/apex-weapons.config";

const percentageString = z.union([z.string(), z.number()]).transform((val) => {
  const str = String(val).replace("%", "").trim();
  const num = parseFloat(str);
  if (isNaN(num)) throw new Error("Format de pourcentage invalide");
  return num;
});

// Schéma brut CSV (PascalCase) → utilisé dans parseCSVLines
export const ChallengeCSVSchema = z.object({
  ChallengeName: z.coerce.string().min(1),
  ShotsHit: z.coerce.number().int().nonnegative(),
  Kills: z.coerce.number().int().nonnegative(),
  Weapon: z.coerce.string().pipe(WeaponSchema.shape.name),
  Accuracy: percentageString,
  Damage: z.coerce.number().int().nonnegative(),
  CriticalShots: z.coerce.number().int().nonnegative(),
  TotalShots: z.coerce.number().int().nonnegative(),
  Roundtime: z.coerce.number().int().positive(),
});

// Schéma transformé (camelCase) → utilisé dans createChallenges
export const ChallengeNormalizedSchema = z.object({
  challengeName: z.string().min(1),
  shotsHit: z.number().int().nonnegative(),
  kills: z.number().int().nonnegative(),
  weapon: z.string().min(1),
  accuracy: z.number().nonnegative(),
  damage: z.number().int().nonnegative(),
  criticalShots: z.number().int().nonnegative(),
  totalShots: z.number().int().nonnegative(),
  roundtime: z.number().int().positive(),
});

// Schéma CSV avec transform → utilisé dans parseCSVLines
export const ChallengeSchema = ChallengeCSVSchema.transform((data) => ({
  challengeName: data.ChallengeName,
  shotsHit: data.ShotsHit,
  kills: data.Kills,
  weapon: data.Weapon,
  accuracy: data.Accuracy,
  damage: data.Damage,
  criticalShots: data.CriticalShots,
  totalShots: data.TotalShots,
  roundtime: data.Roundtime,
}));

export type ChallengeCSV = z.input<typeof ChallengeSchema>;
export type Challenge = z.output<typeof ChallengeSchema>;
export type ChallengeNormalized = z.infer<typeof ChallengeNormalizedSchema>;
