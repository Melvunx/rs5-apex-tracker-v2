import { Footer } from "@/layout/Footer";
import { Header } from "@/layout/Header";
import { getSession } from "@app/actions/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <>
      <Header />
      {children} <Footer />
    </>
  );
}
