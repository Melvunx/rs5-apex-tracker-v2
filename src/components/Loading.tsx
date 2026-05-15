"use client";

import { Card, CardContent } from "./ui/card";
import { Spinner } from "./ui/spinner";

type LoadingProps = {
  loadingString?: string;
};

export function Loading({ loadingString }: LoadingProps) {
  return (
    <Card>
      <CardContent className="flex py-16 items-center justify-center">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          {loadingString ?? "Chargement en cours"} <Spinner />
        </span>
      </CardContent>
    </Card>
  );
}
