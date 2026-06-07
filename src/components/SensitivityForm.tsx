"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ADVANCED_CONTROLLER_SET_KEYS,
  AdvancedControllerSettings,
  AdvancedControllerSettingsSchema,
  defaultAdvancedControllerSettings,
  defaultOpticSettings,
  defaultTurningSettings,
  OPTIC_KEYS,
  OpticSettings,
  OpticSettingsSchema,
  Sensitivity,
  TURNING_KEYS,
  TurningSettings,
  TurningSettingsSchema,
} from "@/schema/sensitivity";
import { upsertSensitivity } from "@app/actions/sensitivity";
import { motion } from "motion/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

// --- Types ---

type SensitivityFormProps = {
  defaultValues: Sensitivity | null;
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  pending: boolean;
};

type FieldRowProps = {
  label: string;
  children: React.ReactNode;
};

type GridProps<T> = {
  values: T;
  onChange: (key: keyof T, val: number) => void;
};

// --- Sous-composants ---

function SectionCard({ title, children, onSave, pending }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">{children}</CardContent>
        <CardFooter>
          <Button onClick={onSave} disabled={pending} className="ml-auto">
            {pending ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function FieldRow({ label, children }: FieldRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 px-2 rounded-sm hover:bg-accent transition-colors">
      <Label className="text-sm text-muted-foreground min-w-40">{label}</Label>
      <div className="flex-1 max-w-48">{children}</div>
    </div>
  );
}

function OpticGrid({ values, onChange }: GridProps<OpticSettings>) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {OPTIC_KEYS.map((key) => (
        <FieldRow key={key} label={`×${key.replace("x", "")}`}>
          <Input
            type="number"
            step="0.1"
            min="0.1"
            max="10"
            value={values[key] ?? 1.0}
            onChange={(e) => onChange(key, parseFloat(e.target.value))}
          />
        </FieldRow>
      ))}
    </div>
  );
}

function TurningGrid({ values, onChange }: GridProps<TurningSettings>) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {TURNING_KEYS.map(({ key, label, max }) => (
        <FieldRow key={key} label={label}>
          <Input
            type="number"
            min="0"
            max={max}
            value={values[key]}
            onChange={(e) => onChange(key, parseInt(e.target.value))}
          />
        </FieldRow>
      ))}
    </div>
  );
}

function AdvancedSettingGrid({
  values,
  onChange,
}: GridProps<AdvancedControllerSettings>) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {ADVANCED_CONTROLLER_SET_KEYS.map(({ key, label, max }) => (
        <FieldRow key={key} label={label}>
          <Input
            type="number"
            min="0"
            max={max}
            value={values[key]}
            onChange={(e) => onChange(key, parseInt(e.target.value))}
          />
        </FieldRow>
      ))}
    </div>
  );
}

// --- Composant principal ---

export function SensitivityForm({ defaultValues }: SensitivityFormProps) {
  const [isPending, startTransition] = useTransition();

  // Souris
  const [mouseDpi, setMouseDpi] = useState(defaultValues?.mouseDpi ?? 800);
  const [mouseSensitivity, setMouseSensitivity] = useState(
    defaultValues?.mouseSensitivity ?? 1.0,
  );
  const [mouseOpticEnabled, setMouseOpticEnabled] = useState(
    defaultValues?.mouseOpticEnabled ?? false,
  );
  const [mouseOptic, setMouseOptic] = useState<OpticSettings>(
    (defaultValues?.mouseOpticSettings as OpticSettings) ??
      defaultOpticSettings,
  );

  // Manette — base
  const [baseControllerSetting, setBaseControllerSetting] = useState(
    defaultValues?.baseControllerSetting ?? "4-4 Classique",
  );

  const [
    advancedControllerSettingEnabled,
    setAdvancedControllerSettingEnabled,
  ] = useState(defaultValues?.advancedControllerSettingEnabled ?? false);

  const [advancedControllerSettings, setAdvancedControllerSettings] =
    useState<AdvancedControllerSettings>(
      defaultValues?.advancedControllerSettings ??
        defaultAdvancedControllerSettings,
    );

  // Manette — optiques
  const [controllerOpticEnabled, setControllerOpticEnabled] = useState(
    defaultValues?.controllerOpticEnabled ?? false,
  );
  const [controllerOptic, setControllerOptic] = useState<OpticSettings>(
    (defaultValues?.controllerOpticSettings as OpticSettings) ??
      defaultOpticSettings,
  );

  // Manette — turning
  const [hipfire, setHipfire] = useState<TurningSettings>(
    (defaultValues?.hipfireSettings as TurningSettings) ??
      defaultTurningSettings,
  );
  const [ads, setAds] = useState<TurningSettings>(
    (defaultValues?.adsSettings as TurningSettings) ?? defaultTurningSettings,
  );

  // --- Helpers ---

  const updateMouseOptic = (key: keyof OpticSettings, val: number) =>
    setMouseOptic((opt) => ({ ...opt, [key]: val }));

  const updateControllerOptic = (key: keyof OpticSettings, val: number) =>
    setControllerOptic((opt) => ({ ...opt, [key]: val }));

  const updateAdvanceControllerSettings = (
    key: keyof AdvancedControllerSettings,
    val: number,
  ) => setAdvancedControllerSettings((acs) => ({ ...acs, [key]: val }));

  const updateHipfire = (key: keyof TurningSettings, val: number) =>
    setHipfire((hpf) => ({ ...hpf, [key]: val }));

  const updateAds = (key: keyof TurningSettings, val: number) =>
    setAds((ads) => ({ ...ads, [key]: val }));

  // --- Sauvegarde par section ---

  const save = (sens: Partial<Sensitivity>) => {
    startTransition(async () => {
      const result = await upsertSensitivity(sens);
      if (result.success) toast.success("Sensi Sauvegardée !");
      else toast.error("Erreur lors de la sauvegarde de la sensi");
    });
  };

  const saveMouseBase = () =>
    save({
      mouseDpi,
      mouseSensitivity,
    });

  const saveMouseOptic = () =>
    save({
      mouseOpticEnabled,
      mouseOpticSettings: mouseOpticEnabled
        ? OpticSettingsSchema.parse(mouseOptic)
        : undefined,
    });

  const saveControllerBase = () =>
    save({
      baseControllerSetting,
    });

  const saveAdvancedController = () =>
    save({
      advancedControllerSettingEnabled,
      advancedControllerSettings: advancedControllerSettingEnabled
        ? AdvancedControllerSettingsSchema.parse(advancedControllerSettings)
        : undefined,
    });

  const saveControllerOptic = () =>
    save({
      controllerOpticEnabled,
      controllerOpticSettings: controllerOpticEnabled
        ? OpticSettingsSchema.parse(controllerOptic)
        : undefined,
    });

  const saveControllerTurning = () =>
    save({
      hipfireSettings: TurningSettingsSchema.parse(hipfire),
      adsSettings: TurningSettingsSchema.parse(ads),
    });

  return (
    <Tabs defaultValue="mouse">
      <TabsList className="mb-6">
        <TabsTrigger value="mouse">🖱️ Souris / Clavier</TabsTrigger>
        <TabsTrigger value="controller">🎮 Manette</TabsTrigger>
      </TabsList>

      {/* ── Onglet Souris ── */}
      <TabsContent value="mouse" className="flex flex-col gap-6">
        <SectionCard
          title="Paramètres de base"
          onSave={saveMouseBase}
          pending={isPending}
        >
          <FieldRow label="DPI">
            <Input
              type="number"
              min="100"
              max="32000"
              step="100"
              placeholder="ex: 800"
              value={mouseDpi}
              onChange={(e) => setMouseDpi(Number(e.target.value))}
            />
          </FieldRow>
          <FieldRow label="Sensibilité">
            <Input
              type="number"
              min="0.1"
              max="20"
              step="0.01"
              placeholder="ex: 2.50"
              value={mouseSensitivity}
              onChange={(e) => setMouseSensitivity(Number(e.target.value))}
            />
          </FieldRow>
        </SectionCard>

        <SectionCard
          title="Sensibilités optiques"
          onSave={saveMouseOptic}
          pending={isPending}
        >
          <FieldRow label="Activer">
            <Switch
              checked={mouseOpticEnabled}
              onCheckedChange={setMouseOpticEnabled}
            />
          </FieldRow>
          {mouseOpticEnabled && (
            <OpticGrid values={mouseOptic} onChange={updateMouseOptic} />
          )}
        </SectionCard>
      </TabsContent>

      {/* ── Onglet Manette ── */}
      <TabsContent value="controller" className="flex flex-col gap-6">
        <SectionCard
          title="Paramètres de base"
          onSave={saveControllerBase}
          pending={isPending}
        >
          <FieldRow label="Preset de base">
            <Input
              placeholder="ex: 7-1 Linéaire"
              value={baseControllerSetting}
              onChange={(e) => setBaseControllerSetting(e.target.value)}
            />
          </FieldRow>
        </SectionCard>

        <SectionCard
          title="Sensibilités optiques"
          onSave={saveControllerOptic}
          pending={isPending}
        >
          <FieldRow label="Activer">
            <Switch
              checked={controllerOpticEnabled}
              onCheckedChange={setControllerOpticEnabled}
            />
          </FieldRow>
          {controllerOpticEnabled && (
            <OpticGrid
              values={controllerOptic}
              onChange={updateControllerOptic}
            />
          )}
        </SectionCard>

        <SectionCard
          title="Paramètres avancés"
          onSave={saveAdvancedController}
          pending={isPending}
        >
          <FieldRow label="Activer">
            <Switch
              checked={advancedControllerSettingEnabled}
              onCheckedChange={setAdvancedControllerSettingEnabled}
            />
          </FieldRow>
          {advancedControllerSettingEnabled && (
            <>
              <AdvancedSettingGrid
                values={advancedControllerSettings}
                onChange={updateAdvanceControllerSettings}
              />
              <SectionCard
                title="Turning — Hipfire"
                onSave={saveControllerTurning}
                pending={isPending}
              >
                <TurningGrid values={hipfire} onChange={updateHipfire} />
              </SectionCard>

              <SectionCard
                title="Turning — ADS"
                onSave={saveControllerTurning}
                pending={isPending}
              >
                <TurningGrid values={ads} onChange={updateAds} />
              </SectionCard>
            </>
          )}
        </SectionCard>
      </TabsContent>
    </Tabs>
  );
}
