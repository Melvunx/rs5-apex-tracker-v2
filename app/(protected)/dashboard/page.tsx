import { SectionReveal } from "@/components/SectionReveal";
import { FileForm } from "@/layout/File-form";
import { Graph } from "@/layout/Graph";
import { ManualChallengeForm } from "@/layout/Manual-Challenge-Form";
import { WeaponStats } from "@/layout/Weapon-Stats";
import { getSession } from "@app/actions/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen flex flex-col items-center gap-20 max-w-7xl w-full mx-auto pt-8 px-4">
      <SectionReveal id="graph" className="max-w-4xl w-full">
        <Graph />
      </SectionReveal>
      <SectionReveal id="form" className="max-w-3xl w-full" delay={0.3}>
        <FileForm />
      </SectionReveal>
      <SectionReveal id="manual" className="max-w-3xl w-full" delay={0.2}>
        <ManualChallengeForm />
      </SectionReveal>
      <SectionReveal id="carrousel" className="w-full" delay={0.2}>
        <WeaponStats />
      </SectionReveal>
    </main>
  );
}
