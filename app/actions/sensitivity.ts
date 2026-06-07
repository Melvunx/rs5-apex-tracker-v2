// actions/sensitivity.ts
"use server";

import { ActionResult } from "@/config/utils.config";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  AdvancedControllerSettingsSchema,
  defaultAdvancedControllerSettings,
  defaultOpticSettings,
  defaultTurningSettings,
  OpticSettingsSchema,
  Sensitivity,
  SensitivitySchema,
  TurningSettingsSchema,
} from "@/schema/sensitivity";
import { headers } from "next/headers";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

// Helper
function parsePrismaSensitivity(
  raw: Awaited<ReturnType<typeof prisma.sensitivity.findUnique>>,
): Sensitivity | null {
  if (!raw) return null;

  const parsedMouseOptic = OpticSettingsSchema.safeParse(
    raw.mouseOpticSettings,
  );

  const parsedControllerOptic = OpticSettingsSchema.safeParse(
    raw.controllerOpticSettings,
  );

  const parsedAdvancedControllerSettings =
    AdvancedControllerSettingsSchema.safeParse(raw.advancedControllerSettings);

  const parsedHipfireSettings = TurningSettingsSchema.safeParse(
    raw.hipfireSettings,
  );

  const parsedAdsSettings = TurningSettingsSchema.safeParse(raw.adsSettings);

  return SensitivitySchema.parse({
    // Souris

    mouseDpi: raw.mouseDpi,
    mouseSensitivity: raw.mouseSensitivity,
    mouseOpticEnabled: raw.mouseOpticEnabled,

    mouseOpticSettings: parsedMouseOptic.success
      ? parsedMouseOptic.data
      : defaultOpticSettings,

    // Manette

    baseControllerSetting: raw.baseControllerSetting,
    advancedControllerSettingEnabled: raw.advancedControllerSettingEnable,

    advancedControllerSettings: parsedAdvancedControllerSettings.success
      ? parsedAdvancedControllerSettings.data
      : defaultAdvancedControllerSettings,
      
    controllerOpticEnabled: raw.controllerOpticEnabled,

    controllerOpticSettings: parsedControllerOptic.success
      ? parsedControllerOptic.data
      : defaultOpticSettings,

    hipfireSettings: parsedHipfireSettings.success
      ? parsedHipfireSettings.data
      : defaultTurningSettings,

    adsSettings: parsedAdsSettings.success
      ? parsedAdsSettings.data
      : defaultTurningSettings,
  });
}

export async function getSensitivity(): Promise<
  ActionResult<Sensitivity | null>
> {
  const session = await getSession();
  if (!session) return { success: false, error: "Non authentifié" };

  try {
    const raw = await prisma.sensitivity.findUnique({
      where: { userId: session.user.id },
    });

    return { success: true, data: parsePrismaSensitivity(raw) };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la récupération" };
  }
}

export async function upsertSensitivity(
  raw: unknown,
): Promise<ActionResult<void>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Non authentifié" };

  const parsed = SensitivitySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.sensitivity.upsert({
      where: { userId: session.user.id },
      update: parsed.data,
      create: { userId: session.user.id, ...parsed.data },
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("❌ Erreur :", error);
    return { success: false, error: "Erreur lors de la sauvegarde" };
  }
}
