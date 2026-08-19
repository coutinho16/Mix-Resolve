"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Chip } from "@/components/ui/Chip";
import { NovoUsuarioCampoForm } from "@/components/gestao/NovoUsuarioCampoForm";
import { NovoUsuarioGestaoForm } from "@/components/gestao/NovoUsuarioGestaoForm";
import type { Usuario } from "@/types/domain";
import { alternarAtivoUsuario } from "@/app/gestao/equipe/actions";

interface EquipePainelProps {
  usuarios: Usuario[];
  admin: boolean;
}

export function EquipePainel({ usuarios, admin }: EquipePainelProps) {
  const [modal, setModal] = useState<"campo" | "gestao" | null>(null);

  const gestao = usuarios.filter((u) => u.perfil === "gestao");
  const campo = usuarios.filter((u) => u.perfil === "campo");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-titulo text-2xl font-semibold text-preto">
          Equipe
        </h1>
        {admin && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setModal("gestao")}>
              <Plus size={16} />
              Usuário de Gestão
            </Button>
            <Button onClick={() => setModal("campo")}>
              <Plus size={16} />
              Usuário de Campo
            </Button>
          </div>
        )}
      </div>

      <ListaUsuarios titulo="Gestão" usuarios={gestao} admin={admin} />
      <ListaUsuarios titulo="Campo" usuarios={campo} admin={admin} />

      <Modal
        aberto={modal !== null}
        titulo={modal === "campo" ? "Novo usuário de Campo" : "Novo usuário de Gestão"}
        onFechar={() => setModal(null)}
      >
        {modal === "campo" && (
          <NovoUsuarioCampoForm onSucesso={() => setModal(null)} />
        )}
        {modal === "gestao" && (
          <NovoUsuarioGestaoForm onSucesso={() => setModal(null)} />
        )}
      </Modal>
    </div>
  );
}

function ListaUsuarios({
  titulo,
  usuarios,
  admin,
}: {
  titulo: string;
  usuarios: Usuario[];
  admin: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-titulo text-sm font-semibold uppercase tracking-wide text-neutro-1">
        {titulo}
      </h2>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-neutro-2 text-neutro-1">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Cargo</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {admin && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b border-neutro-2 last:border-0">
                <td className="px-4 py-3 font-medium text-preto">
                  {u.nome}
                  {u.papel_gestao === "admin" && (
                    <span className="ml-2 text-xs text-neutro-1">(admin)</span>
                  )}
                </td>
                <td className="px-4 py-3 text-neutro-1">{u.cargo ?? "-"}</td>
                <td className="px-4 py-3">
                  <Chip estado={u.ativo ? "disponivel" : "manutencao"} texto={u.ativo ? "Ativo" : "Inativo"} />
                </td>
                {admin && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => alternarAtivoUsuario(u.id, !u.ativo)}
                      className="text-xs font-medium text-laranja hover:underline"
                    >
                      {u.ativo ? "Desativar" : "Reativar"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutro-1">
                  Nenhum usuário cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
