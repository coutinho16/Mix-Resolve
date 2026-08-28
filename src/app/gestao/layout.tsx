import { redirect } from "next/navigation";
import { getUsuarioAtual, isAdminGestao } from "@/lib/auth/session";
import { NavGestao } from "@/components/gestao/NavGestao";

export default async function GestaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await getUsuarioAtual();

  if (!usuario) {
    redirect("/login/gestao");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutro-3">
      <NavGestao nome={usuario.nome} admin={isAdminGestao(usuario)} />
      <main className="flex-1 overflow-y-auto overflow-x-auto p-6 sm:p-8">{children}</main>
    </div>
  );
}
