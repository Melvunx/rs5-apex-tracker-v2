import { SensitivityForm } from "@/components/SensitivityForm";
import { getSensitivity } from "@app/actions/sensitivity";

export default async function SensitivityPage() {
  const result = await getSensitivity();

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-8">
        Mes sensibilités
      </h1>
      <SensitivityForm defaultValues={result.success ? result.data : null} />
    </main>
  );
}
