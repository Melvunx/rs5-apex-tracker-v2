// schema/challenge.ts
import { z } from "zod";
import { WeaponSchema } from "../config/apex-weapons.config";

const percentageString = z
  .union([z.string(), z.number()]) // accepte string OU number
  .transform((val) => {
    const str = String(val).replace("%", "").trim();
    const num = parseFloat(str);
    if (isNaN(num)) throw new Error("Format de pourcentage invalide");
    return num;
  });

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
