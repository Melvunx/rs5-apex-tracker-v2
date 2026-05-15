"use client";

import { WeaponStat, getWeaponBadgePath } from "@/config/apex-weapons.config";
import { Loading } from "./Loading";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

type CarrouselProps = {
  stats: WeaponStat[];
  pending: boolean;
};

type StatRowProps = {
  label: string;
  value: string;
};

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex justify-between items-center py-1.5 px-2 rounded-sm hover:bg-accent transition-colors">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export function CarrouselStats({ stats, pending }: CarrouselProps) {
  if (pending) return <Loading loadingString="Chargement des données" />;

  return (
    <Carousel className="w-full max-w-4xl mx-auto" opts={{ align: "start" }}>
      <CarouselContent className="flex px-1 items-center">
        {stats.map((stat) => (
          <div key={stat.weapon.name} className="py-1 px-3">
            <Card className="w-sm max-w-xs transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-col items-center gap-2 pb-3">
                <CardTitle className="flex w-full items-center gap-3 scroll-m-20 text-xl font-semibold tracking-tight">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getWeaponBadgePath(stat.weapon.slug)} />
                    <AvatarFallback className="text-xs">
                      {stat.weapon.name.slice(0, 3).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold">{stat.weapon.name}</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-3 p-6 pt-0">
                <div className="rounded-sm bg-primary/10 border-l-2 border-primary p-3">
                  <div className="text-sm uppercase font-semibold text-muted-foreground italic mb-1">
                    Précision globale
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {stat.average.accuracy.toFixed(2)} %
                  </div>
                </div>

                <div className="space-y-2">
                  <StatRow
                    label="Balles touchées"
                    value={stat.average.shotsHit.toFixed(2)}
                  />
                  <StatRow
                    label="Taux de frags"
                    value={stat.average.kills.toFixed(0)}
                  />
                  <StatRow
                    label="Taux de dégâts"
                    value={stat.average.damage.toFixed(2)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
