"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import type { Evento } from "@/types/domain";

interface CalendarioPainelProps {
  eventos: Evento[];
  mesInicial: Date;
}

const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function CalendarioPainel({ eventos, mesInicial }: CalendarioPainelProps) {
  const router = useRouter();
  const [mes, setMes] = useState(mesInicial);
  const [selecionado, setSelecionado] = useState<Date | null>(null);

  const dias = useMemo(() => {
    const inicio = startOfWeek(startOfMonth(mes));
    const fim = endOfWeek(endOfMonth(mes));
    return eachDayOfInterval({ start: inicio, end: fim });
  }, [mes]);

  function eventosDoDia(dia: Date) {
    return eventos.filter((e) => {
      const inicio = new Date(`${e.data_inicio}T00:00:00`);
      const fim = new Date(`${e.data_fim}T00:00:00`);
      return dia >= inicio && dia <= fim;
    });
  }

  function montagemDoDia(dia: Date) {
    return eventos.filter(
      (e) => e.data_montagem && isSameDay(new Date(`${e.data_montagem}T00:00:00`), dia)
    );
  }

  const eventosSelecionados = selecionado ? eventosDoDia(selecionado) : [];
  const montagensSelecionadas = selecionado ? montagemDoDia(selecionado) : [];

  function abrirEvento(id: string) {
    router.push(`/gestao/eventos/${id}`);
  }

  return (
    <>
      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-titulo text-lg font-semibold capitalize text-preto">
            {format(mes, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={() => setMes((m) => subMonths(m, 1))}
              className="rounded-lg border border-neutro-2 p-2 hover:bg-neutro-3"
              aria-label="Mês anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setMes((m) => addMonths(m, 1))}
              className="rounded-lg border border-neutro-2 p-2 hover:bg-neutro-3"
              aria-label="Próximo mês"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase text-neutro-1">
          {diasSemana.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dias.map((dia) => {
            const doMes = isSameMonth(dia, mes);
            const evs = eventosDoDia(dia);
            const montagens = montagemDoDia(dia);
            const ativo = selecionado && isSameDay(dia, selecionado);
            const totalItens = evs.length + montagens.length;
            const mostrar = [...evs.slice(0, 2), ...montagens.slice(0, Math.max(0, 2 - evs.length))];

            return (
              <button
                key={dia.toISOString()}
                onClick={() => setSelecionado(dia)}
                className={`flex min-h-[76px] w-full flex-col items-start gap-1 overflow-hidden rounded-lg border p-1.5 text-left text-xs ${
                  ativo ? "border-laranja" : "border-transparent"
                } ${doMes ? "" : "opacity-40"} hover:bg-neutro-3`}
              >
                <span className="font-medium text-preto">{format(dia, "d")}</span>
                <div className="flex w-full min-w-0 flex-col gap-0.5">
                  {evs.slice(0, 2).map((e) => (
                    <span
                      key={e.id}
                      className="block w-full truncate rounded bg-laranja px-1.5 py-0.5 text-[10px] font-medium text-branco-puro"
                      title={e.nome}
                    >
                      {e.nome}
                    </span>
                  ))}
                  {montagens.slice(0, evs.length > 0 ? 1 : 2).map((e) => (
                    <span
                      key={`montagem-${e.id}`}
                      className="block w-full truncate rounded border border-dashed border-neutro-1 px-1.5 py-0.5 text-[10px] font-medium text-neutro-1"
                      title={`Montagem: ${e.nome}`}
                    >
                      Montagem: {e.nome}
                    </span>
                  ))}
                  {totalItens > mostrar.length && (
                    <span className="block px-1.5 text-[10px] font-medium text-neutro-1">
                      +{totalItens - mostrar.length}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Modal
        aberto={selecionado !== null}
        titulo={selecionado ? format(selecionado, "dd 'de' MMMM", { locale: ptBR }) : ""}
        onFechar={() => setSelecionado(null)}
      >
        {eventosSelecionados.length === 0 && montagensSelecionadas.length === 0 && (
          <p className="text-sm text-neutro-1">Nenhum evento neste dia.</p>
        )}

        <ul className="flex flex-col gap-2">
          {eventosSelecionados.map((e) => (
            <li key={e.id}>
              <button
                onClick={() => abrirEvento(e.id)}
                className="flex w-full flex-col items-start gap-1 rounded-lg bg-laranja/10 p-3 text-left text-sm hover:bg-laranja/20"
              >
                <span className="font-medium text-preto">{e.nome}</span>
                <span className="flex items-center gap-1.5 text-xs text-neutro-1">
                  <MapPin size={12} />
                  {e.local ?? "Local não definido"}
                </span>
              </button>
            </li>
          ))}
          {montagensSelecionadas.map((e) => (
            <li key={`m-${e.id}`}>
              <button
                onClick={() => abrirEvento(e.id)}
                className="flex w-full flex-col items-start gap-1 rounded-lg border border-dashed border-neutro-2 p-3 text-left text-sm hover:bg-neutro-3"
              >
                <span className="font-medium text-preto">Montagem: {e.nome}</span>
                {e.hora_montagem && (
                  <span className="flex items-center gap-1.5 text-xs text-neutro-1">
                    <Clock size={12} />
                    {e.hora_montagem}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
