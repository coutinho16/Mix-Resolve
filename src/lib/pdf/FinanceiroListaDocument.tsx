import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { assetSeExistir } from "@/lib/pdf/assets";
import { MIX_DADOS } from "@/lib/contratos/textosPadrao";
import type { StatusFinanceiro, TipoFinanceiro } from "@/types/domain";

const ORANGE = "#F85818";
const INK = "#1A1712";
const MUTED = "#857C6E";
const LINE = "#E7E1D7";
const PANEL = "#F5F1EA";

const styles = StyleSheet.create({
  page: { paddingTop: 32, paddingBottom: 26, paddingHorizontal: 20, fontSize: 9.5, color: INK, fontFamily: "Helvetica" },
  topband: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: ORANGE },
  footer: { position: "absolute", bottom: 10, left: 20, right: 20, borderTop: `1 solid ${LINE}`, paddingTop: 6 },
  footerTexto: { fontSize: 7, color: MUTED },
  paginaNumero: { position: "absolute", bottom: 10, right: 20, fontSize: 7, color: MUTED },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 4, marginBottom: 16 },
  logoTexto: { fontSize: 18, color: ORANGE, fontFamily: "Helvetica-Bold" },
  logoSub: { fontSize: 7, letterSpacing: 3, color: INK, marginTop: 1 },
  logoImg: { width: 100, objectFit: "contain" },
  tituloBloco: { alignItems: "flex-end" },
  titulo: { fontFamily: "Helvetica-Bold", fontSize: 15, color: INK },
  subtitulo: { fontSize: 9, color: MUTED, marginTop: 2 },

  tabela: { border: `1 solid ${LINE}` },
  cab: { flexDirection: "row", backgroundColor: PANEL, borderBottom: `1 solid ${LINE}` },
  cabCel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: MUTED, paddingVertical: 5, paddingHorizontal: 6 },
  linha: { flexDirection: "row", borderBottom: `1 solid ${LINE}` },
  cel: { fontSize: 8.5, paddingVertical: 5, paddingHorizontal: 6 },
  colNumero: { width: 70 },
  colCliente: { flex: 2 },
  colValor: { width: 75, textAlign: "right" },
  colData: { width: 65, textAlign: "center" },
  colStatus: { width: 60, textAlign: "center" },

  statusPendente: { color: "#b8860b", fontFamily: "Helvetica-Bold" },
  statusPago: { color: "#2e9e5b", fontFamily: "Helvetica-Bold" },
  statusCancelado: { color: MUTED, fontFamily: "Helvetica-Bold" },

  totalBox: {
    backgroundColor: INK,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalRotulo: { fontSize: 8, color: "#d9d2c6", fontFamily: "Helvetica-Bold" },
  totalValor: { fontSize: 13, color: "#fff", fontFamily: "Helvetica-Bold" },
});

const rotuloStatus: Record<StatusFinanceiro, string> = {
  rascunho: "Pendente",
  emitido: "Pendente",
  pago: "Pago",
  cancelado: "Cancelado",
};

const estiloStatus: Record<StatusFinanceiro, object> = {
  rascunho: styles.statusPendente,
  emitido: styles.statusPendente,
  pago: styles.statusPago,
  cancelado: styles.statusCancelado,
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

function fmtData(iso: string | null) {
  if (!iso) return "-";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR");
}

export interface ItemListaFinanceiro {
  id: string;
  numeroFormatado: string;
  clienteNome: string;
  valorTotal: number;
  dataEmissao: string | null;
  status: StatusFinanceiro;
}

interface FinanceiroListaDocumentProps {
  tipo: TipoFinanceiro;
  filtroLabel: string;
  itens: ItemListaFinanceiro[];
}

export function FinanceiroListaDocument({ tipo, filtroLabel, itens }: FinanceiroListaDocumentProps) {
  const logo = assetSeExistir("logo.png");
  const total = itens.reduce((soma, i) => soma + i.valorTotal, 0);

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
          <View style={styles.tituloBloco}>
            <Text style={styles.titulo}>{tipo === "fatura" ? "Notas de Fatura" : "Recibos"}</Text>
            <Text style={styles.subtitulo}>{filtroLabel}</Text>
          </View>
        </View>

        <View style={styles.tabela}>
          <View style={styles.cab} fixed>
            <Text style={[styles.cabCel, styles.colNumero]}>NÚMERO</Text>
            <Text style={[styles.cabCel, styles.colCliente]}>CLIENTE</Text>
            <Text style={[styles.cabCel, styles.colValor]}>VALOR</Text>
            <Text style={[styles.cabCel, styles.colData]}>EMISSÃO</Text>
            <Text style={[styles.cabCel, styles.colStatus]}>STATUS</Text>
          </View>
          {itens.map((item) => (
            <View key={item.id} style={styles.linha} wrap={false}>
              <Text style={[styles.cel, styles.colNumero]}>{item.numeroFormatado}</Text>
              <Text style={[styles.cel, styles.colCliente]}>{item.clienteNome || "-"}</Text>
              <Text style={[styles.cel, styles.colValor]}>R$ {item.valorTotal.toFixed(2)}</Text>
              <Text style={[styles.cel, styles.colData]}>{fmtData(item.dataEmissao)}</Text>
              <Text style={[styles.cel, styles.colStatus, estiloStatus[item.status]]}>
                {rotuloStatus[item.status]}
              </Text>
            </View>
          ))}
          {itens.length === 0 && (
            <View style={styles.linha}>
              <Text style={[styles.cel, { flex: 1, textAlign: "center", color: MUTED }]}>
                Nenhum registro encontrado para este filtro.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalRotulo}>TOTAL ({itens.length} {itens.length === 1 ? "documento" : "documentos"})</Text>
          <Text style={styles.totalValor}>R$ {total.toFixed(2)}</Text>
        </View>

        <Rodape />
        <NumeroPagina />
      </Page>
    </Document>
  );
}
