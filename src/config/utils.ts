import z from "zod";

// --- Schémas de validation ---

export const weaponNameSchema = z.string().min(1);

export const idsSchema = z.array(z.uuid()).min(1);

export const ChallengeStatsSchema = z.object({
  average: z.object({
    accuracy: z.number(),
    damage: z.number(),
    kills: z.number(),
  }),
  totalGamePlayed: z.number(),
  maxAccuracy: z.number(),
  minAccuracy: z.number(),
});

export type ChallengeStats = z.infer<typeof ChallengeStatsSchema>;

// --- Type de retour standardisé ---

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const defaultStats: ChallengeStats = {
  average: { accuracy: 0, damage: 0, kills: 0 },
  totalGamePlayed: 0,
  maxAccuracy: 0,
  minAccuracy: 0,
};

export const defaultWeaponStats = {
  challengePlayed: 0,
  average: {
    accuracy: 0,
    damage: 0,
    kills: 0,
    shotsHit: 0,
  },
};
