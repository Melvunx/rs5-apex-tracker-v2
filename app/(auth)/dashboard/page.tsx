import { SectionReveal } from "@/components/SectionReveal";
import { FileForm } from "@/layout/File-form";
import { Graph } from "@/layout/Graph";
import { WeaponStats } from "@/layout/Weapon-Stats";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen flex flex-col items-center gap-20 max-w-7xl w-full mx-auto pt-8 px-4">
      <SectionReveal id="graph" className="max-w-4xl w-full">
        <Graph />
      </SectionReveal>
      <SectionReveal id="form" className="max-w-3xl w-full" delay={0.1}>
        <FileForm />
      </SectionReveal>
      <SectionReveal id="carrousel" className="w-full" delay={0.15}>
        <WeaponStats />
      </SectionReveal>
    </main>
  );
}
