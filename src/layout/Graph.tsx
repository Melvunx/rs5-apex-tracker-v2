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
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ALL_WEAPONS_LABEL,
  WEAPONS_BY_TYPE,
  getImagePathByWeaponName,
  getWeaponImagePath,
} from "@/config/apex-weapons.config";
import {
  ChartData,
  TIME_RANGE_LABELS,
  TimeRange,
  filterByDateRange,
  filterWeaponChallenges,
} from "@/config/chart-utils.config";
import { getAllChallenges } from "@app/actions/challenge";
import { Challenge } from "@app/generated/prisma/client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useTransition } from "react";

// --- Variants Motion ---

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.2 },
  },
};

const chartVariants = {
  hidden: { opacity: 0, scaleY: 0.9 },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: { duration: 0.5, delay: 0.3 },
  },
};

const footerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, delay: 0.5 } },
};

const emptyVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

export function Graph() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isPending, startTransition] = useTransition();
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [weaponName, setWeaponName] = useState(ALL_WEAPONS_LABEL);
  const [filteredData, setFilteredData] = useState<ChartData[]>([]);

  useEffect(() => {
    startTransition(async () => {
      setFilteredData([]);

      const result = await getAllChallenges();

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

  const isAllWeaponLabel = weaponName === ALL_WEAPONS_LABEL;

  if (isPending)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full">
          <Loading loadingString="Chargement du graphique" />
        </div>
      </div>
    );

  if (!isPending && challenges.length === 0) {
    return (
      <motion.div variants={emptyVariants} initial="hidden" animate="visible">
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
      </motion.div>
    );
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card>
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <CardHeader className="flex items-center mb-5 justify-between">
            <CardTitle className="border-b pb-2 text-lg font-semibold tracking-tight">
              Graphique de progression de l&apos;aim de Melvunx
            </CardTitle>
            <ButtonGroup>
              {/* Filtre période */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
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
                  }
                ></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Filtrer par période</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={timeRange}
                      onValueChange={onDateChange}
                    >
                      {(
                        Object.entries(TIME_RANGE_LABELS) as [
                          TimeRange,
                          string,
                        ][]
                      )
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
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filtre arme */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      className={
                        isAllWeaponLabel ? "text-cyan-100" : "text-rose-300"
                      }
                    >
                      {isAllWeaponLabel ? (
                        ALL_WEAPONS_LABEL
                      ) : (
                        <div className="flex gap-2 items-center">
                          <Avatar>
                            <AvatarImage
                              src={getImagePathByWeaponName(weaponName)}
                            />
                            <AvatarFallback>
                              {weaponName.slice(0, 3).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{weaponName}</span>
                        </div>
                      )}
                    </Button>
                  }
                ></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
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
                      {Object.entries(WEAPONS_BY_TYPE).map(
                        ([type, weapons]) => (
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
                                      src={getWeaponImagePath(
                                        weapon.type,
                                        weapon.slug,
                                      )}
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
                        ),
                      )}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </CardHeader>
        </motion.div>

        <motion.div variants={chartVariants} initial="hidden" animate="visible">
          <CardContent>
            {/* Transition fluide quand les données changent */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${weaponName}-${timeRange}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ChartStarts
                  data={filteredData}
                  isLoading={isPending}
                  timeRange={timeRange}
                />
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </motion.div>

        <motion.div
          variants={footerVariants}
          initial="hidden"
          animate="visible"
        >
          <CardFooter>
            <div>
              <p className="text-sm text-muted-foreground">
                {`Affichage des données pour ${
                  isAllWeaponLabel ? "toutes les armes" : weaponName
                } sur les ${TIME_RANGE_LABELS[timeRange]}.`}
              </p>
              <p>
                {!isAllWeaponLabel
                  ? `Challenges avec cette arme : ${challengeCount}`
                  : `Total de challenges : ${challengeCount}`}
              </p>
              {filteredData.length === 0 && (
                <p className="text-lg text-red-500">
                  Aucune donnée disponible pour les filtres sélectionnés.
                </p>
              )}
            </div>
          </CardFooter>
        </motion.div>
      </Card>
    </motion.div>
  );
}
