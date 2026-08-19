export type EstadoChip = "disponivel" | "em-uso" | "manutencao" | "conflito";

const estilos: Record<EstadoChip, string> = {
  disponivel: "bg-disponivel/10 text-disponivel border-disponivel/30",
  "em-uso": "bg-em-uso/10 text-em-uso border-em-uso/30",
  manutencao: "bg-manutencao/10 text-manutencao border-manutencao/30",
  conflito: "bg-conflito/10 text-conflito border-conflito/30",
};

const rotulos: Record<EstadoChip, string> = {
  disponivel: "Disponível",
  "em-uso": "Em uso",
  manutencao: "Manutenção",
  conflito: "Conflito",
};

interface ChipProps {
  estado: EstadoChip;
  texto?: string;
}

export function Chip({ estado, texto }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${estilos[estado]}`}
    >
      {texto ?? rotulos[estado]}
    </span>
  );
}
