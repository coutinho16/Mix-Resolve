import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { FinanceiroListaPainel } from "@/components/financeiro/FinanceiroListaPainel";
import type { Financeiro } from "@/types/domain";

type RegistroFinanceiro = Financeiro & { clientes: { numero: number } | null };

export default async function FinanceiroPage() {
  const supabase = await createClient();
  const { data: registros } = await supabase
    .from("financeiro")
    .select("*, clientes(numero)")
    .order("data_emissao", { ascending: false });

  const todos = (registros ?? []) as unknown as RegistroFinanceiro[];

  const faturas = todos.filter((r) => r.tipo === "fatura");
  const recibos = todos.filter((r) => r.tipo === "recibo");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-titulo text-2xl font-semibold text-preto">Financeiro</h1>
        <Link href="/gestao/financeiro/novo">
          <Button>
            <Plus size={16} />
            Nova fatura ou recibo
          </Button>
        </Link>
      </div>

      <FinanceiroListaPainel faturas={faturas} recibos={recibos} />
    </div>
  );
}
