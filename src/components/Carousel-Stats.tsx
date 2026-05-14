"use client";

import { WeaponStat } from "@/config/apex-weapons.config";
import { Carousel } from "./ui/carousel";

type CarrouselProps = {
  stats: WeaponStat[];
  pending: boolean;
};

export function CarouselStats({ stats, pending }: CarrouselProps) {
  return (
    <Carousel>
      <div></div>
    </Carousel>
  );
}
