import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: anexo } = await supabase
    .from("cliente_anexos")
    .select("*")
    .eq("id", id)
    .single();

  if (!anexo) {
    return new Response("Anexo não encontrado.", { status: 404 });
  }

  const { data, error } = await supabase.storage
    .from("cliente-anexos")
    .createSignedUrl(anexo.caminho_storage, 60, {
      download: anexo.nome_arquivo,
    });

  if (error || !data) {
    return new Response("Não foi possível gerar o link de download.", { status: 500 });
  }

  // No modo demo o "signed URL" é uma data: URL (sem storage real); navegadores
  // bloqueiam redirect para data:, então servimos os bytes diretamente aqui.
  if (data.signedUrl.startsWith("data:")) {
    const base64 = data.signedUrl.slice(data.signedUrl.indexOf(",") + 1);
    const contentType = data.signedUrl.slice(5, data.signedUrl.indexOf(";"));
    return new Response(Buffer.from(base64, "base64"), {
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${anexo.nome_arquivo}"`,
      },
    });
  }

  return Response.redirect(data.signedUrl, 302);
}
