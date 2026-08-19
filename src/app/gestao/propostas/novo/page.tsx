import Link from "next/link";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PropostaForm } from "@/components/propostas/PropostaForm";
import { criarProposta } from "@/app/gestao/propostas/actions";

export default async function NovaPropostaPage() {
  const supabase = await createClient();
  const [{ data: clientes }, { data: eventos }] = await Promise.all([
    supabase.from("clientes").select("*").order("nome"),
    supabase.from("eventos").select("*").order("data_inicio", { ascending: false }),
  ]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-titulo text-2xl font-semibold text-preto">Nova proposta</h1>
          <p className="text-sm text-neutro-1">
            Preencha os dados do cliente. Equipamentos e textos ficam disponíveis logo
            após salvar.
          </p>
        </div>
        <Link href="/gestao/clientes">
          <Button type="button" variant="secondary">
            <Users size={16} />
            Clientes
          </Button>
        </Link>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-neutro-3 p-1">
          <span className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-branco-puro py-2 text-sm font-semibold font-titulo text-preto shadow-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-laranja text-[11px] font-bold text-branco-puro">
              1
            </span>
            Dados
          </span>
        </div>
        <PropostaForm clientes={clientes ?? []} eventos={eventos ?? []} action={criarProposta} />
      </Card>
    </div>
  );
}
