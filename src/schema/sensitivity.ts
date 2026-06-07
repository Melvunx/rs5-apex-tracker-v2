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
  yaw: z.number().int().min(0).max(500).default(0),
  pitch: z.number().int().min(0).max(500).default(0),
  turningExtraYaw: z.number().int().min(0).max(250).default(0),
  turningExtraPitch: z.number().int().min(0).max(250).default(0),
  rampUpTime: z.number().int().min(0).max(100).default(0),
  rampUpDelay: z.number().int().min(0).max(100).default(0),
});

export const AdvancedControllerSettingsSchema = z.object({
  deadzone: z.number().int().min(0).max(50).default(0),
  outerThreshold: z.number().int().min(0).max(30).default(0),
  responseCurve: z.number().int().min(0).max(20).default(0),
});

// --- Schéma principal ---

export const SensitivitySchema = z.object({
  // Souris
  mouseDpi: z.number().int().min(100).max(32000).default(800),
  mouseSensitivity: z.number().min(0.1).max(20).default(1.0),
  mouseOpticEnabled: z.boolean().default(false),
  mouseOpticSettings: OpticSettingsSchema,

  // Manette
  baseControllerSetting: z.string().default("4-4 Classique"),
  advancedControllerSettingEnabled: z.boolean().default(false),
  advancedControllerSettings: AdvancedControllerSettingsSchema,
  controllerOpticEnabled: z.boolean().default(false),
  controllerOpticSettings: OpticSettingsSchema,
  hipfireSettings: TurningSettingsSchema,
  adsSettings: TurningSettingsSchema,
});

export const OPTIC_KEYS: (keyof OpticSettings)[] = [
  "x1",
  "x2",
  "x3",
  "x4",
  "x6",
  "x8",
  "x10",
];

export const TURNING_KEYS: {
  key: keyof TurningSettings;
  label: string;
  max: number;
}[] = [
  { key: "yaw", label: "Yaw Speed", max: 500 },
  { key: "pitch", label: "Pitch Speed", max: 500 },
  { key: "turningExtraYaw", label: "Turning Extra Yaw", max: 250 },
  { key: "turningExtraPitch", label: "Turning Extra Pitch", max: 250 },
  { key: "rampUpTime", label: "Ramp Up Time", max: 100 },
  { key: "rampUpDelay", label: "Ramp Up Delay", max: 100 },
];

export const ADVANCED_CONTROLLER_SET_KEYS: {
  key: keyof AdvancedControllerSettings;
  label: string;
  max: number;
}[] = [
  { key: "deadzone", label: "Deadzone", max: 50 },
  { key: "outerThreshold", label: "Outer Threshold", max: 30 },
  { key: "responseCurve", label: "Response Curve", max: 20 },
];

export const defaultOpticSettings: OpticSettings = {
  x1: 1.0,
  x2: 1.0,
  x3: 1.0,
  x4: 1.0,
  x6: 1.0,
  x8: 1.0,
  x10: 1.0,
};

export const defaultTurningSettings: TurningSettings = {
  yaw: 0,
  pitch: 0,
  turningExtraYaw: 0,
  turningExtraPitch: 0,
  rampUpTime: 0,
  rampUpDelay: 0,
};

export const defaultAdvancedControllerSettings: AdvancedControllerSettings = {
  deadzone: 0,
  outerThreshold: 0,
  responseCurve: 0,
};

export type OpticSettings = z.infer<typeof OpticSettingsSchema>;
export type TurningSettings = z.infer<typeof TurningSettingsSchema>;
export type AdvancedControllerSettings = z.infer<
  typeof AdvancedControllerSettingsSchema
>;
export type Sensitivity = z.infer<typeof SensitivitySchema>;
