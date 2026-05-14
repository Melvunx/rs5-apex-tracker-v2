import { z } from "zod";

export const WEAPON_TYPE = {
  PISTOL: "Pistolet",
  SHOTGUN: "Fusil à pompe",
  SMG: "Mitraillette",
  LMG: "Mitrailleuse",
  AR: "Fusil d'assaut",
  SNIPER: "Fusil de précision",
  MARKSMAN: "Armes à longue portée",
} as const;

export const WeaponTypeSchema = z.enum([
  "PISTOL",
  "SHOTGUN",
  "SMG",
  "LMG",
  "AR",
  "SNIPER",
  "MARKSMAN",
]);

export type WeaponType = z.infer<typeof WeaponTypeSchema>;

export const WeaponSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1), // utilisé pour les paths d'images
  type: WeaponTypeSchema,
});

export type Weapon = z.infer<typeof WeaponSchema>;

// --- Données brutes ---
const RAW_WEAPONS = [
  // PISTOLS
  { name: "Wingman", slug: "wingman", type: "PISTOL" },
  { name: "RE-45", slug: "re45", type: "PISTOL" },
  { name: "P2020", slug: "p2020", type: "PISTOL" },

  // SMG
  { name: "R-99", slug: "r99", type: "SMG" },
  { name: "Volt", slug: "volt", type: "SMG" },
  { name: "Alternator", slug: "alternator", type: "SMG" },

  // AR
  { name: "R-301", slug: "r301", type: "AR" },
  { name: "Flatline", slug: "flatline", type: "AR" },
  // … etc
] satisfies z.input<typeof WeaponSchema>[];

// Validé une seule fois au démarrage
export const WEAPONS = z.array(WeaponSchema).parse(RAW_WEAPONS);

// --- Helpers ---
export function getWeaponsByType(type: WeaponType) {
  return WEAPONS.filter((w) => w.type === type);
}

export function getWeaponByName(name: string) {
  return WEAPONS.find((w) => w.name === name);
}

export function getWeaponImagePath(slug: string, type?: WeaponType) {
  if (type) return `/weapons/${type.toLowerCase()}/${slug}.png`;
  return `/weapons/badges/${slug}.webp`;
}
