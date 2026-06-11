"use server";

import { ChallengeStat } from "@/config/apex-weapons.config";
import { ActionResult, idsSchema } from "@/config/utils.config";
import prisma from "@/lib/prisma";
import { ChallengeNormalizedSchema, ManualChallengeSchema, UserChallengeStats } from "@/schema/challenge";
import { Challenge } from "@app/generated/prisma/client";

import { z } from "zod";
import { getSession } from "./auth";

// --- Actions ---

export async function createChallenges(
  rawChallenges: unknown[],
): Promise<ActionResult<{ count: number }>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Non authentifié" };

  const parsed = z.array(ChallengeNormalizedSchema).safeParse(rawChallenges);

  if (!parsed.success) {
    console.error("❌ Données invalides :", parsed.error);
    return { success: false, error: "Données invalides" };
  }

  const challenges = parsed.data.map((challenge) => ({
    ...challenge,
    userId: session.user.id,
  }));

  try {
    const result = await prisma.challenge.createMany({
      data: challenges,
      skipDuplicates: false,
    });

    console.log(`✨ ${result.count} enregistrements importés avec succès !`);
    return { success: true, data: { count: result.count } };
  } catch (error) {
    console.error("❌ Erreur Prisma :", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function getAllChallenges(): Promise<ActionResult<Challenge[]>> {
  try {
    const challenges = await prisma.challenge.findMany({
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
): Promise<ActionResult<ChallengeStat>> {
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

    const data: ChallengeStat = {
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

export async function createManualChallenge(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Non authentifié" };

  const parsed = ManualChallengeSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("❌ Données invalides :", parsed.error);
    return { success: false, error: "Données invalides" };
  }

  try {
    const challenge = await prisma.challenge.create({
      data: { ...parsed.data, userId: session.user.id },
    });
    return { success: true, data: { id: challenge.id } };
  } catch (error) {
    console.error("❌ Erreur Prisma :", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}



export async function getUserChallengeStats(): Promise<
  ActionResult<UserChallengeStats>
> {
  const session = await getSession();
  if (!session) return { success: false, error: "Non authentifié" };

  const userId = session.user.id;

  try {
    const [agg, favoriteWeaponRaw, plateformeRaw, user] =
      await prisma.$transaction([
        prisma.challenge.aggregate({
          where: { userId },
          _count: { id: true },
          _avg: { accuracy: true, kills: true, damage: true },
          _max: { accuracy: true },
          _sum: { kills: true, damage: true },
        }),
        prisma.challenge.groupBy({
          by: ["weapon"],
          where: { userId },
          _count: { weapon: true },
          orderBy: { _count: { weapon: "desc" } },
          take: 1,
        }),
        prisma.challenge.groupBy({
          by: ["plateforme"],
          where: { userId, plateforme: { not: null } },
          _count: { plateforme: true },
          orderBy: { _count: { plateforme: "desc" } },
          take: 1,
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { createdAt: true },
        }),
      ]);

    return {
      success: true,
      data: {
        total: agg._count.id,
        avgAccuracy: agg._avg.accuracy ?? 0,
        avgKills: agg._avg.kills ?? 0,
        avgDamage: agg._avg.damage ?? 0,
        bestAccuracy: agg._max.accuracy ?? 0,
        totalKills: agg._sum.kills ?? 0,
        totalDamage: agg._sum.damage ?? 0,
        favoriteWeapon: favoriteWeaponRaw[0]?.weapon ?? null,
        mostUsedPlateforme: plateformeRaw[0]?.plateforme ?? null,
        memberSince: user?.createdAt ?? new Date(),
      },
    };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la récupération des stats" };
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
