import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PLATEFORME_LABELS } from "@/schema/challenge";
import { getSession } from "@app/actions/auth";
import { getUserChallengeStats } from "@app/actions/challenge";
import {
  CalendarIcon,
  CrosshairIcon,
  FlameIcon,
  GamepadIcon,
  ShieldIcon,
  SwordIcon,
  TargetIcon,
  TrophyIcon,
  ZapIcon,
} from "lucide-react";
import { redirect } from "next/navigation";

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent transition-colors">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-semibold text-sm">{value}</span>
    </div>
  );
}

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = session.user;
  const statsResult = await getUserChallengeStats();
  const stats = statsResult.success ? statsResult.data : null;

  const memberSince = stats?.memberSince
    ? new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(stats.memberSince))
    : "—";

  const plateformeLabel =
    stats?.mostUsedPlateforme && stats.mostUsedPlateforme in PLATEFORME_LABELS
      ? PLATEFORME_LABELS[
          stats.mostUsedPlateforme as keyof typeof PLATEFORME_LABELS
        ]
      : null;

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Mon compte</h1>

      {/* Profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback>
                {user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <StatRow
            icon={<ShieldIcon className="size-4" />}
            label="Rôle"
            value={user.role as string}
          />
          <StatRow
            icon={<CalendarIcon className="size-4" />}
            label="Membre depuis"
            value={memberSince}
          />
          {plateformeLabel && (
            <StatRow
              icon={<GamepadIcon className="size-4" />}
              label="Plateforme principale"
              value={plateformeLabel}
            />
          )}
        </CardContent>
      </Card>

      {/* Stats globales */}
      {stats && stats.total > 0 ? (
        <>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight">
              Statistiques d&apos;entraînement
            </h2>
            <Badge variant="secondary">{stats.total} challenges</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TargetIcon className="size-4" />
                  Précision moyenne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats.avgAccuracy.toFixed(1)}
                  <span className="text-lg text-muted-foreground">%</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Meilleure : {stats.bestAccuracy.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <SwordIcon className="size-4" />
                  Kills totaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats.totalKills.toLocaleString("fr-FR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Moy. par session : {stats.avgKills.toFixed(1)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FlameIcon className="size-4" />
                  Dégâts totaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats.totalDamage.toLocaleString("fr-FR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Moy. par session :{" "}
                  {Math.round(stats.avgDamage).toLocaleString("fr-FR")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrophyIcon className="size-4" />
                  Challenges joués
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.total}</p>
                {stats.favoriteWeapon && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <CrosshairIcon className="size-3" />
                    Arme favorite : {stats.favoriteWeapon}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ZapIcon className="size-4" />
                Récapitulatif
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <StatRow
                icon={<TargetIcon className="size-4" />}
                label="Précision moyenne"
                value={`${stats.avgAccuracy.toFixed(2)}%`}
              />
              <Separator className="my-1" />
              <StatRow
                icon={<SwordIcon className="size-4" />}
                label="Kills moyens / session"
                value={stats.avgKills.toFixed(1)}
              />
              <StatRow
                icon={<FlameIcon className="size-4" />}
                label="Dégâts moyens / session"
                value={Math.round(stats.avgDamage).toLocaleString("fr-FR")}
              />
              <Separator className="my-1" />
              <StatRow
                icon={<TrophyIcon className="size-4" />}
                label="Meilleure précision"
                value={`${stats.bestAccuracy.toFixed(2)}%`}
              />
              {stats.favoriteWeapon && (
                <StatRow
                  icon={<CrosshairIcon className="size-4" />}
                  label="Arme favorite"
                  value={stats.favoriteWeapon}
                />
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground text-sm">
            Aucun challenge enregistré pour l&apos;instant.
          </CardContent>
        </Card>
      )}
    </main>
  );
}
