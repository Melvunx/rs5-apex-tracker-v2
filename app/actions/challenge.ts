"use server";

import {
  ActionResult,
  ChallengeStats,
  idsSchema,
  weaponNameSchema,
} from "@/config/utils";
import prisma from "@/lib/prisma";
import { ChallengeSchema, type Challenge } from "@/schema/challenge";
import { z } from "zod";

// --- Actions ---

export async function createChallenges(
  rawChallenges: unknown[],
): Promise<ActionResult<{ count: number }>> {
  const parsed = z.array(ChallengeSchema).safeParse(rawChallenges);

  if (!parsed.success) {
    console.error("❌ Données invalides :", z.treeifyError(parsed.error));
    return { success: false, error: "Données invalides" };
  }

  try {
    const result = await prisma.challenge.createMany({
      data: parsed.data,
      skipDuplicates: false,
    });

    console.log(`✨ ${result.count} enregistrements importés avec succès !`);
    return { success: true, data: { count: result.count } };
  } catch (error) {
    console.error("❌ Erreur Prisma :", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function getChallenges(
  weaponName?: unknown,
): Promise<ActionResult<Challenge[]>> {
  const parsed = weaponNameSchema.safeParse(weaponName);

  if (!parsed.success) {
    return { success: false, error: "Nom d'arme invalide" };
  }

  try {
    const challenges = await prisma.challenge.findMany({
      where: parsed.data ? { weapon: parsed.data } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: challenges };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la récupération" };
  }
}

export async function getChallengesStats(
  getAll = false,
): Promise<ActionResult<ChallengeStats>> {
  try {
    const [stats, totalGamePlayed] = await prisma.$transaction([
      prisma.challenge.aggregate({
        _avg: { accuracy: true, damage: true, kills: true },
        _max: { accuracy: true },
        _min: { accuracy: true },
        ...(!getAll && { take: 10 }),
      }),
      prisma.challenge.count(),
    ]);

    const data: ChallengeStats = {
      average: {
        accuracy: stats._avg.accuracy ?? 0,
        damage: stats._avg.damage ?? 0,
        kills: stats._avg.kills ?? 0,
      },
      totalGamePlayed,
      maxAccuracy: stats._max.accuracy ?? 0,
      minAccuracy: stats._min.accuracy ?? 0,
    };

    return { success: true, data };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des stats",
    };
  }
}

export async function deleteChallenges(
  ids: unknown,
): Promise<ActionResult<{ count: number }>> {
  const parsed = idsSchema.safeParse(ids);

  if (!parsed.success) {
    console.error("❌ IDs invalides :", z.treeifyError(parsed.error));
    return { success: false, error: "IDs invalides" };
  }

  try {
    const result = await prisma.challenge.deleteMany({
      where: { id: { in: parsed.data } },
    });

    return { success: true, data: { count: result.count } };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}
