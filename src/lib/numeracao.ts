/**
 * Numeração do sistema: cada cliente recebe um número permanente (001, 002...),
 * nunca reaproveitado mesmo que o cliente seja excluído. Cada documento
 * (proposta, contrato, recibo, nota de fatura) recebe um número sequencial
 * próprio por cliente, exibido como "{numero do cliente}/{prefixo}{sequencial}",
 * ex.: cliente nº 23, segunda proposta dele → "023/P02".
 */

export type PrefixoDocumento = "P" | "C" | "R" | "N";

export function formatarNumeroCliente(numero: number | null | undefined): string {
  return numero == null ? "-" : String(numero).padStart(3, "0");
}

export function formatarNumeroDocumento(
  numeroCliente: number | null | undefined,
  prefixo: PrefixoDocumento,
  sequencial: number | null | undefined
): string {
  if (numeroCliente == null || sequencial == null) return "S/N";
  return `${formatarNumeroCliente(numeroCliente)}/${prefixo}${String(sequencial).padStart(2, "0")}`;
}
