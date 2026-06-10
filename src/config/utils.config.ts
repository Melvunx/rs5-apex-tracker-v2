import z from "zod";

// --- Schémas de validation ---

export const weaponNameSchema = z.string().min(1);
export const slugSchema = z.string().min(1);

export const idsSchema = z.array(z.uuid()).min(1);

// --- Type de retour standardisé ---

export type OkEmpty = { success: true };
export type Err = { success: false; error: string };
export type OkWith<T> = { success: true; data: T };

export type ActionResult<T> = OkWith<T> | Err;
