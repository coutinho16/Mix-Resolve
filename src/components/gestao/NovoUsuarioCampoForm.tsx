"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function NovoUsuarioCampoForm({ onSucesso }: { onSucesso: () => void }) {
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    const formData = new FormData(e.currentTarget);
    const body = {
      nome: formData.get("nome"),
      usuario_login: formData.get("usuario_login"),
      pin: formData.get("pin"),
      cargo: formData.get("cargo"),
    };

    startTransition(async () => {
      const res = await fetch("/api/admin/usuarios-campo", {
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
      <Campo label="Nome" name="nome" required />
      <Campo
        label="Usuário (login)"
        name="usuario_login"
        placeholder="ex: diego.hugo"
        required
      />
      <Campo label="PIN" name="pin" type="password" inputMode="numeric" required />
      <Campo label="Cargo (opcional)" name="cargo" />

      {erro && <p className="text-sm text-conflito">{erro}</p>}

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Criando..." : "Criar usuário de Campo"}
      </Button>
    </form>
  );
}

function Campo({
  label,
  name,
  type = "text",
  placeholder,
  required,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  inputMode?: "numeric";
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
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        className="rounded-lg border border-neutro-2 px-3 py-2 text-sm outline-none focus:border-laranja"
      />
    </div>
  );
}
