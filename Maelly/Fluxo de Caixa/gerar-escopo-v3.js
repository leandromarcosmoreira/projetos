const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

// ===== DESIGN TOKENS — Identidade Visual Maely =====
const COLORS = {
  primary: "004BB7", dark: "011736", accent: "FFCF03", cyan: "00D2E8",
  headerBg: "011736", headerText: "FFFFFF", lightGray: "F5F5F5",
  darkText: "1A1A2E", border: "D0D5DD", muted: "6B7280",
  red: "C0392B", orange: "E67E22", green: "27AE60", yellow: "F39C12",
  accentLight: "FFF8E1",
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

// ===== CONTEUDO =====
const children = [];

// ---------- CAPA ----------
children.push(spacer(600));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 80 },
  children: [new TextRun({ text: "ESCOPO TECNICO FUNCIONAL", font: FONTS.main, size: 40, bold: true, color: COLORS.primary })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 300 },
  children: [new TextRun({ text: "Hierarquia Parametrizavel do Fluxo de Caixa", font: FONTS.main, size: 32, color: COLORS.dark })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: COLORS.accent, space: 8 } },
  children: [new TextRun({ text: " ", font: FONTS.main, size: 10 })],
  spacing: { after: 300 },
}));

children.push(makeTable([2800, 6560],
  ["Campo", "Valor"],
  [
    ["Projeto", "Maelly Analytics"],
    ["Modulo", "Fluxo de Caixa — Hierarquia Parametrizavel"],
    ["Versao", "v3.0"],
    ["Data", "11/03/2026"],
    ["Elaborado por", "Neuon Solucoes"],
    ["Plataforma Integrada", "Sankhya ERP"],
    ["Status", "Em validacao — Pontos em Aberto pendentes"],
  ]
));
children.push(spacer(200));
children.push(highlightBox("v2.0-v2.1:", "Hierarquia parametrizavel com 4 niveis, integracao Sankhya (TGFNAT, TGFSBC, TSICTA, TSIBCO), filtro por empresa, granularidade temporal.", COLORS.green));
children.push(highlightBox("v3.0:", "Incorpora Plano Financeiro completo (5 fluxos, 277 naturezas reais), Plano de Centro de Resultados (152 centros, hierarquia real de 4 niveis), dimensao dupla de analise (Natureza + Centro de Resultado), operacoes Intragrupo, e processo de reestruturacao de-para das naturezas.", COLORS.green));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 1. OBJETIVO ----------
children.push(heading1("1. Objetivo"));
children.push(para(
  "Este documento especifica os requisitos funcionais do modulo de Hierarquia Parametrizavel do Fluxo de Caixa " +
  "da plataforma Maelly Analytics. O modulo permite que o usuario configure a estrutura hierarquica " +
  "de visualizacao do fluxo de caixa segundo duas dimensoes: Plano Financeiro (Naturezas — o que foi pago/recebido) " +
  "e Centro de Resultados (onde o custo/receita e alocado)."
));
children.push(para(
  "A hierarquia e alimentada pelo ERP Sankhya: TGFNAT (249 naturezas financeiras ativas), TGFSBC (saldos " +
  "bancarios), TSICTA (contas bancarias), TSIBCO (bancos) e tabela de Centros de Resultado (152 centros ativos). " +
  "O saldo bancario serve como saldo inicial do periodo. A visualizacao e filtrada por empresa (CODEMP) " +
  "e suporta granularidade Diaria, Semanal e Mensal."
));
children.push(para(
  "O Plano Financeiro reestruturado organiza as naturezas em 5 fluxos principais: (1) Operacional, " +
  "(2) Investimento, (3) Financiamentos de Terceiros, (4) Socios e Partes Relacionadas, (5) Tesouraria. " +
  "Cada fluxo contem ate 4 niveis hierarquicos com nos Sinteticos (totalizadores) e Analiticos (naturezas reais)."
));

// ---------- 2. ATORES E PERSONAS ----------
children.push(heading1("2. Atores e Personas"));
children.push(makeTable([2000, 2500, 4860],
  ["Persona", "Responsabilidade", "Interacao com o Sistema"],
  [
    ["Administrador do Sistema", "Configura e mantem a hierarquia do Plano Financeiro e Centro de Resultados", "Acessa tela de parametrizacao; cria, edita e exclui niveis; vincula naturezas aos nos analiticos; define ordem e subordinacao; executa migracoes de-para"],
    ["Gestor Financeiro", "Analisa fluxo de caixa consolidado por empresa e centro de resultado", "Visualiza dashboard hierarquico; alterna granularidade (diario/semanal/mensal); filtra por empresa e centro de resultado; exporta relatorios"],
    ["Analista Financeiro", "Consulta detalhes e valida movimentacoes", "Navega pela hierarquia com expand/collapse; verifica saldos bancarios; cruza dados entre Natureza e Centro de Resultado"],
    ["Controller / Controladoria", "Valida reestruturacao do plano e consistencia dos dados", "Audita migracoes de naturezas, valida reclassificacoes, compara plano atual vs. novo plano, identifica naturezas com VALIDAR AJUSTE"],
    ["Auditor", "Valida consistencia dos dados e da estrutura", "Consulta hierarquia em modo leitura; compara saldo TGFSBC com totais; identifica divergencias e naturezas nao classificadas"],
  ]
));

// ---------- 3. PRE-CONDICOES ----------
children.push(heading1("3. Pre-Condicoes"));
children.push(makeTable([900, 6460, 2000],
  ["ID", "Descricao", "Tipo"],
  [
    ["PC-01", "ERP Sankhya ativo e acessivel via API ou conexao direta ao banco de dados", "Obrigatoria"],
    ["PC-02", "Tabela TGFNAT populada com as 249 naturezas financeiras ativas identificadas no plano", "Obrigatoria"],
    ["PC-03", "Tabela TGFSBC com saldos bancarios atualizados para o periodo consultado", "Obrigatoria"],
    ["PC-04", "Tabela TSICTA com o cadastro e relacionamento das contas bancarias", "Obrigatoria"],
    ["PC-05", "Tabela TSIBCO com o cadastro dos bancos", "Obrigatoria"],
    ["PC-06", "Empresas cadastradas no Sankhya com CODEMP valido (Grupo Maely: 16+ empresas identificadas)", "Obrigatoria"],
    ["PC-07", "Plano de Centro de Resultados validado (152 centros em 2 eixos: Departamentos e Unidades de Negocio)", "Obrigatoria"],
    ["PC-08", "Plano Financeiro novo definido e aprovado (5 fluxos, de-para validado pela Controladoria)", "Obrigatoria"],
    ["PC-09", "Pelo menos um usuario com perfil de Administrador para configurar a hierarquia", "Obrigatoria"],
    ["PC-10", "Movimentacoes financeiras registradas no Sankhya para o periodo desejado", "Desejavel"],
  ]
));

// ---------- 4. GLOSSARIO ----------
children.push(heading1("4. Glossario"));
children.push(makeTable([2800, 6560],
  ["Termo", "Definicao"],
  [
    ["Nivel Sintetico", "No de agrupamento na hierarquia que totaliza (soma) os valores de seus filhos diretos. Nao possui vinculo com naturezas; valor sempre calculado."],
    ["Nivel Analitico", "No folha na hierarquia, vinculado a exatamente uma Natureza (TGFNAT). Exibe os valores reais das movimentacoes financeiras."],
    ["Natureza (TGFNAT)", "Tabela do Sankhya que classifica as movimentacoes financeiras por tipo. Campo-chave: CODNAT. 249 naturezas analiticas ativas identificadas."],
    ["Plano Financeiro", "Estrutura hierarquica de 4 niveis que classifica as naturezas em 5 fluxos: Operacional (1), Investimento (2), Financiamentos (3), Socios (4), Tesouraria (5)."],
    ["Centro de Resultado", "Dimensao de classificacao que indica ONDE um custo ou receita e alocado. Hierarquia propria com 2 eixos: Departamentos (1000000) e Unidades de Negocio (2000000). 152 centros ativos."],
    ["Saldo Bancario (TGFSBC)", "Tabela do Sankhya que armazena o saldo das contas bancarias por data. Utilizada como saldo inicial do periodo."],
    ["Conta Bancaria (TSICTA)", "Tabela do Sankhya com cadastro das contas bancarias da empresa."],
    ["Banco (TSIBCO)", "Tabela do Sankhya com cadastro dos bancos."],
    ["CODEMP", "Codigo da empresa no Sankhya. Filtro principal para segmentar dados do fluxo de caixa."],
    ["Granularidade", "Resolucao temporal: Diario (coluna por dia), Semanal (coluna por semana) ou Mensal (coluna por mes)."],
    ["CODNAT", "Campo-chave da tabela TGFNAT que identifica univocamente cada natureza financeira."],
    ["Saldo Inicial", "Valor do saldo bancario (TGFSBC) na data anterior ao inicio do periodo selecionado, somando todas as contas da empresa."],
    ["Fluxo Operacional", "Fluxo 1 do Plano Financeiro. Receitas e despesas da operacao corrente: receita bruta, impostos, custos com midias, pessoal, despesas administrativas, etc."],
    ["Fluxo de Investimento", "Fluxo 2. Aquisicoes e vendas de ativo imobilizado, intangivel, benfeitorias, investimentos financeiros."],
    ["Fluxo de Financiamentos", "Fluxo 3. Emprestimos bancarios, financiamentos, parcelamentos tributarios, resultado financeiro (juros, rendimentos)."],
    ["Fluxo Socios e Partes Relacionadas", "Fluxo 4. Capital social, distribuicao de lucros, emprestimos de socios, mutuos entre partes relacionadas."],
    ["Fluxo de Tesouraria", "Fluxo 5. Creditos/debitos indevidos, permutas, operacoes intragrupo (reembolsos entre empresas do grupo)."],
    ["Intragrupo", "Operacoes financeiras entre empresas do Grupo Maely. Inclui reembolsos e despesas reembolsaveis. Exige conciliacao bilateral."],
    ["VALIDAR AJUSTE", "Marcacao na planilha de de-para indicando que a natureza precisa de revisao pela Controladoria antes da ativacao no novo plano."],
    ["De-Para", "Mapeamento entre a estrutura de naturezas atual (Sankhya) e a nova estrutura do Plano Financeiro. Cada natureza antiga e reclassificada para uma posicao no novo plano."],
  ]
));

// ---------- 5. REGRAS DE NEGOCIO ----------
children.push(heading1("5. Regras de Negocio"));

// --- 5.1 Transversais ---
children.push(heading2("5.1 Regras Transversais"));

children.push(heading3("RN-01 — Limite de Niveis da Hierarquia"));
children.push(para("A hierarquia parametrizavel suporta no maximo 4 niveis de profundidade. Cada nivel e identificado por um numero (1 a 4), uma descricao livre e um tipo (Sintetico ou Analitico). O Plano Financeiro utiliza 4 niveis: Fluxo > Grupo > Subgrupo > Natureza Analitica."));

children.push(heading3("RN-02 — Tipos de No: Sintetico e Analitico"));
children.push(para("Nos Sinteticos sao totalizadores (soma dos filhos). Nos Analiticos sao folhas vinculadas a uma Natureza (TGFNAT) e exibem valores reais."));

children.push(heading3("RN-03 — Subordinacao e Ordem"));
children.push(para("Todo no (exceto nivel 1) possui um no pai. A ordem de exibicao entre irmaos e definida por campo numerico."));

children.push(heading3("RN-04 — Vinculo 1:1 entre Analitico e Natureza"));
children.push(para("Cada no Analitico e vinculado a exatamente uma Natureza (CODNAT). Uma mesma Natureza nao pode ser vinculada a mais de um no Analitico. O sistema valida essa unicidade."));

children.push(heading3("RN-05 — Calculo do No Sintetico"));
children.push(para("O valor exibido em um no Sintetico e sempre a soma dos valores de todos os seus filhos diretos, para cada coluna de periodo."));

children.push(heading3("RN-06 — Filtro por Empresa"));
children.push(para("Toda consulta e filtrada por uma unica empresa (CODEMP). O Grupo Maely possui 16+ empresas identificadas na planilha: Visao Midia, Porto Vitoria, WB Schultz, Maely Arte, MMP & Tres, Primer Vida, MedSenior, MMP&3 Inc, AirPower, EConto, PVEC, Mouty Tecnologia, Hotel Porto do Sol, Contobank, Maely SP, entre outras."));

// --- 5.2 Plano Financeiro (NOVO) ---
children.push(heading2("5.2 Plano Financeiro — Estrutura dos 5 Fluxos"));

children.push(heading3("RN-17 — Os 5 Fluxos do Plano Financeiro"));
children.push(para("O Plano Financeiro e organizado em 5 fluxos de nivel 1 (Sinteticos). Cada fluxo contem grupos (nivel 2), subgrupos (nivel 3) e naturezas analiticas (nivel 4). Total: 277 linhas mapeadas."));
children.push(makeTable([600, 2400, 1800, 4560],
  ["#", "Fluxo (Nivel 1)", "Codigo", "Grupos (Nivel 2)"],
  [
    ["1", "FLUXO OPERACIONAL", "1", "Receita Bruta Operacional (1.01), Impostos s/ Receita (1.05), Custos com Midias (1.10), Custos Industrializacao (1.15), Custos Revenda (1.20), Custos Serv. Esportivos (1.25), Custos Pessoal (1.30), Outros Custos (1.35), Desp. Vendas (1.40), Desp. Pessoal (1.45), Remuneracao Diretoria (1.50), Desp. Marketing (1.55), Desp. Administrativas (1.60), Outros Result. Operacionais (1.65), IRPJ e CSLL (1.70), Mov. Capital Giro (1.75)"],
    ["2", "FLUXO DE INVESTIMENTO", "2", "Imobilizado (2.01), Intangivel (2.05), Benfeitorias (2.10), Investimentos Financeiros (2.15)"],
    ["3", "FLUXO FINANCIAMENTOS TERCEIROS", "3", "Emprestimos e Financiamentos (3.01), Parcelamentos Tributarios (3.05), Resultado Financeiro (3.10)"],
    ["4", "FLUXO SOCIOS E PARTES RELACIONADAS", "4", "Capital Social (4.01), Distribuicao Lucro (4.05), Emprestimos Socios (4.10), Emprestimos Partes Relacionadas (4.15)"],
    ["5", "FLUXO DE TESOURARIA", "5", "Tesouraria (5.01): Credito/Debito Indevido, Permuta, Intragrupo"],
  ]
));

children.push(heading3("RN-18 — Detalhamento do Fluxo Operacional (Fluxo 1)"));
children.push(para("O Fluxo Operacional e o mais extenso, com 16 grupos de nivel 2. Detalhe dos subgrupos (nivel 3) e naturezas analiticas (nivel 4):"));
children.push(makeTable([1400, 2400, 5560],
  ["Grupo (N2)", "Subgrupo (N3)", "Exemplos de Naturezas Analiticas (N4)"],
  [
    ["1.01 Receita Bruta", "Receitas Servicos Prestados, Receitas Vendas, Receitas Locacao, Receitas Esportivas, Receitas Atletas, Receitas Incentivos", "Prestacao de Servico, Venda de Industrializacao, Revenda, Receita de Aluguel, Bilheteria, Patrocinio, Socio-Torcedor"],
    ["1.05 Impostos", "Impostos sobre Receita", "ISS, PIS, COFINS, Simples Nacional, ICMS s/ Venda"],
    ["1.10 Custos Midias", "Custos Veiculacao, Custos Terrenos", "Veiculacao Terceirizada, Instalacao Terceirizada, Aluguel Terreno PJ/PF, Energia Midias, Alvara Publicidade"],
    ["1.15 Custos Ind.", "Industrializacao", "Materia Prima, Material Secundario, Producao Maely, Producao Visao"],
    ["1.25 Custos Esport.", "Atletas, Gestao Tecnica, Saude/Performance, Materiais Esportivos, Treinos/Jogos, Logistica", "Direito de Imagem, Treinador, Fisioterapia, Material Esportivo, Arbitragem, Viagens e Estadias"],
    ["1.30 Pessoal", "Custos com Pessoal", "Salarios, 13o, Ferias, INSS/FGTS, Plano Saude, Vale Refeicao, Vale Transporte, Rescisoes, Seguro Vida, Uniformes"],
    ["1.40 Desp. Vendas", "Comissao s/ Vendas, Outras", "Comissao de Agencia, BV Bonificacao, Material Embalagem"],
    ["1.60 Desp. Admin.", "Serv. Terceiros, Sistemas/TI, Ocupacao, Manutencao, Materiais, Veiculos, Outras, Impostos/Taxas, Bancarias", "Honorarios Advocaticios, Software, Energia Imovel, Aluguel, Manutencao Predial, Material Escritorio, Estacionamento, Desp. Bancarias"],
    ["1.65 Outros Result.", "Processos Judiciais, Participacao Resultados, Outras Receitas", "Custas Processuais, Indenizacao Trabalhista, Venda Sucata"],
    ["1.75 Capital Giro", "Adiantamento Fornecedor, Adiantamento Cliente", "Creditos Adiant. Fornecedor, Adiantamento Clientes"],
  ]
));

children.push(heading3("RN-19 — Detalhamento dos Fluxos 2 a 5"));
children.push(makeTable([2400, 2400, 4560],
  ["Fluxo / Grupo", "Subgrupo", "Naturezas Analiticas"],
  [
    ["2. Investimento / 2.01 Imobilizado", "Imobilizado", "Venda e Aquisicao de: Moveis, Veiculos, Computadores, Maquinas, Imoveis, Estruturas Comerciais (paineis, outdoor), Leasing, Consorcios"],
    ["2. Investimento / 2.05 Intangivel", "Intangivel", "Marcas e Patentes, Aquisicao de Software, Aquisicao de Atletas"],
    ["2. Investimento / 2.10 Benfeitorias", "Benfeitorias Imoveis", "Benfeitorias Imoveis Proprios, Benfeitorias Imoveis Terceiros"],
    ["2. Investimento / 2.15 Invest. Financeiros", "Investimentos", "Aplicacao Financeira, Acoes"],
    ["3. Financiamentos / 3.01 Emprestimos", "Bancarios, Financiamentos, de Terceiros, a Terceiros", "Credito/Pagamento Emprestimo Bancario, Pagamento Financiamento, Emprestimo Terceiros"],
    ["3. Financiamentos / 3.05 Parcelamentos", "Tributarios", "Parcelamentos Tributarios"],
    ["3. Financiamentos / 3.10 Result. Financeiro", "Receitas, Desp. Divida Onerosa, Outras Desp.", "Rendimentos Aplicacao, Juros s/ Emprestimos, IOF, Multas/Juros Atraso"],
    ["4. Socios / 4.01-4.15", "Capital Social, Distrib. Lucro, Emprest. Socios, Partes Relacionadas", "Aporte Capital, Distrib. Lucros, Credito/Pag Emprest. Socios, Mutuos"],
    ["5. Tesouraria / 5.01", "Credito/Debito Indevido, Permuta, Intragrupo", "Credito Indevido, Debito Indevido, Permuta Avulsa, Reembolsos Intragrupo, Despesas Reembolsaveis Intragrupo"],
  ]
));

children.push(heading3("RN-20 — Naturezas com Marcacao 'VALIDAR AJUSTE'"));
children.push(para(
  "A planilha de de-para identifica naturezas com marcacao 'VALIDAR AJUSTE' — sao naturezas cuja classificacao no novo plano " +
  "precisa ser revisada pela Controladoria antes da ativacao. O sistema deve suportar um status 'Pendente de validacao' " +
  "para essas naturezas, permitindo que o Controller as revise individualmente."
));
children.push(para([
  { text: "Naturezas com VALIDAR AJUSTE: ", bold: true },
  { text: "~120 naturezas identificadas. Exemplos: Remessas e Outras Saidas, Bilheteria, Venda de Atletas, Bonificacao/Premio, Ferias, Rescisoes, Locacao Maq/Ferramentas, BV, etc." },
]));
children.push(para([
  { text: "Naturezas com observacoes de reclassificacao: ", bold: true },
  { text: "Exemplos: 'Reclassificar lancamentos pois nao refere-se a receita de prestacao de servicos' (Prestacao de Servico na Porto), " +
    "'INATIVAR' (INSS/IR/ISS/CSL PIS COFINS de Terceiros), 'Consolidar para conta de Monitoramento e Vigilancia' (Monitoramento duplicado)." },
]));
children.push(highlightBox("Impacto:", "O go-live do novo plano depende da resolucao de TODAS as naturezas com VALIDAR AJUSTE. O sistema deve impedir a ativacao do plano enquanto houver naturezas pendentes.", COLORS.orange));

// --- 5.3 Centro de Resultados (NOVO) ---
children.push(heading2("5.3 Plano de Centro de Resultados"));

children.push(heading3("RN-21 — Estrutura do Centro de Resultados"));
children.push(para(
  "O Centro de Resultados e uma dimensao independente do Plano Financeiro. Possui hierarquia propria de ate 4 niveis, " +
  "com 2 eixos principais de nivel 1: DEPARTAMENTOS (cod. 1000000) e UNIDADES DE NEGOCIO (cod. 2000000). " +
  "Cada movimentacao financeira e classificada simultaneamente por Natureza (o que) e por Centro de Resultado (onde)."
));
children.push(makeTable([900, 2000, 2560, 3900],
  ["Nivel", "Eixo", "Exemplo N2", "Exemplo N3-N4"],
  [
    ["N1", "DEPARTAMENTOS", "Corporativo, Comercial, Diretoria, Financeiro Adm., Grupo Maely, Marketing, Operacional, RH, Infra TI, Socios, ...", "Grupo Maely > Visao Midia, Porto Vitoria, Maely Arte, MMP&Tres, Primer, MedSenior, EConto, ..."],
    ["N1", "UNIDADES NEGOCIO", "Grandes Formatos, Mobiliario Urbano, Transportes, Ambientes Consumo, Midia Online, Revenda, Industrializacao, Servico, Consorcio, Negocios MMP, Primer, EConto, ...", "Grandes Formatos > Outdoor, Front, Empena, Rodosol, Paineis Led... | Transportes > Aeroporto VIX, Aeroporto FLN, Rodoviarias, Aguia Branca..."],
  ]
));
children.push(para([
  { text: "Total: ", bold: true },
  { text: "152 centros de resultado ativos. 122 analiticos e 30 sinteticos (totalizadores). " +
    "4 centros especiais fora da hierarquia principal: Adiantamentos (96M), Orcamento de Venda (97M), Aquisicao Midias (98M), Importacao XML (99M)." },
]));

children.push(heading3("RN-22 — Dupla Dimensao de Analise: Natureza x Centro de Resultado"));
children.push(para(
  "O fluxo de caixa deve suportar visualizacao cruzada: o usuario pode ver o fluxo por Plano Financeiro " +
  "(hierarquia de naturezas) ou por Centro de Resultado (hierarquia de departamentos/unidades). " +
  "A interseção permite respostas como: 'Quanto gastamos com Custos de Pessoal (Natureza) no departamento Operacional (Centro)?'"
));
children.push(para([
  { text: "Modos de visualizacao: ", bold: true },
  { text: "(a) Por Plano Financeiro: hierarquia dos 5 fluxos com totais. (b) Por Centro de Resultado: hierarquia Departamentos/Unidades com totais. (c) Cruzado: seleciona um Centro e exibe o Plano Financeiro filtrado para aquele centro." },
]));

children.push(heading3("RN-23 — Grupo Maely: Empresas e Centros de Resultado"));
children.push(para("O Grupo Maely e composto por multiplas empresas, cada uma identificada por CODEMP no Sankhya. " +
  "O eixo 'GRUPO MAELY' (cod. 1050000) no Centro de Resultados lista 16 empresas como sub-centros:"));
children.push(makeTable([1200, 3000, 5160],
  ["Codigo", "Empresa", "Observacao"],
  [
    ["1050100", "Visao Midia", "Empresa de midia"],
    ["1050200", "Porto Vitoria", "Clube esportivo"],
    ["1050300", "WB Schultz", "—"],
    ["1050400", "Maely Arte", "Publicidade e paineis (cliente principal deste escopo)"],
    ["1050500", "MMP & Tres", "—"],
    ["1050600", "Primer Vida", "Saude"],
    ["1050700", "MedSenior", "Saude"],
    ["1050800", "MMP&3 Inc", "Internacional"],
    ["1050900", "AirPower S.A", "—"],
    ["1051000", "EConto", "E-commerce esportivo"],
    ["1051100", "PVEC", "—"],
    ["1051200", "Mouty Tecnologia", "Tecnologia"],
    ["1051300", "Hotel Porto do Sol", "Hotelaria"],
    ["1051400", "Contobank", "Fintech"],
    ["1051500", "Maely SP", "Filial Sao Paulo"],
  ]
));

// --- 5.4 Intragrupo ---
children.push(heading2("5.4 Operacoes Intragrupo"));

children.push(heading3("RN-24 — Operacoes entre Empresas do Grupo"));
children.push(para(
  "O Plano Financeiro inclui contas especificas para operacoes intragrupo (Fluxo 5 — Tesouraria, item 5.01.15): " +
  "'Reembolsos Intragrupo' e 'Despesas Reembolsaveis Intragrupo'. " +
  "Essas operacoes representam fluxos entre empresas do Grupo Maely."
));
children.push(makeTable([1400, 3960, 4000],
  ["Direcao", "Maely", "Outras Empresas"],
  [
    ["Debito (D)", "Despesas reembolsaveis Intragrupo", "Manutencao de Software"],
    ["Credito (C)", "Reembolsos Intragrupo", "—"],
  ]
));
children.push(para([
  { text: "Regra: ", bold: true },
  { text: "Operacoes intragrupo devem ser conciliadas bilateralmente — o debito em uma empresa deve ter o credito correspondente na outra. O sistema deve permitir visualizar a conciliacao e alertar sobre discrepancias." },
]));

// --- 5.5 Saldo Bancario ---
children.push(heading2("5.5 Regras de Saldo Bancario"));

children.push(heading3("RN-07 — Saldo Inicial do Periodo"));
children.push(para("O saldo inicial e obtido da tabela TGFSBC, considerando a data imediatamente anterior ao inicio do periodo selecionado."));
children.push(para([
  { text: "Formula: ", bold: true },
  { text: "Saldo Inicial = SUM(TGFSBC.SALDO) WHERE CODEMP = [empresa] AND DTSALDO = [data_inicio - 1]" },
]));

children.push(heading3("RN-08 — Saldo Bancario Alimenta Nos Analiticos"));
children.push(para("Os nos Analiticos vinculados a naturezas de movimentacao bancaria exibem valores da TGFSBC, cruzando com TSICTA e TSIBCO."));

children.push(heading3("RN-09 — Relacionamento de Contas e Bancos"));
children.push(para("TSICTA relaciona contas com contas contabeis. TSIBCO identifica o banco. Permite agrupar saldos por banco/conta."));

// --- 5.6 Visualizacao ---
children.push(heading2("5.6 Regras de Visualizacao"));

children.push(heading3("RN-10 — Granularidade Temporal"));
children.push(para("Colunas seguem granularidade selecionada: Diario, Semanal (seg-dom) ou Mensal. Coluna TOTAL soma todas as colunas."));

children.push(heading3("RN-11 — Expand/Collapse da Hierarquia"));
children.push(para("Nos Sinteticos expandem/recolhem. Estado padrao: nivel 1 expandido, demais recolhidos. Botoes globais Expandir/Recolher."));

children.push(heading3("RN-12 — Saldo Inicial como Primeira Linha"));
children.push(para("Primeira linha da tabela exibe o saldo bancario inicial (RN-07). Nao editavel."));

children.push(heading3("RN-13 — Saldo Final como Ultima Linha"));
children.push(para([
  { text: "Formula: ", bold: true },
  { text: "Saldo Final = Saldo Inicial + SUM(todos os nos Analiticos do periodo)" },
]));

// --- 5.7 Parametrizacao ---
children.push(heading2("5.7 Regras de Parametrizacao"));

children.push(heading3("RN-14 — Estrutura do No na Configuracao"));
children.push(makeTable([2800, 6560],
  ["Atributo", "Descricao"],
  [
    ["Codigo", "Identificador unico do no (formato hierarquico: 1, 1.01, 1.01.01, etc.)"],
    ["Descricao", "Nome de exibicao (texto livre, max 120 caracteres)"],
    ["Nivel", "1 a 4"],
    ["Tipo", "Sintetico ou Analitico"],
    ["No Pai", "Referencia ao no superior (obrigatorio para niveis 2+)"],
    ["Ordem", "Posicao entre irmaos"],
    ["Natureza (CODNAT)", "Codigo TGFNAT (obrigatorio e exclusivo para nos Analiticos)"],
    ["Status Validacao", "Validado / Pendente (VALIDAR AJUSTE) — novo campo para controle de migracao"],
  ]
));

children.push(heading3("RN-15 — Validacoes na Configuracao"));
children.push(para("a) Nos nivel 1 nao podem ter pai. b) Nos nivel 2+ devem ter pai de nivel superior. c) Analiticos devem ter CODNAT vinculado. d) Sinteticos nao podem ter CODNAT. e) CODNAT unico na hierarquia. f) Sinteticos devem ter pelo menos 1 filho."));

children.push(heading3("RN-16 — Hierarquia Global por Tipo"));
children.push(para("A hierarquia do Plano Financeiro e global (mesma estrutura para todas as empresas). A hierarquia do Centro de Resultados tambem e global. Os dados sao filtrados por CODEMP."));

children.push(heading3("RN-25 — Processo de Migracao De-Para"));
children.push(para(
  "O sistema deve suportar o processo de migracão do plano de naturezas atual para o novo Plano Financeiro. " +
  "Cada natureza do plano atual e mapeada para uma posicao no novo plano (de-para). O processo inclui:"
));
children.push(para([{ text: "(a) Importacao do de-para: ", bold: true }, { text: "O Administrador carrega o mapeamento (atual > novo) das 277 naturezas." }]));
children.push(para([{ text: "(b) Validacao por natureza: ", bold: true }, { text: "Naturezas com VALIDAR AJUSTE ficam com status 'Pendente'. O Controller revisa e aprova cada uma." }]));
children.push(para([{ text: "(c) Reclassificacao de lancamentos: ", bold: true }, { text: "Apos aprovacao, lancamentos historicos podem ser reclassificados para o novo plano (ou mantidos com referencia cruzada)." }]));
children.push(para([{ text: "(d) Ativacao: ", bold: true }, { text: "Novo plano so pode ser ativado quando todas as naturezas estiverem validadas." }]));
children.push(para([{ text: "(e) Inativacao de naturezas: ", bold: true }, { text: "Naturezas marcadas como 'INATIVAR' na planilha devem ser desativadas apos migracao dos lancamentos." }]));

// ---------- 6. FLUXO PRINCIPAL ----------
children.push(heading1("6. Fluxo Principal"));
children.push(para("Caminho feliz — da configuracao do plano ate a visualizacao cruzada do fluxo de caixa."));
children.push(makeTable([900, 8460],
  ["Passo", "Descricao"],
  [
    ["1", "O Controller importa o mapeamento de-para das naturezas (plano atual > novo Plano Financeiro). O sistema valida a estrutura e marca naturezas 'VALIDAR AJUSTE'."],
    ["2", "O Controller revisa cada natureza pendente, aprova ou reclassifica. Ao final, todas as naturezas estao validadas."],
    ["3", "O Administrador configura o Plano Financeiro: cria os 5 fluxos de nivel 1, os grupos (N2), subgrupos (N3) e vincula naturezas analiticas (N4)."],
    ["4", "O Administrador configura o Centro de Resultados: define os 2 eixos (Departamentos e Unidades de Negocio) e seus sub-niveis conforme planilha (152 centros)."],
    ["5", "O sistema valida ambas as hierarquias (RN-15). Se validas, salva. Se invalidas, exibe erros."],
    ["6", "O Administrador ativa o novo Plano Financeiro. Lancamentos passam a usar a nova classificacao."],
    ["7", "O Gestor Financeiro acessa o Fluxo de Caixa, seleciona empresa (CODEMP) e modo de visualizacao (por Plano Financeiro ou por Centro de Resultado)."],
    ["8", "O sistema carrega o saldo inicial (RN-07) via TGFSBC."],
    ["9", "O usuario seleciona periodo e granularidade (Diario/Semanal/Mensal)."],
    ["10", "O sistema carrega movimentacoes por Natureza (TGFNAT), calcula nos Analiticos e propaga soma para nos Sinteticos."],
    ["11", "O sistema exibe: Saldo Inicial (1a linha), hierarquia expand/collapse, Saldo Final (ultima linha), coluna TOTAL."],
    ["12", "O usuario alterna entre visao por Plano Financeiro e visao por Centro de Resultado. Pode selecionar um centro e ver o plano financeiro filtrado."],
    ["13", "O Auditor consulta naturezas nao classificadas (FA-02) e conciliacao intragrupo (RN-24)."],
  ]
));

// ---------- 7. FLUXOS ALTERNATIVOS ----------
children.push(heading1("7. Fluxos Alternativos e Excecoes"));
children.push(makeTable([900, 2600, 5860],
  ["ID", "Cenario", "Comportamento Esperado"],
  [
    ["FA-01", "Hierarquia nao configurada", "Sistema exibe mensagem orientando Administrador. Fluxo de Caixa acessivel mas tabela vazia com aviso."],
    ["FA-02", "Natureza sem no Analitico", "Movimentacoes nao mapeadas nao aparecem. Badge/alerta com valor total e lista de naturezas nao classificadas."],
    ["FA-03", "No Analitico sem movimentacao", "Exibe R$ 0,00. Nao e ocultado."],
    ["FA-04", "Empresa sem saldo bancario", "Saldo inicial = R$ 0,00 com indicador visual."],
    ["FA-05", "Exclusao de no Sintetico com filhos", "Bloqueio: 'Remova os sub-niveis primeiro.'"],
    ["FA-06", "Natureza ja vinculada a outro no", "Bloqueio: 'Natureza ja vinculada ao no [descricao].'"],
    ["FA-07", "Edicao de hierarquia em uso", "Alteracoes refletidas na proxima consulta."],
    ["FA-08", "Periodo sem movimentacoes", "Hierarquia completa com zeros. Saldo Final = Saldo Inicial."],
    ["FA-09", "TGFSBC com registros duplicados", "Considerar registro mais recente ou somar (ver PA-03)."],
    ["FA-10", "Indisponibilidade do Sankhya", "Mensagem com data/hora da ultima sincronizacao."],
    ["FA-11", "No Sintetico sem filhos apos exclusao", "Sinaliza no como invalido. Impede salvamento."],
    ["FA-12", "Reordenacao de nos", "Drag-and-drop ou edicao manual do campo de ordem."],
    ["FA-13", "Natureza com VALIDAR AJUSTE pendente", "Natureza fica com status 'Pendente' na hierarquia. Nao impede uso no fluxo, mas exibe alerta visual. Impede ativacao completa do novo plano."],
    ["FA-14", "Migracao de lancamentos historicos", "O sistema oferece opcao de reclassificar lancamentos anteriores para o novo plano. Se nao reclassificados, sao exibidos com referencia cruzada (plano atual > novo)."],
    ["FA-15", "Naturezas marcadas INATIVAR", "Apos migracao dos lancamentos, as 6 naturezas identificadas (INSS/IR/ISS/CSL/PIS/COFINS de Terceiros) sao inativadas. Lancamentos existentes permanecem acessiveis mas nao aceitam novos registros."],
    ["FA-16", "Visualizacao cruzada sem centro", "Se nenhum Centro de Resultado for selecionado, exibe totalizacao de todos os centros."],
    ["FA-17", "Discrepancia intragrupo", "O sistema alerta quando debito em uma empresa nao tem credito correspondente na outra. Exibe relatorio de conciliacao."],
  ]
));

// ---------- 8. CRITERIOS DE ACEITE ----------
children.push(heading1("8. Criterios de Aceite"));
children.push(makeTable([900, 8460],
  ["ID", "Criterio"],
  [
    ["CA-01", "O Administrador consegue criar hierarquia do Plano Financeiro com 5 fluxos e ate 4 niveis."],
    ["CA-02", "Nos Sinteticos exibem soma exata dos filhos diretos em cada coluna."],
    ["CA-03", "Nos Analiticos exibem valores reais da Natureza (TGFNAT) vinculada."],
    ["CA-04", "Cada Natureza (CODNAT) so vinculada a um unico no Analitico."],
    ["CA-05", "Saldo inicial corresponde ao TGFSBC na data anterior, somando todas as contas da empresa."],
    ["CA-06", "Saldo Final = Saldo Inicial + soma de todos os Analiticos."],
    ["CA-07", "Filtro por empresa (CODEMP) carrega apenas dados da empresa selecionada."],
    ["CA-08", "Granularidade Diaria/Semanal/Mensal funciona corretamente."],
    ["CA-09", "Coluna TOTAL soma todas as colunas de periodo."],
    ["CA-10", "Expandir/Recolher funciona para toda a hierarquia."],
    ["CA-11", "Alerta quando existem naturezas nao mapeadas com seu valor total."],
    ["CA-12", "Exclusao de no Sintetico com filhos bloqueada."],
    ["CA-13", "Preview da hierarquia em arvore antes de salvar."],
    ["CA-14", "Validacoes RN-15 (a-f) aplicadas com mensagens."],
    ["CA-15", "Dados de TGFSBC, TSICTA, TSIBCO carregados corretamente."],
    ["CA-16", "Nos sem movimentacao exibem R$ 0,00."],
    ["CA-17", "Alteracoes na hierarquia refletidas na proxima consulta."],
    ["CA-18", "Hierarquias de 1 a 4 niveis funcionam."],
    ["CA-19", "Os 5 fluxos do Plano Financeiro conforme planilha: 277 naturezas mapeadas."],
    ["CA-20", "Centro de Resultados com 152 centros em 2 eixos (Departamentos + Unidades Negocio)."],
    ["CA-21", "Visualizacao cruzada: por Plano Financeiro, por Centro de Resultado, ou cruzada (centro + plano)."],
    ["CA-22", "Naturezas com VALIDAR AJUSTE exibem status 'Pendente' e alerta visual."],
    ["CA-23", "Processo de migracao de-para: importacao, validacao, reclassificacao, ativacao."],
    ["CA-24", "Conciliacao intragrupo: alerta de discrepancias entre empresas."],
    ["CA-25", "Grupo Maely com 16+ empresas reconhecidas como sub-centros de resultado."],
    ["CA-26", "Naturezas inativadas nao aceitam novos lancamentos mas historico permanece acessivel."],
  ]
));

// ---------- 9. PONTOS EM ABERTO ----------
children.push(heading1("9. Pontos em Aberto"));
children.push(highlightBox("Resolvidos v3.0:", "PA-01 (campos TGFNAT): 249 naturezas com 30 campos identificados (CODNAT, descricao, ativa, analitica, incide resultado, conta contabil, grupo natureza, tipo, PIS/COFINS). PA-05 (naturezas inativas): todas as 249 estao ativas. Naturezas a INATIVAR identificadas no de-para.", COLORS.green));
children.push(makeTable([900, 2600, 5860],
  ["ID", "Ponto", "Questao"],
  [
    ["PA-03", "TGFSBC com registros duplicados", "Quando existem multiplos registros de saldo na TGFSBC para a mesma conta/data, qual registro deve prevalecer?"],
    ["PA-04", "Permissoes de parametrizacao", "Apenas Administrador configura hierarquia? Log de auditoria das alteracoes?"],
    ["PA-06", "Movimentacoes entre contas", "Transferencias entre contas da mesma empresa: duplicam (entrada+saida) ou anulam na hierarquia?"],
    ["PA-07", "Exportacao", "Exportacao (PDF/Excel) respeita expand/collapse ou sempre exporta completa?"],
    ["PA-08", "Saldo por conta bancaria", "Saldo inicial como total unico ou detalhado por conta bancaria/banco?"],
    ["PA-09", "Aprovacao do de-para", "Quem aprova formalmente cada natureza com VALIDAR AJUSTE? O Controller tem autonomia ou precisa de aprovacao da Diretoria para reclassificacoes?"],
    ["PA-10", "Reclassificacao historica", "Lancamentos anteriores ao go-live serao reclassificados para o novo plano ou permanecem no plano antigo? Se reclassificados, o historico original e preservado?"],
    ["PA-11", "Naturezas especiais fora da hierarquia", "Os 4 centros especiais (Adiantamentos 96M, Orcamento Venda 97M, Aquisicao Midias 98M, Importacao XML 99M) devem aparecer no fluxo de caixa ou sao exclusivos de outros modulos?"],
    ["PA-12", "Nivel de profundidade do Centro de Resultados", "A hierarquia do Centro de Resultados (152 centros) usa ate 4 niveis (ex.: UNIDADES > NEGOCIOS MMP > MovLog > Galpao 001). O sistema deve suportar 4 niveis tambem para centros?"],
    ["PA-13", "Visao consolidada multi-empresa", "RN-06 define filtro por empresa unica. O Grupo Maely precisa de visao consolidada (todas as empresas) alem da visao individual?"],
    ["PA-14", "Frequencia de sincronizacao", "Os dados do Sankhya (TGFNAT, TGFSBC, movimentacoes) sao sincronizados em tempo real, diariamente ou sob demanda?"],
    ["PA-15", "Centro de Resultado por empresa", "A hierarquia de Centro de Resultados e identica para todas as empresas ou cada empresa pode ter centros diferentes? Ex.: Porto Vitoria tem centros esportivos, Maely Arte nao."],
  ]
));

children.push(spacer(200));
children.push(highlightBox("Nota:", "Quando os pontos acima forem respondidos, as respostas serao incorporadas como Regras de Negocio ou Fluxos Alternativos, e os pontos serao removidos desta lista.", COLORS.primary));

// ===== DOCUMENTO =====
const MODULE_NAME = "Fluxo de Caixa — Hierarquia Parametrizavel";
const VERSION = "v3.0";

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
            new TextRun({ text: MODULE_NAME, font: FONTS.main, size: 16, color: COLORS.primary, italics: true }),
            new TextRun({ text: "\t" + VERSION, font: FONTS.main, size: 16, color: COLORS.muted }),
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

const OUTPUT = "/home/lemoreira/git/projetos/Maelly/Fluxo de Caixa/Escopo_Tecnico_Maelly_Hierarquia_FluxoCaixa_v3.0.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log("Documento criado: " + OUTPUT);
});
