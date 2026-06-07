import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@app/actions/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = session.user;

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Mon compte</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback>
                {user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-bold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex justify-between items-center py-1.5 px-2 rounded-sm hover:bg-accent transition-colors">
            <span className="text-sm text-muted-foreground">Rôle</span>
            <span className="font-semibold">{user.role}</span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
