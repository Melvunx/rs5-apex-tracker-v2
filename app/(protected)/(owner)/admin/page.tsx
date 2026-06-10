// app/(protected)/admin/page.tsx
import { getAllUsers } from "@app/actions/admin";
import { auth }        from "@/lib/auth";
import { headers }     from "next/headers";
import { redirect }    from "next/navigation";
import { UserTable }   from "@/components/admin/UserTable";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const result = await getAllUsers();

  return (
    <main className="max-w-7xl w-full mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Panel <span className="text-primary">Admin</span>
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Gestion des utilisateurs et de leurs données
      </p>

      {result.success && <UserTable users={result.data} />}
    </main>
  );
}