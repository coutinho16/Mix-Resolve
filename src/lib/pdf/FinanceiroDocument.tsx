import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { assetSeExistir } from "@/lib/pdf/assets";
import { valorPorExtenso } from "@/lib/pdf/extenso";
import { MIX_DADOS } from "@/lib/contratos/textosPadrao";
import type { Assinante, Financeiro, FinanceiroItem } from "@/types/domain";

const ORANGE = "#F85818";
const ORANGE_SUAVE = "#FACEB6";
const INK = "#1A1712";
const MUTED = "#857C6E";
const LINE = "#E7E1D7";

const styles = StyleSheet.create({
  page: { paddingTop: 32, paddingBottom: 26, paddingHorizontal: 18, fontSize: 9.5, color: INK, fontFamily: "Helvetica" },
  topband: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: ORANGE },
  footer: { position: "absolute", bottom: 10, left: 18, right: 18, borderTop: `1 solid ${LINE}`, paddingTop: 6 },
  footerTexto: { fontSize: 7, color: MUTED },
  paginaNumero: { position: "absolute", bottom: 10, right: 18, fontSize: 7, color: MUTED },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 4, marginBottom: 12 },
  logoTexto: { fontSize: 16, color: ORANGE, fontFamily: "Helvetica-Bold" },
  logoSub: { fontSize: 6.5, letterSpacing: 3, color: INK, marginTop: 1 },
  logoImg: { width: 90, objectFit: "contain" },
  metaTexto: { fontSize: 8.5, color: "#5a5a5a" },

  titulo: { fontFamily: "Helvetica-Bold", fontSize: 15, color: INK, textAlign: "center", marginBottom: 4 },
  tituloBarra: { width: 60, height: 2, backgroundColor: ORANGE, alignSelf: "center", marginBottom: 8 },
  numero: { fontSize: 8.5, color: MUTED, textAlign: "center", marginBottom: 14 },

  paragrafo: { textAlign: "justify", lineHeight: 1.55, marginBottom: 10, color: INK },
  paragrafoNegrito: { fontFamily: "Helvetica-Bold" },

  kv: { flexDirection: "row", marginBottom: 3 },
  kvRotulo: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  kvValor: { fontSize: 9.5 },

  clausulaBloco: { flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 6 },
  clausulaBarra: { width: 3, height: 11, backgroundColor: ORANGE, marginRight: 6 },
  clausulaTitulo: { fontFamily: "Helvetica-Bold", fontSize: 10.5, color: INK },

  itensBox: {
    border: `1 solid ${ORANGE_SUAVE}`,
    borderLeft: `3 solid ${ORANGE}`,
    borderRadius: 4,
    padding: 10,
    marginTop: 8,
    marginBottom: 4,
  },
  itemLinha: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3, paddingLeft: 4 },
  itemDesc: { fontSize: 9, flex: 3 },
  itemQtd: { fontSize: 9, flex: 1, textAlign: "center", color: MUTED },
  itemUnit: { fontSize: 9, flex: 1.2, textAlign: "right", color: "#5a5a5a" },
  itemValor: { fontSize: 9, flex: 1.2, textAlign: "right", fontFamily: "Helvetica-Bold" },

  totalBox: { backgroundColor: INK, borderRadius: 8, padding: 10, marginTop: 8, marginBottom: 8 },
  totalLinha: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  totalRotulo: { fontSize: 8, color: "#d9d2c6", fontFamily: "Helvetica-Bold" },
  totalValor: { fontSize: 13, color: "#fff", fontFamily: "Helvetica-Bold" },
  totalExtenso: { fontSize: 7.5, color: "#cabfae", fontStyle: "italic", marginTop: 3 },

  assinaturasLinha: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
  assinaturaCol: { width: "50%", alignItems: "center" },
  assinaturaImg: { width: 105, height: 28, objectFit: "contain" },
  assinaturaLinhaTopo: { borderTop: `1 solid ${INK}`, width: "100%", marginTop: 3, paddingTop: 4, textAlign: "center" },
  assinaturaNome: { fontFamily: "Helvetica-Bold", fontSize: 9 },
  assinaturaSub: { fontSize: 7.5, color: MUTED, marginTop: 2 },
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

interface FinanceiroDocumentProps {
  financeiro: Financeiro;
  itens: FinanceiroItem[];
}

export function FinanceiroDocument({ financeiro, itens }: FinanceiroDocumentProps) {
  const logo = assetSeExistir("logo.png");
  const assinatura = financeiro.signatario ? assetSeExistir(`assinatura-${financeiro.signatario}.png`) : null;
  const ehFatura = financeiro.tipo === "fatura";
  const dataEmissao = fmtData(financeiro.data_emissao);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.topband} fixed />

        <View style={styles.header}>
          {logo ? (
            <Image src={logo} style={styles.logoImg} />
          ) : (
            <View>
              <Text style={styles.logoTexto}>mix.</Text>
              <Text style={styles.logoSub}>RESOLVE</Text>
            </View>
          )}
          <Text style={styles.metaTexto}>{dataEmissao}</Text>
        </View>

        <Text style={styles.titulo}>{ehFatura ? "FATURA" : "RECIBO"}</Text>
        <View style={styles.tituloBarra} />
        <Text style={styles.numero}>
          {financeiro.numero ? `Nº ${financeiro.numero}` : `Controle #${financeiro.numero_controle}`}
        </Text>

        <Text style={styles.paragrafo}>
          <Text style={styles.paragrafoNegrito}>{MIX_DADOS.razaoSocial}</Text>, inscrita no CNPJ{" "}
          <Text style={styles.paragrafoNegrito}>{MIX_DADOS.cnpj}</Text>, com sede na{" "}
          <Text style={styles.paragrafoNegrito}>{MIX_DADOS.endereco}</Text>
          {ehFatura ? ", apresenta a presente fatura para" : " declara ter recebido de"}{" "}
          {financeiro.cliente_nome ? (
            <Text style={styles.paragrafoNegrito}>{financeiro.cliente_nome}</Text>
          ) : (
            "o cliente abaixo identificado"
          )}
          {financeiro.cliente_documento && (
            <>
              , inscrito no CPF/CNPJ sob o nº{" "}
              <Text style={styles.paragrafoNegrito}>{financeiro.cliente_documento}</Text>
            </>
          )}
          {ehFatura
            ? ", referente ao(s) serviço(s) e/ou item(ns) discriminados abaixo."
            : ", a quantia referente ao(s) serviço(s) e/ou item(ns) discriminados abaixo, dando plena e geral quitação."}
        </Text>

        {financeiro.descricao && (
          <View style={styles.kv}>
            <Text style={styles.kvRotulo}>Descrição: </Text>
            <Text style={styles.kvValor}>{financeiro.descricao}</Text>
          </View>
        )}
        {financeiro.forma_pagamento && (
          <View style={styles.kv}>
            <Text style={styles.kvRotulo}>Forma de pagamento: </Text>
            <Text style={styles.kvValor}>{financeiro.forma_pagamento}</Text>
          </View>
        )}
        {financeiro.vencimento && (
          <View style={styles.kv}>
            <Text style={styles.kvRotulo}>Vencimento: </Text>
            <Text style={styles.kvValor}>{fmtData(financeiro.vencimento)}</Text>
          </View>
        )}

        {itens.length > 0 && (
          <View style={styles.itensBox}>
            {itens.map((item) => (
              <View key={item.id} style={styles.itemLinha}>
                <Text style={styles.itemDesc}>{item.descricao || "(sem descrição)"}</Text>
                <Text style={styles.itemQtd}>{item.quantidade}x</Text>
                <Text style={styles.itemUnit}>R$ {item.valor_unitario.toFixed(2)}</Text>
                <Text style={styles.itemValor}>R$ {item.valor_total.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.totalBox}>
          <View style={styles.totalLinha}>
            <Text style={styles.totalRotulo}>{ehFatura ? "VALOR TOTAL DA FATURA" : "VALOR RECEBIDO"}</Text>
            <Text style={styles.totalValor}>R$ {financeiro.valor_total.toFixed(2)}</Text>
          </View>
          <Text style={styles.totalExtenso}>({valorPorExtenso(financeiro.valor_total)})</Text>
        </View>

        {financeiro.observacoes && (
          <>
            <View style={styles.clausulaBloco}>
              <View style={styles.clausulaBarra} />
              <Text style={styles.clausulaTitulo}>OBSERVAÇÕES</Text>
            </View>
            <Text style={styles.paragrafo}>{financeiro.observacoes}</Text>
          </>
        )}

        {dataEmissao && <Text style={styles.paragrafo}>Natal, {dataEmissao}.</Text>}

        {financeiro.signatario && (
          <View style={styles.assinaturasLinha}>
            <View style={styles.assinaturaCol}>
              {assinatura ? (
                <Image src={assinatura} style={styles.assinaturaImg} />
              ) : (
                <View style={{ height: 28 }} />
              )}
              <View style={styles.assinaturaLinhaTopo}>
                <Text style={styles.assinaturaNome}>{MIX_DADOS.razaoSocial}</Text>
                <Text style={styles.assinaturaSub}>
                  Responsável: {nomeSignatario[financeiro.signatario]}
                </Text>
              </View>
            </View>
          </View>
        )}

        <Rodape />
        <NumeroPagina />
      </Page>
    </Document>
  );
}
