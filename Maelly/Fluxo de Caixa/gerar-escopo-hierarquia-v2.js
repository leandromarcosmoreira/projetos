const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

// ===== DESIGN TOKENS — Identidade Visual Maely =====
const COLORS = {
  primary: "004BB7",       // Azul corporativo Maely
  dark: "011736",          // Azul marinho Maely
  accent: "FFCF03",        // Amarelo destaque Maely
  cyan: "00D2E8",          // Ciano Maely
  headerBg: "011736",      // Fundo header tabelas
  headerText: "FFFFFF",
  lightGray: "F5F5F5",
  darkText: "1A1A2E",
  border: "D0D5DD",
  muted: "6B7280",
  red: "C0392B",
  orange: "E67E22",
  green: "27AE60",
  yellow: "F39C12",
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

// ===== CONTEUDO DO ESCOPO =====
const children = [];

// ---------- CAPA ----------
children.push(spacer(600));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "ESCOPO TECNICO FUNCIONAL", font: FONTS.main, size: 40, bold: true, color: COLORS.primary })],
  spacing: { after: 80 },
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "Hierarquia Parametrizavel do Fluxo de Caixa", font: FONTS.main, size: 32, color: COLORS.dark })],
  spacing: { after: 300 },
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
    ["Versao", "v2.1"],
    ["Data", "05/03/2026"],
    ["Elaborado por", "Neuon Solucoes"],
    ["Plataforma Integrada", "Sankhya ERP"],
    ["Status", "Entregue — 7 pontos em aberto pendentes de validacao"],
  ]
));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 1. OBJETIVO ----------
children.push(heading1("1. Objetivo"));
children.push(para(
  "Este documento especifica os requisitos funcionais do modulo de Hierarquia Parametrizavel do Fluxo de Caixa " +
  "da plataforma Maelly Analytics. O modulo permite que o usuario configure livremente a estrutura hierarquica " +
  "de visualizacao do fluxo de caixa, definindo ate 4 niveis de agrupamento com nos Sinteticos (totalizadores) " +
  "e Analiticos (detalhamento por Natureza financeira)."
));
children.push(para(
  "A hierarquia e alimentada pelas tabelas do ERP Sankhya: TGFNAT (naturezas financeiras), TGFSBC (saldos " +
  "bancarios), TSICTA (contas bancarias) e TSIBCO (bancos). O saldo bancario do TGFSBC serve tanto como saldo " +
  "inicial do periodo quanto como fonte de dados para os nos analiticos. A visualizacao e filtrada por empresa " +
  "e suporta granularidade Diaria, Semanal e Mensal."
));
children.push(para(
  "Este escopo e um aprimoramento do modulo de Fluxo de Caixa (v1.0), focado na parametrizacao da hierarquia " +
  "e na integracao direta com as tabelas financeiras do Sankhya."
));

// ---------- 2. ATORES E PERSONAS ----------
children.push(heading1("2. Atores e Personas"));
children.push(makeTable([2000, 2500, 4860],
  ["Persona", "Responsabilidade", "Interacao com o Sistema"],
  [
    ["Administrador do Sistema", "Configura e mantem a hierarquia parametrizavel", "Acessa tela de parametrizacao; cria, edita e exclui niveis; vincula naturezas aos nos analiticos; define ordem e subordinacao"],
    ["Gestor Financeiro", "Analisa fluxo de caixa consolidado por empresa", "Visualiza dashboard hierarquico; alterna granularidade (diario/semanal/mensal); filtra por empresa; exporta relatorios"],
    ["Analista Financeiro", "Consulta detalhes e valida movimentacoes", "Navega pela hierarquia com expand/collapse; verifica saldos bancarios; cruza dados entre niveis"],
    ["Auditor / Controladoria", "Valida consistencia dos dados e da estrutura", "Consulta hierarquia em modo leitura; compara saldo TGFSBC com totais da hierarquia; identifica divergencias"],
  ]
));

// ---------- 3. PRE-CONDICOES ----------
children.push(heading1("3. Pre-Condicoes"));
children.push(makeTable([900, 6460, 2000],
  ["ID", "Descricao", "Tipo"],
  [
    ["PC-01", "ERP Sankhya ativo e acessivel via API ou conexao direta ao banco de dados", "Obrigatoria"],
    ["PC-02", "Tabela TGFNAT populada com as naturezas financeiras utilizadas pela empresa", "Obrigatoria"],
    ["PC-03", "Tabela TGFSBC com saldos bancarios atualizados para o periodo consultado", "Obrigatoria"],
    ["PC-04", "Tabela TSICTA com o cadastro e relacionamento das contas bancarias", "Obrigatoria"],
    ["PC-05", "Tabela TSIBCO com o cadastro dos bancos", "Obrigatoria"],
    ["PC-06", "Empresas cadastradas no Sankhya com CODEMP valido", "Obrigatoria"],
    ["PC-07", "Pelo menos um usuario com perfil de Administrador para configurar a hierarquia", "Obrigatoria"],
    ["PC-08", "Movimentacoes financeiras registradas no Sankhya para o periodo desejado", "Desejavel"],
  ]
));

// ---------- 4. GLOSSARIO ----------
children.push(heading1("4. Glossario"));
children.push(makeTable([2800, 6560],
  ["Termo", "Definicao"],
  [
    ["Nivel Sintetico", "No de agrupamento na hierarquia que totaliza (soma) os valores de seus filhos diretos. Nao possui vinculo direto com naturezas; seu valor e sempre calculado."],
    ["Nivel Analitico", "No folha na hierarquia, vinculado a exatamente uma Natureza (TGFNAT). Exibe os valores reais das movimentacoes financeiras daquela natureza."],
    ["Natureza (TGFNAT)", "Tabela do Sankhya que classifica as movimentacoes financeiras por tipo (ex.: Receita de Vendas, Pagamento de Fornecedores, Juros). Campo-chave: CODNAT."],
    ["Saldo Bancario (TGFSBC)", "Tabela do Sankhya que armazena o saldo das contas bancarias por data. Utilizada como saldo inicial do periodo e como fonte de dados para nos analiticos."],
    ["Conta Bancaria (TSICTA)", "Tabela do Sankhya com o cadastro e relacionamento das contas bancarias da empresa, incluindo agencia, numero e tipo de conta."],
    ["Banco (TSIBCO)", "Tabela do Sankhya com o cadastro dos bancos (codigo, nome, ISPB). Relaciona-se com TSICTA para identificar a instituicao financeira."],
    ["CODEMP", "Codigo da empresa no Sankhya. Utilizado como filtro principal para segmentar os dados do fluxo de caixa por empresa."],
    ["Hierarquia Parametrizavel", "Estrutura de ate 4 niveis definida pelo usuario, onde cada nivel pode ser Sintetico ou Analitico, com ordem e subordinacao configuravel."],
    ["Granularidade", "Resolucao temporal das colunas de dados: Diario (uma coluna por dia), Semanal (uma por semana) ou Mensal (uma por mes)."],
    ["Subordinacao", "Relacao pai-filho entre nos da hierarquia. Todo no (exceto os de nivel 1) possui um no pai ao qual esta subordinado."],
    ["CODNAT", "Campo-chave da tabela TGFNAT que identifica univocamente cada natureza financeira."],
    ["Saldo Inicial", "Valor do saldo bancario (TGFSBC) na data de inicio do periodo selecionado. Exibido como primeira linha da hierarquia."],
  ]
));

// ---------- 5. REGRAS DE NEGOCIO ----------
children.push(heading1("5. Regras de Negocio"));

// --- Transversais ---
children.push(heading2("5.1 Regras Transversais"));

children.push(heading3("RN-01 — Limite de Niveis da Hierarquia"));
children.push(para("A hierarquia parametrizavel suporta no maximo 4 niveis de profundidade. Cada nivel e identificado por um numero (1 a 4), uma descricao livre e um tipo (Sintetico ou Analitico)."));

children.push(heading3("RN-02 — Tipos de No: Sintetico e Analitico"));
children.push(para("Cada no da hierarquia e classificado como Sintetico ou Analitico. Nos Sinteticos sao totalizadores e seu valor e a soma dos filhos diretos. Nos Analiticos sao folhas vinculadas a uma Natureza (TGFNAT) e exibem os valores reais das movimentacoes."));

children.push(heading3("RN-03 — Subordinacao e Ordem"));
children.push(para("Todo no (exceto os de nivel 1) possui um no pai. A ordem de exibicao dentro de um mesmo pai e definida por um campo numerico de ordenacao. O sistema respeita a ordem definida pelo usuario na tela de parametrizacao."));

children.push(heading3("RN-04 — Vinculo 1:1 entre Analitico e Natureza"));
children.push(para("Cada no Analitico e vinculado a exatamente uma Natureza (CODNAT da TGFNAT). Uma mesma Natureza nao pode ser vinculada a mais de um no Analitico dentro da mesma hierarquia. O sistema deve validar essa unicidade no momento da configuracao."));

children.push(heading3("RN-05 — Calculo do No Sintetico"));
children.push(para("O valor exibido em um no Sintetico e sempre a soma dos valores de todos os seus filhos diretos (sejam eles Sinteticos ou Analiticos), para cada coluna de periodo."));
children.push(para([
  { text: "Exemplo: ", bold: true },
  { text: "Se o no Sintetico 'Atividades Operacionais' possui 3 filhos Analiticos com valores R$ 100, R$ 250 e R$ -80 para o dia 23/02, o valor exibido no Sintetico sera R$ 270,00." },
]));

children.push(heading3("RN-06 — Filtro por Empresa"));
children.push(para("Toda consulta ao fluxo de caixa e filtrada por uma unica empresa (CODEMP). O usuario seleciona a empresa desejada e o sistema carrega apenas os dados daquela empresa. Nao ha visao consolidada multi-empresa."));

// --- Saldo Bancario ---
children.push(heading2("5.2 Regras de Saldo Bancario"));

children.push(heading3("RN-07 — Saldo Inicial do Periodo"));
children.push(para("O saldo inicial e obtido da tabela TGFSBC, considerando a data imediatamente anterior ao inicio do periodo selecionado. O valor e a soma dos saldos de todas as contas bancarias da empresa (CODEMP) naquela data."));
children.push(para([
  { text: "Formula: ", bold: true },
  { text: "Saldo Inicial = SUM(TGFSBC.SALDO) WHERE CODEMP = [empresa] AND DTSALDO = [data_inicio - 1]" },
]));
children.push(para([
  { text: "Exemplo: ", bold: true },
  { text: "Empresa CODEMP=1, periodo 01/03 a 31/03. Saldo em 28/02: Conta Itau R$ 500.000 + Conta Bradesco R$ 300.000 = Saldo Inicial R$ 800.000,00." },
]));

children.push(heading3("RN-08 — Saldo Bancario Alimenta Nos Analiticos"));
children.push(para("Os nos Analiticos vinculados a naturezas de movimentacao bancaria exibem os valores extraidos da tabela TGFSBC, cruzando com TSICTA (contas) e TSIBCO (bancos) para identificar a origem dos valores."));

children.push(heading3("RN-09 — Relacionamento de Contas e Bancos"));
children.push(para("O sistema utiliza a tabela TSICTA para relacionar as contas bancarias com suas respectivas contas contabeis, e a tabela TSIBCO para identificar o banco de cada conta. Esse relacionamento permite agrupar e detalhar os saldos por banco/conta quando necessario."));

// --- Visualizacao ---
children.push(heading2("5.3 Regras de Visualizacao"));

children.push(heading3("RN-10 — Granularidade Temporal"));
children.push(para("As colunas de dados da tabela hierarquica seguem a granularidade selecionada pelo usuario: Diario (uma coluna por dia), Semanal (uma coluna por semana, agregando seg-dom) ou Mensal (uma coluna por mes). A coluna TOTAL sempre exibe a soma de todas as colunas do periodo."));

children.push(heading3("RN-11 — Expand/Collapse da Hierarquia"));
children.push(para("Nos Sinteticos podem ser expandidos (exibem filhos) ou recolhidos (exibem apenas o total do no). O estado padrao ao carregar e todos os niveis 1 expandidos e demais recolhidos. Os botoes 'Expandir' e 'Recolher' aplicam a acao a todos os nos simultaneamente."));

children.push(heading3("RN-12 — Saldo Inicial como Primeira Linha"));
children.push(para("A primeira linha da tabela hierarquica exibe o saldo bancario inicial (conforme RN-07), antes da hierarquia definida pelo usuario. Essa linha nao e editavel na parametrizacao."));

children.push(heading3("RN-13 — Saldo Final como Ultima Linha"));
children.push(para("A ultima linha exibe o saldo final calculado: Saldo Inicial + soma de todas as movimentacoes do periodo. Essa linha tambem nao e editavel na parametrizacao."));
children.push(para([
  { text: "Formula: ", bold: true },
  { text: "Saldo Final = Saldo Inicial + SUM(todos os nos Analiticos do periodo)" },
]));

// --- Parametrizacao ---
children.push(heading2("5.4 Regras de Parametrizacao"));

children.push(heading3("RN-14 — Estrutura do No na Configuracao"));
children.push(para("Cada no da hierarquia possui os seguintes atributos configurados pelo usuario:"));
children.push(makeTable([2800, 6560],
  ["Atributo", "Descricao"],
  [
    ["Codigo", "Identificador unico do no (gerado automaticamente)"],
    ["Descricao", "Nome de exibicao do no (texto livre, max 120 caracteres)"],
    ["Nivel", "Numero de 1 a 4 indicando a profundidade na hierarquia"],
    ["Tipo", "Sintetico (totalizador) ou Analitico (vinculado a Natureza)"],
    ["No Pai", "Referencia ao no superior (obrigatorio para niveis 2, 3 e 4)"],
    ["Ordem", "Numero inteiro que define a posicao de exibicao entre irmaos"],
    ["Natureza (CODNAT)", "Codigo da natureza TGFNAT (obrigatorio e exclusivo para nos Analiticos)"],
  ]
));

children.push(heading3("RN-15 — Validacoes na Configuracao"));
children.push(para("O sistema deve validar as seguintes regras ao salvar a hierarquia:"));
children.push(para([
  { text: "a) ", bold: true },
  { text: "Nos de nivel 1 nao podem ter no pai." },
]));
children.push(para([
  { text: "b) ", bold: true },
  { text: "Nos de niveis 2, 3 e 4 devem ter um no pai de nivel imediatamente superior." },
]));
children.push(para([
  { text: "c) ", bold: true },
  { text: "Nos Analiticos devem ter uma Natureza (CODNAT) vinculada." },
]));
children.push(para([
  { text: "d) ", bold: true },
  { text: "Nos Sinteticos nao podem ter Natureza vinculada." },
]));
children.push(para([
  { text: "e) ", bold: true },
  { text: "Uma mesma Natureza nao pode aparecer em mais de um no Analitico." },
]));
children.push(para([
  { text: "f) ", bold: true },
  { text: "Nos Sinteticos devem ter pelo menos um filho (nao podem ser folhas vazias)." },
]));

children.push(heading3("RN-16 — Hierarquia por Empresa ou Global"));
children.push(para("A definicao de hierarquia e global, ou seja, a mesma estrutura se aplica a todas as empresas. Os dados exibidos sao filtrados por empresa (CODEMP), mas a estrutura hierarquica e unica e compartilhada. Todas as naturezas (TGFNAT) utilizadas por qualquer empresa devem estar mapeadas na hierarquia."));

// ---------- 6. FLUXO PRINCIPAL ----------
children.push(heading1("6. Fluxo Principal"));
children.push(para("Caminho feliz — da configuracao da hierarquia ate a visualizacao do fluxo de caixa."));
children.push(makeTable([900, 8460],
  ["Passo", "Descricao"],
  [
    ["1", "O Administrador acessa a tela de Parametrizacao da Hierarquia no menu de configuracoes."],
    ["2", "O sistema exibe a hierarquia atual (se existir) em formato de arvore, com opcoes de criar, editar e excluir nos."],
    ["3", "O Administrador cria os nos de nivel 1 (Sinteticos), definindo descricao e ordem de exibicao. Ex.: 'Atividades Operacionais', 'Atividades de Investimento', 'Atividades de Financiamento'."],
    ["4", "O Administrador cria sub-nos (niveis 2, 3 ou 4), selecionando o no pai, definindo tipo (Sintetico ou Analitico), descricao e ordem."],
    ["5", "Para cada no Analitico, o Administrador seleciona a Natureza (TGFNAT) correspondente a partir de uma lista de naturezas disponiveis (nao vinculadas a outros nos)."],
    ["6", "O sistema valida a hierarquia conforme RN-15. Se valida, salva a configuracao. Se invalida, exibe os erros encontrados."],
    ["7", "O Gestor Financeiro acessa a tela de Fluxo de Caixa e seleciona a empresa desejada no filtro."],
    ["8", "O sistema carrega o saldo inicial (RN-07) a partir da TGFSBC para a empresa e data selecionadas."],
    ["9", "O usuario seleciona o periodo e a granularidade (Diario, Semanal ou Mensal)."],
    ["10", "O sistema carrega as movimentacoes por Natureza (TGFNAT) e calcula os valores de cada no Analitico para cada coluna de periodo."],
    ["11", "O sistema calcula os nos Sinteticos (soma dos filhos) de baixo para cima, nivel 4 ate nivel 1."],
    ["12", "O sistema exibe a tabela hierarquica com: Saldo Inicial (1a linha), hierarquia configurada (expand/collapse), Saldo Final (ultima linha) e coluna TOTAL."],
  ]
));

// ---------- 7. FLUXOS ALTERNATIVOS ----------
children.push(heading1("7. Fluxos Alternativos e Excecoes"));
children.push(makeTable([900, 2600, 5860],
  ["ID", "Cenario", "Comportamento Esperado"],
  [
    ["FA-01", "Hierarquia nao configurada", "O sistema exibe mensagem orientando o Administrador a configurar a hierarquia antes de visualizar o fluxo. O menu de Fluxo de Caixa permanece acessivel mas a tabela fica vazia com aviso."],
    ["FA-02", "Natureza sem no Analitico vinculado", "Movimentacoes de naturezas nao mapeadas na hierarquia nao aparecem na tabela. O sistema deve exibir um indicador (badge ou alerta) informando que existem naturezas nao classificadas e seu valor total."],
    ["FA-03", "No Analitico sem movimentacao no periodo", "O no Analitico e exibido com valor R$ 0,00 em todas as colunas. Nao e ocultado."],
    ["FA-04", "Empresa sem saldo bancario (TGFSBC)", "O saldo inicial e exibido como R$ 0,00 com indicador visual de que nao ha dados de saldo para o periodo."],
    ["FA-05", "Exclusao de no Sintetico com filhos", "O sistema impede a exclusao e exibe mensagem: 'Nao e possivel excluir um no que possui filhos. Remova os sub-niveis primeiro.'"],
    ["FA-06", "Tentativa de vincular Natureza ja utilizada", "O sistema impede o vinculo e exibe mensagem: 'Esta Natureza ja esta vinculada ao no [descricao]. Cada Natureza so pode aparecer uma vez na hierarquia.'"],
    ["FA-07", "Edicao de hierarquia em uso", "Alteracoes na hierarquia sao salvas e refletidas imediatamente para todos os usuarios na proxima consulta. Sessoes abertas continuam com a hierarquia anterior ate o proximo carregamento."],
    ["FA-08", "Periodo sem movimentacoes", "A tabela exibe a hierarquia completa com todos os valores zerados. O saldo final sera igual ao saldo inicial."],
    ["FA-09", "TGFSBC com multiplos registros na mesma data/conta", "O sistema deve considerar o registro mais recente (maior timestamp) ou somar, conforme definido pelo Sankhya. Ver PA-03."],
    ["FA-10", "Indisponibilidade do Sankhya", "O sistema exibe mensagem de indisponibilidade com data/hora da ultima sincronizacao bem-sucedida."],
    ["FA-11", "No Sintetico sem filhos apos exclusao", "O sistema sinaliza o no como invalido na tela de parametrizacao e impede o salvamento da hierarquia ate que o no tenha pelo menos um filho ou seja excluido."],
    ["FA-12", "Reordenacao de nos", "O Administrador pode alterar a ordem dos nos arrastando-os (drag-and-drop) ou editando o campo numerico de ordem. O sistema reordena automaticamente os irmaos."],
  ]
));

// ---------- 8. CRITERIOS DE ACEITE ----------
children.push(heading1("8. Criterios de Aceite"));
children.push(makeTable([900, 8460],
  ["ID", "Criterio"],
  [
    ["CA-01", "O Administrador consegue criar uma hierarquia com ate 4 niveis de profundidade, definindo descricao, tipo (Sintetico/Analitico) e ordem para cada no."],
    ["CA-02", "Nos Sinteticos exibem a soma exata dos valores de seus filhos diretos em cada coluna de periodo."],
    ["CA-03", "Nos Analiticos exibem os valores reais das movimentacoes da Natureza (TGFNAT) vinculada."],
    ["CA-04", "Cada Natureza (CODNAT) so pode ser vinculada a um unico no Analitico. O sistema impede vinculos duplicados."],
    ["CA-05", "O saldo inicial (primeira linha) corresponde ao saldo bancario (TGFSBC) na data anterior ao inicio do periodo, somando todas as contas da empresa."],
    ["CA-06", "O saldo final (ultima linha) e igual ao Saldo Inicial + soma de todos os nos Analiticos do periodo."],
    ["CA-07", "O filtro de empresa (CODEMP) carrega apenas os dados da empresa selecionada."],
    ["CA-08", "A granularidade Diaria exibe uma coluna por dia; Semanal uma coluna por semana; Mensal uma coluna por mes."],
    ["CA-09", "A coluna TOTAL exibe a soma de todas as colunas de periodo para cada no."],
    ["CA-10", "Os botoes Expandir/Recolher funcionam para toda a hierarquia simultaneamente."],
    ["CA-11", "O sistema exibe alerta quando existem naturezas com movimentacao que nao estao mapeadas na hierarquia (FA-02)."],
    ["CA-12", "A exclusao de no Sintetico com filhos e bloqueada com mensagem explicativa."],
    ["CA-13", "A tela de parametrizacao exibe preview da hierarquia em formato de arvore antes de salvar."],
    ["CA-14", "As validacoes de RN-15 (a ate f) sao aplicadas e mensagens de erro sao exibidas ao usuario."],
    ["CA-15", "O sistema carrega corretamente os dados das tabelas TGFSBC, TSICTA e TSIBCO para compor saldos e relacionamentos."],
    ["CA-16", "Nos Analiticos sem movimentacao no periodo exibem R$ 0,00 e nao sao ocultados."],
    ["CA-17", "Alteracoes na hierarquia sao refletidas na proxima consulta ao Fluxo de Caixa."],
    ["CA-18", "O sistema funciona corretamente com hierarquias de 1, 2, 3 e 4 niveis (nao obriga uso de todos os niveis)."],
  ]
));

// ---------- 9. PONTOS EM ABERTO ----------
children.push(heading1("9. Pontos em Aberto"));
children.push(makeTable([900, 2600, 5860],
  ["ID", "Ponto", "Questao"],
  [
    ["PA-02", "Campos especificos do TGFNAT", "Quais campos da TGFNAT serao utilizados alem de CODNAT? A descricao (DESCRNAT) e suficiente ou ha campos adicionais (grupo, tipo, ativo/inativo) que devem ser considerados na selecao?"],
    ["PA-03", "TGFSBC com registros duplicados", "Quando existem multiplos registros de saldo na TGFSBC para a mesma conta/data, qual registro deve prevalecer? O mais recente? A soma? O Sankhya tem regra padrao para isso?"],
    ["PA-04", "Permissoes de parametrizacao", "Apenas o perfil Administrador pode configurar a hierarquia, ou outros perfis tambem terao acesso? Deve haver log de auditoria das alteracoes?"],
    ["PA-05", "Naturezas inativas", "O TGFNAT possui naturezas inativas ou descontinuadas? Se sim, devem ser filtradas na selecao de vinculo do no Analitico?"],
    ["PA-06", "Movimentacoes entre contas", "Transferencias entre contas bancarias da mesma empresa devem aparecer como entrada e saida (duplicando) ou devem ser anuladas/ocultadas na hierarquia?"],
    ["PA-07", "Exportacao", "A exportacao (PDF/Excel) deve respeitar o estado atual de expand/collapse ou sempre exportar a hierarquia completa expandida?"],
    ["PA-08", "Saldo por conta bancaria", "O saldo inicial deve ser exibido como total unico ou com detalhamento por conta bancaria/banco (usando TSICTA e TSIBCO)?"],
  ]
));

children.push(spacer(200));
children.push(highlightBox("Nota:", "Quando os pontos acima forem respondidos, as respostas serao incorporadas como Regras de Negocio ou Fluxos Alternativos, e os pontos serao removidos desta lista. A versao do documento sera incrementada.", COLORS.primary));

// ===== DOCUMENTO =====
const MODULE_NAME = "Fluxo de Caixa — Hierarquia Parametrizavel";
const VERSION = "v2.1";

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

const OUTPUT = "/home/lemoreira/git/projetos/Maelly/Fluxo de Caixa/Escopo_Tecnico_Maelly_Hierarquia_FluxoCaixa_v2.1.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log("Documento criado: " + OUTPUT);
});
