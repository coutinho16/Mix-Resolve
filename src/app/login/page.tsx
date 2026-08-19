import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Card } from "@/components/ui/Card";

export default function SelecaoPerfilPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-neutro-3 px-4 py-12">
      <Logo className="mb-2" />

      <div className="grid w-full max-w-md gap-4 sm:grid-cols-2">
        <Link href="/login/gestao">
          <Card className="flex h-full flex-col items-center justify-center gap-2 text-center transition-shadow hover:shadow-md">
            <span className="font-titulo text-lg font-semibold text-preto">
              Gestão
            </span>
            <span className="text-sm text-neutro-1">
              Planejamento, cadastro e controle
            </span>
          </Card>
        </Link>

        <Link href="/login/campo">
          <Card className="flex h-full flex-col items-center justify-center gap-2 text-center transition-shadow hover:shadow-md">
            <span className="font-titulo text-lg font-semibold text-preto">
              Campo
            </span>
            <span className="text-sm text-neutro-1">
              Tarefas do dia e checklists
            </span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
