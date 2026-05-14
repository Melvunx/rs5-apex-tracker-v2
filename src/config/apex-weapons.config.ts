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

  // SMGS
  { name: "R-99", slug: "r99", type: "SMG" },
  { name: "Volt", slug: "volt", type: "SMG" },
  { name: "Alternator", slug: "alternator", type: "SMG" },
  { name: "Prowler", slug: "prowler", type: "SMG" },

  // ARS
  { name: "R-301", slug: "r301", type: "AR" },
  { name: "Flatline", slug: "flatline", type: "AR" },
  { name: "Havoc", slug: "havoc", type: "AR" },
  { name: "Hemlok", slug: "hemlok", type: "AR" },

  // LMGS
  { name: "Devotion", slug: "devotion", type: "LMG" },
  { name: "L-star", slug: "lstar", type: "LMG" },
  { name: "Spitfire", slug: "spitfire", type: "LMG" },

  // MARKSMANS
  { name: "G7", slug: "G7", type: "MARKSMAN" },
  { name: "Triple-Take", slug: "tripletake", type: "MARKSMAN" },

  //SNIPERS
  { name: "Charge-Rifle", slug: "chargerifle", type: "SNIPER" },
  { name: "Kraber", slug: "kraber", type: "SNIPER" },
  { name: "Longbow", slug: "longbow", type: "SNIPER" },
  { name: "Sentinel", slug: "sentinel", type: "SNIPER" },

  //SHOTGUNS
  { name: "EVA-8", slug: "eva8", type: "SHOTGUN" },
  { name: "Mastiff", slug: "mastiff", type: "SHOTGUN" },
  { name: "Mozambique", slug: "mozambique", type: "SHOTGUN" },
  { name: "Peacekeeper", slug: "peacekeeper", type: "SHOTGUN" },
] satisfies z.input<typeof WeaponSchema>[];

// Validé une seule fois au démarrage
export const WEAPONS = z.array(WeaponSchema).parse(RAW_WEAPONS);

// --- Helpers ---
export function getWeaponsByType(type: WeaponType) {
  return WEAPONS.filter((w) => w.type === type);
}

export function getWeaponByName(name: string) {
  return WEAPONS.find((w) => w.name === name) ?? null;
}

export function getWeaponImagePath(type: WeaponType, slug: string) {
  return `/apex-weapons/${type.toLowerCase()}/${slug}.png`;
}

export function getWeaponBadgePath(slug: string) {
  return `/apex-weapons/badges/${slug}.webp`;
}
