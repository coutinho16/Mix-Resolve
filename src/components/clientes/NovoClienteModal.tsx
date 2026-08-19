"use client";

import { useActionState, useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { criarCliente, type ClienteActionState } from "@/app/gestao/clientes/actions";
import type { Cliente } from "@/types/domain";

interface NovoClienteModalProps {
  onCriado: (cliente: Cliente) => void;
}

const estadoInicial: ClienteActionState = {};

export function NovoClienteModal({ onCriado }: NovoClienteModalProps) {
  const [aberto, setAberto] = useState(false);
  const [state, formAction, pending] = useActionState(criarCliente, estadoInicial);

  useEffect(() => {
    if (state.sucesso && state.cliente) {
      onCriado(state.cliente);
      setAberto(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <Button type="button" variant="secondary" onClick={() => setAberto(true)}>
        <UserPlus size={16} />
        Novo cliente
      </Button>

      <Modal aberto={aberto} titulo="Novo cliente" onFechar={() => setAberto(false)}>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="novo_cliente_nome" className="text-sm font-medium text-preto">
              Nome
            </label>
            <input
              id="novo_cliente_nome"
              name="nome"
              required
              className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="novo_cliente_empresa" className="text-sm font-medium text-preto">
                Empresa
              </label>
              <input
                id="novo_cliente_empresa"
                name="empresa"
                className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="novo_cliente_documento" className="text-sm font-medium text-preto">
                CPF/CNPJ
              </label>
              <input
                id="novo_cliente_documento"
                name="documento"
                className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="novo_cliente_telefone" className="text-sm font-medium text-preto">
                Telefone
              </label>
              <input
                id="novo_cliente_telefone"
                name="telefone"
                className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="novo_cliente_email" className="text-sm font-medium text-preto">
                E-mail
              </label>
              <input
                id="novo_cliente_email"
                name="email"
                type="email"
                className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="novo_cliente_endereco" className="text-sm font-medium text-preto">
              Endereço
            </label>
            <input
              id="novo_cliente_endereco"
              name="endereco"
              className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
            />
          </div>

          {state.erro && <p className="text-sm text-conflito">{state.erro}</p>}

          <Button type="submit" disabled={pending} className="self-start">
            {pending ? "Salvando..." : "Salvar cliente"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
