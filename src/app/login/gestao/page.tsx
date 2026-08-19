import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Card } from "@/components/ui/Card";
import { LoginGestaoForm } from "@/components/login/LoginGestaoForm";
import { DEMO_MODE } from "@/lib/demo/mode";

export default function LoginGestaoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutro-3 px-4 py-12">
      <Logo />

      <Card className="w-full max-w-sm">
        <h1 className="mb-1 font-titulo text-xl font-semibold text-preto">
          Entrar como Gestão
        </h1>
        <p className="mb-6 text-sm text-neutro-1">Higor, Gabriel ou Flávio</p>

        {DEMO_MODE && (
          <p className="mb-4 rounded-lg bg-neutro-3 p-3 text-xs text-neutro-1">
            Demonstração: entre com <strong>gabriel@mixresolve.com.br</strong>
            {" "}ou <strong>higor@mixresolve.com.br</strong> (acesso admin) ou{" "}
            <strong>flavio@mixresolve.com.br</strong> (operacional). Qualquer
            senha funciona.
          </p>
        )}

        <LoginGestaoForm />
      </Card>

      <Link href="/login" className="text-sm text-neutro-1 hover:text-preto">
        Voltar para seleção de perfil
      </Link>
    </div>
  );
}
