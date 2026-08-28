"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import type { StatusEvento } from "@/types/domain";
import { confirmarEvento, cancelarEvento } from "@/app/gestao/eventos/actions";

const rotulo: Record<StatusEvento, string> = {
  orcamento: "Orçamento",
  confirmado: "Confirmado",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export function EventoAcoesStatus({
  eventoId,
  status,
}: {
  eventoId: string;
  status: StatusEvento;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <Chip
        estado={status === "cancelado" ? "conflito" : "disponivel"}
        texto={rotulo[status]}
      />
      {status === "orcamento" && (
        <Button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => confirmarEvento(eventoId))}
        >
          Confirmar evento
        </Button>
      )}
      {status !== "cancelado" && status !== "concluido" && (
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() => startTransition(() => cancelarEvento(eventoId))}
        >
          Cancelar evento
        </Button>
      )}
      <a href={`/api/pdf/evento/${eventoId}`} target="_blank" rel="noreferrer">
        <Button type="button" variant="secondary">
          <Download size={16} />
          Ficha em PDF
        </Button>
      </a>
    </div>
  );
}
