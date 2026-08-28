import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { EventoDocument } from "@/lib/pdf/EventoDocument";
import { SETOR_PADRAO } from "@/lib/pdf/agrupamento";
import type { MembroEquipePdf, ItemEquipamentoPdf } from "@/lib/pdf/EventoDocument";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: evento } = await supabase.from("eventos").select("*").eq("id", id).single();

  if (!evento) {
    return new Response("Evento não encontrado.", { status: 404 });
  }

  const [
    { data: cliente },
    { data: equipeRows },
    { data: itensRows },
    { data: usuarios },
    { data: equipamentos },
    { data: categorias },
  ] = await Promise.all([
    evento.cliente_id
      ? supabase.from("clientes").select("nome, empresa").eq("id", evento.cliente_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("evento_equipe").select("*").eq("evento_id", id),
    supabase.from("evento_equipamentos").select("*").eq("evento_id", id),
    supabase.from("usuarios").select("*"),
    supabase.from("equipamentos").select("*"),
    supabase.from("categorias_equipamento").select("*"),
  ]);

  const usuarioPorId = new Map((usuarios ?? []).map((u) => [u.id, u]));
  const equipe: MembroEquipePdf[] = (equipeRows ?? []).map((m) => ({
    id: m.id,
    nome: usuarioPorId.get(m.usuario_id)?.nome ?? "Integrante removido",
    etapa: m.etapa,
    funcao: m.funcao,
  }));

  const equipamentoPorId = new Map((equipamentos ?? []).map((e) => [e.id, e]));
  const categoriaPorId = new Map((categorias ?? []).map((c) => [c.id, c.nome]));
  const itens: ItemEquipamentoPdf[] = (itensRows ?? []).map((i) => {
    const equipamento = equipamentoPorId.get(i.equipamento_id);
    return {
      id: i.id,
      nome: equipamento?.nome ?? "Equipamento removido",
      quantidade: i.quantidade_reservada,
      setor: equipamento ? categoriaPorId.get(equipamento.categoria_id) ?? SETOR_PADRAO : SETOR_PADRAO,
    };
  });

  const clienteNome = cliente ? cliente.empresa || cliente.nome : null;

  const buffer = await renderToBuffer(
    EventoDocument({ evento, clienteNome, equipe, itens })
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="evento-${id}.pdf"`,
    },
  });
}
