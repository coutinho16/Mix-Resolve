"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface ExcluirDocumentoBotaoProps {
  descricao: string;
  onConfirmar: () => Promise<{ erro?: string } | void>;
}

export function ExcluirDocumentoBotao({ descricao, onConfirmar }: ExcluirDocumentoBotaoProps) {
  const [aberto, setAberto] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function confirmar() {
    startTransition(async () => {
      const resultado = await onConfirmar();
      if (resultado?.erro) {
        setErro(resultado.erro);
      } else {
        setAberto(false);
        setErro(null);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setAberto(true);
        }}
        aria-label="Excluir"
        className="shrink-0 rounded p-1.5 text-neutro-1 hover:bg-conflito/10 hover:text-conflito"
      >
        <Trash2 size={16} />
      </button>

      <Modal
        aberto={aberto}
        titulo="Confirmar exclusão"
        onFechar={() => {
          setAberto(false);
          setErro(null);
        }}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-preto">
            Tem certeza que deseja excluir {descricao}? Essa ação não pode ser desfeita.
          </p>
          {erro && <p className="text-sm text-conflito">{erro}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setAberto(false);
                setErro(null);
              }}
              className="rounded-lg border border-neutro-2 px-4 py-2.5 text-sm font-semibold font-titulo text-preto hover:bg-neutro-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={confirmar}
              className="rounded-lg bg-conflito px-4 py-2.5 text-sm font-semibold font-titulo text-branco-puro hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
