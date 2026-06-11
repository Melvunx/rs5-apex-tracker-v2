"use server";

import { ActionResult, Err, OkEmpty } from "@/config/utils.config";
import prisma from "@/lib/prisma";
import z from "zod";
import { getSession } from "./auth";
import { AdminUser, challengeIdSchema, userIdSchema } from "@/schema/auth";
import { AdminChallenge } from "@/schema/challenge";

// --- Guard admin ---

async function requireAdmin() {
  const session = await getSession();

  if (!session) throw new Error("Non authentifié");
  if (session.user.role !== "ADMIN") throw new Error("Accès refusé");

  return session;
}



// --- Gestion des utilisateurs ---

export async function getAllUsers(): Promise<ActionResult<AdminUser[]>> {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: { challenges: true },
        },
        accounts: {
          select: { providerId: true },
        },
      },
    });

    return {
      success: true,
      data: users.map((u) => ({ ...u, role: u.role as "USER" | "ADMIN" })),
    };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la récupération" };
  }
}

export async function updateUserRole(
  userId: unknown,
  role: unknown,
): Promise<OkEmpty | Err> {
  try {
    await requireAdmin();

    const parsedId = userIdSchema.safeParse(userId);
    const parsedRole = z.enum(["USER", "ADMIN"]).safeParse(role);

    if (!parsedId.success || !parsedRole.success) {
      return { success: false, error: "Données invalides" };
    }

    await prisma.user.update({
      where: { id: parsedId.data },
      data: { role: parsedRole.data },
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

export async function deleteUser(userId: unknown): Promise<OkEmpty | Err> {
  try {
    const session = await requireAdmin();

    const parsed = userIdSchema.safeParse(userId);
    if (!parsed.success) return { success: false, error: "ID invalide" };

    if (parsed.data === session.user.id) {
      return {
        success: false,
        error: "Impossible de supprimer votre propre compte",
      };
    }

    await prisma.user.delete({ where: { id: parsed.data } });

    return { success: true };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

// --- Gestion des données ---

export async function getUserChallenges(
  userId: unknown,
): Promise<ActionResult<AdminChallenge[]>> {
  try {
    await requireAdmin();

    const parsed = userIdSchema.safeParse(userId);
    if (!parsed.success) return { success: false, error: "ID invalide" };

    const challenges = await prisma.challenge.findMany({
      where: { userId: parsed.data },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: challenges };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la récupération" };
  }
}

export async function deleteChallenge(
  challengeId: unknown,
): Promise<OkEmpty | Err> {
  try {
    await requireAdmin();

    const parsed = challengeIdSchema.safeParse(challengeId);
    if (!parsed.success) return { success: false, error: "ID invalide" };

    await prisma.challenge.delete({ where: { id: parsed.data } });

    return { success: true };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

export async function deleteAllUserChallenges(
  userId: unknown,
): Promise<ActionResult<{ count: number }>> {
  try {
    await requireAdmin();

    const parsed = userIdSchema.safeParse(userId);
    if (!parsed.success) return { success: false, error: "ID invalide" };

    const result = await prisma.challenge.deleteMany({
      where: { userId: parsed.data },
    });

    return { success: true, data: { count: result.count } };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

export async function exportUserChallengesCSV(
  userId: unknown,
): Promise<ActionResult<{ csv: string; userName: string }>> {
  try {
    await requireAdmin();

    const parsed = userIdSchema.safeParse(userId);
    if (!parsed.success) return { success: false, error: "ID invalide" };

    const [user, challenges] = await prisma.$transaction([
      prisma.user.findUnique({
        where: { id: parsed.data },
        select: { name: true },
      }),
      prisma.challenge.findMany({
        where: { userId: parsed.data },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const header =
      "ChallengeName,ShotsHit,Kills,Weapon,Accuracy,Damage,CriticalShots,TotalShots,Roundtime,CreatedAt";

    const rows = challenges.map((c) =>
      [
        c.challengeName,
        c.shotsHit,
        c.kills,
        c.weapon,
        `${c.accuracy}%`,
        c.damage,
        c.criticalShots,
        c.totalShots,
        c.roundtime,
        c.createdAt.toISOString(),
      ].join(","),
    );

    const csv = [header, ...rows].join("\n");

    return { success: true, data: { csv, userName: user?.name ?? "unknown" } };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de l'export" };
  }
}
