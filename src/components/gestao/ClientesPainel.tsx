"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { ClienteForm } from "@/components/gestao/ClienteForm";
import type { Cliente } from "@/types/domain";
import {
  criarCliente,
  atualizarCliente,
  excluirCliente,
  importarClientes,
} from "@/app/gestao/clientes/actions";

interface ClientesPainelProps {
  clientes: Cliente[];
}

export function ClientesPainel({ clientes }: ClientesPainelProps) {
  const [modal, setModal] = useState<"novo" | Cliente | null>(null);
  const inputArquivoRef = useRef<HTMLInputElement>(null);
  const [mensagemImportacao, setMensagemImportacao] = useState<string | null>(
    null
  );

  function exportarJSON() {
    const blob = new Blob([JSON.stringify(clientes, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clientes-mix-resolve.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    try {
      const texto = await arquivo.text();
      const dados = JSON.parse(texto);
      const lista = Array.isArray(dados) ? dados : [dados];
      const resultado = await importarClientes(lista);
      setMensagemImportacao(
        resultado.erro ?? `${resultado.importados} cliente(s) importado(s).`
      );
    } catch {
      setMensagemImportacao("Arquivo inválido. Use um JSON exportado por aqui.");
    } finally {
      if (inputArquivoRef.current) inputArquivoRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-titulo text-2xl font-semibold text-preto">
          Clientes
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportarJSON}>
            <Download size={16} />
            Exportar
          </Button>
          <Button
            variant="secondary"
            onClick={() => inputArquivoRef.current?.click()}
          >
            <Upload size={16} />
            Importar
          </Button>
          <input
            ref={inputArquivoRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={importarArquivo}
          />
          <Button onClick={() => setModal("novo")}>
            <Plus size={16} />
            Novo cliente
          </Button>
        </div>
      </div>

      {mensagemImportacao && (
        <p className="text-sm text-neutro-1">{mensagemImportacao}</p>
      )}

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-neutro-2 text-neutro-1">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">Contato</th>
              <th className="px-4 py-3 font-medium">Telefone</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} className="border-b border-neutro-2 last:border-0">
                <td className="px-4 py-3 font-medium text-preto">
                  <Link href={`/gestao/clientes/${c.id}`} className="hover:text-laranja">
                    {c.nome}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutro-1">{c.empresa ?? "-"}</td>
                <td className="px-4 py-3 text-neutro-1">
                  {c.contato_nome ?? "-"}
                </td>
                <td className="px-4 py-3 text-neutro-1">{c.telefone ?? "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setModal(c)}
                      aria-label="Editar"
                      className="rounded p-1.5 text-neutro-1 hover:bg-neutro-3 hover:text-preto"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => excluirCliente(c.id)}
                      aria-label="Excluir"
                      className="rounded p-1.5 text-neutro-1 hover:bg-conflito/10 hover:text-conflito"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutro-1">
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Modal
        aberto={modal !== null}
        titulo={modal === "novo" ? "Novo cliente" : "Editar cliente"}
        onFechar={() => setModal(null)}
      >
        {modal === "novo" && (
          <ClienteForm action={criarCliente} onSucesso={() => setModal(null)} />
        )}
        {modal !== null && modal !== "novo" && (
          <ClienteForm
            cliente={modal}
            action={atualizarCliente.bind(null, modal.id)}
            onSucesso={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
