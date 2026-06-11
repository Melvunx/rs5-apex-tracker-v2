// schema/challenge.ts
import { z } from "zod";
import { WeaponSchema } from "../config/apex-weapons.config";

export const PlateformeSchema = z.enum(["MANETTE", "CLAVIER_SOURIS"]);
export type Plateforme = z.infer<typeof PlateformeSchema>;

export const TypeEntrainementSchema = z.enum([
  "STRAFE",
  "TARGET_SWITCHING",
  "TRACKING",
  "FLICKING",
  "MICRO_AJUSTEMENT",
  "CLOSE_RANGE",
  "LONGUE_DISTANCE",
  "LIBRE",
]);
export type TypeEntrainement = z.infer<typeof TypeEntrainementSchema>;

export const PLATEFORME_LABELS: Record<Plateforme, string> = {
  MANETTE: "Manette",
  CLAVIER_SOURIS: "Clavier / Souris",
};

export const TYPE_ENTRAINEMENT_LABELS: Record<TypeEntrainement, string> = {
  STRAFE: "Strafe",
  TARGET_SWITCHING: "Target Switching",
  TRACKING: "Tracking",
  FLICKING: "Flicking",
  MICRO_AJUSTEMENT: "Micro-ajustement",
  CLOSE_RANGE: "Close Range",
  LONGUE_DISTANCE: "Longue Distance",
  LIBRE: "Libre",
};

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

// Schéma pour la création manuelle d'un challenge depuis le formulaire
export const ManualChallengeSchema = z.object({
  challengeName: z.string().min(1, "Nom requis"),
  weapon: z.string().min(1, "Arme requise"),
  kills: z.coerce.number().int().nonnegative("Kills invalides"),
  shotsHit: z.coerce.number().int().nonnegative("Tirs touchés invalides"),
  totalShots: z.coerce.number().int().positive("Total tirs invalide"),
  damage: z.coerce.number().int().nonnegative("Dégâts invalides"),
  criticalShots: z.coerce.number().int().nonnegative("Critiques invalides"),
  roundtime: z.coerce.number().int().positive("Temps invalide"),
  plateforme: PlateformeSchema.optional(),
  typeEntrainement: TypeEntrainementSchema.optional(),
}).transform((data) => ({
  ...data,
  accuracy: data.totalShots > 0 ? (data.shotsHit / data.totalShots) * 100 : 0,
}));

export type ManualChallenge = z.infer<typeof ManualChallengeSchema>;
