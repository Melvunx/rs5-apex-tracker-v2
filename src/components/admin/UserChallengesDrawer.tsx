// components/admin/UserChallengesDrawer.tsx
"use client";

import { deleteChallenge, getUserChallenges } from "@app/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type Challenge = {
  id:            string;
  challengeName: string;
  weapon:        string;
  accuracy:      number;
  kills:         number;
  damage:        number;
  createdAt:     Date;
};

type UserChallengesDrawerProps = {
  userId:  string | null;
  onClose: () => void;
};

export function UserChallengesDrawer({ userId, onClose }: UserChallengesDrawerProps) {
  const [challenges, setChallenges]  = useState<Challenge[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!userId) return;

    startTransition(async () => {
      const result = await getUserChallenges(userId);
      if (result.success) setChallenges(result.data as Challenge[]);
    });
  }, [userId]);

  const handleDelete = (challengeId: string) => {
    startTransition(async () => {
      const result = await deleteChallenge(challengeId);

      if (result.success) {
        setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
        toast.success("Challenge supprimé");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Sheet open={!!userId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="min-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>
            Challenges{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({challenges.length})
            </span>
          </SheetTitle>
        </SheetHeader>

        {isPending ? (
          <p className="text-muted-foreground text-sm">Chargement...</p>
        ) : challenges.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucun challenge trouvé.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge</TableHead>
                <TableHead>Arme</TableHead>
                <TableHead className="text-right">Précision</TableHead>
                <TableHead className="text-right">Kills</TableHead>
                <TableHead className="text-right">Dégâts</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-sm">{c.challengeName}</TableCell>
                  <TableCell className="text-sm">{c.weapon}</TableCell>
                  <TableCell className="text-right text-sm">{c.accuracy.toFixed(2)}%</TableCell>
                  <TableCell className="text-right text-sm">{c.kills}</TableCell>
                  <TableCell className="text-right text-sm">{c.damage}</TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SheetContent>
    </Sheet>
  );
}