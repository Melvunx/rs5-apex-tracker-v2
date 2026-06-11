"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WEAPONS } from "@/config/apex-weapons.config";
import {
  PLATEFORME_LABELS,
  PlateformeSchema,
  TYPE_ENTRAINEMENT_LABELS,
  TypeEntrainementSchema,
} from "@/schema/challenge";
import { createManualChallenge } from "@app/actions/challenge";
import { PlusIcon } from "lucide-react";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  min?: string;
  step?: string;
  defaultValue?: string;
};

function Field({
  id,
  label,
  type = "number",
  min = "0",
  step,
  defaultValue,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="text-xs uppercase font-semibold text-muted-foreground"
      >
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        min={min}
        step={step}
        defaultValue={defaultValue}
        required
        className="h-9"
      />
    </div>
  );
}

export function ManualChallengeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const raw = {
      challengeName: fd.get("challengeName"),
      weapon: fd.get("weapon"),
      kills: fd.get("kills"),
      shotsHit: fd.get("shotsHit"),
      totalShots: fd.get("totalShots"),
      damage: fd.get("damage"),
      criticalShots: fd.get("criticalShots"),
      roundtime: fd.get("roundtime"),
      plateforme: fd.get("plateforme") || undefined,
      typeEntrainement: fd.get("typeEntrainement") || undefined,
    };

    startTransition(async () => {
      const result = await createManualChallenge(raw);
      if (result.success) {
        toast.success("Challenge ajouté avec succès !");
        formRef.current?.reset();
      } else {
        toast.error("Erreur lors de l'ajout", { description: result.error });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="scroll-m-20 text-2xl font-bold tracking-tight">
          Ajouter un challenge manuellement
        </CardTitle>
        <CardDescription>
          Renseigne les stats d&apos;une session d&apos;entraînement sans passer
          par un fichier CSV.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Infos générales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label
                htmlFor="challengeName"
                className="text-xs uppercase font-semibold text-muted-foreground"
              >
                Nom du challenge
              </Label>
              <Input
                id="challengeName"
                name="challengeName"
                type="text"
                placeholder="ex: Gridshot Ultimate"
                required
                className="h-9"
              />
            </div>

            {/* Arme */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="weapon"
                className="text-xs uppercase font-semibold text-muted-foreground"
              >
                Arme
              </Label>
              <select
                id="weapon"
                name="weapon"
                required
                className="h-9 w-full rounded-none border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="">Sélectionner une arme</option>
                {WEAPONS.map((w) => (
                  <option key={w.name} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Plateforme */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="plateforme"
                className="text-xs uppercase font-semibold text-muted-foreground"
              >
                Plateforme
              </Label>
              <select
                id="plateforme"
                name="plateforme"
                className="h-9 w-full rounded-none border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="">Non renseigné</option>
                {PlateformeSchema.options.map((p) => (
                  <option key={p} value={p}>
                    {PLATEFORME_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>

            {/* Type d'entraînement */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label
                htmlFor="typeEntrainement"
                className="text-xs uppercase font-semibold text-muted-foreground"
              >
                Type d&apos;entraînement
              </Label>
              <select
                id="typeEntrainement"
                name="typeEntrainement"
                className="h-9 w-full rounded-none border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="">Non renseigné</option>
                {TypeEntrainementSchema.options.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_ENTRAINEMENT_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats numériques */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field id="kills" label="Kills" min="0" />
            <Field id="shotsHit" label="Tirs touchés" min="0" />
            <Field id="totalShots" label="Tirs totaux" min="1" />
            <Field id="damage" label="Dégâts" min="0" />
            <Field id="criticalShots" label="Critiques" min="0" />
            <Field
              id="roundtime"
              label="Temps (ms)"
              min="1"
              defaultValue="60000"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto self-end"
          >
            <PlusIcon className="size-4" />
            {isPending ? "Ajout en cours…" : "Ajouter le challenge"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
