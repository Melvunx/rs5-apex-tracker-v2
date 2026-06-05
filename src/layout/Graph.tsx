// components/Graph.tsx
"use client";

import { ChartStarts } from "@/components/Chart-Stats";
import { Loading } from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WEAPONS, getWeaponImagePath } from "@/config/apex-weapons.config";
import {
  ChartData,
  TIME_RANGE_LABELS,
  TimeRange,
  filterByDateRange,
  filterWeaponChallenges,
} from "@/config/chart-utils.config";
import { getChallenges } from "@app/actions/challenge";
import { Challenge } from "@app/generated/prisma/client";
import { useEffect, useState, useTransition } from "react";

const ALL_WEAPONS_LABEL = "Toutes les armes";

// Armes groupées par type, calculé une seule fois
const WEAPONS_BY_TYPE = WEAPONS.reduce(
  (acc, weapon) => {
    if (weapon.type === "NOT FOUND") return acc; // on ignore ce type
    if (!acc[weapon.type]) acc[weapon.type] = [];
    acc[weapon.type].push(weapon);
    return acc;
  },
  {} as Record<string, typeof WEAPONS>,
);

export function Graph() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isPending, startTransition] = useTransition();
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [weaponName, setWeaponName] = useState(ALL_WEAPONS_LABEL);
  const [filteredData, setFilteredData] = useState<ChartData[]>([]);

  useEffect(() => {
    startTransition(async () => {
      setFilteredData([]);

      const result = await getChallenges();
      if (!result.success || result.data.length === 0) return;

      const filtered = result.data.filter(
        (c) => c.challengeName === "STRAFING DUMMY" && c.accuracy !== 0,
      );

      setChallenges(filtered);
      setFilteredData(filterWeaponChallenges(filtered, weaponName, timeRange));
    });
  }, [timeRange, weaponName]);

  const onDateChange = (value: string) => {
    const parsed = value as TimeRange;
    startTransition(() => {
      setTimeRange(parsed);
      setFilteredData(filterByDateRange(filteredData, parsed));
    });
  };

  const onWeaponChange = (value: string) => {
    startTransition(() => {
      setWeaponName(value);
      setFilteredData(filterWeaponChallenges(challenges, value, timeRange));
    });
  };

  const challengeCount =
    weaponName !== ALL_WEAPONS_LABEL
      ? filterByDateRange(
          challenges.filter((c) => c.weapon === weaponName),
          timeRange,
        ).length
      : filterByDateRange(challenges, timeRange).length;

  if (isPending) return <Loading loadingString="Chargement du graphique" />;

  if (!isPending && challenges.length === 0) {
    return (
      <Card className="min-h-screen">
        <CardHeader>
          <CardTitle className="border-b text-2xl pb-2 font-semibold tracking-tight">
            Aucune valeur trouvée ⚠️
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-10/12 items-center justify-center">
          <div className="flex flex-col gap-14 items-center">
            <p>Veuillez réessayer plus tard !</p>
            <Button variant="secondary" onClick={() => location.reload()}>
              Recharger 🔄️
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center mb-5 justify-between">
        <CardTitle className="border-b pb-2 text-lg font-semibold tracking-tight">
          Graphique de progression de l&apos;aim de Melvunx
        </CardTitle>
        <ButtonGroup>
          {/* Filtre période */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className={
                  timeRange === "7d"
                    ? "text-lime-300"
                    : timeRange === "30d"
                      ? "text-orange-300"
                      : "text-rose-300"
                }
              >
                {TIME_RANGE_LABELS[timeRange]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filtrer par période</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={timeRange}
                onValueChange={onDateChange}
              >
                {(Object.entries(TIME_RANGE_LABELS) as [TimeRange, string][])
                  .reverse()
                  .map(([value, label]) => (
                    <DropdownMenuRadioItem
                      key={value}
                      value={value}
                      className={
                        timeRange === value
                          ? "bg-primary/10 border-l-2 border-primary"
                          : "hover:bg-accent"
                      }
                    >
                      {label} derniers jours
                    </DropdownMenuRadioItem>
                  ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filtre arme */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className={
                  weaponName === ALL_WEAPONS_LABEL
                    ? "text-cyan-100"
                    : "text-primary"
                }
              >
                {weaponName}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="text-center">
                Filtrer par arme
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                className="text-center h-56"
                value={weaponName}
                onValueChange={onWeaponChange}
              >
                <DropdownMenuRadioItem value={ALL_WEAPONS_LABEL}>
                  {ALL_WEAPONS_LABEL}
                </DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                {Object.entries(WEAPONS_BY_TYPE).map(([type, weapons]) => (
                  <div key={type}>
                    <DropdownMenuLabel className="font-semibold text-xs uppercase bg-gray-400/10 text-muted-foreground italic px-2 py-1.5">
                      {type}
                    </DropdownMenuLabel>
                    {weapons.map((weapon) => {
                      const isSelected = weaponName === weapon.name;
                      return (
                        <DropdownMenuRadioItem
                          key={weapon.name}
                          value={weapon.name}
                          className={`flex w-full items-center my-1 rounded-sm transition-colors ${
                            isSelected
                              ? "bg-primary/10 border-l-2 border-primary"
                              : "hover:bg-accent"
                          }`}
                        >
                          <Avatar>
                            <AvatarImage
                              src={getWeaponImagePath(weapon.type, weapon.slug)}
                            />
                            <AvatarFallback>
                              {weapon.name.slice(0, 3).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={`ml-1 ${isSelected ? "font-bold text-primary" : ""}`}
                          >
                            {weapon.name}
                          </span>
                        </DropdownMenuRadioItem>
                      );
                    })}
                  </div>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </CardHeader>

      <CardContent>
        <ChartStarts
          data={filteredData}
          isLoading={isPending}
          timeRange={timeRange}
        />
      </CardContent>

      <CardFooter>
        <div>
          <p className="text-sm text-muted-foreground">
            {`Affichage des données pour ${
              weaponName === ALL_WEAPONS_LABEL ? "toutes les armes" : weaponName
            } sur les ${TIME_RANGE_LABELS[timeRange]}.`}
          </p>
          <p>
            {weaponName !== ALL_WEAPONS_LABEL
              ? `Challenges avec cette arme : ${challengeCount}`
              : `Total challenges : ${challengeCount}`}
          </p>
          {filteredData.length === 0 && (
            <p className="text-lg text-red-500">
              Aucune donnée disponible pour les filtres sélectionnés.
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
