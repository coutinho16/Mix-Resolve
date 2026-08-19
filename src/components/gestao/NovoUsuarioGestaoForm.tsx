"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function NovoUsuarioGestaoForm({ onSucesso }: { onSucesso: () => void }) {
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    const formData = new FormData(e.currentTarget);
    const body = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      senha: formData.get("senha"),
      papel_gestao: formData.get("papel_gestao"),
      cargo: formData.get("cargo"),
    };

    startTransition(async () => {
      const res = await fetch("/api/admin/usuarios-gestao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.erro ?? "Não foi possível criar o usuário.");
        return;
      }
      router.refresh();
      onSucesso();
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nome" className="text-sm font-medium text-preto">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          required
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-preto">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="senha" className="text-sm font-medium text-preto">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="papel_gestao" className="text-sm font-medium text-preto">
          Nível de acesso
        </label>
        <select
          id="papel_gestao"
          name="papel_gestao"
          required
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        >
          <option value="admin">Administrativo completo</option>
          <option value="operacional">Operacional</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cargo" className="text-sm font-medium text-preto">
          Cargo (opcional)
        </label>
        <input
          id="cargo"
          name="cargo"
          className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
        />
      </div>

      {erro && <p className="text-sm text-conflito">{erro}</p>}

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Criando..." : "Criar usuário de Gestão"}
      </Button>
    </form>
  );
}
