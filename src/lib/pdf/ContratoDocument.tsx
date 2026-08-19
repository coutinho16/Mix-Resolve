import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { assetSeExistir } from "@/lib/pdf/assets";
import { agruparPorSetor, type ItemComSetor } from "@/lib/pdf/agrupamento";
import { valorPorExtenso } from "@/lib/pdf/extenso";
import { MIX_DADOS } from "@/lib/contratos/textosPadrao";
import type { Assinante, Contrato } from "@/types/domain";

const ORANGE = "#F85818";
const ORANGE_SUAVE = "#FACEB6";
const INK = "#1A1712";
const MUTED = "#857C6E";
const LINE = "#E7E1D7";

const styles = StyleSheet.create({
  page: { paddingTop: 32, paddingBottom: 26, paddingHorizontal: 18, fontSize: 9.5, color: INK, fontFamily: "Helvetica" },
  topband: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: ORANGE },
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

  clausulaBloco: { flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 6 },
  clausulaBarra: { width: 3, height: 11, backgroundColor: ORANGE, marginRight: 6 },
  clausulaTitulo: { fontFamily: "Helvetica-Bold", fontSize: 10.5, color: INK },

  itemLetra: { flexDirection: "row", marginBottom: 5 },
  itemLetraTexto: { width: 14, fontFamily: "Helvetica-Bold", fontSize: 9 },
  itemTexto: { flex: 1, fontSize: 9.5, lineHeight: 1.5, textAlign: "justify" },

  kv: { flexDirection: "row", marginBottom: 3 },
  kvRotulo: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  kvValor: { fontSize: 9.5 },

  equipBox: {
    border: `1 solid ${ORANGE_SUAVE}`,
    borderLeft: `3 solid ${ORANGE}`,
    borderRadius: 4,
    padding: 10,
    marginTop: 8,
    marginBottom: 4,
  },
  pill: { backgroundColor: ORANGE, borderRadius: 5, paddingVertical: 3, paddingHorizontal: 7, marginTop: 6, marginBottom: 4 },
  pillTexto: { color: "#fff", fontSize: 8.5, fontFamily: "Helvetica-Bold" },
  itemEquip: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3, paddingLeft: 4 },
  itemEquipDesc: { fontSize: 9, flex: 3 },
  itemEquipQtd: { fontSize: 9, flex: 1, textAlign: "right" },
  itemEquipDiarias: { fontSize: 8, flex: 1, textAlign: "center", color: MUTED },
  itemEquipUnit: { fontSize: 9, flex: 1.2, textAlign: "right", color: "#5a5a5a" },
  itemEquipValor: { fontSize: 9, flex: 1.2, textAlign: "right", fontFamily: "Helvetica-Bold" },
  setorSubtotal: { flexDirection: "row", justifyContent: "space-between", marginTop: 2, marginBottom: 6, paddingLeft: 4 },
  setorSubtotalTexto: { fontSize: 8, fontFamily: "Helvetica-Bold", color: ORANGE },

  totalBox: { backgroundColor: INK, borderRadius: 8, padding: 10, marginTop: 8, marginBottom: 8 },
  totalLinha: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  totalRotulo: { fontSize: 8, color: "#d9d2c6", fontFamily: "Helvetica-Bold" },
  totalValor: { fontSize: 13, color: "#fff", fontFamily: "Helvetica-Bold" },
  totalExtenso: { fontSize: 7.5, color: "#cabfae", fontStyle: "italic", marginTop: 3 },

  parcela: { flexDirection: "row", marginBottom: 3 },
  parcelaValor: { fontFamily: "Helvetica-Bold", fontSize: 9.5, marginRight: 4 },
  parcelaVencimento: { fontSize: 9.5, color: "#5a5a5a" },

  assinaturasLinha: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  assinaturaCol: { width: "46%", alignItems: "center" },
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

function ClausulaTitulo({ texto }: { texto: string }) {
  return (
    <View style={styles.clausulaBloco}>
      <View style={styles.clausulaBarra} />
      <Text style={styles.clausulaTitulo}>{texto}</Text>
    </View>
  );
}

function ListaLetras({ texto }: { texto: string | null }) {
  const linhas = (texto ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return (
    <>
      {linhas.map((linha, i) => (
        <View key={i} style={styles.itemLetra}>
          <Text style={styles.itemLetraTexto}>{letras[i] ?? "*"})</Text>
          <Text style={styles.itemTexto}>{linha}</Text>
        </View>
      ))}
    </>
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

interface ContratoDocumentProps {
  contrato: Contrato;
  itens: ItemComSetor[];
  propostaNumeroCliente: number | null;
}

export function ContratoDocument({ contrato, itens, propostaNumeroCliente }: ContratoDocumentProps) {
  const logo = assetSeExistir("logo.png");
  const assinaturaContratada = assetSeExistir(`assinatura-${contrato.signatario}.png`);
  const grupos = agruparPorSetor(itens);
  const dataContrato = fmtData(contrato.data_contrato);
  const porItem = contrato.submodo_valor === "item";
  const porSetor = contrato.submodo_valor === "setor";
  const ehPermuta = contrato.tipo_contratacao === "permuta";

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
          <Text style={styles.metaTexto}>{dataContrato}</Text>
        </View>

        <Text style={styles.titulo}>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</Text>
        <View style={styles.tituloBarra} />
        <Text style={styles.numero}>
          {contrato.numero_cliente ? `Contrato nº ${contrato.numero_cliente}` : ""}
          {contrato.numero_cliente && propostaNumeroCliente ? " · " : ""}
          {propostaNumeroCliente ? `referente à Proposta nº ${propostaNumeroCliente}` : ""}
        </Text>

        <Text style={styles.paragrafo}>
          Os signatários deste instrumento, de um lado{" "}
          <Text style={styles.paragrafoNegrito}>{MIX_DADOS.razaoSocial}</Text>, inscrita no CNPJ{" "}
          <Text style={styles.paragrafoNegrito}>{MIX_DADOS.cnpj}</Text>, com sede na{" "}
          <Text style={styles.paragrafoNegrito}>{MIX_DADOS.endereco}</Text>, doravante denominada{" "}
          <Text style={styles.paragrafoNegrito}>CONTRATADA</Text>, e, de outro lado,{" "}
          <Text style={styles.paragrafoNegrito}>{contrato.contratante_nome}</Text>
          {contrato.contratante_documento && (
            <>
              , inscrito no CPF/CNPJ sob o nº{" "}
              <Text style={styles.paragrafoNegrito}>{contrato.contratante_documento}</Text>
            </>
          )}
          {contrato.contratante_endereco && (
            <>
              , com endereço em{" "}
              <Text style={styles.paragrafoNegrito}>{contrato.contratante_endereco}</Text>
            </>
          )}
          , doravante denominada <Text style={styles.paragrafoNegrito}>CONTRATANTE</Text>, têm
          entre si justo e acordado o presente instrumento, submetendo-se às cláusulas e
          condições a seguir.
        </Text>

        <ClausulaTitulo texto="CLÁUSULA 1 · DO OBJETO" />
        <Text style={styles.paragrafo}>
          O presente contrato tem como objeto a prestação de serviços pela CONTRATADA, conforme
          as especificações abaixo:
        </Text>
        {contrato.objeto_montagem && (
          <View style={styles.kv}>
            <Text style={styles.kvRotulo}>Montagem: </Text>
            <Text style={styles.kvValor}>{fmtData(contrato.objeto_montagem)}</Text>
          </View>
        )}
        {contrato.objeto_data_evento && (
          <View style={styles.kv}>
            <Text style={styles.kvRotulo}>Data do evento: </Text>
            <Text style={styles.kvValor}>{fmtData(contrato.objeto_data_evento)}</Text>
          </View>
        )}
        {contrato.objeto_local && (
          <View style={styles.kv}>
            <Text style={styles.kvRotulo}>Local: </Text>
            <Text style={styles.kvValor}>{contrato.objeto_local}</Text>
          </View>
        )}
        <View style={styles.kv}>
          <Text style={styles.kvRotulo}>Desmontagem: </Text>
          <Text style={styles.kvValor}>{contrato.objeto_desmontagem}</Text>
        </View>

        <View style={styles.equipBox}>
          {grupos.map(([setor, itensSetor]) => {
            const subtotalSetor = itensSetor.reduce((s, i) => s + i.valor_total, 0);
            return (
              <View key={setor}>
                <View style={styles.pill}>
                  <Text style={styles.pillTexto}>{setor.toUpperCase()}</Text>
                </View>
                {itensSetor.map((item) => (
                  <View key={item.id} style={styles.itemEquip}>
                    <Text style={styles.itemEquipDesc}>{item.descricao}</Text>
                    {porItem ? (
                      <>
                        <Text style={styles.itemEquipDiarias}>
                          {item.tipo_valor === "diaria" ? `${item.diarias ?? 1}d` : ""}
                        </Text>
                        <Text style={styles.itemEquipUnit}>R$ {item.valor_unitario.toFixed(2)}</Text>
                        <Text style={styles.itemEquipValor}>R$ {item.valor_total.toFixed(2)}</Text>
                      </>
                    ) : (
                      <Text style={styles.itemEquipQtd}>{item.quantidade}x</Text>
                    )}
                  </View>
                ))}
                {porSetor && (
                  <View style={styles.setorSubtotal}>
                    <Text style={styles.setorSubtotalTexto}>Valor do setor</Text>
                    <Text style={styles.setorSubtotalTexto}>R$ {subtotalSetor.toFixed(2)}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.totalBox}>
          <View style={styles.totalLinha}>
            <Text style={styles.totalRotulo}>
              {ehPermuta ? "VALOR EQUIVALENTE DA PERMUTA" : "VALOR TOTAL DO CONTRATO"}
            </Text>
            <Text style={styles.totalValor}>
              R$ {(ehPermuta ? contrato.permuta_valor ?? 0 : contrato.valor_total).toFixed(2)}
            </Text>
          </View>
          {!ehPermuta && (
            <Text style={styles.totalExtenso}>({valorPorExtenso(contrato.valor_total)})</Text>
          )}
        </View>

        <ClausulaTitulo texto="CLÁUSULA 2 · DAS OBRIGAÇÕES DA CONTRATADA" />
        <Text style={styles.paragrafo}>
          Constituem obrigações da CONTRATADA, sem prejuízo de outras previstas neste contrato ou
          decorrentes de lei:
        </Text>
        <ListaLetras texto={contrato.clausula2_texto} />

        <ClausulaTitulo texto="CLÁUSULA 3 · DAS OBRIGAÇÕES DA CONTRATANTE" />
        <Text style={styles.paragrafo}>A CONTRATANTE se compromete a:</Text>
        <ListaLetras texto={contrato.clausula3_texto} />

        <ClausulaTitulo
          texto={ehPermuta ? "CLÁUSULA 4 · DA PERMUTA" : "CLÁUSULA 4 · DO VALOR E DAS CONDIÇÕES DE PAGAMENTO"}
        />
        {ehPermuta ? (
          <>
            <Text style={styles.paragrafo}>{contrato.permuta_descricao}</Text>
            {contrato.permuta_valor != null && contrato.permuta_valor > 0 && (
              <Text style={styles.paragrafo}>
                Valor equivalente da permuta:{" "}
                <Text style={styles.paragrafoNegrito}>R$ {contrato.permuta_valor.toFixed(2)}</Text>{" "}
                ({valorPorExtenso(contrato.permuta_valor)}).
              </Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.paragrafo}>
              O valor total do serviço é de{" "}
              <Text style={styles.paragrafoNegrito}>R$ {contrato.valor_total.toFixed(2)}</Text> (
              {valorPorExtenso(contrato.valor_total)}).
            </Text>
            <Text style={styles.paragrafo}>
              O pagamento poderá ser realizado por transferência bancária ou Pix, nos seguintes
              dados: Banco <Text style={styles.paragrafoNegrito}>{contrato.banco_nome}</Text>
              {contrato.banco_agencia && (
                <>
                  , Agência <Text style={styles.paragrafoNegrito}>{contrato.banco_agencia}</Text>
                </>
              )}
              {contrato.banco_conta && (
                <>
                  , Conta Corrente <Text style={styles.paragrafoNegrito}>{contrato.banco_conta}</Text>
                </>
              )}
              {contrato.banco_chave_pix && (
                <>
                  , Chave Pix <Text style={styles.paragrafoNegrito}>{contrato.banco_chave_pix}</Text>
                </>
              )}
              , Favorecido <Text style={styles.paragrafoNegrito}>{contrato.banco_favorecido}</Text>.
            </Text>
            {contrato.parcelas.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                {contrato.parcelas.map((p, i) => (
                  <View key={i} style={styles.parcela}>
                    <Text style={styles.parcelaValor}>R$ {p.valor.toFixed(2)}</Text>
                    <Text style={styles.parcelaVencimento}>{p.vencimento}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        <ClausulaTitulo texto="CLÁUSULA 5 · DO CANCELAMENTO E DA MULTA" />
        <ListaLetras texto={contrato.clausula5_texto} />

        <ClausulaTitulo texto="CLÁUSULA 6 · DAS RESPONSABILIDADES E GARANTIAS" />
        <ListaLetras texto={contrato.clausula6_texto} />

        <ClausulaTitulo texto="CLÁUSULA 7 · DAS DISPOSIÇÕES GERAIS" />
        <ListaLetras texto={contrato.clausula7_texto} />

        <ClausulaTitulo texto="CLÁUSULA 8 · DO FORO" />
        <Text style={styles.paragrafo}>{contrato.clausula8_texto}</Text>

        <Text style={[styles.paragrafo, { marginTop: 8 }]}>
          E por estarem justos e acordados, assinam o presente contrato em duas vias de igual
          teor e forma, destinando-se uma via para cada parte.
        </Text>
        {dataContrato && <Text style={styles.paragrafo}>Natal, {dataContrato}.</Text>}

        <View style={styles.assinaturasLinha}>
          <View style={styles.assinaturaCol}>
            {assinaturaContratada ? (
              <Image src={assinaturaContratada} style={styles.assinaturaImg} />
            ) : (
              <View style={{ height: 28 }} />
            )}
            <View style={styles.assinaturaLinhaTopo}>
              <Text style={styles.assinaturaNome}>{MIX_DADOS.razaoSocial}</Text>
              <Text style={styles.assinaturaSub}>CNPJ {MIX_DADOS.cnpj}</Text>
            </View>
          </View>
          <View style={styles.assinaturaCol}>
            <View style={{ height: 28 }} />
            <View style={styles.assinaturaLinhaTopo}>
              <Text style={styles.assinaturaNome}>{contrato.contratante_nome}</Text>
              {contrato.contratante_documento && (
                <Text style={styles.assinaturaSub}>CPF/CNPJ {contrato.contratante_documento}</Text>
              )}
            </View>
          </View>
        </View>
        <Text style={[styles.assinaturaSub, { textAlign: "center", marginTop: 4 }]}>
          Responsável Mix: {nomeSignatario[contrato.signatario]}
        </Text>

        <Rodape />
        <NumeroPagina />
      </Page>
    </Document>
  );
}
