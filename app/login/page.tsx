import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/dashboard");
    return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <LoginForm />
    </main>
  );
}
