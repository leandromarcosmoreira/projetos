const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

// ===== DESIGN TOKENS =====
const COLORS = {
  primary: "1B5E7B",
  accent: "E8F4F8",
  headerBg: "1B5E7B",
  headerText: "FFFFFF",
  lightGray: "F5F5F5",
  darkText: "333333",
  border: "CCCCCC",
  muted: "999999",
  red: "C0392B",
  orange: "E67E22",
  green: "27AE60",
  yellow: "F39C12",
};
const FONTS = { main: "Arial" };
const border = { style: BorderStyle.SINGLE, size: 1, color: COLORS.border };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };
const TOTAL_WIDTH = 9360;

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
  const shade = opts.shade
    ? { fill: COLORS.lightGray, type: ShadingType.CLEAR }
    : (opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined);
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA }, shading: shade, margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, font: FONTS.main, size: 20, color: opts.color || COLORS.darkText, bold: opts.bold || false, italics: opts.italics || false })] })],
  });
}

function makeTable(colWidths, headerTexts, dataRows) {
  return new Table({
    width: { size: TOTAL_WIDTH, type: WidthType.DXA },
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

// ===== CONTEÚDO =====
const children = [];

// ── CAPA ──
children.push(spacer(800));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "ESCOPO TÉCNICO FUNCIONAL", font: FONTS.main, size: 36, bold: true, color: COLORS.primary })],
  spacing: { after: 120 },
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "Módulo: Fluxo de Caixa — BeaBisa IA Analytics", font: FONTS.main, size: 26, bold: true, color: COLORS.darkText })],
  spacing: { after: 480 },
}));

children.push(makeTable(
  [2800, 6560],
  ["Campo", "Valor"],
  [
    ["Projeto", "BeaBisa IA — Plataforma Analytics"],
    ["Módulo", "Controladoria / Fluxo de Caixa"],
    ["Versão", "v2.0"],
    ["Data", "04/03/2026"],
    ["Elaborado por", "Neuon Soluções"],
    ["Status", "Em elaboração — Pontos em Aberto pendentes"],
  ]
));
children.push(spacer(400));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ── 1. OBJETIVO ──
children.push(heading1("1. Objetivo"));
children.push(para("Este documento especifica os requisitos funcionais do módulo Fluxo de Caixa da plataforma BeaBisa IA Analytics, abrangendo as visões de Fluxo de Caixa Direto e Fluxo de Caixa Indireto sob a área de Controladoria."));
children.push(para("O módulo tem como propósito oferecer aos gestores e analistas financeiros da BeaBisa uma visão analítica consolidada do fluxo de entrada e saída de recursos financeiros, permitindo o acompanhamento do desempenho de caixa por período e por empresa."));
children.push(para("As telas são acessadas via link web com autenticação integrada ao ERP Sankhya. O Fluxo de Caixa Direto utiliza como base de dados planilhas Excel externas ao Sankhya, enquanto o Fluxo de Caixa Indireto consome dados diretamente do Sankhya."));
children.push(spacer());

// ── 2. ATORES E PERSONAS ──
children.push(heading1("2. Atores e Personas"));
children.push(makeTable(
  [2000, 2500, 4860],
  ["Persona", "Responsabilidade", "Interação com o Sistema"],
  [
    ["Analista Financeiro / Controladoria", "Acompanhar o fluxo de caixa operacional e elaborar análises periódicas", "Acessa as telas, aplica filtros de período e empresa, exporta dados para análise"],
    ["Gestor / Diretor Financeiro", "Validar resultados e tomar decisões estratégicas com base nos indicadores", "Visualiza os painéis em modo leitura; aplica filtros para comparar períodos e empresas"],
    ["Administrador da Plataforma", "Manter a base de dados do Fluxo de Caixa Direto (planilha Excel) atualizada", "Realiza a carga/atualização da planilha Excel que alimenta o painel Direto"],
    ["Usuário Sankhya (Genérico)", "Qualquer usuário com acesso ao link e credenciais Sankhya válidas", "Autentica via credenciais Sankhya e acessa somente as telas de Analytics autorizadas"],
  ]
));
children.push(spacer());

// ── 3. PRÉ-CONDIÇÕES ──
children.push(heading1("3. Pré-Condições"));
children.push(makeTable(
  [900, 5600, 2860],
  ["ID", "Descrição", "Tipo"],
  [
    ["PC-01", "ERP Sankhya ativo com movimentações financeiras lançadas e atualizadas para os períodos analisados", "Obrigatória"],
    ["PC-02", "Usuário possui credenciais válidas no ERP Sankhya", "Obrigatória"],
    ["PC-03", "Link de acesso ao painel Analytics foi enviado ao usuário por e-mail", "Obrigatória"],
    ["PC-04", "Planilha Excel com dados do Fluxo de Caixa Direto carregada e atualizada na plataforma", "Obrigatória (somente para painel Direto)"],
    ["PC-05", "A estrutura de contas e categorias do Fluxo de Caixa está parametrizada no Sankhya", "Obrigatória (somente para painel Indireto)"],
    ["PC-06", "O usuário possui permissão de acesso ao módulo Analytics no Sankhya", "Desejável"],
  ]
));
children.push(spacer());

// ── 4. GLOSSÁRIO ──
children.push(heading1("4. Glossário"));
children.push(makeTable(
  [2800, 6560],
  ["Termo", "Definição"],
  [
    ["Fluxo de Caixa Direto (FCD)", "Demonstração financeira que evidencia as entradas e saídas brutas de caixa classificadas por atividade (operacional, investimento e financiamento), com origem em dados de planilha Excel externa ao Sankhya"],
    ["Fluxo de Caixa Indireto (FCI)", "Demonstração financeira que parte do lucro/prejuízo líquido e aplica ajustes de itens não-caixa para chegar à variação do caixa, com dados provenientes do ERP Sankhya"],
    ["ERP Sankhya", "Sistema de Gestão Empresarial (Enterprise Resource Planning) utilizado pela BeaBisa como fonte primária de dados financeiros, contábeis e operacionais"],
    ["Período", "Intervalo de tempo selecionado pelo usuário como filtro nas telas de análise (ex.: mês, trimestre, semestre ou ano)"],
    ["Empresa", "Entidade jurídica ou unidade de negócios da BeaBisa cadastrada no Sankhya, utilizada como filtro de segmentação dos relatórios"],
    ["Atividades Operacionais", "Entradas e saídas de caixa decorrentes das operações principais do negócio (recebimentos de clientes, pagamentos a fornecedores, salários, etc.)"],
    ["Atividades de Investimento", "Entradas e saídas de caixa relacionadas à aquisição e venda de ativos de longo prazo (imóveis, equipamentos, investimentos)"],
    ["Atividades de Financiamento", "Entradas e saídas de caixa decorrentes de captações, amortizações de dívidas e distribuição de dividendos"],
    ["Planilha de Base (Excel)", "Arquivo de planilha eletrônica mantido externamente ao Sankhya que serve de fonte de dados para o painel Fluxo de Caixa Direto"],
    ["Carga de Dados", "Processo de importação ou atualização da planilha Excel na plataforma Analytics para disponibilizar dados atualizados no painel Direto"],
    ["Saldo de Caixa Inicial / Final", "Valores que representam o caixa disponível no início e no fim do período analisado, calculados pela soma algébrica das atividades"],
    ["Analytics / BeaBisa IA", "Plataforma de Business Intelligence da BeaBisa, acessível via link web com autenticação Sankhya, que centraliza os painéis gerenciais de todas as áreas"],
  ]
));
children.push(spacer());

// ── 5. REGRAS DE NEGÓCIO ──
children.push(heading1("5. Regras de Negócio"));

children.push(heading2("RN-01 — Fonte de dados do Fluxo de Caixa Direto"));
children.push(para("O painel Fluxo de Caixa Direto obtém seus dados exclusivamente de uma planilha Excel externa ao Sankhya. O sistema não extrai os dados de Direto do ERP. A planilha deve seguir o layout padrão acordado com a Neuon para que a leitura ocorra corretamente."));
children.push(highlightBox("Ponto em Aberto:", "O layout exato da planilha Excel (colunas, linhas, categorias esperadas) ainda não foi definido. Ver PA-01.", COLORS.orange));
children.push(spacer());

children.push(heading2("RN-02 — Fonte de dados do Fluxo de Caixa Indireto"));
children.push(para("O painel Fluxo de Caixa Indireto obtém seus dados diretamente do ERP Sankhya. O cálculo parte do resultado líquido do período e aplica os ajustes de itens não-caixa (depreciação, variações de capital de giro, etc.) para chegar à variação líquida do caixa por categoria de atividade."));
children.push(highlightBox("Ponto em Aberto:", "As contas e campos específicos do Sankhya que alimentam cada linha do FCI ainda precisam ser levantados. Ver PA-02.", COLORS.orange));
children.push(spacer());

children.push(heading2("RN-03 — Filtro por Período"));
children.push(para("Ambos os painéis (Direto e Indireto) disponibilizam filtro de período. O usuário seleciona o intervalo desejado antes de visualizar os dados. O sistema exibe somente os dados correspondentes ao período selecionado."));
children.push(highlightBox("Ponto em Aberto:", "A granularidade do período (mensal, trimestral, anual, range customizado) não foi definida. Ver PA-03.", COLORS.orange));
children.push(spacer());

children.push(heading2("RN-04 — Filtro por Empresa"));
children.push(para("Ambos os painéis disponibilizam filtro por empresa. O painel exibe somente os dados da empresa selecionada. O usuário visualiza somente as empresas às quais possui acesso conforme permissão Sankhya."));
children.push(highlightBox("Ponto em Aberto:", "Seleção múltipla de empresas e visão consolidada não foram definidas. Ver PA-04.", COLORS.orange));
children.push(spacer());

children.push(heading2("RN-05 — Autenticação via Sankhya"));
children.push(para("O acesso à plataforma Analytics é realizado mediante autenticação com usuário e senha do ERP Sankhya. Não há cadastro separado de usuários na plataforma Analytics. As permissões de acesso são herdadas do perfil Sankhya do usuário."));
children.push(spacer());

children.push(heading2("RN-06 — Acesso por Link de E-mail"));
children.push(para("O ponto de entrada da plataforma Analytics é um link enviado ao usuário por e-mail. Ao acessar o link, o usuário é direcionado para a tela de login com credenciais Sankhya. Este comportamento está contratado e acordado entre BeaBisa e Neuon."));
children.push(spacer());

children.push(heading2("RN-07 — Estrutura de Apresentação do Fluxo de Caixa Direto"));
children.push(para("O painel Direto apresenta as movimentações de caixa agrupadas em três blocos: Atividades Operacionais, Atividades de Investimento e Atividades de Financiamento. Cada bloco exibe suas linhas de receita/despesa com os respectivos valores e o subtotal do bloco. O saldo de caixa inicial, a variação líquida e o saldo de caixa final são exibidos ao final."));
children.push(highlightBox("Ponto em Aberto:", "As linhas específicas dentro de cada bloco (ex.: 'Recebimentos de Clientes', 'Pagamentos a Fornecedores') dependem do layout da planilha Excel. Ver PA-01.", COLORS.orange));
children.push(spacer());

children.push(heading2("RN-08 — Estrutura de Apresentação do Fluxo de Caixa Indireto"));
children.push(para("O painel Indireto parte do Resultado Líquido do exercício (conforme DRE do Sankhya) e apresenta os ajustes classificados por natureza: ajustes de itens não-caixa (depreciação, amortização), variações no capital de giro (clientes, estoques, fornecedores) e variações em atividades de investimento e financiamento. O saldo de caixa final é calculado automaticamente."));
children.push(spacer());

children.push(heading2("RN-09 — Atualização de Dados"));
children.push(para("Os dados do painel Indireto refletem as informações disponíveis no Sankhya no momento da consulta. Os dados do painel Direto refletem a última carga da planilha Excel realizada pelo Administrador. O sistema deve indicar a data e hora da última atualização dos dados em cada painel."));
children.push(spacer());

// ── 6. FLUXO PRINCIPAL ──
children.push(heading1("6. Fluxo Principal (Caminho Feliz)"));
children.push(makeTable(
  [900, 8460],
  ["Passo", "Descrição"],
  [
    ["1", "O usuário recebe o link de acesso ao painel Analytics por e-mail"],
    ["2", "O usuário acessa o link no navegador e a plataforma exibe a tela de autenticação Sankhya"],
    ["3", "O usuário informa seu usuário e senha do Sankhya e confirma o login"],
    ["4", "O sistema valida as credenciais junto ao Sankhya e, em caso de sucesso, redireciona para a home da plataforma Analytics"],
    ["5", "O usuário navega pelo menu: Controladoria → Fluxo de Caixa Direto (ou Indireto)"],
    ["6", "O sistema exibe a tela do painel selecionado com os filtros de Período e Empresa disponíveis"],
    ["7", "O usuário seleciona o período desejado no filtro de período"],
    ["8", "O usuário seleciona a empresa desejada no filtro de empresa"],
    ["9", "O sistema carrega e exibe a demonstração do Fluxo de Caixa com os dados correspondentes ao período e empresa selecionados"],
    ["10", "O painel apresenta os valores por categoria de atividade (Operacional, Investimento, Financiamento), com subtotais e saldo de caixa final"],
    ["11", "O sistema exibe a data e hora da última atualização dos dados"],
    ["12", "O usuário analisa os dados e, se necessário, ajusta os filtros para outra combinação de período/empresa"],
  ]
));
children.push(spacer());

// ── 7. FLUXOS ALTERNATIVOS E EXCEÇÕES ──
children.push(heading1("7. Fluxos Alternativos e Exceções"));
children.push(makeTable(
  [900, 2600, 5860],
  ["ID", "Cenário", "Comportamento Esperado"],
  [
    ["FA-01", "Credenciais Sankhya inválidas", "O sistema exibe mensagem de erro informando que usuário ou senha estão incorretos. O usuário permanece na tela de login para nova tentativa."],
    ["FA-02", "Usuário sem permissão de acesso ao Analytics", "Após autenticação, o sistema exibe mensagem informando que o usuário não possui acesso ao módulo Analytics e orienta a contatar o administrador."],
    ["FA-03", "Nenhum dado disponível para o período/empresa selecionados", "O sistema exibe a estrutura do painel com valores zerados ou mensagem de estado vazio ('Nenhum dado encontrado para o período selecionado')."],
    ["FA-04", "Planilha Excel do Fluxo Direto não carregada ou desatualizada", "O sistema exibe aviso informando que os dados do Fluxo de Caixa Direto estão indisponíveis ou desatualizados, com a data da última carga disponível."],
    ["FA-05", "Sessão expirada por inatividade", "O sistema redireciona o usuário para a tela de login com mensagem informando que a sessão expirou."],
    ["FA-06", "Erro de comunicação com o Sankhya (painel Indireto)", "O sistema exibe mensagem de erro genérica informando que não foi possível carregar os dados no momento e sugere tentar novamente."],
    ["FA-07", "Usuário tenta acessar o link de e-mail após o prazo de validade", "⚠ Comportamento a definir — verificar se o link tem validade ou é permanente. Ver PA-05."],
  ]
));
children.push(spacer());

// ── 8. CRITÉRIOS DE ACEITE ──
children.push(heading1("8. Critérios de Aceite"));
children.push(makeTable(
  [900, 8460],
  ["ID", "Critério"],
  [
    ["CA-01", "O sistema autentica o usuário com credenciais válidas do Sankhya e redireciona para a home do Analytics em até 5 segundos"],
    ["CA-02", "O sistema recusa autenticação com credenciais inválidas e exibe mensagem de erro sem revelar qual campo está incorreto"],
    ["CA-03", "O painel Fluxo de Caixa Direto carrega dados exclusivamente da planilha Excel definida, não do Sankhya"],
    ["CA-04", "O painel Fluxo de Caixa Indireto carrega dados exclusivamente do Sankhya, sem dependência de planilha Excel"],
    ["CA-05", "Ao aplicar o filtro de período, o painel atualiza todos os valores exibidos para o intervalo selecionado"],
    ["CA-06", "Ao aplicar o filtro de empresa, o painel exibe somente os dados da empresa selecionada"],
    ["CA-07", "O painel Direto apresenta os dados agrupados em Atividades Operacionais, Atividades de Investimento e Atividades de Financiamento com subtotais por grupo"],
    ["CA-08", "O painel Indireto apresenta o Resultado Líquido como ponto de partida e demonstra os ajustes que chegam ao saldo final de caixa"],
    ["CA-09", "Ambos os painéis exibem o saldo de caixa inicial, a variação líquida do período e o saldo de caixa final"],
    ["CA-10", "O sistema exibe a data e hora da última atualização de dados em cada painel"],
    ["CA-11", "Quando não há dados para o período/empresa selecionados, o sistema exibe estado vazio com mensagem informativa (valores não devem aparecer como nulo ou erro)"],
    ["CA-12", "Quando a planilha Excel não está carregada, o painel Direto exibe aviso explícito de indisponibilidade de dados em vez de valores zerados"],
    ["CA-13", "A sessão é encerrada automaticamente após o período de inatividade e o usuário é redirecionado para login com mensagem de sessão expirada"],
    ["CA-14", "Usuário sem permissão no Sankhya para acessar o Analytics recebe mensagem de acesso negado após autenticação bem-sucedida"],
    ["CA-15", "O menu de navegação exibe corretamente: Controladoria → Fluxo de Caixa Direto e Controladoria → Fluxo de Caixa Indireto como itens distintos"],
  ]
));
children.push(spacer());

// ── 9. PONTOS EM ABERTO ──
children.push(heading1("9. Pontos em Aberto"));
children.push(makeTable(
  [900, 2600, 5860],
  ["ID", "Ponto", "Questão"],
  [
    ["PA-01", "Layout da planilha Excel (FCD)", "Qual é o layout padrão da planilha Excel que alimenta o Fluxo de Caixa Direto? Quais colunas, linhas e categorias são esperadas? Quem é o responsável por manter o arquivo?"],
    ["PA-02", "Campos Sankhya para o FCI", "Quais contas, naturezas financeiras ou campos específicos do Sankhya alimentam cada linha do Fluxo de Caixa Indireto? A estrutura já está parametrizada?"],
    ["PA-03", "Granularidade do filtro de período", "O filtro de período permite seleção por: mês, trimestre, semestre, ano, ou range customizado de datas? Qual é a opção padrão ao abrir o painel?"],
    ["PA-04", "Seleção múltipla de empresas e visão consolidada", "O usuário pode selecionar mais de uma empresa ao mesmo tempo? Há uma opção 'Todas as Empresas' com visão consolidada?"],
    ["PA-05", "Validade do link de acesso por e-mail", "O link enviado por e-mail tem prazo de validade ou é permanente? Há processo de renovação ou reenvio?"],
    ["PA-06", "Processo de carga da planilha Excel", "Como o Administrador realiza a carga/atualização da planilha Excel? Upload manual na plataforma? Integração automática? Com que frequência deve ser atualizada?"],
    ["PA-07", "Permissão de acesso granular", "Todos os usuários Sankhya têm acesso a todas as empresas no painel, ou o acesso é segmentado por empresa de acordo com o perfil Sankhya?"],
    ["PA-08", "Exportação de dados", "O usuário deve poder exportar os dados do painel (PDF, Excel)? Este requisito está no escopo atual ou é fase futura?"],
  ]
));
children.push(spacer());

// ===== ESTRUTURA DO DOCUMENTO =====
const MODULE_NAME = "BeaBisa IA — Fluxo de Caixa";
const VERSION = "v2.0";

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
            new TextRun({ text: "Página ", font: FONTS.main, size: 16, color: COLORS.muted }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONTS.main, size: 16, color: COLORS.muted }),
          ],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("Escopo-Tecnico-BeaBisa-FluxoCaixa-v2.0.docx", buffer);
  console.log("Documento criado com sucesso: Escopo-Tecnico-BeaBisa-FluxoCaixa-v2.0.docx");
});
