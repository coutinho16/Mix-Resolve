"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MapPin, Clock, Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Evento } from "@/types/domain";

interface CalendarioPainelProps {
  eventos: Evento[];
  mesInicial: Date;
}

type Modo = "dia" | "semana" | "mes";

const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function ymd(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function CalendarioPainel({ eventos, mesInicial }: CalendarioPainelProps) {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>("mes");
  const [foco, setFoco] = useState(mesInicial);
  const [selecionado, setSelecionado] = useState<Date | null>(null);
  const [mostrarPersonalizado, setMostrarPersonalizado] = useState(false);
  const [rangeInicio, setRangeInicio] = useState("");
  const [rangeFim, setRangeFim] = useState("");

  const dias = useMemo(() => {
    const inicio = startOfWeek(startOfMonth(foco));
    const fim = endOfWeek(endOfMonth(foco));
    return eachDayOfInterval({ start: inicio, end: fim });
  }, [foco]);

  const diasSemanaAtual = useMemo(() => {
    const inicio = startOfWeek(foco);
    const fim = endOfWeek(foco);
    return eachDayOfInterval({ start: inicio, end: fim });
  }, [foco]);

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

  function navegar(direcao: -1 | 1) {
    if (modo === "dia") setFoco((d) => (direcao === 1 ? addDays(d, 1) : subDays(d, 1)));
    else if (modo === "semana") setFoco((d) => (direcao === 1 ? addWeeks(d, 1) : subWeeks(d, 1)));
    else setFoco((d) => (direcao === 1 ? addMonths(d, 1) : subMonths(d, 1)));
  }

  const periodoAtual = useMemo(() => {
    if (modo === "dia") return { inicio: foco, fim: foco };
    if (modo === "semana") return { inicio: startOfWeek(foco), fim: endOfWeek(foco) };
    return { inicio: startOfMonth(foco), fim: endOfMonth(foco) };
  }, [modo, foco]);

  const hrefExportarAtual = `/api/pdf/calendario?inicio=${ymd(periodoAtual.inicio)}&fim=${ymd(periodoAtual.fim)}`;
  const hrefExportarPersonalizado =
    rangeInicio && rangeFim ? `/api/pdf/calendario?inicio=${rangeInicio}&fim=${rangeFim}` : null;

  const tituloPeriodo =
    modo === "dia"
      ? format(foco, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      : modo === "semana"
        ? `${format(periodoAtual.inicio, "dd MMM", { locale: ptBR })} a ${format(periodoAtual.fim, "dd MMM yyyy", { locale: ptBR })}`
        : format(foco, "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <>
      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-titulo text-lg font-semibold capitalize text-preto">{tituloPeriodo}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1 rounded-xl bg-neutro-3 p-1">
              {(["dia", "semana", "mes"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setModo(m)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    modo === m ? "bg-laranja text-branco-puro" : "text-neutro-1 hover:text-preto"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => navegar(-1)}
                className="rounded-lg border border-neutro-2 p-2 hover:bg-neutro-3"
                aria-label="Anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setFoco(new Date())}
                className="rounded-lg border border-neutro-2 px-3 py-2 text-xs font-semibold text-preto hover:bg-neutro-3"
              >
                Hoje
              </button>
              <button
                onClick={() => navegar(1)}
                className="rounded-lg border border-neutro-2 p-2 hover:bg-neutro-3"
                aria-label="Próximo"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <a href={hrefExportarAtual} target="_blank" rel="noreferrer">
              <Button type="button" variant="secondary">
                <Download size={16} />
                Exportar PDF
              </Button>
            </a>
          </div>
        </div>

        {modo === "mes" && (
          <>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase text-neutro-1">
              {diasSemana.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {dias.map((dia) => {
                const doMes = isSameMonth(dia, foco);
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
          </>
        )}

        {modo === "semana" && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-7">
            {diasSemanaAtual.map((dia) => {
              const evs = eventosDoDia(dia);
              const montagens = montagemDoDia(dia);
              const hoje = isSameDay(dia, new Date());
              return (
                <div key={dia.toISOString()} className="flex flex-col gap-1.5 rounded-lg border border-neutro-2 p-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-medium uppercase text-neutro-1">
                      {format(dia, "EEE", { locale: ptBR })}
                    </span>
                    <span className={`text-sm font-semibold ${hoje ? "text-laranja" : "text-preto"}`}>
                      {format(dia, "d")}
                    </span>
                  </div>
                  <div className="flex min-h-[60px] flex-col gap-1">
                    {evs.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => abrirEvento(e.id)}
                        className="block w-full truncate rounded bg-laranja px-1.5 py-1 text-left text-[10px] font-medium text-branco-puro hover:opacity-90"
                        title={e.nome}
                      >
                        {e.nome}
                      </button>
                    ))}
                    {montagens.map((e) => (
                      <button
                        key={`montagem-${e.id}`}
                        onClick={() => abrirEvento(e.id)}
                        className="block w-full truncate rounded border border-dashed border-neutro-1 px-1.5 py-1 text-left text-[10px] font-medium text-neutro-1 hover:bg-neutro-3"
                        title={`Montagem: ${e.nome}`}
                      >
                        Montagem: {e.nome}
                      </button>
                    ))}
                    {evs.length === 0 && montagens.length === 0 && (
                      <span className="text-[10px] text-neutro-1">Sem eventos</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {modo === "dia" && (
          <div className="flex flex-col gap-2">
            {eventosDoDia(foco).length === 0 && montagemDoDia(foco).length === 0 && (
              <p className="rounded-lg border border-dashed border-neutro-2 px-3 py-6 text-center text-sm text-neutro-1">
                Nenhum evento neste dia.
              </p>
            )}
            {eventosDoDia(foco).map((e) => (
              <button
                key={e.id}
                onClick={() => abrirEvento(e.id)}
                className="flex w-full flex-col items-start gap-1 rounded-lg bg-laranja/10 p-3 text-left text-sm hover:bg-laranja/20"
              >
                <span className="font-medium text-preto">{e.nome}</span>
                <span className="flex items-center gap-1.5 text-xs text-neutro-1">
                  <MapPin size={12} />
                  {e.local ?? "Local não definido"}
                </span>
              </button>
            ))}
            {montagemDoDia(foco).map((e) => (
              <button
                key={`m-${e.id}`}
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
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-neutro-2 pt-3">
          <button
            type="button"
            onClick={() => setMostrarPersonalizado((v) => !v)}
            className="text-xs font-semibold text-laranja hover:underline"
          >
            {mostrarPersonalizado ? "Ocultar período personalizado" : "Exportar período personalizado"}
          </button>
          {mostrarPersonalizado && (
            <div className="mt-2 flex flex-wrap items-end gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase text-neutro-1">De</label>
                <input
                  type="date"
                  value={rangeInicio}
                  onChange={(e) => setRangeInicio(e.target.value)}
                  className="rounded-lg border border-neutro-2 px-3 py-1.5 text-sm outline-none focus:border-laranja"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase text-neutro-1">Até</label>
                <input
                  type="date"
                  value={rangeFim}
                  onChange={(e) => setRangeFim(e.target.value)}
                  className="rounded-lg border border-neutro-2 px-3 py-1.5 text-sm outline-none focus:border-laranja"
                />
              </div>
              {hrefExportarPersonalizado ? (
                <a href={hrefExportarPersonalizado} target="_blank" rel="noreferrer">
                  <Button type="button" variant="secondary">
                    <Download size={16} />
                    Exportar
                  </Button>
                </a>
              ) : (
                <Button type="button" variant="secondary" disabled>
                  <Download size={16} />
                  Exportar
                </Button>
              )}
            </div>
          )}
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
