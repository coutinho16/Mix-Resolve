import fs from "node:fs";
import path from "node:path";

function caminhoPublico(nome: string) {
  return path.join(process.cwd(), "public", "assets", nome);
}

/** Retorna o caminho do asset se ele existir, ou null (nunca inventa um arquivo). */
export function assetSeExistir(nome: string): string | null {
  const caminho = caminhoPublico(nome);
  return fs.existsSync(caminho) ? caminho : null;
}
