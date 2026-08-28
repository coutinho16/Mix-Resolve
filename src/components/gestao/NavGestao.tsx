"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  PackageSearch,
  CalendarClock,
  Users,
  UserSquare,
  FileText,
  Receipt,
  LogOut,
} from "lucide-react";
import { sair } from "@/lib/auth/actions";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface NavGestaoProps {
  nome: string;
  admin: boolean;
}

const itens = [
  { href: "/gestao/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/gestao/calendario", label: "Calendário", icon: Calendar },
  { href: "/gestao/eventos", label: "Eventos", icon: CalendarClock },
  { href: "/gestao/estoque", label: "Estoque", icon: PackageSearch },
  { href: "/gestao/disponibilidade", label: "Disponibilidade", icon: Calendar },
  { href: "/gestao/clientes", label: "Clientes", icon: UserSquare },
  { href: "/gestao/equipe", label: "Equipe", icon: Users },
];

export function NavGestao({ nome, admin }: NavGestaoProps) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-60 shrink-0 flex-col border-r border-neutro-2 bg-branco-puro px-3 py-4">
      <div className="mb-6 flex items-start justify-between px-2">
        <div>
          <span className="font-titulo text-lg font-bold lowercase text-laranja">
            mix.
          </span>
          <div className="text-[10px] font-semibold tracking-[0.2em] text-preto">
            RESOLVE
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {itens.map(({ href, label, icon: Icon }) => {
          const ativo = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                ativo
                  ? "bg-laranja/10 text-laranja"
                  : "text-preto hover:bg-neutro-3"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}

        {admin && (
          <>
            <Link
              href="/gestao/propostas"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname.startsWith("/gestao/propostas")
                  ? "bg-laranja/10 text-laranja"
                  : "text-preto hover:bg-neutro-3"
              }`}
            >
              <FileText size={18} />
              Propostas
            </Link>
            <Link
              href="/gestao/contratos"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname.startsWith("/gestao/contratos")
                  ? "bg-laranja/10 text-laranja"
                  : "text-preto hover:bg-neutro-3"
              }`}
            >
              <FileText size={18} />
              Contratos
            </Link>
            <Link
              href="/gestao/financeiro"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname.startsWith("/gestao/financeiro")
                  ? "bg-laranja/10 text-laranja"
                  : "text-preto hover:bg-neutro-3"
              }`}
            >
              <Receipt size={18} />
              Financeiro
            </Link>
          </>
        )}
      </div>

      <div className="border-t border-neutro-2 pt-3">
        <p className="truncate px-3 text-xs text-neutro-1">{nome}</p>
        <form action={sair}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-preto hover:bg-neutro-3"
          >
            <LogOut size={18} />
            Sair
          </button>
        </form>
      </div>
    </nav>
  );
}
