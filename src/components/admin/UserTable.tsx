// components/admin/UserTable.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  deleteAllUserChallenges,
  deleteUser,
  exportUserChallengesCSV,
  updateUserRole,
  type AdminUser,
} from "@app/actions/admin";
import { Download, Shield, ShieldOff, Trash, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { UserChallengesDrawer } from "./UserChallengesDrawer";

type UserTableProps = {
  users: AdminUser[];
};

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  discord: "Discord",
};

export function UserTable({ users: initialUsers }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isPending, startTransition] = useTransition();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleRoleToggle = (user: AdminUser) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    startTransition(async () => {
      const result = await updateUserRole(user.id, newRole);

      if (result.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
        );
        toast.success(`Rôle mis à jour → ${newRole}`);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDeleteUser = (userId: string) => {
    startTransition(async () => {
      const result = await deleteUser(userId);

      if (result.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        if (selectedUserId === userId) setSelectedUserId(null);
        toast.success("Utilisateur supprimé");
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDeleteChallenges = (userId: string) => {
    startTransition(async () => {
      const result = await deleteAllUserChallenges(userId);

      if (result.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, _count: { challenges: 0 } } : u,
          ),
        );
        toast.success(`${result.data?.count} challenges supprimés`);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleExport = (userId: string, userName: string) => {
    startTransition(async () => {
      const result = await exportUserChallengesCSV(userId);

      if (result.success) {
        // Télécharge le CSV côté client
        const blob = new Blob([result.data.csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${result.data.userName}-challenges.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Export de  ${userName} téléchargé !`);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-center">Challenges</TableHead>
              <TableHead>Inscrit le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="border-b transition-colors hover:bg-muted/50"
              >
                {/* Utilisateur */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image ?? ""} />
                      <AvatarFallback className="text-xs">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Provider */}
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {user.accounts
                      .map((a) => PROVIDER_LABELS[a.providerId] ?? a.providerId)
                      .join(", ")}
                  </Badge>
                </TableCell>

                {/* Rôle */}
                <TableCell>
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>

                {/* Challenges */}
                <TableCell className="text-center">
                  <button
                    className="font-semibold text-primary hover:underline cursor-pointer"
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    {user._count.challenges}
                  </button>
                </TableCell>

                {/* Date */}
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={isPending}
                            onClick={() => handleRoleToggle(user)}
                          />
                        }
                      >
                        {user.role === "ADMIN" ? (
                          <ShieldOff className="h-4 w-4 text-amber-400" />
                        ) : (
                          <Shield className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {user.role === "ADMIN"
                          ? "Retirer admin"
                          : "Passer admin"}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={isPending}
                            onClick={() => handleExport(user.id, user.name)}
                          />
                        }
                      >
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>Exporter les challenges</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={isPending || user._count.challenges === 0}
                            onClick={() => handleDeleteChallenges(user.id)}
                          />
                        }
                      >
                        <Trash className="h-4 w-4 text-orange-400" />
                      </TooltipTrigger>
                      <TooltipContent>Supprimer les challenges</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={isPending}
                            onClick={() => handleDeleteUser(user.id)}
                          />
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Supprimer l&apos;utilisateur
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Drawer challenges */}
      <UserChallengesDrawer
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </>
  );
}
