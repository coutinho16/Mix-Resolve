const MESES: Record<string, number> = {
  janeiro: 0,
  fevereiro: 1,
  marco: 2,
  "março": 2,
  abril: 3,
  maio: 4,
  junho: 5,
  julho: 6,
  agosto: 7,
  setembro: 8,
  outubro: 9,
  novembro: 10,
  dezembro: 11,
};

/**
 * Interpreta datas em texto livre (ex.: "11 a 17 de agosto de 2026") e retorna o
 * primeiro dia do intervalo em formato ISO (yyyy-mm-dd). Retorna null quando não
 * reconhece o formato, para que o campo fique em branco em vez de errado.
 */
export function primeiraDataDoTexto(texto: string | null | undefined): string | null {
  if (!texto) return null;
  const t = texto.toLowerCase();

  const porExtenso = t.match(/(\d{1,2})(?:\s*a\s*\d{1,2})?\s+de\s+([a-zç]+)\s+de\s+(\d{4})/);
  if (porExtenso) {
    const dia = Number(porExtenso[1]);
    const mes = MESES[porExtenso[2]];
    const ano = Number(porExtenso[3]);
    if (mes != null) {
      return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    }
  }

  const numerica = t.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (numerica) {
    return `${numerica[3]}-${numerica[2].padStart(2, "0")}-${numerica[1].padStart(2, "0")}`;
  }

  return null;
}
