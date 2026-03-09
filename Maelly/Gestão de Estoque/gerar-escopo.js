const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

// ===== DESIGN TOKENS — Identidade Visual Maely =====
const COLORS = {
  primary: "011736",      // Azul marinho Maely
  secondary: "004BB7",    // Azul royal Maely
  accent: "FFCF03",       // Amarelo Maely (CTA)
  cyan: "00D2E8",         // Ciano Maely (accent)
  headerBg: "011736",     // Fundo header tabelas
  headerText: "FFFFFF",   // Texto header tabelas
  lightGray: "F2F5F7",    // Fundo alternado (cinza Maely)
  darkText: "3A4F66",     // Texto corpo (cinza escuro Maely)
  border: "E1E8ED",       // Bordas (cinza médio Maely)
  muted: "8A9BB0",        // Texto secundário
  red: "C0392B",
  orange: "FF9700",       // Laranja Maely
  green: "27AE60",
  yellow: "FFCF03",       // Amarelo Maely
};
const FONTS = { main: "Inter" };
const border = { style: BorderStyle.SINGLE, size: 1, color: COLORS.border };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

// ===== HELPERS =====
function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: FONTS.main, size: 32, bold: true, color: COLORS.primary })],
    spacing: { before: 360, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: COLORS.secondary, space: 4 } },
  });
}
function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: FONTS.main, size: 26, bold: true, color: COLORS.secondary })],
    spacing: { before: 280, after: 160 },
  });
}
function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, font: FONTS.main, size: 22, bold: true, color: COLORS.primary })],
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

// ============================================================
// CONTEÚDO DO ESCOPO
// ============================================================
const children = [];

// ==================== 1. CAPA ====================
children.push(spacer(500));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 80 },
  children: [new TextRun({ text: "MAELLY", font: FONTS.main, size: 56, bold: true, color: COLORS.primary })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 60 },
  children: [new TextRun({ text: "Escopo Técnico Funcional", font: FONTS.main, size: 40, color: COLORS.secondary })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 300 },
  children: [new TextRun({ text: "Gestão de Estoque", font: FONTS.main, size: 36, bold: true, color: COLORS.primary })],
}));
children.push(spacer(100));
children.push(makeTable(
  [2800, 6560],
  ["Campo", "Valor"],
  [
    ["Projeto", "Maelly — Analytics (Sankhya)"],
    ["Módulo", "Gestão de Estoque"],
    ["Versão", "v2.0"],
    ["Data", "05/03/2026"],
    ["Elaborado por", "Leandro Moreira, Diogo Moura, Jonatan Barros"],
    ["Cliente", "Conto de Fidelidade do Brasil Ltda — CNPJ 35.515.223/0001-76"],
    ["Status", "Em validação — contém Pontos em Aberto"],
  ]
));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ==================== 2. OBJETIVO ====================
children.push(heading1("1. Objetivo"));
children.push(para(
  "Este documento especifica os requisitos funcionais do módulo de Gestão de Estoque da plataforma Analytics para o cliente Maelly " +
  "(Conto de Fidelidade do Brasil Ltda). O módulo substitui os controles realizados em planilhas Excel, oferecendo uma solução centralizada " +
  "para acompanhamento de saldos, movimentações, custos, contagem física, análise de vendas e conciliação financeira."
));
children.push(para(
  "Os dados são consumidos diretamente do ERP Sankhya, maximizando o uso das informações disponíveis na base de dados. " +
  "As tabelas de origem incluem TGFCAB (cabeçalho de notas), TGFITE (itens de nota), TGFPRO (produtos), TGFPAR (parceiros), " +
  "TGFFIN (financeiro) e TGFMBC (movimentação bancária). Não há importação manual de planilhas — a integração com o Sankhya é a fonte primária."
));
children.push(para(
  "O módulo Fiscal (PIS/COFINS), embora mencionado no levantamento comercial, será tratado em documento de escopo separado."
));

// ==================== 3. ATORES E PERSONAS ====================
children.push(heading1("2. Atores e Personas"));
children.push(makeTable(
  [2000, 2500, 4860],
  ["Persona", "Responsabilidade", "Interação com o Sistema"],
  [
    ["Analista de Estoque", "Operação diária de controle de saldos, movimentações e contagens", "Consulta saldos e movimentações do Sankhya, registra contagens físicas, acompanha divergências, analisa dashboards"],
    ["Coordenador de Estoque", "Supervisão, aprovação de ajustes e análise gerencial", "Aprova ajustes de inventário, analisa curva ABC e margens, valida divergências, monitora acuracidade"],
    ["Analista Comercial", "Acompanhamento de vendas e preços", "Consulta relatórios de vendas, analisa descontos e margens, acompanha lançamentos e desempenho de novos produtos"],
    ["Analista Financeiro", "Conciliação de vendas com extrato bancário", "Cruza vendas com entradas no extrato via TGFFIN/TGFMBC, identifica divergências de taxas e prazos"],
    ["Administrador do Sistema", "Configuração e manutenção", "Configura mapeamento de TOPs, gerencia integração Sankhya, controla permissões"],
  ]
));

// ==================== 4. PRÉ-CONDIÇÕES ====================
children.push(heading1("3. Pré-Condições"));
children.push(makeTable(
  [900, 6460, 2000],
  ["ID", "Descrição", "Tipo"],
  [
    ["PC-01", "Acesso de leitura à base Oracle do Sankhya (tabelas TGFCAB, TGFITE, TGFPRO, TGFPAR, TGFGRU, TGFFIN, TGFMBC, TSIBCO, TSICTA, TGFNAT, TSICUS, TGFTIT)", "Obrigatória"],
    ["PC-02", "Cadastro de produtos (TGFPRO) com CODPROD, DESCRPROD, unidade, NCM e grupo (CODGRUPOPROD = 10101)", "Obrigatória"],
    ["PC-03", "TOPs mapeadas no Sankhya: 1199 (Venda), 1200 (Doação), 1202 (Devolução), 1401 (Compras)", "Obrigatória"],
    ["PC-04", "Campo ATUALESTOQUE na TGFITE preenchido (-1 = saída, demais = entrada)", "Obrigatória"],
    ["PC-05", "TGFFIN com campo HISTORICO contendo bandeira e modalidade para conciliação", "Obrigatória"],
    ["PC-06", "Conexão estável entre Analytics e banco Oracle do Sankhya", "Obrigatória"],
    ["PC-07", "Perfis de acesso por área definidos na plataforma Analytics", "Obrigatória"],
  ]
));

// ==================== 5. GLOSSÁRIO ====================
children.push(heading1("4. Glossário"));
children.push(makeTable(
  [2800, 6560],
  ["Termo", "Definição"],
  [
    ["TOP (Tipo de Operação)", "Código do Sankhya (CODTIPOPER): 1199=Venda, 1200=Doação, 1202=Devolução a fornecedor, 1401=Compras."],
    ["NUNOTA", "Identificador único de cada nota no Sankhya (TGFCAB). Diferente do NUMNOTA (número fiscal)."],
    ["ATUALESTOQUE", "Campo da TGFITE: -1 = saída (reduz saldo), outros = entrada (aumenta saldo)."],
    ["Sankhya", "ERP do cliente. Banco Oracle com tabelas TGF*/TSI*."],
    ["TGFCAB / TGFITE / TGFPRO", "Cabeçalho de notas, Itens de nota e Cadastro de produtos do Sankhya."],
    ["TGFFIN / TGFMBC", "Financeiro (títulos, baixas, históricos) e Movimentação Bancária (lançamentos, saldos)."],
    ["Saldo em Estoque", "Quantidade disponível = Σ Entradas — Σ Saídas, com base no ATUALESTOQUE."],
    ["Contagem Física", "Inventário: qtd. real vs saldo sistema. Gera acuracidade e desvio."],
    ["Acuracidade", "Indicador: 1 - |Divergência| ÷ Saldo Sistema. Próximo a 100% = alta confiabilidade."],
    ["Curva ABC", "Pareto sobre valor de vendas: A = ~80%, B = ~15%, C = ~5%."],
    ["Custo Médio Ponderado", "(Qtd Anterior × Custo Anterior + Qtd Entrada × Custo Entrada) ÷ (Qtd Anterior + Qtd Entrada)."],
    ["Alíquota SN", "Simples Nacional 4% (0,04). Tributos = VLRTOT × 0,04."],
    ["Parceiro (TGFPAR)", "Cliente ou fornecedor no Sankhya. Ex.: '3433 - CONSUMIDOR FINAL'."],
    ["Conciliação Financeira", "Cruzamento vendas (TGFCAB/TGFITE) vs recebimentos (TGFFIN/TGFMBC)."],
    ["Registro de Inventário", "Documento fiscal mensal: NCM, descrição, unidade, quantidade, valores."],
    ["CODGRUPOPROD", "Grupo de produto no Sankhya. 10101 = produtos para venda."],
  ]
));

// ==================== 6. REGRAS DE NEGÓCIO ====================
children.push(heading1("5. Regras de Negócio"));

// RN-01
children.push(heading2("RN-01 — Classificação de Movimentações por TOP"));
children.push(para(
  "Toda movimentação é classificada pelo CODTIPOPER e pelo campo ATUALESTOQUE da TGFITE. " +
  "O ATUALESTOQUE é a referência definitiva para entrada ou saída."
));
children.push(makeTable(
  [1200, 2000, 1800, 1800, 2560],
  ["CODTIPOPER", "Descrição", "ATUALESTOQUE", "Classificação", "Efeito"],
  [
    ["1199", "Venda", "-1", "Saída", "Reduz saldo"],
    ["1200", "Doação", "-1", "Saída", "Reduz saldo"],
    ["1202", "Devolução (a fornecedor)", "-1", "Saída", "Reduz saldo"],
    ["1401", "Compras", "(outro)", "Entrada", "Aumenta saldo"],
  ]
));
children.push(highlightBox("Importante:", "TOPs 1123, 1203, 1462, 1792 citadas em reuniões anteriores diferem das encontradas nas queries do Sankhya. Este escopo adota as TOPs das queries SQL. Confirmar se ambos os conjuntos existem — ver PA-01.", COLORS.orange));

// RN-02
children.push(heading2("RN-02 — Tipos de Movimentação"));
children.push(makeTable(
  [2500, 2000, 4860],
  ["Tipo", "Classificação", "Descrição"],
  [
    ["Venda (TOP 1199)", "Saída", "Venda ao consumidor. Reduz saldo."],
    ["Compras (TOP 1401)", "Entrada", "Aquisição de mercadoria. Aumenta saldo."],
    ["Devolução a fornecedor (TOP 1202)", "Saída", "Retorno ao fornecedor. Reduz saldo."],
    ["Doação (TOP 1200)", "Saída", "Saída sem contrapartida financeira. Reduz saldo."],
    ["Devolução de cliente", "Entrada", "Retorno de mercadoria vendida. Aumenta saldo. TOP a confirmar (PA-02)."],
  ]
));

// RN-03
children.push(heading2("RN-03 — Cálculo do Saldo em Estoque"));
children.push(para(
  "Saldo = Estoque Inicial + Σ Entradas (ATUALESTOQUE <> -1) — Σ Saídas (ATUALESTOQUE = -1). " +
  "Dados de TGFCAB+TGFITE filtrados por CODGRUPOPROD = 10101."
));
children.push(para([{ text: "Exemplo (Produto 2470 — Camisa Champions, 3° Trim. 2025):", bold: true }]));
children.push(para("Estoque 2° Trim.: 823 un."));
children.push(para("Jul: 823 — 178 vendas = 645 | Ago: 645 + 11 devoluções — 198 vendas = 458 | Set: 458 — 36 vendas = 422"));
children.push(para([{ text: "Exemplo (Relatório de Saldo — Dez/2025, dados da plataforma):", bold: true }]));
children.push(makeTable(
  [2500, 1200, 1000, 1000, 900, 1200, 1560],
  ["Produto", "Saldo Ini.", "Compra", "Venda", "Doação", "Devol.", "Est. Final"],
  [
    ["Camisa Champions", "1.478", "0", "22", "0", "0", "1.456"],
    ["Camisa Réveillon", "0", "309", "3", "0", "0", "306"],
    ["Boné Luxo", "159", "0", "4", "0", "0", "155"],
    ["Caneca Porto", "47", "0", "1", "0", "0", "46"],
  ]
));

// RN-04
children.push(heading2("RN-04 — Divergência entre Fontes de Dados"));
children.push(para([
  { text: "Exemplo real: ", bold: true },
  { text: "Produto 2946 (Mascote Porto) — Janeiro: Analytics 440 un. de entrada vs portal de compras 300 un. = divergência de 140 un. O sistema deve sinalizar para investigação." },
]));

// RN-05
children.push(heading2("RN-05 — Tratamento de Dados Perdidos (Junho/2025)"));
children.push(para(
  "Em junho/2025 houve perda de dados no Sankhya. NFs aprovadas e válidas não constam mais no sistema. " +
  "O sistema deve prever mecanismo de inclusão manual com flag 'Ajuste Manual — Dados Recuperados' e justificativa obrigatória."
));

// RN-06
children.push(heading2("RN-06 — Contagem Física, Acuracidade e Desvio"));
children.push(para("Fórmulas: Divergência = Saldo — Contagem | Desvio (%) = |Divergência| ÷ Saldo | Acuracidade (%) = 1 — Desvio"));
children.push(para([{ text: "Dados reais — Relatório de Contagem (Mar/2026, plataforma):", bold: true }]));
children.push(makeTable(
  [900, 2400, 1100, 1200, 1100, 1100, 1560],
  ["Cód.", "Produto", "Saldo", "Contagem", "Dif.", "Desvio%", "Acurac.%"],
  [
    ["2470", "Camisa Champions", "1.513", "—", "—", "—", "—"],
    ["2550", "Boné Luxo", "163", "—", "—", "—", "—"],
    ["2946", "Mascote Porto", "592", "—", "—", "—", "—"],
    ["2953", "Copo 500ML", "100", "—", "—", "—", "—"],
    ["2957", "Garrafa 660ML", "-2", "—", "—", "—", "—"],
    ["3049", "Camisa Retrô", "351", "—", "—", "—", "—"],
  ]
));
children.push(highlightBox("Atenção:", "Itens com saldo negativo (Garrafa 660ML: -2, Garrafa 335ML: -7, Regata: -10, Camisa Oficial: -14, Jaqueta: -11) indicam saídas sem entrada correspondente — possível falta de nota de compra no Sankhya.", COLORS.red));

children.push(para([{ text: "Contagem histórica (Out/2025, planilha):", bold: true }]));
children.push(makeTable(
  [900, 2000, 1000, 1200, 900, 1100, 1100, 1160],
  ["Cód.", "Produto", "Saldo", "Contag.", "Dif.", "Desvio", "Acurac.", "Status"],
  [
    ["2470", "Champions", "417", "1.056", "-639", "153%", "-53%", "ALERTA"],
    ["2550", "Boné Luxo", "80", "63", "+17", "21%", "79%", "Investigar"],
    ["2959", "Caneca", "48", "47", "+1", "2%", "98%", "OK"],
    ["2946", "Mascote", "265", "258", "+7", "3%", "97%", "OK"],
    ["3049", "Cam.Retrô", "356", "297", "+59", "17%", "83%", "Investigar"],
  ]
));

// RN-07
children.push(heading2("RN-07 — Custo Médio Ponderado"));
children.push(para([
  { text: "Fórmula: ", bold: true },
  { text: "Novo Custo = (Qtd Ant. × Custo Ant. + Qtd Entrada × Custo Entrada) ÷ (Qtd Ant. + Qtd Entrada)" },
]));
children.push(para([
  { text: "Exemplo (2470, Jul/2025): ", bold: true },
  { text: "445 un. × R$ 87,92 + 200 un. × R$ 109,90 = R$ 61.104,40 ÷ 645 = R$ 94,73/un." },
]));

// RN-08
children.push(heading2("RN-08 — Curva ABC"));
children.push(para("Classificação: A = até 80% do valor acumulado | B = próximos 15% | C = últimos 5%."));
children.push(para([
  { text: "Exemplo: ", bold: true },
  { text: "Champions R$ 149.229 → classe A. Boné Luxo R$ 5.994 → provável classe C." },
]));

// RN-09
children.push(heading2("RN-09 — Cálculo de Margem"));
children.push(para([
  { text: "Fórmula: ", bold: true },
  { text: "Margem (%) = ((Preço Venda Líquido — Custo Médio) ÷ Preço Venda Líquido) × 100" },
]));
children.push(para([
  { text: "Exemplo (dados da plataforma — Análise de Preços, Dez/2025):", bold: true },
]));
children.push(makeTable(
  [1200, 2200, 1200, 1200, 1200, 1200, 1160],
  ["Cód.", "Produto", "Custo Total", "Custo Médio", "Venda Bruta", "Desc.", "Preço Médio"],
  [
    ["2470", "Camisa Champions", "0", "0", "4.068", "108", "R$ 184,91"],
    ["3108", "Camisa Réveillon", "40.139", "R$ 129,90", "540", "0", "R$ 180"],
    ["2550", "Boné Luxo", "0", "0", "240", "0", "R$ 60"],
    ["3006", "Regata Basquete", "0", "0", "374", "34", "R$ 187"],
  ]
));

// RN-10
children.push(heading2("RN-10 — Conciliação Financeira (Vendas vs Extrato)"));
children.push(para("Cruzamento TGFCAB/TGFITE com TGFFIN e TGFMBC. Considera:"));
children.push(para("• Modalidade: CODTIPTIT (44 = cartão) e HISTORICO da TGFFIN"));
children.push(para("• Bandeira: pattern matching no HISTORICO (Visa, Mastercard, Elo, Amex, Hipercard, Sodexo, Alelo, Ticket)"));
children.push(para("• Parcelas: 1X a 12X via patterns no HISTORICO"));
children.push(para("• RECDESP: -1 = Despesa, outro = Receita"));
children.push(para([
  { text: "Exemplo: ", bold: true },
  { text: "NF 1019 — Venda R$ 180 | Tributos R$ 7,20 (4% SN) | Taxa R$ 3,42 (débito Visa) → Líquido R$ 169,38. Extrato julho: R$ 176,58 (divergência +R$ 7,20)." },
]));

// RN-11
children.push(heading2("RN-11 — Tributos (Simples Nacional)"));
children.push(para([
  { text: "Fórmula: ", bold: true },
  { text: "Tributos = VLRTOT × 0,04. Exemplo: Venda R$ 180 → Tributos = R$ 7,20." },
]));

// RN-12
children.push(heading2("RN-12 — Registro de Inventário Mensal"));
children.push(para("Consolidação com NCM, descrição, unidade, quantidade e valores por lote."));
children.push(para([
  { text: "Exemplo (Jul/2025): ", bold: true },
  { text: "Camisa Champions — NCM 61.05.20.00 | Lote 1: 445 un. × R$ 87,92 | Lote 2: 200 un. × R$ 109,90." },
]));

// RN-13
children.push(heading2("RN-13 — Relatório de Vendas por Produto e Período"));
children.push(para("QTD e VLR por produto por mês, com totalizadores. TOP 1199 (Venda)."));
children.push(para([{ text: "Exemplo (dados plataforma — Top 10 Faturamento, Dez/2025):", bold: true }]));
children.push(para("Camisa Réveillon R$ 40,7K | Champions R$ 4,0K | Prata Dry R$ 780 | Litotex R$ 480 | Polo R$ 400 | Regata R$ 340 | Boné Luxo R$ 240 | Retrô R$ 180 | Caneca R$ 50"));

// RN-14
children.push(heading2("RN-14 — Governança de Acesso"));
children.push(para("Acesso segmentado por área: estoque, comercial, financeiro. Administrador gerencia permissões."));

// ==================== TELAS DA PLATAFORMA ====================
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(heading1("6. Telas da Plataforma"));
children.push(para(
  "Esta seção descreve todas as telas do módulo Gestão de Estoque na plataforma Analytics, organizadas conforme a navegação lateral. " +
  "A estrutura de navegação é dividida em quatro áreas: Análises, Operacional, Cadastros e Relatórios."
));

// --- ANÁLISES ---
children.push(heading2("6.1 — Análises"));

children.push(heading3("6.1.1 — Dashboard"));
children.push(para([{ text: "Filtros: ", bold: true }, { text: "Data Inicial, Data Final, Produto, Parceiro, Comparar com Mês Anterior" }]));
children.push(para([{ text: "KPIs (cards superiores): ", bold: true }]));
children.push(para("• Total de Produtos (quantidade de SKUs ativos no período)"));
children.push(para("• Valor em Estoque (R$ — valor total do estoque consolidado)"));
children.push(para("• Movimentações no Período (quantidade total de movimentos)"));
children.push(para([{ text: "Gráficos: ", bold: true }]));
children.push(para("• Entradas vs. Saídas (Últimos 6 meses) — Gráfico de barras com volume de produtos, comparando mês atual vs anterior. Legenda: Entradas, Saídas, Saldo, Entradas Mês Ant., Saídas Mês Ant."));
children.push(para("• Valor em Estoque por Parceiro — Gráfico donut mostrando participação de cada fornecedor no estoque"));
children.push(para([{ text: "Tabela: ", bold: true }, { text: "Últimos Lançamentos por Produto — lista com busca, exibindo produto, tipo de operação (ex.: VENDA), movimento (SAÍDA), quantidade e data" }]));

children.push(heading3("6.1.2 — Análise de Vendas"));
children.push(para([{ text: "Filtros: ", bold: true }, { text: "Data Inicial, Data Final, Produto, Parceiro" }]));
children.push(para([{ text: "KPIs: ", bold: true }, { text: "Faturamento Bruto (R$), Descontos Concedidos (R$), Faturamento Líquido (R$), Margem Média (%)" }]));
children.push(para([{ text: "Gráficos/Tabelas: ", bold: true }]));
children.push(para("• Top 10 Produtos por Faturamento — Gráfico de barras horizontal com receita líquida"));
children.push(para("• Vendas por Parceiro — Tabela com: Parceiro, Faturamento Bruto, Descontos, Faturamento Líquido, Margem (%)"));

children.push(heading3("6.1.3 — Análise de Custos"));
children.push(para([{ text: "Filtros: ", bold: true }, { text: "Data Inicial, Data Final, Grupo de Produto" }]));
children.push(para([{ text: "KPIs: ", bold: true }, { text: "Total de Despesas (R$), Despesas Baixadas/Pagas (R$), Despesas em Aberto (R$)" }]));
children.push(para([{ text: "Gráficos/Tabelas: ", bold: true }]));
children.push(para("• Evolução dos Custos Mensais — Gráfico de barras (Por Mês). Exibe total de custo por mês no período"));
children.push(para("• Composição de Custos por Natureza — Gráfico donut (Por Natureza). Distribuição percentual por código de natureza"));
children.push(para("• Detalhamento de Custos e Despesas — Tabela com busca: Data Mov., Vencimento, Natureza, Centro de Custo, Histórico, Valor, Valor Baixado, Data Baixa"));

children.push(heading3("6.1.4 — Análise de Preços"));
children.push(para([{ text: "Filtros: ", bold: true }, { text: "Data Inicial, Data Final" }]));
children.push(para([{ text: "Gráficos/Tabelas: ", bold: true }]));
children.push(para("• Custo de Aquisição por Fornecedor — Gráfico donut (Por Fornecedor). Clique filtra produtos"));
children.push(para("• Top 10 Produtos: Custo de Aquisição vs. Preço de Venda — Gráfico de barras agrupadas (custo vermelho, preço venda verde)"));
children.push(para("• Análise Detalhada por Produto — Tabela: Cód. Prod., Produto, Custo Total, Qtd. Compra, Custo Médio, Venda Bruta, Descontos, Qtd. Venda, Preço Médio"));

children.push(heading3("6.1.5 — Novos Produtos"));
children.push(para([{ text: "Filtros: ", bold: true }, { text: "Data Lançamento Inicial, Data Lançamento Final, Produto" }]));
children.push(para([{ text: "KPIs: ", bold: true }, { text: "Novos Produtos Lançados (qtd), Faturamento Novos Produtos (R$), Quantidade Vendida (un)" }]));
children.push(para([{ text: "Gráficos/Tabelas: ", bold: true }]));
children.push(para("• Curva de Vendas dos Novos Produtos — Gráfico de barras mensal com faturamento. Slider de período"));
children.push(para("• Detalhes dos Novos Produtos — Tabela: Cód., Produto, Lançamento (data), Faturamento, Qtd. Vendida"));

// --- OPERACIONAL ---
children.push(heading2("6.2 — Operacional"));

children.push(heading3("6.2.1 — Movimentações"));
children.push(para([{ text: "Filtros: ", bold: true }, { text: "Data Inicial, Data Final, Tipo de Operação, Produto, Tipo de Movimento, Parceiro" }]));
children.push(para([{ text: "Gráficos: ", bold: true }]));
children.push(para("• Análise de Movimentações — Gráfico de barras horizontal (Por Operação: Compras, Venda). Alternável por visão"));
children.push(para("• Distribuição de Movimento — Gráfico donut (Por Movimento: Entrada, Saída)"));
children.push(para([{ text: "Tabela: ", bold: true }, { text: "Histórico de Movimentações — com busca. Colunas: Data, Produto, Operação, Movimento, Qtd., Valor Total, Parceiro" }]));

// --- CADASTROS ---
children.push(heading2("6.3 — Cadastros"));

children.push(heading3("6.3.1 — Produtos"));
children.push(para([{ text: "Funcionalidade: ", bold: true }, { text: "Cadastro de Produtos — consulta de produtos e seus saldos" }]));
children.push(para([{ text: "Busca: ", bold: true }, { text: "Campo de busca por texto livre" }]));
children.push(para([{ text: "Tabela: ", bold: true }, { text: "Código, Descrição, Saldo Atual, Vlr. Últ. Compra" }]));

// --- RELATÓRIOS ---
children.push(heading2("6.4 — Relatórios"));

children.push(heading3("6.4.1 — Relatório de Vendas"));
children.push(para([{ text: "Filtro: ", bold: true }, { text: "Selecione o Ano (dropdown)" }]));
children.push(para([{ text: "KPIs: ", bold: true }, { text: "Total Produtos Vendidos (qtd), Total dos Valores (R$)" }]));
children.push(para([{ text: "Tabelas: ", bold: true }]));
children.push(para("• Vendas Mensais por Produto — Tabela com busca: Mês como colunas, produtos como linhas. QTD e VLR por célula"));
children.push(para("• Saldo Total por Produto — Tabela: Produto, Qtd, Valor"));
children.push(para("• Saldo Total por Mês — Tabela: Mês, Qtd, Valor"));

children.push(heading3("6.4.2 — Relatório de Contagem"));
children.push(para([{ text: "Filtros: ", bold: true }, { text: "Selecione o Ano, Selecione o Mês" }]));
children.push(para([{ text: "Ações: ", bold: true }, { text: "Imprimir, Exportar PDF, Exportar Excel" }]));
children.push(para([{ text: "Tabela: ", bold: true }, { text: "Cód., Descrição, Saldo Mês, DT Contagem Física (input data), Contagem (input numérico), Diferença (calculado), Desvio % (calculado), Acuracidade (calculado)" }]));
children.push(highlightBox("Nota:", "O Relatório de Contagem possui campos de entrada (DT Contagem e Contagem), ou seja, é uma tela com writeback — o usuário registra a contagem diretamente na plataforma.", COLORS.secondary));

children.push(heading3("6.4.3 — Relatório de Saldo"));
children.push(para([{ text: "Filtros: ", bold: true }, { text: "Data Inicial, Data Final, Produto" }]));
children.push(para([{ text: "Ação: ", bold: true }, { text: "Exportar XLSX" }]));
children.push(para([{ text: "Tabela: ", bold: true }, { text: "Produto, Saldo Inicial, Compra, Venda, Doação, Devolução, Estoque Final. Agrupado por mês (ex.: 12/2025)" }]));

children.push(heading3("6.4.4 — Relatório de Movimento"));
children.push(para([{ text: "Filtros: ", bold: true }, { text: "Data Inicial, Data Final, Produto, Parceiro, Tipo de Operação, Tipo de Movimento" }]));
children.push(para([{ text: "Ação: ", bold: true }, { text: "Exportar XLSX" }]));
children.push(para([{ text: "Tabela: ", bold: true }, { text: "Listagem de todas as movimentações individuais com campos filtrados do Sankhya" }]));

children.push(heading3("6.4.5 — Relatório de Inventário"));
children.push(para([{ text: "Funcionalidades: ", bold: true }, { text: "Nova Contagem (botão), Gerar Relatório Cont... (botão)" }]));
children.push(para([{ text: "Busca: ", bold: true }, { text: "Campo de busca por texto livre" }]));
children.push(para([{ text: "Tabela: ", bold: true }, { text: "Data Contagem, Cód. Prod., Produto, Qtd. Sistema, Qtd. Física, Diferença, Ações" }]));
children.push(highlightBox("Nota:", "Esta tela também possui writeback — permite registrar novas contagens e gerenciar o inventário físico diretamente na plataforma.", COLORS.secondary));

// ==================== 7. FLUXO PRINCIPAL ====================
children.push(heading1("7. Fluxo Principal (Caminho Feliz)"));
children.push(makeTable(
  [900, 8460],
  ["Passo", "Descrição"],
  [
    ["1", "Administrador configura integração com Sankhya (conexão Oracle, mapeamento de tabelas) e mapeamento de TOPs (1199→Venda, 1200→Doação, 1202→Devolução, 1401→Compras)."],
    ["2", "Sistema consome automaticamente movimentações (TGFCAB+TGFITE, CODGRUPOPROD=10101) e calcula saldos por item conforme RN-03."],
    ["3", "Sistema calcula custo médio ponderado com base nas entradas (TOP 1401), conforme RN-07."],
    ["4", "Analista de Estoque consulta Dashboard: KPIs, gráfico Entradas vs Saídas, Valor por Parceiro, Últimos Lançamentos."],
    ["5", "Analista Comercial consulta Análise de Vendas: Top 10 Faturamento, Vendas por Parceiro, margens."],
    ["6", "Analista Comercial consulta Análise de Preços: Custo Aquisição vs Preço Venda, detalhamento por produto."],
    ["7", "Analista de Estoque acessa Relatório de Contagem, seleciona mês, preenche data e quantidade da contagem para cada item. Sistema calcula divergência, desvio e acuracidade (RN-06)."],
    ["8", "Coordenador analisa divergências. Itens com acuracidade negativa geram alerta. Aprova/reprova ajustes."],
    ["9", "Analista Financeiro realiza conciliação via dados TGFFIN/TGFMBC (RN-10)."],
    ["10", "Analista consulta Relatório de Saldo para verificar movimentações consolidadas (Saldo Inicial + Compra - Venda - Doação + Devolução = Estoque Final)."],
    ["11", "Analista utiliza Relatório de Inventário para registrar novas contagens e gerar relatórios consolidados."],
    ["12", "Coordenador consulta dashboards gerenciais: Novos Produtos (curva de vendas de lançamentos), Análise de Custos (evolução mensal, composição por natureza)."],
  ]
));

// ==================== 8. FLUXOS ALTERNATIVOS ====================
children.push(heading1("8. Fluxos Alternativos e Exceções"));
children.push(makeTable(
  [900, 2600, 5860],
  ["ID", "Cenário", "Comportamento Esperado"],
  [
    ["FA-01", "Divergência Analytics vs portal de compras", "Sistema sinaliza (ex.: produto 2946, 440 vs 300 un.). Coordenador investiga e aprova ajuste."],
    ["FA-02", "Dados perdidos no Sankhya (junho/2025)", "Administrador utiliza mecanismo de inclusão manual (RN-05) com flag e justificativa."],
    ["FA-03", "Contagem com acuracidade negativa", "Ex.: Champions saldo 417, contagem 1.056. Alerta automático, investigação obrigatória."],
    ["FA-04", "Contagem com divergência aceitável", "Ex.: Caneca Porto, dif. 1 un., 98%. Aprovação com justificativa simplificada."],
    ["FA-05", "Contagem sem divergência", "Registra conferida, atualiza data última contagem."],
    ["FA-06", "TOP não mapeada", "Movimentações listadas em relatório de exceções. Administrador mapeia antes do cálculo."],
    ["FA-07", "Produto novo no Sankhya", "Códigos não mapeados listados em pendências. Administrador configura."],
    ["FA-08", "Venda com desconto", "Registra bruto, desconto e total separadamente. Ex.: NF 1021 — bruto R$ 180, desc. R$ 80, total R$ 100."],
    ["FA-09", "Divergência conciliação financeira", "Valor extrato ≠ valor esperado → sinaliza. Analista Financeiro registra tratativa."],
    ["FA-10", "Recebimento em mês diferente da venda", "Ex.: venda junho, extrato julho. Conciliação cross-período via DTVENC/DHBAIXA."],
    ["FA-11", "Indisponibilidade do Sankhya", "Exibe data/hora última sincronização e alerta quando desatualizado."],
    ["FA-12", "Item com saldo negativo", "Ex.: Garrafa 660ML (-2), Jaqueta (-11). Sistema sinaliza saldo negativo com alerta, indica possível falta de nota de compra."],
    ["FA-13", "Bandeira não identificável no HISTORICO", "Registro entra como 'Não identificado' para tratativa manual."],
  ]
));

// ==================== 9. CRITÉRIOS DE ACEITE ====================
children.push(heading1("9. Critérios de Aceite"));
children.push(makeTable(
  [900, 8460],
  ["ID", "Critério"],
  [
    ["CA-01", "TOP 1199 = Venda/Saída, TOP 1200 = Doação/Saída, TOP 1202 = Devolução/Saída, TOP 1401 = Compras/Entrada."],
    ["CA-02", "Saldo produto 2470 (Champions) Jul/2025 = 645 un. (823 — 178). Set/2025 = 422 un."],
    ["CA-03", "Relatório de Saldo Dez/2025: Champions saldo inicial 1.478, vendas 22, estoque final 1.456."],
    ["CA-04", "Custo médio 2470 Jul/2025 = R$ 94,73 (445 × 87,92 + 200 × 109,90) ÷ 645."],
    ["CA-05", "Curva ABC: Champions = classe A (R$ 149.229 no período)."],
    ["CA-06", "Contagem Caneca Porto Out/2025: Saldo 48, Contagem 47, Dif. +1, Desvio 2%, Acuracidade 98%."],
    ["CA-07", "Champions contagem 1.056 vs saldo 417 → alerta automático de acuracidade negativa."],
    ["CA-08", "Itens com saldo negativo (Garrafa -2, Jaqueta -11) devem gerar alerta visual na plataforma."],
    ["CA-09", "Ajustes reprovados não alteram saldo, ficam no histórico."],
    ["CA-10", "Dados recuperados (RN-05) com flag 'Ajuste Manual' visível em todas as consultas."],
    ["CA-11", "Dashboard: KPIs (Total Produtos, Valor Estoque, Movimentações), gráfico Entradas vs Saídas, donut Valor por Parceiro."],
    ["CA-12", "Análise de Vendas: KPIs (Bruto, Descontos, Líquido, Margem), Top 10, Vendas por Parceiro."],
    ["CA-13", "Relatório de Contagem: campos editáveis DT Contagem e Contagem com cálculo automático de Diferença, Desvio% e Acuracidade%."],
    ["CA-14", "Relatório de Saldo: colunas Saldo Inicial, Compra, Venda, Doação, Devolução, Estoque Final por produto/mês."],
    ["CA-15", "Relatório de Inventário: botão 'Nova Contagem', tabela com Qtd. Sistema, Qtd. Física, Diferença, Ações."],
    ["CA-16", "Conciliação: bandeira extraída do HISTORICO TGFFIN (Visa, Mastercard, Elo, Amex, etc.)."],
    ["CA-17", "Vendas com desconto: NF 1021 = bruto R$ 180, desc. R$ 80, total R$ 100."],
    ["CA-18", "Exportações funcionais: Relatório de Contagem (PDF/Excel), Saldo (XLSX), Movimento (XLSX)."],
  ]
));

// ==================== 10. PONTOS EM ABERTO ====================
children.push(heading1("10. Pontos em Aberto"));
children.push(makeTable(
  [900, 2600, 5860],
  ["ID", "Ponto", "Questão"],
  [
    ["PA-01", "Lista completa de TOPs", "Queries mostram 1199, 1200, 1202, 1401. Reuniões citaram 1123, 1203, 1462, 1792. Ambos existem? Há TOPs de transferência, perda, bonificação?"],
    ["PA-02", "TOP devolução de cliente", "Planilha classifica 'Devolução' como ENTRADA (retorno de cliente). Qual TOP no Sankhya? 1202 é devolução a fornecedor (saída)."],
    ["PA-03", "Método de custeio", "Custo médio ponderado assumido. O Sankhya calcula automaticamente? Outro método?"],
    ["PA-04", "Contagem: cega ou com saldo visível?", "Relatório de Contagem exibe Saldo Mês. Contagem deveria ser cega?"],
    ["PA-05", "Frequência e meta de acuracidade", "Periodicidade das contagens? Meta mínima (ex.: 95%)?"],
    ["PA-06", "Divergência produto 2946 — Janeiro", "440 un. Analytics vs 300 un. portal. Origem das 140 un. extras?"],
    ["PA-07", "NFs perdidas junho/2025", "Quantas NFs? Backup, PDF ou relatório auxiliar?"],
    ["PA-08", "Champions — contagem desproporcional", "Saldo 417 vs contagem 1.056 (Out/2025). Correto ou erro?"],
    ["PA-09", "Saldos negativos Mar/2026", "Garrafa 660ML (-2), Garrafa 335ML (-7), Regata (-10), Camisa Oficial (-14), Jaqueta (-11). Falta de NF de compra no Sankhya?"],
    ["PA-10", "Estrutura de depósitos", "Quantos depósitos no Sankhya? Hierarquia ou nível único?"],
    ["PA-11", "Despesas no cálculo de margem", "Apenas custo de aquisição ou também frete, armazenagem?"],
    ["PA-12", "Faixas da curva ABC", "80/15/5% adequado? Critério: valor ou quantidade?"],
    ["PA-13", "Conciliação: escopo", "Fica neste módulo ou em módulo financeiro separado?"],
    ["PA-14", "Taxas de cartão", "Query de vendas lista TX CARTÃO mas não extrai do Sankhya. Como obtê-las?"],
    ["PA-15", "Frequência de sincronização", "Tempo real, horário, diário? Janela de restrição no Sankhya?"],
    ["PA-16", "Writeback confirmado?", "Relatório de Contagem e Inventário possuem entrada de dados (writeback). Confirmar que a plataforma suporta e que o levantamento comercial será ajustado (estava marcado como 'Sem writeback')."],
  ]
));

// ============================================================
// MONTAGEM DO DOCUMENTO
// ============================================================
const doc = new Document({
  styles: {
    default: { document: { run: { font: FONTS.main, size: 21 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: FONTS.main, color: COLORS.primary },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: FONTS.main, color: COLORS.secondary },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: FONTS.main, color: COLORS.primary },
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
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.secondary, space: 4 } },
          children: [
            new TextRun({ text: "Maelly — Gestão de Estoque", font: FONTS.main, size: 16, color: COLORS.primary, bold: true }),
            new TextRun({ text: "\tv2.0", font: FONTS.main, size: 16, color: COLORS.muted }),
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
            new TextRun({ text: "Página ", font: FONTS.main, size: 16, color: COLORS.muted }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONTS.main, size: 16, color: COLORS.muted }),
          ],
        })],
      }),
    },
    children,
  }],
});

const outputPath = "/home/lemoreira/git/projetos/Maelly/Gestão de Estoque/Escopo-Tecnico-Gestao-Estoque-v2.0.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Documento gerado: " + outputPath);
});
