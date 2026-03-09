const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

// ===== DESIGN TOKENS =====
const COLORS = {
  primary: "1B5E7B", accent: "E8F4F8", headerBg: "1B5E7B", headerText: "FFFFFF",
  lightGray: "F5F5F5", darkText: "333333", border: "CCCCCC", muted: "999999",
  red: "C0392B", orange: "E67E22", green: "27AE60", yellow: "F39C12", blue: "2980B9",
};
const FONTS = { main: "Arial" };
const border = { style: BorderStyle.SINGLE, size: 1, color: COLORS.border };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

// ===== HELPERS =====
function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: FONTS.main, size: 32, bold: true, color: COLORS.primary })],
    spacing: { before: 360, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: COLORS.primary, space: 4 } },
  });
}
function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: FONTS.main, size: 26, bold: true, color: COLORS.primary })],
    spacing: { before: 280, after: 160 },
  });
}
function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, font: FONTS.main, size: 22, bold: true, color: COLORS.darkText })],
    spacing: { before: 200, after: 120 },
  });
}
const DEFAULT_RUN = { font: FONTS.main, size: 21, color: COLORS.darkText };
function para(text) {
  const items = typeof text === "string" ? [text] : text;
  const runs = items.map(t =>
    typeof t === "string"
      ? new TextRun({ ...DEFAULT_RUN, text: t })
      : new TextRun({ ...DEFAULT_RUN, ...t })
  );
  return new Paragraph({ children: runs, spacing: { after: 120, line: 276 } });
}
function spacer(pts = 120) {
  return new Paragraph({ spacing: { after: pts }, children: [] });
}
function headerCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: { fill: COLORS.headerBg, type: ShadingType.CLEAR },
    margins: cellMargins, verticalAlign: "center",
    children: [new Paragraph({ children: [new TextRun({ text, font: FONTS.main, size: 20, bold: true, color: COLORS.headerText })] })],
  });
}
function dataCell(text, width, opts = {}) {
  const shade = opts.shade ? { fill: COLORS.lightGray, type: ShadingType.CLEAR } : (opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined);
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA }, shading: shade, margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, font: FONTS.main, size: 20, color: opts.color || COLORS.darkText, bold: opts.bold || false, italics: opts.italics || false })] })],
  });
}
function makeTable(colWidths, headerTexts, dataRows) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({ children: headerTexts.map((h, i) => headerCell(h, colWidths[i])) }),
      ...dataRows.map((row, ri) => new TableRow({
        children: row.map((cell, ci) => {
          const isObj = typeof cell === "object" && cell !== null;
          const text = isObj ? cell.text : cell;
          const extraOpts = isObj ? cell : {};
          return dataCell(text, colWidths[ci], { shade: ri % 2 === 1, ...extraOpts });
        }),
      })),
    ],
  });
}
function highlightBox(label, text, color) {
  return new Paragraph({
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: color, space: 8 } },
    indent: { left: 200 },
    spacing: { after: 140, line: 276 },
    children: [
      new TextRun({ text: label + " ", font: FONTS.main, size: 21, bold: true, color: color }),
      new TextRun({ text, font: FONTS.main, size: 21, color: COLORS.darkText }),
    ],
  });
}

// ===== CONTEUDO DO DOCUMENTO =====
const children = [];

// ---------- CAPA ----------
children.push(spacer(600));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 100 },
  children: [new TextRun({ text: "ESCOPO TECNICO FUNCIONAL", font: FONTS.main, size: 36, bold: true, color: COLORS.primary })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 400 },
  children: [new TextRun({ text: "Modulo Controle Fiscal — PIS/COFINS", font: FONTS.main, size: 28, color: COLORS.primary })],
}));
children.push(spacer(200));
children.push(makeTable(
  [2800, 6560],
  ["Campo", "Valor"],
  [
    ["Projeto", "Maelly Arte — Plataforma Analytics"],
    ["Modulo", "Controle Fiscal (PIS/COFINS)"],
    ["Versao", "v2.3"],
    ["Data", "05/03/2026"],
    ["Elaborado por", "Leandro Moreira, Diogo Moura, Jonatan Barros"],
    ["Status", "Em validacao — Pontos em Aberto pendentes"],
  ]
));
children.push(spacer(200));
children.push(highlightBox("Origem:", "Levantamento comercial Maelly v2 (17/12/2025) + planilha de apuracao PIS/COFINS Jan/2026 + analise critica.", COLORS.blue));
children.push(highlightBox("v2.1:", "Incorpora regime tributario (Lucro Real), estrutura por CFOP e Natureza, campos manuais e integracao Sankhya.", COLORS.green));
children.push(highlightBox("v2.2:", "Detalha origem dos campos (Sankhya vs. manual), referencia tabela TGFCAB, define ICMS como campo manual nas entradas.", COLORS.green));
children.push(highlightBox("v2.3:", "Naturezas confirmadas (lista completa, origem TGFNAT). CFOP nao se aplica a servicos. ICMS manual inicialmente, automacao futura. Ajuste Uniar = pontual.", COLORS.green));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 1. OBJETIVO ----------
children.push(heading1("1. Objetivo"));
children.push(para(
  "Este documento especifica os requisitos funcionais do modulo de Controle Fiscal (PIS/COFINS) " +
  "da plataforma Analytics para o cliente Maelly Arte (CNPJ 27.419.126/0001-51). O modulo tem como " +
  "finalidade substituir o controle fiscal atualmente realizado em planilhas Excel, oferecendo maior " +
  "rastreabilidade, seguranca e automacao na apuracao de PIS e COFINS."
));
children.push(para(
  "O escopo abrange: integracao com o ERP Sankhya para obtencao de dados de notas fiscais (tabela TGFCAB), " +
  "registro de entradas (compras) classificadas por CFOP, registro de servicos tomados classificados " +
  "por Natureza, campos de entrada manual para dados provenientes da contabilidade e ajustes fiscais " +
  "(ICMS, fretes, receita financeira), calculo automatizado de creditos e debitos, consolidacao da " +
  "apuracao mensal e disponibilizacao de relatorios e dashboards gerenciais."
));
children.push(para(
  "A empresa opera no regime de Lucro Real (nao-cumulativo), com aliquotas de PIS a 1,65% e COFINS " +
  "a 7,60% sobre a receita bruta, com direito a aproveitamento de creditos sobre entradas e servicos tomados."
));

// ---------- 2. ATORES E PERSONAS ----------
children.push(heading1("2. Atores e Personas"));
children.push(makeTable(
  [2000, 2500, 4860],
  ["Persona", "Responsabilidade", "Interacao com o Sistema"],
  [
    ["Analista Fiscal", "Executa a operacao fiscal diaria", "Importa dados do Sankhya, digita campos manuais (ICMS, fretes, receita financeira), executa apuracao, gera relatorios"],
    ["Coordenador Fiscal", "Supervisiona e valida a apuracao", "Revisa consolidados, valida apuracao antes do fechamento, audita lancamentos, reabre periodos"],
    ["Contabilidade", "Fornece dados complementares", "Informa valores de receita financeira, depreciacoes e demais dados contabeis para campos manuais"],
    ["Gestor Financeiro", "Consome informacoes gerenciais", "Acessa dashboards de evolucao tributaria e impacto fiscal"],
    ["Consultor de Implantacao", "Configura e parametriza o modulo", "Define parametros, configura integracao Sankhya (queries TGFCAB), treina usuarios"],
  ]
));

// ---------- 3. PRE-CONDICOES ----------
children.push(heading1("3. Pre-Condicoes"));
children.push(makeTable(
  [900, 6460, 2000],
  ["ID", "Descricao", "Tipo"],
  [
    ["PC-01", "Plataforma Analytics instalada e operacional", "Obrigatoria"],
    ["PC-02", "ERP Sankhya operacional com tabela TGFCAB (cabecalho de NF) acessivel para consulta", "Obrigatoria"],
    ["PC-03", "Queries de consulta ao Sankhya disponibilizadas pelo cliente (campo NUMNOTA da TGFCAB e demais campos necessarios)", "Obrigatoria"],
    ["PC-04", "Cadastro de itens no Sankhya com CFOP e grupo de produto preenchidos", "Obrigatoria"],
    ["PC-05", "Tabela de Naturezas de servico definida e validada (18 categorias identificadas na planilha)", "Obrigatoria"],
    ["PC-06", "Perfis de acesso definidos (Fiscal vs. Gerencial)", "Desejavel"],
    ["PC-07", "Historico de apuracoes anteriores disponivel para carga inicial (creditos acumulados)", "Desejavel"],
  ]
));

// ---------- 4. GLOSSARIO ----------
children.push(heading1("4. Glossario"));
children.push(makeTable(
  [2800, 6560],
  ["Termo", "Definicao"],
  [
    ["PIS", "Programa de Integracao Social — contribuicao federal incidente sobre a receita bruta (1,65% no regime nao-cumulativo)"],
    ["COFINS", "Contribuicao para o Financiamento da Seguridade Social — contribuicao federal sobre a receita bruta (7,60% no regime nao-cumulativo)"],
    ["Regime Nao-Cumulativo", "Regime aplicavel a empresas do Lucro Real em que PIS (1,65%) e COFINS (7,60%) incidem sobre a receita, permitindo creditos sobre entradas e servicos tomados"],
    ["CFOP", "Codigo Fiscal de Operacoes e Prestacoes — codigo de 4 digitos que identifica a natureza da operacao. Usado para classificar entradas (ex.: 1128, 1253, 1303)"],
    ["Natureza (do servico)", "Classificacao funcional dos servicos tomados, originada da tabela TGFNAT do Sankhya. Exemplos: Comissao de Agencia, Instalacao Terceirizada, Servicos de Impressao. CFOP nao se aplica a servicos tomados"],
    ["TGFNAT", "Tabela de cadastro de naturezas no ERP Sankhya. Contem as classificacoes de servicos tomados utilizadas no modulo fiscal"],
    ["TGFCAB", "Tabela de cabecalho de notas fiscais no ERP Sankhya. Campo NUMNOTA contem o numero da NF utilizado como chave de integracao"],
    ["NUMNOTA", "Campo da tabela TGFCAB do Sankhya que contem o numero unico da nota fiscal — chave principal de integracao"],
    ["Base de Calculo", "Valor sobre o qual a aliquota e aplicada. Nas entradas: Valor NF - ICMS (digitado manualmente). Nos servicos tomados: valor integral da NF"],
    ["Credito Fiscal", "Valor de PIS/COFINS apurado sobre entradas e servicos que pode ser abatido dos debitos na apuracao"],
    ["Debito Fiscal", "Valor de PIS/COFINS apurado sobre a receita bruta de vendas/prestacao de servicos"],
    ["Apuracao", "Consolidacao mensal de debitos e creditos para determinar saldo a recolher ou credito acumulado"],
    ["Credito do Periodo Anterior", "Saldo credor de PIS ou COFINS nao utilizado em periodos anteriores, transportado para compensacao no periodo atual"],
    ["Receita Financeira", "Receita de aplicacoes financeiras, juros ativos e descontos obtidos. Aliquotas diferenciadas: PIS 0,65% e COFINS 4,00%"],
    ["Demais Documentos", "Creditos originados de alugueis PJ, locacoes de veiculos, locacoes de maquinas e depreciacoes"],
    ["Entrada Bonificacao", "Entrada de mercadoria recebida sem custo (CFOPs 1910/2910), nao gera credito fiscal"],
    ["Campo Manual", "Campo cujo valor e digitado pelo usuario (Analista Fiscal ou Contabilidade), nao obtido automaticamente do Sankhya"],
  ]
));

// ---------- 5. REGRAS DE NEGOCIO ----------
children.push(heading1("5. Regras de Negocio"));

// ===== REGIME =====
children.push(heading2("RN-01 — Regime Tributario: Lucro Real (Nao-Cumulativo)"));
children.push(para(
  "A Maelly opera no regime de Lucro Real, enquadrada no regime nao-cumulativo de PIS e COFINS."
));
children.push(para([{ text: "PIS: 1,65%  |  COFINS: 7,60%", bold: true }]));
children.push(para(
  "O regime permite aproveitamento de creditos sobre entradas (compras) e servicos tomados, " +
  "que sao abatidos dos debitos apurados sobre a receita bruta."
));

// ===== DEBITOS =====
children.push(heading2("RN-02 — Calculo de Debitos sobre a Receita Bruta"));
children.push(para(
  "Os debitos de PIS e COFINS sao calculados sobre a base de calculo da receita bruta do periodo."
));
children.push(para([
  { text: "Formula: ", bold: true },
  { text: "Debito PIS = Base Debito x 1,65%  |  Debito COFINS = Base Debito x 7,60%" },
]));
children.push(para([
  { text: "Exemplo (Jan/2026): ", bold: true },
  { text: "Base = R$ 1.570.959,27. Debito PIS = R$ 25.920,83. Debito COFINS = R$ 119.392,90." },
]));

children.push(heading2("RN-03 — Composicao da Base de Calculo dos Debitos"));
children.push(para("A base de calculo dos debitos e composta por:"));
children.push(para([{ text: "(a) Receita de Servicos Prestados: ", bold: true }, { text: "valor total do faturamento no periodo." }]));
children.push(para([{ text: "(b) Servicos adicionais: ", bold: true }, { text: "se houver." }]));
children.push(para([{ text: "(c) ISS calculado: ", bold: true }, { text: "utilizar o valor de ISS calculado (nao o retido). Anotacao: 'pegar o valor de ISS calculado'." }]));
children.push(para([{ text: "(d) Demais Debitos e Entrada Bonificacao (1910/2910): ", bold: true }, { text: "registrados separadamente." }]));

// ===== INTEGRACAO SANKHYA =====
children.push(heading2("RN-04 — Integracao com ERP Sankhya e Origem dos Dados"));
children.push(para(
  "Os dados de notas fiscais sao obtidos via integracao com o ERP Sankhya. " +
  "A chave de integracao e o campo NUMNOTA da tabela TGFCAB. " +
  "As queries de consulta sao de responsabilidade do cliente."
));
children.push(spacer(80));
children.push(para([{ text: "Mapeamento de campos — Aba ENTRADAS (NF-e de compra):", bold: true }]));
children.push(makeTable(
  [2400, 1800, 1800, 3360],
  ["Campo Tela", "Origem", "Ref. Sankhya", "Observacao"],
  [
    ["NRO NOTA", "Sankhya", "NUMNOTA / TGFCAB", "Chave de integracao"],
    ["RAZAO SOCIAL", "Sankhya", "A definir", "Nome do fornecedor"],
    ["DT ENTRADA", "Sankhya", "A definir", "Data de entrada da NF"],
    ["CFOP", "Sankhya", "A definir", "Classifica a natureza da entrada"],
    ["TOTAL NF", "Sankhya", "A definir", "Valor total da nota fiscal"],
    [{ text: "ICMS", bold: true }, { text: "MANUAL", bold: true, color: COLORS.orange }, "—", "Digitado pelo Analista Fiscal. Subtraido da base manualmente"],
    ["BASE PIS/COFINS", "Calculado", "—", "= TOTAL NF - ICMS (quando informado)"],
    ["VLR PIS", "Calculado", "—", "= BASE x 1,65%"],
    ["VLR COFINS", "Calculado", "—", "= BASE x 7,60%"],
  ]
));
children.push(spacer(80));
children.push(para([{ text: "Mapeamento de campos — Aba TOMADOS (Servicos Tomados):", bold: true }]));
children.push(makeTable(
  [2400, 1800, 1800, 3360],
  ["Campo Tela", "Origem", "Ref. Sankhya", "Observacao"],
  [
    ["CLASSIFICACOES (Natureza)", "Sankhya", "TGFNAT", "Cadastro de naturezas do Sankhya. 18 categorias definidas (lista completa e final)"],
    ["NRO NOTA", "Sankhya", "NUMNOTA / TGFCAB", "Chave de integracao"],
    ["RAZAO SOCIAL", "Sankhya", "A definir", "Nome do prestador de servico"],
    ["DATA ENT/SAIDA", "Sankhya", "A definir", "Data do lancamento"],
    ["CFOP", "Nao se aplica", "—", "CFOP nao e utilizado para classificar servicos tomados. O campo existe mas nao e relevante"],
    ["BASE PIS/COFINS", "Sankhya", "A definir", "Valor integral da NF do servico"],
    ["VLR PIS", "Calculado", "—", "= BASE x 1,65%"],
    ["VLR COFINS", "Calculado", "—", "= BASE x 7,60%"],
  ]
));
children.push(spacer(80));
children.push(para([{ text: "Campos manuais — Aba Resumo (01.2026):", bold: true }]));
children.push(makeTable(
  [3000, 2160, 4200],
  ["Campo", "Responsavel", "Observacao"],
  [
    ["ICMS nas entradas", "Analista Fiscal", "Digitado manualmente para cada NF de entrada. Subtraido do valor total para compor a base de PIS/COFINS"],
    ["Fretes (CFOP 1353/2353)", "Analista Fiscal", "Unica informacao necessaria de entrada manual conforme anotacao da planilha"],
    ["Receita Financeira", "Contabilidade", "Rendimentos de aplicacao, juros ativos, descontos obtidos. 'A contabilidade quem manda'"],
    ["Depreciacao", "Contabilidade", "Valor da depreciacao do ativo imobilizado para creditamento"],
    ["Credito Periodo Anterior (PIS)", "Analista Fiscal", "Saldo credor transportado do periodo anterior (automatico apos 1o periodo)"],
    ["Credito Periodo Anterior (COFINS)", "Analista Fiscal", "Saldo credor transportado do periodo anterior (automatico apos 1o periodo)"],
    ["PIS Retido NF", "Analista Fiscal", "Valor de PIS retido na fonte sobre NFs de saida"],
    ["COFINS Retido NF", "Analista Fiscal", "Valor de COFINS retido na fonte sobre NFs de saida"],
  ]
));
children.push(highlightBox("Definido v2.2:", "Origem de cada campo mapeada (Sankhya vs. Manual vs. Calculado). ICMS confirmado como campo manual nas entradas.", COLORS.green));

// ===== CREDITOS ENTRADAS =====
children.push(heading2("RN-05 — Creditos sobre Entradas (Compras)"));
children.push(para(
  "Os creditos de PIS/COFINS sobre entradas sao calculados a partir dos dados de NF-e integrados do Sankhya, " +
  "complementados pelo valor de ICMS digitado manualmente pelo Analista Fiscal. " +
  "As entradas sao classificadas por CFOP."
));
children.push(para([
  { text: "Base de Calculo = Valor Total NF - ICMS (digitado manualmente)", bold: true },
]));
children.push(para("Quando nao houver ICMS a subtrair, a base e o valor integral da NF."));
children.push(spacer(80));
children.push(para([{ text: "CFOPs de entrada identificados:", bold: true }]));
children.push(makeTable(
  [1200, 1200, 6960],
  ["CFOP", "CFOP (Inter)", "Descricao / Categoria"],
  [
    ["1128", "2128", "Material para prestacao de servicos"],
    ["1253", "—", "EDP - Energia eletrica"],
    ["1303", "2303", "Telefonia / Comunicacao"],
    ["1353", "2353", "Frete sobre material e instalacao de paineis (MANUAL)"],
    ["1551", "2551", "Imobilizado"],
    ["1556", "—", "Aquisicao de material de informatica"],
    ["1910", "2910", "Entrada bonificacao (NAO gera credito)"],
  ]
));
children.push(para([
  { text: "Exemplo (Jan/2026): ", bold: true },
  { text: "NF 33581 (Tinbol Tintas, CFOP 1128): Valor NF = R$ 4.049,10, ICMS digitado = R$ 85,49. " +
    "Base = R$ 4.049,10 - R$ 85,49 = R$ 3.963,61. PIS = R$ 65,40. COFINS = R$ 301,23." },
]));
children.push(para([
  { text: "Total entradas Jan/2026: ", bold: true },
  { text: "Base = R$ 24.559,44. Credito PIS = R$ 405,23. Credito COFINS = R$ 1.866,52." },
]));

// ===== CREDITOS SERVICOS TOMADOS =====
children.push(heading2("RN-06 — Creditos sobre Servicos Tomados"));
children.push(para(
  "Os servicos tomados sao classificados por Natureza, obtida da tabela TGFNAT do cadastro de naturezas do Sankhya. " +
  "CFOP nao se aplica para classificacao de servicos tomados. " +
  "Cada servico gera credito sobre o valor integral da NF."
));
children.push(para([
  { text: "Formula: ", bold: true },
  { text: "Credito PIS = Base x 1,65%  |  Credito COFINS = Base x 7,60%" },
]));
children.push(spacer(80));
children.push(para([{ text: "Naturezas de servicos tomados — lista completa e final (18 categorias, origem: tabela TGFNAT do Sankhya):", bold: true }]));
children.push(makeTable(
  [600, 5360, 3400],
  ["#", "Natureza", "Exemplo Jan/2026"],
  [
    ["1", "Comissao de Agencia", "R$ 94.002,46"],
    ["2", "Servicos de Impressao", "R$ 14.760,00"],
    ["3", "Instalacao Terceirizada", "R$ 44.203,45"],
    ["4", "Servicos de Reparo / Manutencao", "R$ 16.022,15"],
    ["5", "Veiculacao Terceirizada", "R$ 16.260,00"],
    ["6", "Locacao de Maquinas e Equipamentos - NF Deb.", "R$ 2.354,45"],
    ["7", "Locacao Veiculos", "R$ 9.642,00"],
    ["8", "Servicos de Informatica", "R$ 6.333,48"],
    ["9", "Servico de Movimentacao e Transporte", "R$ 750,00"],
    ["10", "Despesas com Veiculos", "R$ 624,10"],
    ["11", "Dados (Internet/Comunicacao)", "—"],
    ["12", "Servicos de Marketing", "—"],
    ["13", "Instalacoes de Paineis", "—"],
    ["14", "Servicos de Terceiros", "—"],
    ["15", "Projeto Outdoor", "—"],
    ["16", "Locacao Espaco - Shopping Vitoria", "—"],
    ["17", "Locacao Espaco - Rodosol", "—"],
    ["18", "Locacao Espaco - Aeroportos", "—"],
  ]
));
children.push(para([
  { text: "Total servicos Jan/2026: ", bold: true },
  { text: "R$ 192.955,64. Credito PIS = R$ 3.183,77. Credito COFINS = R$ 14.664,63." },
]));
children.push(highlightBox("Ajuste pontual:", "A NF 3210 da Uniar foi ajustada em Jan/2026. Confirmado como caso pontual, nao recorrente. O sistema deve permitir ajustes manuais eventuais em lancamentos (ver FA-10).", COLORS.yellow));

// ===== CREDITOS DEMAIS DOCUMENTOS =====
children.push(heading2("RN-07 — Creditos sobre Demais Documentos"));
children.push(para("Creditos de documentos que nao se enquadram em Entradas nem Servicos Tomados:"));
children.push(makeTable(
  [600, 5360, 3400],
  ["#", "Categoria", "Exemplo Jan/2026"],
  [
    ["1", "Alugueis pagos a Pessoa Juridica", "R$ 82.615,90"],
    ["2", "Locacao Espaco — Concessao Rodosol", "—"],
    ["3", "Locacao Espaco (Shopping e Aeroportos)", "—"],
    ["4", "Locacao de Maquinas e Equipamentos — Nota de debito", "R$ 2.354,45"],
    ["5", "Locacao de Veiculos", "R$ 9.642,00"],
  ]
));
children.push(para([
  { text: "Total Demais Documentos Jan/2026: ", bold: true },
  { text: "R$ 94.612,35." },
]));

// ===== DEPRECIACAO =====
children.push(heading2("RN-08 — Creditos sobre Depreciacao"));
children.push(para(
  "O modulo deve permitir o registro de creditos sobre depreciacao de bens do ativo imobilizado. " +
  "O valor e informado manualmente pela Contabilidade."
));
children.push(para([
  { text: "Formula: ", bold: true },
  { text: "Credito PIS = Valor Depreciacao x 1,65%  |  Credito COFINS = Valor Depreciacao x 7,60%" },
]));

// ===== RECEITA FINANCEIRA =====
children.push(heading2("RN-09 — Receita Financeira (Aliquotas Diferenciadas)"));
children.push(para(
  "A receita financeira possui aliquotas diferenciadas (Decreto 8.426/2015). " +
  "O valor e informado manualmente pela Contabilidade."
));
children.push(para([{ text: "PIS: 0,65%  |  COFINS: 4,00%", bold: true }]));
children.push(para("Componentes: descontos obtidos, juros ativos, juros Selic, rendimentos de aplicacao."));
children.push(para([
  { text: "Exemplo (Jan/2026): ", bold: true },
  { text: "Receita Financeira = R$ 17.304,00 (rendimento de aplicacao). " +
    "PIS = R$ 112,48. COFINS = R$ 692,16." },
]));

// ===== APURACAO =====
children.push(heading2("RN-10 — Apuracao Consolidada do Periodo"));
children.push(para("A apuracao mensal consolida todos os componentes:"));
children.push(para([{ text: "Saldo PIS = Debito PIS + PIS Rec.Financeira - Credito Entradas PIS - Credito Servicos PIS - Credito Demais Docs PIS - Credito Depreciacao PIS - Credito Periodo Anterior PIS - PIS Retido NF", bold: true }]));
children.push(para([{ text: "Saldo COFINS = Debito COFINS + COFINS Rec.Financeira - Credito Entradas COFINS - Credito Servicos COFINS - Credito Demais Docs COFINS - Credito Depreciacao COFINS - Credito Periodo Anterior COFINS - COFINS Retido NF", bold: true }]));
children.push(para([{ text: "Saldo > 0: ", bold: true }, { text: "valor a recolher." }]));
children.push(para([{ text: "Saldo < 0: ", bold: true }, { text: "credito acumulado, transportado para o proximo periodo." }]));
children.push(para([
  { text: "Exemplo (Jan/2026): ", bold: true },
  { text: "Saldo PIS = -R$ 20.770,73 (credito). Saldo COFINS = -R$ 95.671,22 (credito). Total = -R$ 116.441,95." },
]));

// ===== CREDITO PERIODO ANTERIOR =====
children.push(heading2("RN-11 — Credito do Periodo Anterior"));
children.push(para(
  "Saldo credor e transportado automaticamente para o proximo periodo. " +
  "Na carga inicial (go-live), o valor acumulado deve ser informado manualmente."
));

// ===== PIS/COFINS RETIDOS =====
children.push(heading2("RN-12 — PIS e COFINS Retidos na Fonte"));
children.push(para(
  "Valores retidos na fonte sobre NFs de saida devem ser deduzidos do saldo a recolher. " +
  "Campos de entrada manual: 'PIS Retido NF' e 'COFINS Retido NF'."
));

// ===== ICMS MANUAL =====
children.push(heading2("RN-13 — ICMS como Campo Manual nas Entradas (com previsao de automacao futura)"));
children.push(para(
  "Inicialmente, o valor do ICMS nas entradas e digitado manualmente pelo Analista Fiscal para cada NF de compra. " +
  "O sistema nao obtem o ICMS automaticamente do Sankhya nesta fase. O Analista consulta a NF e informa o valor " +
  "de ICMS a ser subtraido da base de calculo de PIS/COFINS."
));
children.push(para([
  { text: "Evolucao futura: ", bold: true },
  { text: "em fase posterior, o campo ICMS podera ser automatizado via integracao com o Sankhya, " +
    "eliminando a necessidade de digitacao manual. O sistema deve ser construido de forma que essa " +
    "transicao seja possivel sem impacto na formula de calculo." },
]));
children.push(para([
  { text: "Comportamento: ", bold: true },
  { text: "Campo ICMS exibido ao lado de cada NF de entrada. Quando preenchido, a base e recalculada: " +
    "Base = Total NF - ICMS. Quando vazio (ou zero), a base e o valor integral da NF." },
]));
children.push(para([
  { text: "Exemplo: ", bold: true },
  { text: "NF 103520 (Porto Nautico, CFOP 1128): Total NF = R$ 1.471,50, ICMS digitado = R$ 317,30. " +
    "Base = R$ 1.154,20. PIS = R$ 19,04. COFINS = R$ 87,72." },
]));
children.push(highlightBox("Definido v2.2:", "ICMS confirmado como campo manual (nao vem do Sankhya). O Analista digita o valor para cada entrada.", COLORS.green));

// ===== PERIODO =====
children.push(heading2("RN-14 — Periodo de Apuracao Mensal"));
children.push(para(
  "Apuracao sempre mensal (mes-calendario). Periodos fechados nao aceitam alteracoes sem reabertura pelo Coordenador."
));

// ===== IMOBILIZADO =====
children.push(heading2("RN-15 — Credito sobre Imobilizado (CFOP 1551/2551)"));
children.push(para(
  "Entradas de ativo imobilizado geram credito de PIS/COFINS. Na planilha, os valores de credito " +
  "sugerem calculo sobre 1/48 avos (creditamento em 48 meses conforme legislacao)."
));
children.push(highlightBox("Pendente:", "Confirmar se o creditamento e em 48 parcelas ou integral. Ver PA-04.", COLORS.orange));

// ===== CONTROLE ACESSOS =====
children.push(heading2("RN-16 — Controle de Acessos"));
children.push(para(
  "Perfil Fiscal: acesso total. Perfil Gerencial: somente dashboards e relatorios consolidados."
));

// ---------- 6. FLUXO PRINCIPAL ----------
children.push(heading1("6. Fluxo Principal (Caminho Feliz)"));
children.push(makeTable(
  [900, 8460],
  ["Passo", "Descricao"],
  [
    ["1", "O Analista Fiscal acessa o modulo Controle Fiscal e seleciona o periodo (mes/ano)"],
    ["2", "O sistema carrega automaticamente os dados de NF-e do Sankhya (TGFCAB) para o periodo: entradas por CFOP e servicos tomados por Natureza"],
    ["3", "O Analista Fiscal confere os dados importados e verifica se todas as NFs esperadas estao presentes"],
    ["4", "Para cada NF de entrada, o Analista Fiscal digita o valor de ICMS a ser subtraido da base (campo manual). O sistema recalcula a base automaticamente"],
    ["5", "O Analista Fiscal digita os valores de fretes (CFOP 1353/2353), se houver lancamentos manuais"],
    ["6", "A Contabilidade informa o valor da Receita Financeira do periodo e o valor de Depreciacao (campos manuais)"],
    ["7", "O Analista Fiscal registra valores de PIS/COFINS retidos na fonte, se houver"],
    ["8", "O sistema exibe a visao consolidada: Servicos Tomados por Natureza (18 categorias), Entradas por CFOP (7 categorias), Demais Documentos (5 categorias)"],
    ["9", "O Analista Fiscal executa a apuracao do periodo"],
    ["10", "O sistema calcula: debitos (RN-02), receita financeira (RN-09), creditos entradas (RN-05), creditos servicos (RN-06), demais docs (RN-07), depreciacao (RN-08), deduz credito anterior (RN-11) e retencoes (RN-12)"],
    ["11", "O sistema exibe resumo: debitos, creditos por categoria, saldo PIS e saldo COFINS"],
    ["12", "O Coordenador Fiscal revisa e valida a apuracao"],
    ["13", "O sistema fecha o periodo, transporta credito acumulado e disponibiliza relatorios/dashboards"],
  ]
));

// ---------- 7. FLUXOS ALTERNATIVOS ----------
children.push(heading1("7. Fluxos Alternativos e Excecoes"));
children.push(makeTable(
  [900, 2600, 5860],
  ["ID", "Cenario", "Comportamento Esperado"],
  [
    ["FA-01", "Dados do Sankhya indisponiveis", "O sistema exibe alerta. O Analista pode importar dados via planilha estruturada como fallback (mesmo layout da planilha atual)."],
    ["FA-02", "NF com CFOP nao mapeado", "Registrada em categoria 'Outros' com alerta. Analista reclassifica antes da apuracao."],
    ["FA-03", "Servico com Natureza nao cadastrada", "Alerta exibido. Servico nao incluido na apuracao ate definicao da Natureza."],
    ["FA-04", "Periodo ja fechado", "Bloqueio de alteracoes. Coordenador deve reabrir."],
    ["FA-05", "Saldo credor (credito acumulado)", "Transportado automaticamente como Credito Periodo Anterior no proximo mes."],
    ["FA-06", "Correcao apos apuracao", "Coordenador reabre, Analista corrige, nova apuracao. Historico preservado."],
    ["FA-07", "Nota de devolucao", "Identificada por CFOP. Estorno automatico de debitos (dev. venda) ou creditos (dev. compra)."],
    ["FA-08", "Retencao na fonte", "Campos manuais para PIS/COFINS retidos. Deduzidos do saldo."],
    ["FA-09", "Primeiro periodo (go-live)", "Analista informa manualmente Credito Periodo Anterior acumulado."],
    ["FA-10", "Ajuste manual em NF especifica", "O sistema permite ajustar valor de um lancamento (ex.: diminuir NF 3210 da Uniar). Ajuste registrado com justificativa."],
    ["FA-11", "Analista nao preenche ICMS", "Sistema assume ICMS = 0 e usa valor integral da NF como base. Alerta visual no campo."],
  ]
));

// ---------- 8. CRITERIOS DE ACEITE ----------
children.push(heading1("8. Criterios de Aceite"));
children.push(makeTable(
  [900, 8460],
  ["ID", "Criterio"],
  [
    ["CA-01", "O sistema deve integrar NF-e do Sankhya (TGFCAB/NUMNOTA) e exibir entradas por CFOP e servicos por Natureza"],
    ["CA-02", "O campo ICMS nas entradas deve ser editavel (manual). Ao preencher, a base deve recalcular automaticamente: Base = Total NF - ICMS"],
    ["CA-03", "O calculo de debitos deve aplicar 1,65% (PIS) e 7,60% (COFINS) sobre a base de receita bruta"],
    ["CA-04", "Os creditos sobre entradas devem usar Base = Total NF - ICMS (manual) e aplicar 1,65% / 7,60%"],
    ["CA-05", "Os creditos sobre servicos tomados devem usar o valor integral da NF (sem subtracao de ICMS)"],
    ["CA-06", "As 18 Naturezas de servicos devem estar cadastradas e visíveis na consolidacao"],
    ["CA-07", "A Receita Financeira deve usar aliquotas diferenciadas: PIS 0,65% e COFINS 4,00%"],
    ["CA-08", "Campos manuais: ICMS, fretes, receita financeira, depreciacao, credito anterior, retencoes"],
    ["CA-09", "Entradas com CFOP 1910/2910 (bonificacao) nao devem gerar credito fiscal"],
    ["CA-10", "Formula de apuracao: Saldo = Debitos + Rec.Financeira - Creditos(Entradas+Servicos+Demais+Depreciacao) - Credito Anterior - Retencoes"],
    ["CA-11", "Saldo credor deve ser transportado automaticamente para o proximo periodo"],
    ["CA-12", "Periodos fechados: bloqueio de alteracoes sem reabertura pelo Coordenador"],
    ["CA-13", "Historico de apuracoes preservado (versoes anteriores consultaveis)"],
    ["CA-14", "Dashboards: evolucao mensal debitos/creditos/saldo, composicao por Natureza, detalhamento por CFOP"],
    ["CA-15", "Perfil Gerencial sem acesso a importacao, digitacao ou alteracao"],
    ["CA-16", "Validacao: valores Jan/2026 devem conferir com planilha de referencia (Debito PIS R$ 25.920,83, Saldo PIS -R$ 20.770,73, Saldo COFINS -R$ 95.671,22)"],
    ["CA-17", "O sistema deve permitir ajuste manual em lancamentos com registro de justificativa"],
  ]
));

// ---------- 9. PONTOS EM ABERTO ----------
children.push(heading1("9. Pontos em Aberto"));
children.push(highlightBox("Resolvidos v2.1-v2.3:", "Regime tributario (Lucro Real), servicos por Natureza (TGFNAT, lista final de 18), CFOP nao se aplica a servicos, integracao Sankhya (TGFCAB), ICMS manual (automacao futura), ajuste Uniar (pontual).", COLORS.green));
children.push(makeTable(
  [900, 2600, 5860],
  ["ID", "Ponto", "Questao"],
  [
    ["PA-01", "Exclusao ICMS nas saidas", "A exclusao do ICMS da base de PIS/COFINS (STF RE 574.706) se aplica aos debitos sobre vendas? O cliente ja aplica?"],
    ["PA-02", "Locacoes duplicadas", "'Locacao Maquinas' e 'Locacao Veiculos' aparecem em Servicos Tomados e Demais Documentos. Sao lancamentos distintos ou duplicados?"],
    ["PA-03", "PIS/COFINS retidos na fonte", "Como a retencao chega ao sistema? Manual? Quais notas possuem retencao?"],
    ["PA-04", "Creditamento de imobilizado", "O credito sobre ativo imobilizado (1551/2551) e em 48 parcelas ou integral?"],
    ["PA-05", "Frequencia de sincronizacao Sankhya", "Tempo real, diaria ou sob demanda?"],
    ["PA-06", "Dashboards e KPIs", "Quais indicadores sao prioritarios nos dashboards gerenciais?"],
    ["PA-07", "Integracao com modulo Estoque", "O Fiscal deve cruzar dados com Estoque? Quais visoes integradas?"],
    ["PA-08", "Regra geral de ajuste em NFs", "O ajuste da NF 3210 (Uniar) e caso unico ou existe um padrao de ajustes? Deve haver tela para gerenciar ajustes?"],
    ["PA-09", "Campos Sankhya complementares", "Quais tabelas/campos do Sankhya alem de TGFCAB serao usados? (TGFITE para itens? TGFPAR para parceiros?) Queries ja existem?"],
    ["PA-10", "Telefonia e ICMS", "Notas de telefonia (1303/2303) tem ICMS destacado? A planilha mostra 'R$ 6.310,61 — ICMS' ao lado. Confirmar tratamento."],
  ]
));

// ===== MONTAR DOCUMENTO =====
const doc = new Document({
  styles: {
    default: { document: { run: { font: FONTS.main, size: 21 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: FONTS.main, color: COLORS.primary },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: FONTS.main, color: COLORS.primary },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: FONTS.main, color: COLORS.darkText },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.primary, space: 4 } },
          children: [
            new TextRun({ text: "Controle Fiscal — PIS/COFINS", font: FONTS.main, size: 16, color: COLORS.primary, italics: true }),
            new TextRun({ text: "\tv2.3", font: FONTS.main, size: 16, color: COLORS.muted }),
          ],
          tabStops: [{ type: "right", position: 9360 }],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Pagina ", font: FONTS.main, size: 16, color: COLORS.muted }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONTS.main, size: 16, color: COLORS.muted }),
          ],
        })],
      }),
    },
    children,
  }],
});

const outputPath = path.join(__dirname, "Escopo_Tecnico_Maelly_ControleFiscal_v2.3.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Documento criado: " + outputPath);
});
