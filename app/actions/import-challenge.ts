// actions/import-challenge.ts
"use server";

import { ChallengeCSVSchema } from "@/schema/challenge";
import { z } from "zod";
import { createChallenges } from "./challenge";

// --- Schémas ---

const EXPECTED_COLUMNS = 9;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ImportResultSchema = z.object({
  success: z.boolean(),
  imported: z.number(),
  errors: z.number(),
  error: z.string(),
  errorDetails: z.array(z.string()),
});

export type ImportResult = z.infer<typeof ImportResultSchema>;

const defaultError = (
  message: string,
  errorDetails?: string[],
): ImportResult => ({
  success: false,
  imported: 0,
  errors: errorDetails?.length ?? 1,
  error: message,
  errorDetails: errorDetails ?? [message],
});

// --- Parser CSV ---

function parseCSVLines(lines: string[]): {
  records: z.output<typeof ChallengeCSVSchema>[];
  successCount: number;
  errorCount: number;
  errorDetails: string[];
} {
  const records = [];
  const errorDetails = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 3; // +3 car on a skippé header + types
    const columns = lines[i].split(",").map((col) => col.trim());

    if (columns.length < EXPECTED_COLUMNS) {
      errorCount++;
      errorDetails.push(
        `⚠️ Ligne ${lineNumber} : format invalide (${columns.length} colonnes)`,
      );
      continue;
    }

    const [
      ChallengeName,
      ShotsHit,
      Kills,
      Weapon,
      Accuracy,
      Damage,
      CriticalShots,
      TotalShots,
      Roundtime,
    ] = columns;

    const parsed = ChallengeCSVSchema.safeParse({
      ChallengeName,
      ShotsHit,
      Kills,
      Weapon,
      Accuracy,
      Damage,
      CriticalShots,
      TotalShots,
      Roundtime,
    });

    if (!parsed.success) {
      errorCount++;
      const issues = parsed.error.issues.map((i) => i.message).join(", ");
      errorDetails.push(`⚠️ Ligne ${lineNumber} : ${issues}`);
      continue;
    }

    records.push(parsed.data);
    successCount++;
  }

  if (errorCount === 0) console.log("✔️ Aucune erreur détectée !");

  return { records, successCount, errorCount, errorDetails };
}

// --- Action principale ---

export async function importChallenge(text: string): Promise<ImportResult> {
  const verifLine = process.env.VERIF_LINE;

  if (!verifLine) {
    const message = "❌ Variable d'environnement VERIF_LINE introuvable";
    console.error(message);
    return defaultError(message);
  }

  console.log("📥 Début de l'import des données...\n");

  const lines = text.split("\n").filter((line) => line.trim());
  const header = lines[0];
  const types = lines[1]?.split(",").filter((t) => t.trim()) ?? [];

  if (!header.includes(verifLine) || types.length !== EXPECTED_COLUMNS) {
    const message = "❌ Le fichier importé n'est pas valide";
    console.error(message);
    return defaultError(message);
  }

  const dataLines = lines.slice(2);
  const { records, successCount, errorCount, errorDetails } =
    parseCSVLines(dataLines);

  if (records.length === 0) {
    const message = "❌ Aucun enregistrement valide à importer";
    console.log(message);
    return defaultError(message, errorDetails);
  }

  const result = await createChallenges(records);

  if (!result.success) {
    return defaultError(result.error, errorDetails);
  }

  return {
    success: true,
    imported: successCount,
    errors: errorCount,
    error: errorDetails.slice(0, 3).join(" , "),
    errorDetails,
  };
}
