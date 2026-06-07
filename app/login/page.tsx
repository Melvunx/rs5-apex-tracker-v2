import { LoginForm } from "@/components/LoginForm";
import { getSession } from "@app/actions/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <LoginForm />
    </main>
  );
}
