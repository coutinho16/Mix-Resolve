import { redirect } from "next/navigation";
import { getUsuarioAtual } from "@/lib/auth/session";
import { HeaderCampo, BottomNavCampo } from "@/components/campo/NavCampo";

export default async function CampoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await getUsuarioAtual();

  if (!usuario) {
    redirect("/login/campo");
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutro-3">
      <HeaderCampo nome={usuario.nome} />
      <main className="flex-1 px-4 py-4 pb-20">{children}</main>
      <BottomNavCampo />
    </div>
  );
}
