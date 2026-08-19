import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Card } from "@/components/ui/Card";
import { LoginCampoForm } from "@/components/login/LoginCampoForm";
import { DEMO_MODE } from "@/lib/demo/mode";

export default function LoginCampoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutro-3 px-4 py-12">
      <Logo />

      <Card className="w-full max-w-sm">
        <h1 className="mb-1 font-titulo text-xl font-semibold text-preto">
          Entrar como Campo
        </h1>
        <p className="mb-6 text-sm text-neutro-1">
          Equipe de montagem e desmontagem
        </p>

        {DEMO_MODE && (
          <p className="mb-4 rounded-lg bg-neutro-3 p-3 text-xs text-neutro-1">
            Demonstração: entre com usuário <strong>diego.hugo</strong> (tem
            tarefas escaladas). Qualquer PIN funciona.
          </p>
        )}

        <LoginCampoForm />
      </Card>

      <Link href="/login" className="text-sm text-neutro-1 hover:text-preto">
        Voltar para seleção de perfil
      </Link>
    </div>
  );
}
