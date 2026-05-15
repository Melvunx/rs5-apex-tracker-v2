import { FileForm } from "@/layout/File-form";
import { Graph } from "@/layout/Graph";
import { WeaponStats } from "@/layout/Weapon-Stats";

export default function Home() {
  return (
    <main>
      <main className="min-h-screen flex flex-col items-center gap-20 max-w-7xl w-full mx-auto pt-8 px-4">
        <section className="max-w-4xl w-full" id="graph">
          <Graph />
        </section>

        <section
          className="flex items-center max-w-4xl min-h-screen w-full"
          id="form"
        >
          <FileForm />
        </section>

        <section className="w-full" id="carrousel">
          <WeaponStats />
        </section>
      </main>
    </main>
  );
}
