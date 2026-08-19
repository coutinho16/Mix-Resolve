"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import type { Cliente } from "@/types/domain";
import type { ClienteActionState } from "@/app/gestao/clientes/actions";

type AcaoCliente = (
  prev: ClienteActionState,
  formData: FormData
) => Promise<ClienteActionState>;

interface ClienteFormProps {
  cliente?: Cliente;
  action: AcaoCliente;
  onSucesso: () => void;
}

const estadoInicial: ClienteActionState = {};

export function ClienteForm({ cliente, action, onSucesso }: ClienteFormProps) {
  const [state, formAction, pending] = useActionState(action, estadoInicial);

  useEffect(() => {
    if (state.sucesso) onSucesso();
  }, [state.sucesso, onSucesso]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Campo label="Nome" name="nome" defaultValue={cliente?.nome} required />
        <Campo label="Empresa" name="empresa" defaultValue={cliente?.empresa ?? ""} />
        <Campo
          label="CNPJ/CPF"
          name="documento"
          defaultValue={cliente?.documento ?? ""}
        />
        <Campo
          label="Contato"
          name="contato_nome"
          defaultValue={cliente?.contato_nome ?? ""}
        />
        <Campo
          label="Telefone"
          name="telefone"
          defaultValue={cliente?.telefone ?? ""}
        />
        <Campo
          label="E-mail"
          name="email"
          type="email"
          defaultValue={cliente?.email ?? ""}
        />
      </div>
      <Campo
        label="Endereço"
        name="endereco"
        defaultValue={cliente?.endereco ?? ""}
      />

      {state.erro && <p className="text-sm text-conflito">{state.erro}</p>}

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}

function Campo({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-preto">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
      />
    </div>
  );
}
