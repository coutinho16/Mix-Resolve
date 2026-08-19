/** Escreve um valor monetário por extenso, em português (ex.: "Mil e duzentos reais"). */
export function valorPorExtenso(valorBruto: number): string {
  const valor = Math.round((Number(valorBruto) || 0) * 100) / 100;
  const inteiro = Math.floor(valor);
  const centavos = Math.round((valor - inteiro) * 100);

  const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const dezA19 = [
    "dez", "onze", "doze", "treze", "quatorze", "quinze",
    "dezesseis", "dezessete", "dezoito", "dezenove",
  ];
  const dezenas = [
    "", "", "vinte", "trinta", "quarenta", "cinquenta",
    "sessenta", "setenta", "oitenta", "noventa",
  ];
  const centenas = [
    "", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos",
    "seiscentos", "setecentos", "oitocentos", "novecentos",
  ];

  function ate999(x: number): string {
    if (x === 0) return "";
    if (x === 100) return "cem";
    let s = "";
    const c = Math.floor(x / 100);
    const r = x % 100;
    if (c > 0) s += centenas[c];
    if (r > 0) {
      if (s) s += " e ";
      if (r < 10) s += unidades[r];
      else if (r < 20) s += dezA19[r - 10];
      else {
        const d = Math.floor(r / 10);
        const u = r % 10;
        s += dezenas[d];
        if (u > 0) s += " e " + unidades[u];
      }
    }
    return s;
  }

  function grupos(n: number): string {
    if (n === 0) return "zero";
    const nomes: Array<[string, string]> = [
      ["", ""],
      ["mil", "mil"],
      ["milhão", "milhões"],
      ["bilhão", "bilhões"],
    ];
    const partes: Array<{ ordem: number; grupo: number; texto: string }> = [];
    let ordem = 0;
    let x = n;
    while (x > 0) {
      const grupo = x % 1000;
      if (grupo > 0) {
        let texto: string;
        if (ordem === 1 && grupo === 1) texto = "mil";
        else {
          texto = ate999(grupo);
          if (ordem >= 1) texto += " " + (grupo === 1 ? nomes[ordem][0] : nomes[ordem][1]);
        }
        partes.unshift({ ordem, grupo, texto });
      }
      x = Math.floor(x / 1000);
      ordem++;
    }
    let saida = "";
    partes.forEach((p, i) => {
      if (i > 0) {
        saida += p.ordem === 0 && (p.grupo < 100 || p.grupo % 100 === 0) ? " e " : ", ";
      }
      saida += p.texto;
    });
    return saida;
  }

  let texto = `${grupos(inteiro)} ${inteiro === 1 ? "real" : "reais"}`;
  if (centavos > 0) {
    texto += ` e ${grupos(centavos)} ${centavos === 1 ? "centavo" : "centavos"}`;
  }
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
