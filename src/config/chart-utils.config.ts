// lib/chart-utils.ts
import { Challenge } from "@app/generated/prisma/client";
import { z } from "zod";

// --- Schémas ---

export const ChartDataSchema = z.object({
  accuracy: z.number(),
  day: z.string(),
});

export type ChartData = z.infer<typeof ChartDataSchema>;

export const TimeRangeSchema = z.enum(["7d", "30d", "90d"]);
export type TimeRange = z.infer<typeof TimeRangeSchema>;

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "7d": "7 jours",
  "30d": "30 jours",
  "90d": "90 jours",
};

// --- Helpers ---

export function formatedDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getMinTickGap(timeRange: TimeRange) {
  switch (timeRange) {
    case "7d":
      return 369;
    case "30d":
      return 169;
    case "90d":
      return 68;
  }
}

export function filterByDateRange<
  T extends { day: string } | { createdAt: Date },
>(data: T[], timeRange: TimeRange): T[] {
  const referenceDate = new Date();

  switch (timeRange) {
    case "7d":
      referenceDate.setDate(referenceDate.getDate() - 7);
      break;
    case "30d":
      referenceDate.setDate(referenceDate.getDate() - 30);
      break;
    case "90d":
      referenceDate.setDate(referenceDate.getDate() - 90);
      break;
  }

  return data.filter((item) => {
    const date = new Date("day" in item ? item.day : item.createdAt);
    return date >= referenceDate;
  });
}

export function filterWeaponChallenges(
  challenges: Challenge[],
  weaponName: string,
  timeRange?: TimeRange,
): ChartData[] {
  const data = challenges
    .filter(
      (c) =>
        (weaponName === "Toutes les armes" || c.weapon === weaponName) &&
        c.challengeName === "STRAFING DUMMY" &&
        c.accuracy !== 0,
    )
    .map((c) => ({
      accuracy: c.accuracy,
      day: c.createdAt.toISOString().split("T")[0],
    }));

  return timeRange ? filterByDateRange(data, timeRange) : data;
}
