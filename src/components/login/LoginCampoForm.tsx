"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { loginCampo, type LoginState } from "@/app/login/actions";

const estadoInicial: LoginState = {};

export function LoginCampoForm() {
  const [state, formAction, pending] = useActionState(
    loginCampo,
    estadoInicial
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="usuario_login" className="text-sm font-medium text-preto">
          Usuário
        </label>
        <input
          id="usuario_login"
          name="usuario_login"
          type="text"
          autoComplete="username"
          required
          className="rounded-lg border border-neutro-2 px-3 py-2.5 text-sm outline-none focus:border-laranja"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pin" className="text-sm font-medium text-preto">
          PIN
        </label>
        <input
          id="pin"
          name="pin"
          type="password"
          inputMode="numeric"
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
