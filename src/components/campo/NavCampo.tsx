"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LogOut } from "lucide-react";
import { sair } from "@/lib/auth/actions";

export function HeaderCampo({ nome }: { nome: string }) {
  return (
    <header className="flex items-center justify-between border-b border-neutro-2 bg-branco-puro px-4 py-3">
      <div>
        <span className="font-titulo text-lg font-bold lowercase text-laranja">
          mix.
        </span>
        <span className="ml-1 text-[10px] font-semibold tracking-[0.2em] text-preto">
          RESOLVE
        </span>
      </div>
      <span className="text-xs text-neutro-1">{nome}</span>
    </header>
  );
}

export function BottomNavCampo() {
  const pathname = usePathname();
  const emTarefas = pathname.startsWith("/campo/tarefas");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-neutro-2 bg-branco-puro">
      <Link
        href="/campo/tarefas"
        className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
          emTarefas ? "text-laranja" : "text-neutro-1"
        }`}
      >
        <ClipboardList size={20} />
        Minhas tarefas
      </Link>
      <form action={sair} className="flex flex-1">
        <button
          type="submit"
          className="flex w-full flex-col items-center gap-1 py-3 text-xs font-medium text-neutro-1"
        >
          <LogOut size={20} />
          Sair
        </button>
      </form>
    </nav>
  );
}
