"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [escuro, setEscuro] = useState(false);

  useEffect(() => {
    setEscuro(document.documentElement.classList.contains("dark"));
  }, []);

  function aplicar(dark: boolean) {
    setEscuro(dark);
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("tema", dark ? "dark" : "light");
    } catch {
      // localStorage indisponível (modo privado, etc.) — tema só não persiste
    }
  }

  return (
    <div className="flex gap-1 rounded-lg bg-neutro-3 p-1">
      <button
        type="button"
        onClick={() => aplicar(false)}
        aria-label="Modo claro"
        aria-pressed={!escuro}
        className={`rounded p-1.5 transition-colors ${
          !escuro ? "bg-branco-puro text-laranja shadow-sm" : "text-neutro-1 hover:text-preto"
        }`}
      >
        <Sun size={14} />
      </button>
      <button
        type="button"
        onClick={() => aplicar(true)}
        aria-label="Modo escuro"
        aria-pressed={escuro}
        className={`rounded p-1.5 transition-colors ${
          escuro ? "bg-branco-puro text-laranja shadow-sm" : "text-neutro-1 hover:text-preto"
        }`}
      >
        <Moon size={14} />
      </button>
    </div>
  );
}
