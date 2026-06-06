import { z } from "zod";

// --- Sous-schémas JSON ---

export const OpticSettingsSchema = z.object({
  x1: z.number().min(0.1).max(10).default(1.0),
  x2: z.number().min(0.1).max(10).default(1.0),
  x3: z.number().min(0.1).max(10).default(1.0),
  x4: z.number().min(0.1).max(10).default(1.0),
  x6: z.number().min(0.1).max(10).default(1.0),
  x8: z.number().min(0.1).max(10).default(1.0),
  x10: z.number().min(0.1).max(10).default(1.0),
});

export const TurningSettingsSchema = z.object({
  yaw: z.number().int().min(0).max(500).optional(),
  pitch: z.number().int().min(0).max(500).optional(),
  turningExtraYaw: z.number().int().min(0).max(250).optional(),
  turningExtraPitch: z.number().int().min(0).max(250).optional(),
  rampUpTime: z.number().int().min(0).max(100).optional(),
  rampUpDelay: z.number().int().min(0).max(100).optional(),
});

// --- Schéma principal ---

export const SensitivitySchema = z.object({
  // Souris
  mouseDpi: z.coerce.number().int().min(100).max(32000).optional(),
  mouseSensitivity: z.coerce.number().min(0.1).max(20).optional(),
  mouseOpticEnabled: z.boolean().default(false),
  mouseOpticSettings: OpticSettingsSchema.optional(),

  // Manette
  baseControllerSetting: z.string().optional(),
  deadzone: z.coerce.number().int().min(0).max(50).optional(),
  outerThreshold: z.coerce.number().int().min(0).max(30).optional(),
  controllerOpticEnabled: z.boolean().default(false),
  controllerOpticSettings: OpticSettingsSchema.optional(),
  hipfireSettings: TurningSettingsSchema.optional(),
  adsSettings: TurningSettingsSchema.optional(),
});

export type OpticSettings = z.infer<typeof OpticSettingsSchema>;
export type TurningSettings = z.infer<typeof TurningSettingsSchema>;
export type Sensitivity = z.infer<typeof SensitivitySchema>;
