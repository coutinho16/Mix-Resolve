import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { assetSeExistir } from "@/lib/pdf/assets";
import { agruparPorSetor, type ItemComSetor } from "@/lib/pdf/agrupamento";
import { valorPorExtenso } from "@/lib/pdf/extenso";
import { TEXTO_ABERTURA_PADRAO, DIFERENCIAIS_PADRAO, MIX_DADOS } from "@/lib/contratos/textosPadrao";
import type { Assinante, Cliente, DescontoTipo, Proposta } from "@/types/domain";

const ORANGE = "#F85818";
const INK = "#1A1712";
const MUTED = "#857C6E";
const PANEL = "#F5F1EA";
const LINE = "#E7E1D7";

const styles = StyleSheet.create({
  page: { paddingTop: 32, paddingBottom: 26, paddingHorizontal: 18, fontSize: 9.5, color: INK, fontFamily: "Helvetica" },
  topband: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: ORANGE },
  marcaDagua: {
    position: "absolute",
    top: "32%",
    left: "18%",
    width: "64%",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 18,
    right: 18,
    borderTop: `1 solid ${LINE}`,
    paddingTop: 6,
  },
  footerTexto: { fontSize: 7, color: MUTED },
  paginaNumero: { position: "absolute", bottom: 10, right: 18, fontSize: 7, color: MUTED },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 4, marginBottom: 18 },
  logoTexto: { fontSize: 20, color: ORANGE, fontFamily: "Helvetica-Bold" },
  logoSub: { fontSize: 7, letterSpacing: 3, color: INK, marginTop: 1 },
  logoImg: { width: 110, objectFit: "contain" },
  metaBloco: { alignItems: "flex-end" },
  metaTexto: { fontSize: 8.5, color: "#5a5a5a", marginBottom: 3 },

  tituloBloco: { marginBottom: 14, alignItems: "center" },
  tituloL1: { fontFamily: "Helvetica-Bold", fontSize: 22, color: INK },
  tituloL2: { fontFamily: "Helvetica-Bold", fontSize: 22, color: ORANGE, marginTop: 1 },
  tituloBarra: { width: 26, height: 3, backgroundColor: ORANGE, borderRadius: 2, marginTop: 5 },

  card: { backgroundColor: PANEL, borderRadius: 8, padding: 12, marginBottom: 16 },
  cardLinha: { flexDirection: "row", marginBottom: 8 },
  cardCel: { flex: 1, paddingRight: 8 },
  cardRotulo: { fontSize: 7, fontFamily: "Helvetica-Bold", color: ORANGE, letterSpacing: 0.5, marginBottom: 2 },
  cardValor: { fontSize: 9.5, color: INK },

  secaoTitulo: { fontSize: 11, fontFamily: "Helvetica-Bold", color: ORANGE, marginBottom: 6, marginTop: 4 },
  paragrafo: { textAlign: "justify", lineHeight: 1.5, marginBottom: 10, color: INK },

  difsGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  difItem: { width: "50%", flexDirection: "row", alignItems: "flex-start", marginBottom: 6, paddingRight: 6 },
  difBolinha: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: ORANGE, marginTop: 3, marginRight: 6 },
  difTexto: { fontSize: 9, flex: 1 },

  pill: { backgroundColor: ORANGE, borderRadius: 5, paddingVertical: 4, paddingHorizontal: 8, marginTop: 10, marginBottom: 5 },
  pillTexto: { color: "#fff", fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 0.4 },

  linhaCab: { flexDirection: "row", borderBottom: `1 solid ${MUTED}`, paddingBottom: 3, marginBottom: 3 },
  linhaCabTexto: { fontSize: 7, fontFamily: "Helvetica-Bold", color: MUTED },
  linha: { flexDirection: "row", borderBottom: `1 solid ${LINE}`, paddingVertical: 4 },
  colDescricao: { flex: 3 },
  colQtd: { flex: 1, textAlign: "center", color: "#5a5a5a" },
  colDiarias: { flex: 1, textAlign: "center", color: "#5a5a5a" },
  colUnit: { flex: 1.2, textAlign: "right", color: "#5a5a5a" },
  colValor: { flex: 1.2, textAlign: "right", fontFamily: "Helvetica-Bold" },

  linhaSimples: { fontSize: 9.5, marginBottom: 3 },

  subtotalLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 12,
    paddingTop: 3,
    borderTop: `1 solid ${LINE}`,
  },
  subtotalTexto: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: ORANGE },

  resumoLinha: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  resumoRotulo: { fontSize: 9, color: MUTED },
  resumoValor: { fontSize: 9, color: INK },

  totalBox: { backgroundColor: INK, borderRadius: 8, padding: 12, marginTop: 4, marginBottom: 4 },
  totalLinha: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalRotulo: { fontSize: 8, color: "#d9d2c6", fontFamily: "Helvetica-Bold" },
  totalValor: { fontSize: 16, color: "#fff", fontFamily: "Helvetica-Bold" },
  totalExtenso: { fontSize: 8, color: "#cabfae", fontStyle: "italic", marginTop: 3 },

  obsItem: { flexDirection: "row", marginBottom: 4 },
  obsIndice: { width: 14, fontSize: 9 },
  obsTexto: { flex: 1, fontSize: 9, lineHeight: 1.4, color: "#404040" },

  assinatura: { marginTop: 34, alignItems: "center" },
  assinaturaImg: { width: 130, height: 35, objectFit: "contain" },
  assinaturaLinha: {
    borderTop: `1 solid ${INK}`,
    width: 200,
    marginTop: 3,
    paddingTop: 4,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  assinaturaSub: { fontSize: 8, color: MUTED, marginTop: 2 },
});

const nomeSignatario: Record<Assinante, string> = {
  gabriel: "Gabriel Coutinho",
  higor: "Higor Amaral",
};

function Rodape() {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerTexto}>
        {MIX_DADOS.razaoSocial} · CNPJ {MIX_DADOS.cnpj}
      </Text>
      <Text style={styles.footerTexto}>
        {MIX_DADOS.endereco} · {MIX_DADOS.instagram}
      </Text>
    </View>
  );
}

function NumeroPagina() {
  return (
    <Text
      style={styles.paginaNumero}
      fixed
      render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
    />
  );
}

function fmtData(iso: string | null | undefined) {
  if (!iso) return null;
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function rotuloDesconto(tipo: DescontoTipo, valor: number) {
  if (tipo === "percentual") return `Desconto (${valor}%)`;
  return "Desconto";
}

interface PropostaDocumentProps {
  proposta: Proposta;
  cliente: Cliente;
  itens: ItemComSetor[];
}

export function PropostaDocument({ proposta, cliente, itens }: PropostaDocumentProps) {
  const logo = assetSeExistir("logo.png");
  const assinatura = assetSeExistir(`assinatura-${proposta.signatario}.png`);
  const grupos = agruparPorSetor(itens);
  const observacoesLinhas = (proposta.observacoes ?? "")
    .split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean);
  const validadeFmt = fmtData(proposta.validade);
  const diferenciais = proposta.diferenciais.length > 0 ? proposta.diferenciais : DIFERENCIAIS_PADRAO;
  const textoAbertura = proposta.texto_abertura || TEXTO_ABERTURA_PADRAO;

  const porItem = proposta.submodo_precificacao === "item";
  const porSetor = proposta.submodo_precificacao === "setor";
  const subtotal = itens.reduce((s, i) => s + i.valor_total, 0);
  const desconto =
    proposta.desconto_tipo === "percentual"
      ? subtotal * (proposta.desconto_valor / 100)
      : proposta.desconto_tipo === "valor"
        ? proposta.desconto_valor
        : 0;
  const mostraDesconto = proposta.desconto_tipo !== "nenhum" && desconto > 0;

  const infoLinhas: Array<[string, string]> = [];
  infoLinhas.push(["Cliente", cliente.empresa || cliente.nome]);
  if (cliente.documento) infoLinhas.push(["CNPJ / CPF", cliente.documento]);
  if (proposta.local) infoLinhas.push(["Local", proposta.local]);
  if (proposta.data_evento_texto) infoLinhas.push(["Data do evento", proposta.data_evento_texto]);
  if (proposta.montagem_texto) infoLinhas.push(["Montagem", proposta.montagem_texto]);

  const paresInfo: Array<[[string, string] | null, [string, string] | null]> = [];
  for (let i = 0; i < infoLinhas.length; i += 2) {
    paresInfo.push([infoLinhas[i], infoLinhas[i + 1] ?? null]);
  }

  const marcaDagua = assetSeExistir("marca-dagua.png");

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.topband} fixed />
        {marcaDagua && <Image src={marcaDagua} style={styles.marcaDagua} fixed />}

        <View style={styles.header}>
          <View>
            {logo ? (
              <Image src={logo} style={styles.logoImg} />
            ) : (
              <View>
                <Text style={styles.logoTexto}>mix.</Text>
                <Text style={styles.logoSub}>RESOLVE</Text>
              </View>
            )}
          </View>
          <View style={styles.metaBloco}>
            <Text style={styles.metaTexto}>
              Natal, {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
            </Text>
            {proposta.numero_cliente && (
              <Text style={styles.metaTexto}>Proposta nº {proposta.numero_cliente}</Text>
            )}
            {validadeFmt && <Text style={styles.metaTexto}>Válida até {validadeFmt}</Text>}
          </View>
        </View>

        <View style={styles.tituloBloco}>
          <Text style={styles.tituloL1}>Proposta</Text>
          <Text style={styles.tituloL2}>Comercial</Text>
          <View style={styles.tituloBarra} />
        </View>

        {paresInfo.length > 0 && (
          <View style={styles.card}>
            {paresInfo.map((par, i) => (
              <View key={i} style={styles.cardLinha}>
                {par.map((cel, j) =>
                  cel ? (
                    <View key={j} style={styles.cardCel}>
                      <Text style={styles.cardRotulo}>{cel[0].toUpperCase()}</Text>
                      <Text style={styles.cardValor}>{cel[1]}</Text>
                    </View>
                  ) : (
                    <View key={j} style={styles.cardCel} />
                  )
                )}
              </View>
            ))}
          </View>
        )}

        <Text style={styles.secaoTitulo}>Por que escolher a Mix</Text>
        <Text style={styles.paragrafo}>{textoAbertura}</Text>

        <View style={styles.difsGrid}>
          {diferenciais.map((texto, i) => (
            <View key={i} style={styles.difItem}>
              <View style={styles.difBolinha} />
              <Text style={styles.difTexto}>{texto}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.secaoTitulo}>
          {porItem ? "Detalhamento dos equipamentos" : "Resumo por setor"}
        </Text>
        {grupos.map(([setor, itensSetor]) => {
          const subtotalSetor = itensSetor.reduce((soma, i) => soma + i.valor_total, 0);
          return (
            <View key={setor} wrap={false} minPresenceAhead={40}>
              <View style={styles.pill}>
                <Text style={styles.pillTexto}>{setor.toUpperCase()}</Text>
              </View>

              {porItem ? (
                <>
                  <View style={styles.linhaCab}>
                    <Text style={[styles.linhaCabTexto, styles.colDescricao]}>DESCRIÇÃO</Text>
                    <Text style={[styles.linhaCabTexto, styles.colQtd]}>QTD.</Text>
                    <Text style={[styles.linhaCabTexto, styles.colDiarias]}>DIÁRIAS</Text>
                    <Text style={[styles.linhaCabTexto, styles.colUnit]}>VLR. UNIT.</Text>
                    <Text style={[styles.linhaCabTexto, styles.colValor]}>VALOR</Text>
                  </View>
                  {itensSetor.map((item) => (
                    <View key={item.id} style={styles.linha}>
                      <Text style={styles.colDescricao}>{item.descricao}</Text>
                      <Text style={styles.colQtd}>{item.quantidade}</Text>
                      <Text style={styles.colDiarias}>
                        {item.tipo_valor === "diaria" ? item.diarias ?? 1 : ""}
                      </Text>
                      <Text style={styles.colUnit}>R$ {item.valor_unitario.toFixed(2)}</Text>
                      <Text style={styles.colValor}>R$ {item.valor_total.toFixed(2)}</Text>
                    </View>
                  ))}
                  <View style={styles.subtotalLinha}>
                    <Text style={styles.subtotalTexto}>Subtotal {setor}</Text>
                    <Text style={styles.subtotalTexto}>R$ {subtotalSetor.toFixed(2)}</Text>
                  </View>
                </>
              ) : (
                <>
                  {itensSetor.map((item) => (
                    <Text key={item.id} style={styles.linhaSimples}>
                      {item.quantidade}x {item.descricao}
                    </Text>
                  ))}
                  {porSetor && (
                    <View style={styles.subtotalLinha}>
                      <Text style={styles.subtotalTexto}>Valor do setor</Text>
                      <Text style={styles.subtotalTexto}>R$ {subtotalSetor.toFixed(2)}</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          );
        })}

        {mostraDesconto && (
          <>
            <View style={styles.resumoLinha}>
              <Text style={styles.resumoRotulo}>Subtotal</Text>
              <Text style={styles.resumoValor}>R$ {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.resumoLinha}>
              <Text style={styles.resumoRotulo}>
                {rotuloDesconto(proposta.desconto_tipo, proposta.desconto_valor)}
              </Text>
              <Text style={styles.resumoValor}>· R$ {desconto.toFixed(2)}</Text>
            </View>
          </>
        )}

        <View style={styles.totalBox}>
          <View style={styles.totalLinha}>
            <Text style={styles.totalRotulo}>
              {proposta.submodo_precificacao === "unico" ? "VALOR DA PROPOSTA" : "VALOR TOTAL"}
            </Text>
            <Text style={styles.totalValor}>R$ {proposta.valor_total.toFixed(2)}</Text>
          </View>
          <Text style={styles.totalExtenso}>({valorPorExtenso(proposta.valor_total)})</Text>
        </View>

        <Text style={[styles.secaoTitulo, { marginTop: 16 }]}>Condições e pagamento</Text>
        <Text style={styles.paragrafo}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            Forma de pagamento: {proposta.forma_pagamento || "Pix ou transferência bancária"}.{" "}
          </Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            Beneficiário: {proposta.pix_beneficiario || MIX_DADOS.razaoSocial}.{" "}
          </Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            Chave Pix: {proposta.pix_chave || MIX_DADOS.cnpj}.
          </Text>
        </Text>

        {proposta.tem_permuta && proposta.condicoes_permuta && (
          <>
            <Text style={styles.secaoTitulo}>Permuta</Text>
            <Text style={styles.paragrafo}>{proposta.condicoes_permuta}</Text>
          </>
        )}

        {observacoesLinhas.length > 0 && (
          <>
            <Text style={[styles.secaoTitulo, { marginTop: 6 }]}>Observações</Text>
            {observacoesLinhas.map((linha, i) => (
              <View key={i} style={styles.obsItem}>
                <Text style={styles.obsIndice}>{i + 1}.</Text>
                <Text style={styles.obsTexto}>{linha}</Text>
              </View>
            ))}
          </>
        )}

        <View style={styles.assinatura}>
          {assinatura ? (
            <Image src={assinatura} style={styles.assinaturaImg} />
          ) : (
            <View style={{ height: 35 }} />
          )}
          <Text style={styles.assinaturaLinha}>{nomeSignatario[proposta.signatario]}</Text>
          <Text style={styles.assinaturaSub}>
            {proposta.cargo_signatario || "Mix · Luz, Som, Painel de LED e Estrutura"}
          </Text>
        </View>

        <Rodape />
        <NumeroPagina />
      </Page>
    </Document>
  );
}
