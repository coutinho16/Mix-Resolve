import { DEMO_MODE } from "@/lib/demo/mode";

export function FaixaDemo() {
  if (!DEMO_MODE) return null;

  return (
    <div className="sticky top-0 z-50 bg-preto px-4 py-1.5 text-center text-xs font-medium text-branco-puro">
      Modo demonstração com dados fictícios · conecte um projeto Supabase em
      .env.local para usar dados reais (veja SETUP.md)
    </div>
  );
}
