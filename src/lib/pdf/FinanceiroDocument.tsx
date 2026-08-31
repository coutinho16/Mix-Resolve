import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { assetSeExistir } from "@/lib/pdf/assets";
import { valorPorExtenso } from "@/lib/pdf/extenso";
import { MIX_DADOS } from "@/lib/contratos/textosPadrao";
import { formatarNumeroDocumento } from "@/lib/numeracao";
import type { Assinante, Financeiro, FinanceiroItem } from "@/types/domain";

const ORANGE = "#F85818";
const PEACH = "#FDEDE4";
const INK = "#1A1712";
const MUTED = "#857C6E";
const LINE = "#E7E1D7";

const MIX_FATURA = {
  inscricaoMunicipal: "225.610-2",
  telefone: "(84) 99129-8769",
  email: "mixtendaeluz@hotmail.com",
  ruaCep: "Rua Doutor Eloy de Souza, 79, Alecrim, CEP 59.037-590",
  municipio: "Natal",
  uf: "RN",
  cnae: "77.39-0-03 · Aluguel de palcos, coberturas e outras estruturas de uso temporário, exceto andaimes.",
};

const styles = StyleSheet.create({
  page: { paddingTop: 30, paddingBottom: 26, paddingHorizontal: 18, fontSize: 8.5, color: INK, fontFamily: "Helvetica" },
  topband: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: ORANGE },
  footer: { position: "absolute", bottom: 10, left: 18, right: 18, borderTop: `1 solid ${LINE}`, paddingTop: 6 },
  footerTexto: { fontSize: 7, color: MUTED },
  paginaNumero: { position: "absolute", bottom: 10, right: 18, fontSize: 7, color: MUTED },

  logoTexto: { fontSize: 16, color: ORANGE, fontFamily: "Helvetica-Bold" },
  logoSub: { fontSize: 6.5, letterSpacing: 3, color: INK, marginTop: 1 },
  logoImg: { width: 90, objectFit: "contain" },

  // ---------- Fatura (NFL) ----------
  faturaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  faturaTituloBloco: { maxWidth: 260 },
  faturaTitulo: { fontFamily: "Helvetica-Bold", fontSize: 13, color: INK },
  faturaSubtitulo: { fontSize: 8, fontFamily: "Helvetica-Bold", color: INK, marginTop: 1 },
  faturaLegal: { fontSize: 6, color: MUTED, marginTop: 4, lineHeight: 1.3 },

  numBox: { border: `1 solid ${LINE}`, borderRadius: 4, width: 210 },
  numLinha: { flexDirection: "row", borderBottom: `1 solid ${LINE}` },
  numCel: { flex: 1, paddingVertical: 3, paddingHorizontal: 5, borderRight: `1 solid ${LINE}` },
  numCelUltima: { flex: 1, paddingVertical: 3, paddingHorizontal: 5 },
  numRotulo: { fontSize: 6, color: MUTED, marginBottom: 1 },
  numValor: { fontSize: 8, fontFamily: "Helvetica-Bold" },

  boxTitulo: {
    backgroundColor: INK,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginTop: 8,
  },
  boxTituloTexto: { color: "#fff", fontSize: 7.5, fontFamily: "Helvetica-Bold" },
  infoBox: { border: `1 solid ${LINE}`, borderTop: "none" },
  logoCel: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRight: `1 solid ${LINE}`,
    paddingVertical: 6,
  },
  infoLinha: { flexDirection: "row", borderBottom: `1 solid ${LINE}` },
  infoRotuloCel: { width: 90, paddingVertical: 3, paddingHorizontal: 6, fontSize: 7, fontFamily: "Helvetica-Bold", borderRight: `1 solid ${LINE}` },
  infoValorCel: { flex: 1, paddingVertical: 3, paddingHorizontal: 6, fontSize: 7.5 },

  itensTabela: { border: `1 solid ${LINE}`, borderTop: "none", marginTop: 0 },
  itensCab: { flexDirection: "row", backgroundColor: "#F2EFE9", borderBottom: `1 solid ${LINE}` },
  itensCabCel: { fontSize: 6.5, fontFamily: "Helvetica-Bold", color: MUTED, paddingVertical: 3, paddingHorizontal: 5 },
  itensLinha: { flexDirection: "row", borderBottom: `1 solid ${LINE}` },
  itensCel: { fontSize: 7.5, paddingVertical: 4, paddingHorizontal: 5 },
  colItem: { width: 24, textAlign: "center" },
  colDescricao: { flex: 4 },
  colQuant: { width: 45, textAlign: "center" },
  colUnit: { width: 60, textAlign: "right" },
  colTotal: { width: 65, textAlign: "right", fontFamily: "Helvetica-Bold" },

  totalFaturaBox: {
    border: `1 solid ${LINE}`,
    borderTop: "none",
    alignItems: "flex-end",
    padding: 6,
  },
  totalFaturaRotulo: { fontSize: 7, fontFamily: "Helvetica-Bold", color: MUTED },
  totalFaturaValor: { fontSize: 13, fontFamily: "Helvetica-Bold", color: INK },

  fiscalGrid: { flexDirection: "row", marginTop: 8, border: `1 solid ${LINE}` },
  fiscalCel: { flex: 1, paddingVertical: 3, paddingHorizontal: 5, borderRight: `1 solid ${LINE}` },
  fiscalCelUltima: { flex: 1, paddingVertical: 3, paddingHorizontal: 5 },
  fiscalRotulo: { fontSize: 6, color: MUTED },
  fiscalValor: { fontSize: 7.5, marginTop: 1 },

  outrasInfoBox: { border: `1 solid ${LINE}`, borderTop: "none", padding: 6 },
  outrasInfoTexto: { fontSize: 6.5, color: "#3a3a3a", lineHeight: 1.4, marginBottom: 2 },
  outrasInfoNegrito: { fontFamily: "Helvetica-Bold" },

  // ---------- Recibo ----------
  reciboHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  reciboMixInfo: { alignItems: "flex-end" },
  reciboMixNome: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: INK },
  reciboMixLinha: { fontSize: 7, color: MUTED, marginTop: 1 },

  reciboTitulo: { fontFamily: "Helvetica-Bold", fontSize: 18, color: INK, textAlign: "center", letterSpacing: 2, marginTop: 10 },
  reciboBarra: { width: 60, height: 2, backgroundColor: ORANGE, alignSelf: "center", marginTop: 4, marginBottom: 10 },
  reciboData: { fontSize: 8.5, textAlign: "right", marginBottom: 10, color: "#3a3a3a" },

  valorBox: { backgroundColor: PEACH, borderRadius: 8, padding: 14, alignItems: "center", marginBottom: 14 },
  valorRotulo: { fontSize: 8, fontFamily: "Helvetica-Bold", color: ORANGE, letterSpacing: 1 },
  valorNumero: { fontSize: 22, fontFamily: "Helvetica-Bold", color: INK, marginTop: 2 },
  valorExtenso: { fontSize: 8.5, fontStyle: "italic", color: "#5a5a5a", marginTop: 2 },

  reciboParagrafo: { textAlign: "justify", lineHeight: 1.6, fontSize: 9.5, marginBottom: 12, color: INK },
  reciboNegrito: { fontFamily: "Helvetica-Bold" },

  tomadorTitulo: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: INK, marginBottom: 4 },
  tomadorTabela: { border: `1 solid ${LINE}`, borderLeft: `3 solid ${ORANGE}` },
  tomadorLinha: { flexDirection: "row", borderBottom: `1 solid ${LINE}`, paddingVertical: 4, paddingHorizontal: 8 },
  tomadorRotulo: { width: 110, fontSize: 8.5, fontFamily: "Helvetica-Bold", color: ORANGE },
  tomadorValor: { flex: 1, fontSize: 8.5, color: INK },
  formaPagPill: {
    alignSelf: "flex-start",
    backgroundColor: INK,
    color: "#fff",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },

  assinaturasLinha: { flexDirection: "row", justifyContent: "center", marginTop: 34 },
  assinaturaCol: { width: "60%", alignItems: "center" },
  assinaturaImg: { width: 120, height: 32, objectFit: "contain" },
  assinaturaLinhaTopo: { borderTop: `1 solid ${INK}`, width: "100%", marginTop: 3, paddingTop: 4, textAlign: "center" },
  assinaturaNome: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
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

function fmtDataCurta(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR");
}

function competenciaDe(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).replace(".", "");
}

function InfoLinha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.infoLinha}>
      <Text style={styles.infoRotuloCel}>{rotulo}</Text>
      <Text style={styles.infoValorCel}>{valor || "-"}</Text>
    </View>
  );
}

interface FinanceiroDocumentProps {
  financeiro: Financeiro;
  itens: FinanceiroItem[];
  clienteNumero: number | null;
  propostaNumeroCliente: number | null;
}

export function FinanceiroDocument({
  financeiro,
  itens,
  clienteNumero,
  propostaNumeroCliente,
}: FinanceiroDocumentProps) {
  const logo = assetSeExistir("logo.png");
  const assinatura = financeiro.signatario ? assetSeExistir(`assinatura-${financeiro.signatario}.png`) : null;
  const numeroFormatado = formatarNumeroDocumento(
    clienteNumero,
    financeiro.tipo === "fatura" ? "N" : "R",
    financeiro.numero_cliente
  );

  if (financeiro.tipo === "fatura") {
    return (
      <FaturaPdf
        financeiro={financeiro}
        itens={itens}
        logo={logo}
        numeroFormatado={numeroFormatado}
        propostaNumeroFormatado={
          financeiro.proposta_id ? formatarNumeroDocumento(clienteNumero, "P", propostaNumeroCliente) : null
        }
      />
    );
  }
  return (
    <ReciboPdf financeiro={financeiro} logo={logo} assinatura={assinatura} numeroFormatado={numeroFormatado} />
  );
}

function FaturaPdf({
  financeiro,
  itens,
  logo,
  numeroFormatado,
  propostaNumeroFormatado,
}: {
  financeiro: Financeiro;
  itens: FinanceiroItem[];
  logo: string | null;
  numeroFormatado: string;
  propostaNumeroFormatado: string | null;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.topband} fixed />

        <View style={styles.faturaHeader}>
          <View style={styles.faturaTituloBloco}>
            <Text style={styles.faturaTitulo}>NOTA DE FATURA DE LOCAÇÃO · NFL</Text>
            <Text style={styles.faturaSubtitulo}>LOCAÇÃO DE BENS MÓVEIS</Text>
            <Text style={styles.faturaLegal}>
              Lei Complementar Federal nº 116 de 31/07/2003 e art. 60 da Lei Municipal nº 50 de
              29/12/2003, que excluiu a atividade de Locação de Bens Móveis da lista de serviços
              sujeitos ao pagamento de Imposto sobre Serviços, ISS.
            </Text>
          </View>

          <View style={styles.numBox}>
            <View style={styles.numLinha}>
              <View style={styles.numCel}>
                <Text style={styles.numRotulo}>Nº DA NOTA DE FATURA</Text>
                <Text style={styles.numValor}>{numeroFormatado}</Text>
              </View>
              <View style={styles.numCelUltima}>
                <Text style={styles.numRotulo}>Nº DA SUBSTITUIÇÃO</Text>
                <Text style={styles.numValor}>{financeiro.numero_substituicao || "-"}</Text>
              </View>
            </View>
            <View style={styles.numLinha}>
              <View style={styles.numCel}>
                <Text style={styles.numRotulo}>DATA DE EMISSÃO</Text>
                <Text style={styles.numValor}>{fmtDataCurta(financeiro.data_emissao)}</Text>
              </View>
              <View style={styles.numCelUltima}>
                <Text style={styles.numRotulo}>COMPETÊNCIA</Text>
                <Text style={styles.numValor}>{competenciaDe(financeiro.data_emissao)}</Text>
              </View>
            </View>
            <View style={[styles.numLinha, { borderBottom: "none" }]}>
              <View style={styles.numCel}>
                <Text style={styles.numRotulo}>Nº DA PROPOSTA</Text>
                <Text style={styles.numValor}>{propostaNumeroFormatado ?? "-"}</Text>
              </View>
              <View style={styles.numCelUltima}>
                <Text style={styles.numRotulo}>DATA DA ENTREGA</Text>
                <Text style={styles.numValor}>{financeiro.data_entrega || "-"}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.boxTitulo}>
          <Text style={styles.boxTituloTexto}>LOCADOR DE BENS MÓVEIS</Text>
        </View>
        <View style={[styles.infoBox, { flexDirection: "row" }]}>
          <View style={styles.logoCel}>
            {logo ? (
              <Image src={logo} style={{ width: 46, objectFit: "contain" }} />
            ) : (
              <View>
                <Text style={{ fontSize: 10, color: ORANGE, fontFamily: "Helvetica-Bold" }}>mix</Text>
                <Text style={{ fontSize: 4.5, letterSpacing: 1, color: INK }}>LUZ, SOM E ESTRUTURAS</Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.infoLinha}>
              <Text style={styles.infoRotuloCel}>CNPJ</Text>
              <Text style={styles.infoValorCel}>{MIX_DADOS.cnpj}</Text>
            </View>
            <InfoLinha rotulo="Insc. Municipal" valor={MIX_FATURA.inscricaoMunicipal} />
            <InfoLinha rotulo="Razão Social" valor={MIX_DADOS.razaoSocial.toUpperCase()} />
            <InfoLinha rotulo="Endereço" valor={MIX_FATURA.ruaCep} />
            <InfoLinha rotulo="Município / UF" valor={`${MIX_FATURA.municipio} / ${MIX_FATURA.uf}`} />
            <View style={[styles.infoLinha, { borderBottom: "none" }]}>
              <Text style={styles.infoRotuloCel}>Telefone / E-mail</Text>
              <Text style={styles.infoValorCel}>
                {MIX_FATURA.telefone} · {MIX_FATURA.email}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.boxTitulo}>
          <Text style={styles.boxTituloTexto}>TOMADOR DA LOCAÇÃO DE BENS E MÓVEIS</Text>
        </View>
        <View style={styles.infoBox}>
          <InfoLinha rotulo="Nome / Razão" valor={financeiro.cliente_nome ?? ""} />
          <InfoLinha rotulo="CPF/CNPJ" valor={financeiro.cliente_documento ?? ""} />
          <InfoLinha rotulo="Insc. Municipal" valor={financeiro.cliente_inscricao_municipal ?? ""} />
          <InfoLinha rotulo="Endereço" valor={financeiro.cliente_endereco ?? ""} />
          <View style={[styles.infoLinha, { borderBottom: "none" }]}>
            <Text style={styles.infoRotuloCel}>Telefone / E-mail</Text>
            <Text style={styles.infoValorCel}>
              {[financeiro.cliente_telefone, financeiro.cliente_email].filter(Boolean).join(" · ") || "-"}
            </Text>
          </View>
        </View>

        <View style={styles.boxTitulo}>
          <Text style={styles.boxTituloTexto}>BENS E MÓVEIS LOCADOS</Text>
        </View>
        <View style={[styles.infoBox, { padding: 5 }]}>
          <Text style={{ fontSize: 6.5, color: MUTED }}>{MIX_FATURA.cnae}</Text>
        </View>

        <View style={styles.itensTabela}>
          <View style={styles.itensCab}>
            <Text style={[styles.itensCabCel, styles.colItem]}>ITEM</Text>
            <Text style={[styles.itensCabCel, styles.colDescricao]}>DESCRIÇÃO</Text>
            <Text style={[styles.itensCabCel, styles.colQuant]}>QUANT.</Text>
            <Text style={[styles.itensCabCel, styles.colUnit]}>VLR. UNIT.</Text>
            <Text style={[styles.itensCabCel, styles.colTotal]}>VALOR TOTAL</Text>
          </View>
          {itens.map((item, i) => (
            <View key={item.id} style={styles.itensLinha}>
              <Text style={[styles.itensCel, styles.colItem]}>{i + 1}</Text>
              <Text style={[styles.itensCel, styles.colDescricao]}>{item.descricao || "-"}</Text>
              <Text style={[styles.itensCel, styles.colQuant]}>{item.quantidade.toFixed(4)}</Text>
              <Text style={[styles.itensCel, styles.colUnit]}>{item.valor_unitario.toFixed(2)}</Text>
              <Text style={[styles.itensCel, styles.colTotal]}>{item.valor_total.toFixed(2)}</Text>
            </View>
          ))}
          {itens.length === 0 && (
            <View style={styles.itensLinha}>
              <Text style={[styles.itensCel, { flex: 1, textAlign: "center", color: MUTED }]}>
                Nenhum item adicionado.
              </Text>
            </View>
          )}
        </View>
        <View style={styles.totalFaturaBox}>
          <Text style={styles.totalFaturaRotulo}>VALOR TOTAL DA NFL R$</Text>
          <Text style={styles.totalFaturaValor}>{financeiro.valor_total.toFixed(2)}</Text>
        </View>

        <View style={styles.fiscalGrid}>
          <View style={styles.fiscalCel}>
            <Text style={styles.fiscalRotulo}>DEDUÇÕES (R$)</Text>
            <Text style={styles.fiscalValor}>0,00</Text>
          </View>
          <View style={styles.fiscalCel}>
            <Text style={styles.fiscalRotulo}>BASE DE CÁLCULO (R$)</Text>
            <Text style={styles.fiscalValor}>{financeiro.valor_total.toFixed(2)}</Text>
          </View>
          <View style={styles.fiscalCel}>
            <Text style={styles.fiscalRotulo}>ALÍQUOTA (%)</Text>
            <Text style={styles.fiscalValor}>**</Text>
          </View>
          <View style={styles.fiscalCel}>
            <Text style={styles.fiscalRotulo}>VALOR DO ISS (R$)</Text>
            <Text style={styles.fiscalValor}>**</Text>
          </View>
          <View style={styles.fiscalCelUltima}>
            <Text style={styles.fiscalRotulo}>OUTRAS RETENÇÕES (R$)</Text>
            <Text style={styles.fiscalValor}>0,00</Text>
          </View>
        </View>
        <View style={[styles.fiscalGrid, { marginTop: 0, borderTop: "none" }]}>
          <View style={styles.fiscalCel}>
            <Text style={styles.fiscalRotulo}>INSS (R$)</Text>
            <Text style={styles.fiscalValor}>0,00</Text>
          </View>
          <View style={styles.fiscalCel}>
            <Text style={styles.fiscalRotulo}>IRPJ (R$)</Text>
            <Text style={styles.fiscalValor}>0,00</Text>
          </View>
          <View style={styles.fiscalCel}>
            <Text style={styles.fiscalRotulo}>CSLL (R$)</Text>
            <Text style={styles.fiscalValor}>0,00</Text>
          </View>
          <View style={styles.fiscalCel}>
            <Text style={styles.fiscalRotulo}>COFINS (R$)</Text>
            <Text style={styles.fiscalValor}>0,00</Text>
          </View>
          <View style={styles.fiscalCelUltima}>
            <Text style={styles.fiscalRotulo}>PIS/PASEP (R$)</Text>
            <Text style={styles.fiscalValor}>0,00</Text>
          </View>
        </View>

        <View style={styles.boxTitulo}>
          <Text style={styles.boxTituloTexto}>OUTRAS INFORMAÇÕES</Text>
        </View>
        <View style={styles.outrasInfoBox}>
          <Text style={styles.outrasInfoTexto}>Documento emitido por Empresa do MEI.</Text>
          <Text style={styles.outrasInfoTexto}>
            EMPRESA OPTANTE PELO SIMPLES NACIONAL, sem retenção/substituição tributária de ISS, com
            ISS devido ao próprio Município do estabelecimento, sem retenção do INSS. PROCON (84)
            3232-2525.
          </Text>
          <Text style={styles.outrasInfoTexto}>
            ISENTO DO ISS, conforme Lei Complementar nº 116 de 31/07/2003, Mensagem nº 362 de
            31/07/2003.
          </Text>
          <Text style={[styles.outrasInfoTexto, styles.outrasInfoNegrito]}>
            Dados bancários: Banco 756 SICOOB · Sistema de Cooperativa de Crédito do Brasil · AG.
            4194-7 · C/C 15620-5 · PIX: {MIX_DADOS.cnpj} · Favorecido: {MIX_DADOS.razaoSocial}
          </Text>
        </View>

        <Rodape />
        <NumeroPagina />
      </Page>
    </Document>
  );
}

function ReciboPdf({
  financeiro,
  logo,
  assinatura,
  numeroFormatado,
}: {
  financeiro: Financeiro;
  logo: string | null;
  assinatura: string | null;
  numeroFormatado: string;
}) {
  const dataEmissao = fmtData(financeiro.data_emissao);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.topband} fixed />

        <View style={styles.reciboHeader}>
          {logo ? (
            <Image src={logo} style={styles.logoImg} />
          ) : (
            <View>
              <Text style={styles.logoTexto}>mix.</Text>
              <Text style={styles.logoSub}>LUZ, SOM E ESTRUTURAS</Text>
            </View>
          )}
          <View style={styles.reciboMixInfo}>
            <Text style={styles.reciboMixNome}>{MIX_DADOS.razaoSocial}</Text>
            <Text style={styles.reciboMixLinha}>CNPJ: {MIX_DADOS.cnpj}</Text>
            <Text style={styles.reciboMixLinha}>{MIX_DADOS.endereco}</Text>
            <Text style={styles.reciboMixLinha}>Instagram: {MIX_DADOS.instagram}</Text>
          </View>
        </View>

        <Text style={styles.reciboTitulo}>RECIBO</Text>
        <View style={styles.reciboBarra} />
        <Text style={[styles.reciboData, { textAlign: "center", marginBottom: 2 }]}>
          Nº {numeroFormatado}
        </Text>
        {dataEmissao && <Text style={styles.reciboData}>Natal/RN, {dataEmissao}.</Text>}

        <View style={styles.valorBox}>
          <Text style={styles.valorRotulo}>VALOR</Text>
          <Text style={styles.valorNumero}>R$ {financeiro.valor_total.toFixed(2)}</Text>
          <Text style={styles.valorExtenso}>({valorPorExtenso(financeiro.valor_total)})</Text>
        </View>

        <Text style={styles.reciboParagrafo}>
          Recebemos de{" "}
          <Text style={styles.reciboNegrito}>{financeiro.cliente_nome || "o tomador abaixo identificado"}</Text>
          {financeiro.cliente_documento && (
            <>
              , inscrito no CNPJ/CPF sob o nº{" "}
              <Text style={styles.reciboNegrito}>{financeiro.cliente_documento}</Text>
            </>
          )}
          , a quantia de{" "}
          <Text style={styles.reciboNegrito}>
            R$ {financeiro.valor_total.toFixed(2)} ({valorPorExtenso(financeiro.valor_total)})
          </Text>
          {financeiro.forma_pagamento && <>, através de {financeiro.forma_pagamento}</>}
          {financeiro.descricao && <>, referente a: {financeiro.descricao}</>}
          , dando plena e geral quitação.
        </Text>
        <Text style={styles.reciboParagrafo}>Para maior clareza, firmamos o presente recibo.</Text>

        <Text style={styles.tomadorTitulo}>Dados do Tomador</Text>
        <View style={styles.tomadorTabela}>
          <View style={styles.tomadorLinha}>
            <Text style={styles.tomadorRotulo}>Razão Social</Text>
            <Text style={styles.tomadorValor}>{financeiro.cliente_nome || "-"}</Text>
          </View>
          <View style={styles.tomadorLinha}>
            <Text style={styles.tomadorRotulo}>CNPJ/CPF</Text>
            <Text style={styles.tomadorValor}>{financeiro.cliente_documento || "-"}</Text>
          </View>
          <View style={styles.tomadorLinha}>
            <Text style={styles.tomadorRotulo}>Inscrição Estadual</Text>
            <Text style={styles.tomadorValor}>{financeiro.cliente_inscricao_estadual || "-"}</Text>
          </View>
          <View style={styles.tomadorLinha}>
            <Text style={styles.tomadorRotulo}>Endereço</Text>
            <Text style={styles.tomadorValor}>{financeiro.cliente_endereco || "-"}</Text>
          </View>
          <View style={styles.tomadorLinha}>
            <Text style={styles.tomadorRotulo}>Responsável</Text>
            <Text style={styles.tomadorValor}>{financeiro.cliente_responsavel || "-"}</Text>
          </View>
          <View style={styles.tomadorLinha}>
            <Text style={styles.tomadorRotulo}>E-mail</Text>
            <Text style={styles.tomadorValor}>{financeiro.cliente_email || "-"}</Text>
          </View>
          <View style={[styles.tomadorLinha, { borderBottom: "none", alignItems: "center" }]}>
            <Text style={styles.tomadorRotulo}>Forma de Pagamento</Text>
            <Text style={styles.formaPagPill}>{(financeiro.forma_pagamento || "-").toUpperCase()}</Text>
          </View>
        </View>

        {financeiro.observacoes && (
          <Text style={[styles.reciboParagrafo, { marginTop: 12 }]}>{financeiro.observacoes}</Text>
        )}

        {financeiro.signatario && (
          <View style={styles.assinaturasLinha}>
            <View style={styles.assinaturaCol}>
              {assinatura ? (
                <Image src={assinatura} style={styles.assinaturaImg} />
              ) : (
                <View style={{ height: 32 }} />
              )}
              <View style={styles.assinaturaLinhaTopo}>
                <Text style={styles.assinaturaNome}>{nomeSignatario[financeiro.signatario]}</Text>
                <Text style={styles.assinaturaSub}>Diretor Presidente · {MIX_DADOS.razaoSocial}</Text>
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
