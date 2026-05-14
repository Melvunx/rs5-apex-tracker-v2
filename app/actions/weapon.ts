"use server";

import { defaultWeaponStats, WeaponStat } from "@/config/apex-weapons.config";
import { ActionResult, weaponNameSchema } from "@/config/utils.config";
import prisma from "@/lib/prisma";

// --- Helpers ---

async function weaponExists(weaponName: string): Promise<boolean> {
  const weapon = await prisma.challenge.findFirst({
    where: { weapon: weaponName },
    select: { id: true }, // on récupère uniquement l'id, plus léger
  });
  return !!weapon;
}

// --- Actions ---

export async function getWeaponStats(
  weaponName: unknown,
): Promise<ActionResult<WeaponStat>> {
  const parsed = weaponNameSchema.safeParse(weaponName);

  if (!parsed.success) {
    return { success: false, error: "Nom d'arme invalide" };
  }

  try {
    if (!(await weaponExists(parsed.data))) {
      console.log(`❌ Aucun challenge trouvé pour l'arme "${parsed.data}"`);
      return { success: true, data: defaultWeaponStats(parsed.data) };
    }

    const stats = await prisma.challenge.aggregate({
      where: { weapon: parsed.data },
      _count: { weapon: true },
      _avg: { accuracy: true, damage: true, kills: true, shotsHit: true },
    });

    return {
      success: true,
      data: {
        weaponName: parsed.data,
        challengePlayed: stats._count.weapon ?? 0,
        average: {
          accuracy: stats._avg.accuracy ?? 0,
          damage: stats._avg.damage ?? 0,
          kills: stats._avg.kills ?? 0,
          shotsHit: stats._avg.shotsHit ?? 0,
        },
      },
    };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des stats",
    };
  }
}

export async function getMaxWeaponAccuracy(
  weaponName: unknown,
): Promise<ActionResult<{ accuracy: number }>> {
  const parsed = weaponNameSchema.safeParse(weaponName);

  if (!parsed.success) {
    return { success: false, error: "Nom d'arme invalide" };
  }

  try {
    if (!(await weaponExists(parsed.data))) {
      console.log(`❌ Aucun challenge trouvé pour l'arme "${parsed.data}"`);
      return { success: true, data: { accuracy: 0 } };
    }

    const stats = await prisma.challenge.aggregate({
      where: { weapon: parsed.data },
      _max: { accuracy: true },
    });

    return { success: true, data: { accuracy: stats._max.accuracy ?? 0 } };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la récupération" };
  }
}

export async function getMaxWeaponShotsHit(
  weaponName: unknown,
): Promise<ActionResult<{ shotsHit: number }>> {
  const parsed = weaponNameSchema.safeParse(weaponName);

  if (!parsed.success) {
    return { success: false, error: "Nom d'arme invalide" };
  }

  try {
    if (!(await weaponExists(parsed.data))) {
      console.log(`❌ Aucun challenge trouvé pour l'arme "${parsed.data}"`);
      return { success: true, data: { shotsHit: 0 } };
    }

    const stats = await prisma.challenge.aggregate({
      where: { weapon: parsed.data },
      _max: { shotsHit: true },
    });

    return { success: true, data: { shotsHit: stats._max.shotsHit ?? 0 } };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la récupération" };
  }
}

export async function getChallengePlayedPerWeapon(
  weaponName: unknown,
): Promise<ActionResult<{ challengePlayed: number }>> {
  const parsed = weaponNameSchema.safeParse(weaponName);

  if (!parsed.success) {
    return { success: false, error: "Nom d'arme invalide" };
  }

  try {
    if (!(await weaponExists(parsed.data))) {
      console.log(`❌ Aucun challenge trouvé pour l'arme "${parsed.data}"`);
      return { success: true, data: { challengePlayed: 0 } };
    }

    const count = await prisma.challenge.count({
      where: { weapon: parsed.data },
    });

    return { success: true, data: { challengePlayed: count } };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors du comptage" };
  }
}
