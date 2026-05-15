"use client";

import { CarrouselStats } from "@/components/Carrousel-Stats";
import { WEAPONS, WeaponStat } from "@/config/apex-weapons.config";
import { getWeaponStats } from "@app/actions/weapon";
import { useEffect, useState, useTransition } from "react";

export function WeaponStats() {
  const [isPending, startTransition] = useTransition();
  const [weaponStats, setWeaponStats] = useState<WeaponStat[]>([]);

  useEffect(() => {
    startTransition(async () => {
      setWeaponStats([]);

      const results = await Promise.all(
        WEAPONS.map((weapon) => getWeaponStats(weapon.name)),
      );

      const stats = results
        .filter((result) => result.success)
        .map((result) => result.data)
        .filter((stat) => stat.weapon.type !== "NOT FOUND");

      setWeaponStats(stats);
    });
  }, []);

  return (
    <div className="flex items-center min-h-screen">
      <CarrouselStats stats={weaponStats} pending={isPending} />
    </div>
  );
}
