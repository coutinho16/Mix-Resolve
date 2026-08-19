"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { loginGestao, type LoginState } from "@/app/login/actions";

const estadoInicial: LoginState = {};

export function LoginGestaoForm() {
  const [state, formAction, pending] = useActionState(
    loginGestao,
    estadoInicial
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-preto">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-lg border border-neutro-2 px-3 py-2.5 text-sm outline-none focus:border-laranja"
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
          autoComplete="current-password"
          required
          className="rounded-lg border border-neutro-2 px-3 py-2.5 text-sm outline-none focus:border-laranja"
        />
      </div>

      {state.erro && <p className="text-sm text-conflito">{state.erro}</p>}

      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
