import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { CalendarioDocument } from "@/lib/pdf/CalendarioDocument";
import type { Evento } from "@/types/domain";

export const runtime = "nodejs";

function diasEntre(inicio: string, fim: string): string[] {
  const dias: string[] = [];
  const cursor = new Date(`${inicio}T00:00:00`);
  const limite = new Date(`${fim}T00:00:00`);
  while (cursor <= limite) {
    dias.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dias;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inicio = searchParams.get("inicio");
  const fim = searchParams.get("fim");

  if (!inicio || !fim) {
    return new Response("Informe os parâmetros inicio e fim (yyyy-mm-dd).", { status: 400 });
  }

  const supabase = await createClient();
  const { data: eventos } = await supabase
    .from("eventos")
    .select("*")
    .neq("status", "cancelado")
    .lte("data_inicio", fim)
    .gte("data_fim", inicio);

  const todosEventos = (eventos ?? []) as Evento[];

  const dias = diasEntre(inicio, fim).map((data) => {
    const eventosDoDia = todosEventos.filter((e) => data >= e.data_inicio && data <= e.data_fim);
    const montagensDoDia = todosEventos.filter((e) => e.data_montagem === data);
    return { data, eventos: eventosDoDia, montagens: montagensDoDia };
  });

  const buffer = await renderToBuffer(CalendarioDocument({ inicio, fim, dias }));

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="calendario-${inicio}-a-${fim}.pdf"`,
    },
  });
}
