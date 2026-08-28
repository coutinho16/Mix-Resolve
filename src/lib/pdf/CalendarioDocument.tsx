import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { assetSeExistir } from "@/lib/pdf/assets";
import { MIX_DADOS } from "@/lib/contratos/textosPadrao";
import type { Evento } from "@/types/domain";

const ORANGE = "#F85818";
const INK = "#1A1712";
const MUTED = "#857C6E";
const PANEL = "#F5F1EA";
const LINE = "#E7E1D7";

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

  diaBloco: { marginBottom: 10 },
  diaCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PANEL,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  diaCabecalhoBarra: { width: 3, height: 11, backgroundColor: ORANGE, marginRight: 6 },
  diaCabecalhoTexto: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: INK },

  item: { flexDirection: "row", borderBottom: `1 solid ${LINE}`, paddingVertical: 5, paddingHorizontal: 8 },
  itemMontagem: { borderLeft: `2 dashed ${MUTED}` },
  itemEvento: { borderLeft: `2 solid ${ORANGE}` },
  itemCol: { flex: 1 },
  itemNome: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: INK },
  itemMeta: { fontSize: 8, color: MUTED, marginTop: 1 },
  itemStatus: { fontSize: 7.5, color: MUTED, marginLeft: 6 },

  vazio: { fontSize: 8.5, color: MUTED, fontStyle: "italic", paddingHorizontal: 8, paddingVertical: 6 },
});

const rotuloStatus: Record<string, string> = {
  orcamento: "Orçamento",
  confirmado: "Confirmado",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
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

function fmtDiaCompleto(iso: string) {
  const texto = new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function fmtPeriodo(inicio: string, fim: string) {
  const fmt = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  return inicio === fim ? fmt(inicio) : `${fmt(inicio)} a ${fmt(fim)}`;
}

interface DiaAgenda {
  data: string;
  eventos: Evento[];
  montagens: Evento[];
}

interface CalendarioDocumentProps {
  inicio: string;
  fim: string;
  dias: DiaAgenda[];
}

export function CalendarioDocument({ inicio, fim, dias }: CalendarioDocumentProps) {
  const logo = assetSeExistir("logo.png");

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
            <Text style={styles.titulo}>Calendário</Text>
            <Text style={styles.subtitulo}>{fmtPeriodo(inicio, fim)}</Text>
          </View>
        </View>

        {dias.map((dia) => (
          <View key={dia.data} wrap={false} style={styles.diaBloco}>
            <View style={styles.diaCabecalho}>
              <View style={styles.diaCabecalhoBarra} />
              <Text style={styles.diaCabecalhoTexto}>{fmtDiaCompleto(dia.data)}</Text>
            </View>

            {dia.eventos.length === 0 && dia.montagens.length === 0 && (
              <Text style={styles.vazio}>Nenhum evento agendado.</Text>
            )}

            {dia.eventos.map((e) => (
              <View key={e.id} style={[styles.item, styles.itemEvento]}>
                <View style={styles.itemCol}>
                  <Text style={styles.itemNome}>{e.nome}</Text>
                  <Text style={styles.itemMeta}>
                    {e.local ?? "Local não definido"}
                    {" · "}
                    {rotuloStatus[e.status] ?? e.status}
                  </Text>
                </View>
              </View>
            ))}

            {dia.montagens.map((e) => (
              <View key={`m-${e.id}`} style={[styles.item, styles.itemMontagem]}>
                <View style={styles.itemCol}>
                  <Text style={styles.itemNome}>Montagem: {e.nome}</Text>
                  {e.hora_montagem && <Text style={styles.itemMeta}>{e.hora_montagem}</Text>}
                </View>
              </View>
            ))}
          </View>
        ))}

        <Rodape />
        <NumeroPagina />
      </Page>
    </Document>
  );
}
