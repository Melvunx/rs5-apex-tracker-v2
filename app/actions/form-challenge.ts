"use server";

import { z } from "zod";
import { importChallenge, type ImportResult } from "./import-challenge";

const FileSchema = z
  .instanceof(File)
  .refine((file) => file.name.endsWith(".csv"), {
    message: "Le fichier doit être au format CSV",
  });

export async function uploadChallengeFile(
  data: FormData,
): Promise<ImportResult> {
  const raw = data.get("file");

  const parsed = FileSchema.safeParse(raw);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Fichier invalide";
    return {
      success: false,
      imported: 0,
      errors: 1,
      error: message,
      errorDetails: [message],
    };
  }

  const text = await parsed.data.text();
  return importChallenge(text);
}
