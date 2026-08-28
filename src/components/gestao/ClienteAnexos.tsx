"use client";

import { useRef, useState, useTransition } from "react";
import { Download, Paperclip, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ExcluirDocumentoBotao } from "@/components/ui/ExcluirDocumentoBotao";
import type { ClienteAnexo } from "@/types/domain";
import { enviarAnexoCliente, excluirAnexoCliente } from "@/app/gestao/clientes/actions";

function fmtTamanho(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ClienteAnexos({
  clienteId,
  anexos,
}: {
  clienteId: string;
  anexos: ClienteAnexo[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const resultado = await enviarAnexoCliente(clienteId, formData);
      setErro(resultado.erro ?? null);
      if (!resultado.erro) formRef.current?.reset();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-titulo text-lg font-semibold text-preto">Anexos</h2>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-neutro-2 bg-neutro-3/60 p-4"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-neutro-1">
            Arquivo
          </label>
          <input
            type="file"
            name="arquivo"
            required
            className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-laranja file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-branco-puro"
          />
        </div>
        <Button type="submit" disabled={pending}>
          <Upload size={16} />
          {pending ? "Enviando..." : "Enviar"}
        </Button>
      </form>

      {erro && <p className="text-sm text-conflito">{erro}</p>}

      <ul className="flex flex-col gap-2">
        {anexos.map((anexo) => (
          <li
            key={anexo.id}
            className="flex items-center justify-between rounded-lg border border-neutro-2 px-3 py-2 text-sm"
          >
            <span className="flex items-center gap-2 text-preto">
              <Paperclip size={14} className="shrink-0 text-neutro-1" />
              <span className="truncate">{anexo.nome_arquivo}</span>
              <span className="shrink-0 text-xs text-neutro-1">
                {fmtTamanho(anexo.tamanho_bytes)}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <a
                href={`/api/clientes/anexos/${anexo.id}`}
                aria-label="Baixar"
                className="rounded p-1.5 text-neutro-1 hover:bg-neutro-3 hover:text-preto"
              >
                <Download size={16} />
              </a>
              <ExcluirDocumentoBotao
                descricao="este anexo"
                onConfirmar={() =>
                  excluirAnexoCliente(clienteId, anexo.id, anexo.caminho_storage)
                }
              />
            </span>
          </li>
        ))}
        {anexos.length === 0 && (
          <p className="rounded-lg border border-dashed border-neutro-2 px-3 py-6 text-center text-sm text-neutro-1">
            Nenhum arquivo anexado ainda.
          </p>
        )}
      </ul>
    </div>
  );
}
