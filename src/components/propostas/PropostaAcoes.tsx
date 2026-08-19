"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import type { StatusProposta } from "@/types/domain";
import { atualizarStatusProposta } from "@/app/gestao/propostas/actions";

const rotulo: Record<StatusProposta, string> = {
  rascunho: "Rascunho",
  enviada: "Enviada",
  aceita: "Aceita",
  recusada: "Recusada",
  expirada: "Expirada",
};

export function PropostaAcoes({
  propostaId,
  status,
  contratoId,
}: {
  propostaId: string;
  status: StatusProposta;
  contratoId: string | null;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip estado={status === "aceita" ? "disponivel" : "em-uso"} texto={rotulo[status]} />

      {status === "rascunho" && (
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          className="text-xs"
          onClick={() => startTransition(() => atualizarStatusProposta(propostaId, "enviada"))}
        >
          Marcar como enviada
        </Button>
      )}

      {status === "enviada" && (
        <>
          <Button
            type="button"
            disabled={pending}
            className="text-xs"
            onClick={() => startTransition(() => atualizarStatusProposta(propostaId, "aceita"))}
          >
            Marcar como aceita
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            className="text-xs"
            onClick={() =>
              startTransition(() => atualizarStatusProposta(propostaId, "recusada"))
            }
          >
            Marcar como recusada
          </Button>
        </>
      )}

      {status === "aceita" && !contratoId && (
        <Link href={`/gestao/contratos/novo?propostaId=${propostaId}`}>
          <Button type="button" className="text-xs">
            Gerar contrato
          </Button>
        </Link>
      )}

      {contratoId && (
        <>
          <Link href={`/gestao/contratos/${contratoId}`}>
            <Button type="button" variant="secondary" className="text-xs">
              Abrir contrato
            </Button>
          </Link>
          <a href={`/api/pdf/contrato/${contratoId}`} target="_blank" rel="noreferrer">
            <Button type="button" variant="secondary" className="text-xs">
              <Download size={16} />
              PDF do contrato
            </Button>
          </a>
        </>
      )}
    </div>
  );
}
