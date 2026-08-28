import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { assetSeExistir } from "@/lib/pdf/assets";
import { MIX_DADOS } from "@/lib/contratos/textosPadrao";
import type { EtapaEquipe, Evento, StatusEvento } from "@/types/domain";

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
  tituloBloco: { alignItems: "flex-end", maxWidth: 300 },
  titulo: { fontFamily: "Helvetica-Bold", fontSize: 15, color: INK },
  subtitulo: { fontSize: 9, color: MUTED, marginTop: 2, textAlign: "right" },

  card: { backgroundColor: PANEL, borderRadius: 8, padding: 12, marginBottom: 14 },
  cardLinha: { flexDirection: "row", marginBottom: 8 },
  cardCel: { flex: 1, paddingRight: 8 },
  cardRotulo: { fontSize: 7, fontFamily: "Helvetica-Bold", color: ORANGE, letterSpacing: 0.5, marginBottom: 2 },
  cardValor: { fontSize: 9.5, color: INK },

  montagemBox: {
    backgroundColor: INK,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  montagemRotulo: { fontSize: 8, color: "#d9d2c6", fontFamily: "Helvetica-Bold", letterSpacing: 0.5 },
  montagemData: { fontSize: 15, color: "#fff", fontFamily: "Helvetica-Bold", marginTop: 2 },
  montagemHora: { fontSize: 9, color: "#cabfae", marginTop: 2 },
  montagemAusente: { fontSize: 9, color: MUTED, fontStyle: "italic", marginBottom: 16 },

  secaoTitulo: { fontSize: 11, fontFamily: "Helvetica-Bold", color: ORANGE, marginBottom: 6, marginTop: 4 },

  etapaBloco: { marginBottom: 6 },
  etapaTitulo: { fontSize: 8, fontFamily: "Helvetica-Bold", color: MUTED, marginBottom: 3, textTransform: "uppercase" },
  membroLinha: { flexDirection: "row", justifyContent: "space-between", borderBottom: `1 solid ${LINE}`, paddingVertical: 4 },
  membroNome: { fontSize: 9.5, color: INK },
  membroFuncao: { fontSize: 8.5, color: MUTED },

  pill: { backgroundColor: ORANGE, borderRadius: 5, paddingVertical: 4, paddingHorizontal: 8, marginTop: 10, marginBottom: 5 },
  pillTexto: { color: "#fff", fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 0.4 },

  checkLinha: { flexDirection: "row", alignItems: "center", borderBottom: `1 solid ${LINE}`, paddingVertical: 5 },
  checkbox: { width: 11, height: 11, border: `1.2 solid ${INK}`, borderRadius: 2, marginRight: 8 },
  checkNome: { flex: 1, fontSize: 9.5, color: INK },
  checkQtd: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: INK },
});

const rotuloStatus: Record<StatusEvento, string> = {
  orcamento: "Orçamento",
  confirmado: "Confirmado",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const rotuloEtapa: Record<EtapaEquipe, string> = {
  montagem: "Montagem",
  operacao: "Operação",
  desmontagem: "Desmontagem",
};

const ORDEM_ETAPAS: EtapaEquipe[] = ["montagem", "operacao", "desmontagem"];

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

export interface MembroEquipePdf {
  id: string;
  nome: string;
  etapa: EtapaEquipe;
  funcao: string | null;
}

export interface ItemEquipamentoPdf {
  id: string;
  nome: string;
  quantidade: number;
  setor: string;
}

interface EventoDocumentProps {
  evento: Evento;
  clienteNome: string | null;
  equipe: MembroEquipePdf[];
  itens: ItemEquipamentoPdf[];
}

export function EventoDocument({ evento, clienteNome, equipe, itens }: EventoDocumentProps) {
  const logo = assetSeExistir("logo.png");

  const periodo =
    evento.data_fim && evento.data_fim !== evento.data_inicio
      ? `${fmtData(evento.data_inicio)} a ${fmtData(evento.data_fim)}`
      : fmtData(evento.data_inicio);

  const gruposEtapa = ORDEM_ETAPAS.map((etapa) => ({
    etapa,
    membros: equipe.filter((m) => m.etapa === etapa),
  })).filter((g) => g.membros.length > 0);

  const setores = Array.from(new Set(itens.map((i) => i.setor)));

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
            <Text style={styles.titulo}>Ficha do Evento</Text>
            <Text style={styles.subtitulo}>{evento.nome}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardLinha}>
            <View style={styles.cardCel}>
              <Text style={styles.cardRotulo}>CLIENTE</Text>
              <Text style={styles.cardValor}>{clienteNome ?? "Não definido"}</Text>
            </View>
            <View style={styles.cardCel}>
              <Text style={styles.cardRotulo}>STATUS</Text>
              <Text style={styles.cardValor}>{rotuloStatus[evento.status]}</Text>
            </View>
          </View>
          <View style={styles.cardLinha}>
            <View style={styles.cardCel}>
              <Text style={styles.cardRotulo}>DATA DO EVENTO</Text>
              <Text style={styles.cardValor}>{periodo ?? "-"}</Text>
            </View>
            <View style={styles.cardCel}>
              <Text style={styles.cardRotulo}>LOCAL</Text>
              <Text style={styles.cardValor}>{evento.local ?? "Não definido"}</Text>
            </View>
          </View>
        </View>

        {evento.data_montagem ? (
          <View style={styles.montagemBox}>
            <View>
              <Text style={styles.montagemRotulo}>DATA DE MONTAGEM</Text>
              <Text style={styles.montagemData}>{fmtData(evento.data_montagem)}</Text>
            </View>
            {evento.hora_montagem && <Text style={styles.montagemHora}>{evento.hora_montagem}</Text>}
          </View>
        ) : (
          <Text style={styles.montagemAusente}>Data de montagem não definida.</Text>
        )}

        {gruposEtapa.length > 0 && (
          <>
            <Text style={styles.secaoTitulo}>Equipe</Text>
            {gruposEtapa.map(({ etapa, membros }) => (
              <View key={etapa} style={styles.etapaBloco} wrap={false}>
                <Text style={styles.etapaTitulo}>{rotuloEtapa[etapa]}</Text>
                {membros.map((m) => (
                  <View key={m.id} style={styles.membroLinha}>
                    <Text style={styles.membroNome}>{m.nome}</Text>
                    {m.funcao && <Text style={styles.membroFuncao}>{m.funcao}</Text>}
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        <Text style={styles.secaoTitulo}>Checklist de equipamentos</Text>
        {setores.map((setor) => (
          <View key={setor} wrap={false} minPresenceAhead={30}>
            <View style={styles.pill}>
              <Text style={styles.pillTexto}>{setor.toUpperCase()}</Text>
            </View>
            {itens
              .filter((i) => i.setor === setor)
              .map((item) => (
                <View key={item.id} style={styles.checkLinha}>
                  <View style={styles.checkbox} />
                  <Text style={styles.checkNome}>{item.nome}</Text>
                  <Text style={styles.checkQtd}>x{item.quantidade}</Text>
                </View>
              ))}
          </View>
        ))}
        {itens.length === 0 && (
          <Text style={styles.montagemAusente}>Nenhum equipamento reservado para este evento.</Text>
        )}

        <Rodape />
        <NumeroPagina />
      </Page>
    </Document>
  );
}
