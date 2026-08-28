"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FinanceiroForm, type DadosPuxados, type ItemPuxado } from "@/components/financeiro/FinanceiroForm";
import { criarFinanceiro } from "@/app/gestao/financeiro/actions";
import type { Cliente } from "@/types/domain";

interface GerarFinanceiroModalProps {
  clientes: Cliente[];
  dadosPuxados: DadosPuxados;
  itensPuxados: ItemPuxado[];
}

export function GerarFinanceiroModal({ clientes, dadosPuxados, itensPuxados }: GerarFinanceiroModalProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <Button type="button" variant="secondary" className="w-full" onClick={() => setAberto(true)}>
        <Receipt size={16} />
        Gerar fatura ou recibo
      </Button>
      <Modal aberto={aberto} titulo="Gerar fatura ou recibo" onFechar={() => setAberto(false)}>
        <FinanceiroForm
          clientes={clientes}
          dadosPuxados={dadosPuxados}
          itensPuxados={itensPuxados}
          action={criarFinanceiro}
        />
      </Modal>
    </>
  );
}
