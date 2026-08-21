import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function caminhoPublico(nome: string) {
  return path.join(process.cwd(), "public", "assets", nome);
}

/**
 * Retorna o caminho do asset como uma URL file:// (nunca um caminho de
 * sistema de arquivos cru), ou null se ele não existir. Necessário porque o
 * resolvedor de imagens do react-pdf confunde letras de unidade do Windows
 * (ex.: "D:\...") com esquema de URI e tenta buscar como se fosse remoto.
 */
export function assetSeExistir(nome: string): string | null {
  const caminho = caminhoPublico(nome);
  return fs.existsSync(caminho) ? pathToFileURL(caminho).href : null;
}
