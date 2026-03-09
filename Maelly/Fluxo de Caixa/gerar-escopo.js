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
    border: { left: { style: BorderStyle.SINGLE, size: 12, color, space: 8 } },
    indent: { left: 200 },
    spacing: { after: 140, line: 276 },
    children: [
      new TextRun({ text: label + " ", font: FONTS.main, size: 21, bold: true, color }),
      new TextRun({ text, font: FONTS.main, size: 21, color: COLORS.darkText }),
    ],
  });
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
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
  children: [new TextRun({ text: "Módulo: Fluxo de Caixa — Maelly Analytics", font: FONTS.main, size: 26, bold: true, color: COLORS.darkText })],
  spacing: { after: 480 },
}));
children.push(makeTable(
  [2800, 6560],
  ["Campo", "Valor"],
  [
    ["Projeto", "Maelly — Plataforma Analytics de Fluxo de Caixa"],
    ["Módulo", "Controladoria / Fluxo de Caixa (Direto e Indireto) + Estoque e Custos"],
    ["Versão", "v1.0"],
    ["Data", "04/03/2026"],
    ["Elaborado por", "Neuon Soluções"],
    ["Revisado por", "Maelly — Gestão Comercial e Financeira"],
    ["Status", "Versão inicial — Em revisão com o cliente"],
    ["ERP", "Sankhya"],
    ["Sistema auxiliar", "Econto (controle de estoque)"],
    ["Segmento", "Varejo — Material Esportivo (Grupo 10101)"],
  ]
));
children.push(spacer(280));

children.push(heading3("Histórico de Versões"));
children.push(makeTable(
  [1200, 1400, 6760],
  ["Versão", "Data", "Descrição das Alterações"],
  [
    ["v1.0", "04/03/2026", "Primeira versão estruturada. Levantamento realizado com base em planilha de estoque (3º Trim. 2025), cadastro de produtos no Sankhya (Grupo 10101 — Material Esportivo) e reuniões de alinhamento com a equipe Maelly. Cobre: Dashboard, FCD, FCI, Análise de Estoque e Custos."],
  ]
));
children.push(spacer(400));
children.push(pageBreak());

// ── 1. OBJETIVO ──
children.push(heading1("1. Objetivo"));
children.push(para("Este documento especifica os requisitos funcionais do módulo Fluxo de Caixa da plataforma Maelly Analytics, abrangendo as visões de Dashboard Principal, Fluxo de Caixa Direto (FCD), Fluxo de Caixa Indireto (FCI) e Análise de Estoque e Custos. O sistema é voltado para empresas do segmento de varejo de Material Esportivo, com produtos cadastrados no ERP Sankhya e controle de estoque complementado pelo sistema Econto."));
children.push(para("O módulo tem como propósito oferecer à gestão da Maelly uma visão analítica completa do fluxo de entrada e saída de recursos financeiros, com rastreabilidade por produto, categoria e período. O sistema permite acompanhar o desempenho de caixa, identificar o giro e a cobertura de estoque, calcular margens por produto (incluindo custo de personalização) e comparar resultados entre períodos, apoiando decisões de compra, precificação e estratégia comercial."));
children.push(para("O FCD utiliza como base de dados o sistema Econto e/ou planilhas externas ao Sankhya (recebimentos e pagamentos). O FCI consome dados diretamente do ERP Sankhya, partindo do Resultado Líquido e aplicando ajustes de itens não-caixa e variações de capital de giro. Ambos os painéis são acessados via link web com autenticação integrada ao ERP Sankhya."));
children.push(spacer());

// ── 2. ATORES E PERSONAS ──
children.push(heading1("2. Atores e Personas"));
children.push(makeTable(
  [2000, 2500, 4860],
  ["Persona", "Responsabilidade", "Interação com o Sistema"],
  [
    ["Gestor Financeiro / Proprietário", "Acompanhar o resultado global de caixa, avaliar a saúde financeira da empresa por período e tomar decisões estratégicas de compra, precificação e distribuição de resultado", "Acessa todos os painéis em modo leitura. Utiliza KPIs do Dashboard, compara períodos, visualiza Fluxo Direto e Indireto, analisa margens por produto e exporta relatórios para PDF e Excel"],
    ["Gestor Comercial / Compras", "Monitorar o giro de estoque, identificar produtos com maior e menor saída, negociar compras com fornecedores e avaliar o impacto do custo de personalização na margem", "Acessa principalmente o painel de Estoque e Custos. Aplica filtros por categoria, fornecedor e período. Analisa CMV, margem bruta por produto e custo de personalização"],
    ["Analista Financeiro / Controladoria", "Elaborar análises periódicas do fluxo de caixa, conciliar dados do Sankhya e Econto, gerar relatórios para tomada de decisão", "Acessa FCD e FCI com filtros de período. Exporta tabelas para Excel. Valida dados de carga e acompanha data da última sincronização"],
    ["Administrador da Plataforma", "Manter a base de dados atualizada (Econto e Sankhya), gerenciar o processo de carga periódica e controlar o acesso de usuários", "Realiza upload ou integração de dados do Econto; monitora status de sincronização; gerencia usuários na plataforma via perfil Sankhya"],
    ["Usuário Sankhya (Genérico)", "Qualquer colaborador com credenciais Sankhya e permissão de acesso ao link Analytics", "Autentica com usuário e senha Sankhya; acessa somente os módulos autorizados pelo perfil Sankhya configurado pelo Administrador"],
  ]
));
children.push(spacer());

// ── 3. PRÉ-CONDIÇÕES ──
children.push(heading1("3. Pré-Condições"));
children.push(makeTable(
  [900, 5600, 2860],
  ["ID", "Descrição", "Tipo"],
  [
    ["PC-01", "ERP Sankhya ativo, acessível pela plataforma Analytics e com movimentações financeiras lançadas para os períodos analisados", "Obrigatória"],
    ["PC-02", "Usuário possui credenciais válidas (usuário e senha) no ERP Sankhya e não está com acesso bloqueado", "Obrigatória"],
    ["PC-03", "Link de acesso à plataforma Analytics foi distribuído ao usuário por e-mail pelo Administrador", "Obrigatória"],
    ["PC-04", "Produtos do grupo Material Esportivo (10101) cadastrados no Sankhya com código, descrição, valor de última compra e fornecedor preferencial preenchidos", "Obrigatória"],
    ["PC-05", "Dados de estoque do Econto sincronizados ou exportados para a plataforma Analytics conforme layout-padrão acordado (ver PA-01)", "Obrigatória — painéis FCD e Estoque"],
    ["PC-06", "Estrutura de contas, naturezas financeiras e centros de custo para o FCI parametrizados no Sankhya (ver PA-02)", "Obrigatória — painel FCI"],
    ["PC-07", "Usuário possui permissão de acesso ao módulo Analytics no perfil Sankhya", "Obrigatória"],
    ["PC-08", "Para produtos com custo de personalização: campo de observação no Sankhya ou Econto indica o valor adicional por unidade (ex.: R$ 10,00 de aplicação de detalhes)", "Desejável — painel Estoque e Custos"],
  ]
));
children.push(spacer());

// ── 4. GLOSSÁRIO ──
children.push(heading1("4. Glossário"));
children.push(makeTable(
  [2800, 6560],
  ["Termo", "Definição"],
  [
    ["Fluxo de Caixa Direto (FCD)", "Demonstração que evidencia entradas e saídas brutas de caixa classificadas em Atividades Operacionais, de Investimento e de Financiamento. Fonte de dados: Econto e/ou planilha externa ao Sankhya."],
    ["Fluxo de Caixa Indireto (FCI)", "Demonstração que parte do Resultado Líquido do período e aplica ajustes de itens não-caixa e variações no capital de giro para chegar ao caixa gerado pelas operações. Fonte de dados: ERP Sankhya."],
    ["ERP Sankhya", "Sistema de Gestão Empresarial utilizado pela Maelly como fonte primária de dados financeiros, contábeis e de cadastro de produtos. Também provê autenticação dos usuários da plataforma Analytics."],
    ["Econto", "Sistema auxiliar de controle de estoque utilizado pela Maelly, integrado ou sincronizado com o Sankhya. Fonte de dados de movimentação de estoque para o painel FCD e Análise de Estoque."],
    ["Material Esportivo (Grupo 10101)", "Grupo de produtos cadastrado no Sankhya que engloba todos os itens vendidos pela Maelly: camisas (Champions, Polo, Oficial, Especial Retrô), bonés (Luxo, Brim), bermudas, jaquetas torcedor, canecas, garrafas térmicas, copos térmicos, etiquetas e mascotes."],
    ["Custo de Personalização", "Custo adicional por unidade para produtos que recebem aplicação de detalhes (ex.: estampas, bordados). Valor fixo de R$ 10,00 por peça, registrado no campo de observações do produto no Sankhya/Econto. Compõe o CMV total do produto personalizado."],
    ["Valor de Última Compra (VLC)", "Preço unitário pago ao fornecedor na compra mais recente do produto, registrado na planilha de estoque e no Sankhya. Base de cálculo para o CMV e margens."],
    ["CMV (Custo das Mercadorias Vendidas)", "Custo total das unidades vendidas no período: CMV = (VLC × Qtd. Vendida) + (Custo de Personalização × Qtd. Personalizada). Exibido por produto e agregado por categoria."],
    ["Margem Bruta", "Diferença entre a Receita Bruta de Vendas e o CMV. Margem Bruta (%) = ((Receita − CMV) / Receita) × 100. Calculada por produto, categoria e período."],
    ["Giro de Estoque", "Indicador que mede quantas vezes o estoque foi renovado no período. Giro = CMV / Estoque Médio. Valores altos indicam alta rotatividade; valores baixos indicam possível excesso de estoque."],
    ["Cobertura de Estoque", "Número de dias de venda que o estoque atual suporta. Cobertura (dias) = (Estoque Final / CMV Médio Diário). Auxilia no planejamento de reposição."],
    ["Atividades Operacionais", "Bloco do FCD/FCI com entradas e saídas das operações principais: recebimentos de clientes, pagamentos a fornecedores, pessoal, tributos e outros."],
    ["Atividades de Investimento", "Bloco do FCD/FCI com entradas e saídas relacionadas à aquisição e venda de ativos de longo prazo."],
    ["Atividades de Financiamento", "Bloco do FCD/FCI com entradas e saídas de captação de empréstimos, amortização de dívidas e outras operações de financiamento."],
    ["Resultado Líquido", "Lucro ou prejuízo apurado no período, extraído do DRE do Sankhya. Ponto de partida do FCI."],
    ["Saldo Inicial / Saldo Final", "Saldo Inicial: caixa disponível no início do período. Saldo Final = Saldo Inicial + Variação Líquida (soma das três atividades)."],
    ["KPI (Key Performance Indicator)", "Indicador de desempenho exibido em card de destaque no topo de cada painel, calculado automaticamente e comparado com o período anterior."],
    ["Variação vs Período Anterior (Δ%)", "Diferença percentual entre o valor atual e o valor do período imediatamente anterior. Verde para melhora; vermelho para piora."],
    ["Referência do Fornecedor", "Código interno do fornecedor que originou o produto (ex.: 002546 para Camisa Champions). Registrado no Sankhya e utilizado para filtros de análise de compras."],
    ["Badge de Fonte", "Indicador visual na barra superior de cada painel informando a origem dos dados: 'Econto' (âmbar) ou 'Sankhya' (verde)."],
    ["Analytics / Maelly Analytics", "Plataforma de Business Intelligence da Maelly, acessível via link web com autenticação Sankhya, centralizando painéis gerenciais de fluxo de caixa, estoque e custos."],
  ]
));
children.push(spacer());
children.push(pageBreak());

// ── 5. REGRAS DE NEGÓCIO ──
children.push(heading1("5. Regras de Negócio"));

// 5.1 Transversais
children.push(heading2("5.1 Regras Transversais (aplicam-se a todos os painéis)"));

children.push(heading3("RN-01 — Fonte de Dados: Fluxo de Caixa Direto"));
children.push(para("O painel FCD obtém dados de movimentações de caixa do sistema Econto e/ou planilha Excel externa ao Sankhya. A planilha deve seguir o layout-padrão definido pela Neuon. Dados fora do layout são ignorados e sinalizados no log de carga. Nenhum dado do FCD é extraído diretamente do Sankhya — o Sankhya é utilizado apenas para autenticação e cadastro de produtos."));
children.push(highlightBox("Ponto em Aberto PA-01:", "O layout exato dos arquivos de exportação do Econto (colunas, categorias de receita/despesa, codificação) ainda não foi definido. Necessário antes de desenvolver o parser de integração.", COLORS.orange));
children.push(spacer());

children.push(heading3("RN-02 — Fonte de Dados: Fluxo de Caixa Indireto"));
children.push(para("O painel FCI obtém dados exclusivamente do ERP Sankhya: Resultado Líquido do DRE, contas contábeis de depreciação/amortização, variações em contas a receber, estoques e fornecedores. Nenhuma fonte externa é consultada para o FCI."));
children.push(highlightBox("Ponto em Aberto PA-02:", "As contas contábeis e naturezas financeiras do Sankhya que alimentam cada linha do FCI (depreciação, provisões, variação de estoques, fornecedores) precisam ser mapeadas com o time financeiro da Maelly.", COLORS.orange));
children.push(spacer());

children.push(heading3("RN-03 — Autenticação via ERP Sankhya"));
children.push(para("O acesso à plataforma Analytics é feito exclusivamente com usuário e senha do ERP Sankhya. Não existe cadastro adicional de usuários na plataforma Analytics. Após autenticação bem-sucedida, o sistema redireciona para o Dashboard. Em caso de credenciais inválidas, exibe mensagem genérica sem revelar qual campo está incorreto. O sistema respeita o perfil de acesso configurado no Sankhya."));
children.push(spacer());

children.push(heading3("RN-04 — Acesso por Link de E-mail"));
children.push(para("O ponto de entrada da plataforma é um link enviado ao usuário por e-mail pelo Administrador. Ao acessar o link, o usuário é redirecionado à tela de login com autenticação Sankhya. Após o login, o usuário navega livremente pelos módulos aos quais tem permissão."));
children.push(highlightBox("Ponto em Aberto PA-03:", "Definir se o link tem prazo de validade ou é permanente. Definir processo de reenvio e gestão de acessos pelo Administrador.", COLORS.orange));
children.push(spacer());

children.push(heading3("RN-05 — Filtro de Período"));
children.push(para([
  "Todos os painéis disponibilizam filtro de período em formato de ",
  { text: "pills selecionáveis", bold: true },
  ". As opções são fixas: meses individuais recentes (últimos 6 meses), trimestres (T1, T2, T3, T4) e o ano corrente. O período padrão ao abrir qualquer painel é o mês corrente."
]));
children.push(spacer(60));
children.push(makeTable(
  [2200, 3080, 4080],
  ["Opção de Período", "Cobertura dos Dados", "Exemplo (contexto Mar/2026)"],
  [
    ["Mês individual (pill)", "Dados do mês selecionado", "Out/25, Nov/25, Dez/25, Jan/26, Fev/26, Mar/26"],
    ["Trimestre (pill T1, T2, T3, T4)", "Soma dos meses do trimestre selecionado", "T1 2026 = Jan + Fev + Mar"],
    ["Ano completo (pill 2025, 2026)", "Soma de todos os meses do ano", "Jan a Dez/2025 (completo); Jan a Mar/2026 (parcial)"],
  ]
));
children.push(spacer(60));
children.push(highlightBox("Nota:", "Seleção de range customizado de datas (data inicial e final livre) não está no escopo desta versão. Pode ser avaliada em versão futura.", COLORS.blue));
children.push(spacer());

children.push(heading3("RN-06 — Comparativo com Período Anterior"));
children.push(para("Todos os KPIs e tabelas de dados exibem o valor do período selecionado, o valor do período imediatamente anterior e a variação percentual (Δ%)."));
children.push(spacer(60));
children.push(makeTable(
  [3500, 5860],
  ["Elemento", "Especificação"],
  [
    ["Fórmula da variação", "Δ% = ((Valor Atual − Valor Anterior) / |Valor Anterior|) × 100"],
    ["Cor — variação positiva (melhora)", "Verde (#27AE60) — quando variação é favorável ao caixa ou à margem"],
    ["Cor — variação negativa (piora)", "Vermelho (#C0392B) — quando variação é desfavorável"],
    ["Período anterior — mês", "Mês imediatamente anterior ao mês selecionado (ex.: Fev/26 para Mar/26)"],
    ["Período anterior — trimestre", "Trimestre imediatamente anterior (ex.: T3 2025 para T4 2025)"],
    ["Período anterior — ano", "Ano imediatamente anterior (ex.: 2024 para 2025)"],
    ["Valor anterior zero", "Se valor do período anterior for zero, exibir 'N/A' no lugar do Δ%"],
  ]
));
children.push(spacer());

children.push(heading3("RN-07 — Exportação de Dados"));
children.push(para("Todos os painéis disponibilizam exportação nos formatos PDF e Excel. Os botões ficam na barra de filtros (lado direito)."));
children.push(spacer(60));
children.push(makeTable(
  [2000, 3080, 4280],
  ["Botão", "Formato", "Conteúdo Exportado"],
  [
    ["PDF", ".pdf", "Captura visual fiel do painel — inclui filtros selecionados, KPIs, gráficos e tabela completa. Cabeçalho com nome do módulo, período e data de geração."],
    ["Exportar Excel", ".xlsx", "Planilha com os dados da tabela. Aba principal com dados do período atual e anterior. Aba de metadados com: módulo, período, data de extração, fonte dos dados."],
  ]
));
children.push(spacer());

children.push(heading3("RN-08 — Badge de Fonte de Dados"));
children.push(para("Cada painel exibe na topbar um badge visual identificando a fonte dos dados. O badge é estático (não interativo)."));
children.push(spacer(60));
children.push(makeTable(
  [3000, 2680, 3680],
  ["Painel", "Badge", "Cor"],
  [
    ["Fluxo de Caixa Direto", "'Base: Econto'", "Âmbar (#F59E0B) — dado externo ao ERP"],
    ["Fluxo de Caixa Indireto", "'Base: Sankhya'", "Verde (#27AE60) — dado em tempo real do ERP"],
    ["Análise de Estoque e Custos", "'Base: Econto + Sankhya'", "Azul (#2980B9) — dado híbrido"],
  ]
));
children.push(spacer());

children.push(heading3("RN-09 — Data e Hora da Última Atualização"));
children.push(para("Todos os painéis exibem na barra de filtros a data e hora da última sincronização: 'Atualizado em DD/MM/AAAA às HH:MM'. Ponto verde ao lado indica dados disponíveis. Ponto vermelho indica problema na sincronização."));
children.push(spacer());

children.push(heading3("RN-10 — Sessão e Inatividade"));
children.push(para("A sessão do usuário herda o comportamento de sessão do Sankhya. Após período de inatividade, a sessão é encerrada automaticamente. O sistema redireciona para a tela de login com a mensagem: 'Sua sessão expirou. Por favor, faça login novamente.'"));
children.push(spacer());

children.push(heading3("RN-11 — Navegação e Estrutura do Menu"));
children.push(para("A plataforma possui menu lateral fixo (sidebar) hierárquico com as seções disponíveis para a Maelly: Dashboard, Financeiro (FCD, FCI), Estoque e Custos, Configurações. Itens ainda não desenvolvidos permanecem no menu, mas sem link ativo (exibem badge 'Em breve'). O item ativo é destacado com cor primária."));
children.push(spacer());

// 5.2 FCD
children.push(heading2("5.2 Regras Específicas — Fluxo de Caixa Direto (FCD)"));

children.push(heading3("RN-12 — Linhas da Tabela FCD — Atividades Operacionais"));
children.push(para("O bloco de Atividades Operacionais do FCD é composto pelas seguintes linhas nesta ordem:"));
children.push(spacer(60));
children.push(makeTable(
  [600, 5160, 1800, 1800],
  ["Nº", "Linha", "Sinal Esperado", "Origem"],
  [
    ["1", "Recebimentos de vendas de produtos (à vista e prazo)", "Positivo (+)", "Econto / Sankhya"],
    ["2", "Pagamentos a fornecedores de mercadorias", "Negativo (−)", "Econto / Sankhya"],
    ["3", "Pagamentos de custos de personalização (aplicação de detalhes)", "Negativo (−)", "Econto / planilha"],
    ["4", "Pagamentos de pessoal e encargos sociais", "Negativo (−)", "Sankhya / planilha"],
    ["5", "Recolhimento de tributos e contribuições", "Negativo (−)", "Sankhya"],
    ["6", "Outras receitas operacionais", "Positivo (+)", "Econto / planilha"],
    ["7", "Outras despesas operacionais", "Negativo (−)", "Econto / planilha"],
    ["8", "SUBTOTAL — Atividades Operacionais", "Calculado", "Σ linhas 1 a 7"],
  ]
));
children.push(spacer());

children.push(heading3("RN-13 — Linhas da Tabela FCD — Atividades de Investimento"));
children.push(makeTable(
  [600, 5160, 1800, 1800],
  ["Nº", "Linha", "Sinal Esperado", "Origem"],
  [
    ["1", "Aquisição de equipamentos, móveis e utensílios", "Negativo (−)", "Sankhya / planilha"],
    ["2", "Aquisição de máquinas e ferramentas (ex.: plotters, prensas)", "Negativo (−)", "Sankhya / planilha"],
    ["3", "Receitas de venda de ativos", "Positivo (+)", "Sankhya / planilha"],
    ["4", "Aplicações financeiras (transferências para investimentos)", "Negativo (−)", "Planilha"],
    ["5", "Resgates de aplicações financeiras", "Positivo (+)", "Planilha"],
    ["6", "SUBTOTAL — Atividades de Investimento", "Calculado", "Σ linhas 1 a 5"],
  ]
));
children.push(spacer());

children.push(heading3("RN-14 — Linhas da Tabela FCD — Atividades de Financiamento"));
children.push(makeTable(
  [600, 5160, 1800, 1800],
  ["Nº", "Linha", "Sinal Esperado", "Origem"],
  [
    ["1", "Captação de empréstimos e financiamentos", "Positivo (+)", "Sankhya / planilha"],
    ["2", "Amortização de empréstimos e financiamentos", "Negativo (−)", "Sankhya / planilha"],
    ["3", "Pagamento de juros e encargos financeiros", "Negativo (−)", "Sankhya / planilha"],
    ["4", "Distribuição de lucros / retiradas dos sócios", "Negativo (−)", "Planilha"],
    ["5", "SUBTOTAL — Atividades de Financiamento", "Calculado", "Σ linhas 1 a 4"],
  ]
));
children.push(spacer());

children.push(heading3("RN-15 — Cálculo do Saldo Final do FCD"));
children.push(para("O Saldo Final do FCD é calculado conforme as seguintes regras:"));
children.push(spacer(60));
children.push(makeTable(
  [3500, 5860],
  ["Elemento", "Especificação"],
  [
    ["Variação Líquida de Caixa", "= Subtotal Operacional + Subtotal Investimento + Subtotal Financiamento"],
    ["Saldo Final", "= Saldo Inicial do Período + Variação Líquida de Caixa"],
    ["Saldo Inicial", "= Saldo Final do período anterior (encadeamento de períodos)"],
    ["Exibição de valores negativos", "Exibir em vermelho com sinal (−) explícito e parênteses: (R$ 10.000,00)"],
    ["Exibição de valores positivos", "Exibir em preto ou verde sem parênteses: R$ 10.000,00"],
  ]
));
children.push(spacer());

children.push(heading3("RN-16 — KPIs do Painel FCD"));
children.push(makeTable(
  [2200, 4360, 2800],
  ["KPI", "Fórmula / Fonte", "Cor da Variação"],
  [
    ["Entradas Totais", "Σ todas as linhas com sinal positivo do período", "Verde se aumentar"],
    ["Saídas Totais", "Σ todas as linhas com sinal negativo do período (valor absoluto)", "Vermelho se aumentar"],
    ["Variação Líquida de Caixa", "Entradas Totais − Saídas Totais", "Verde se positivo"],
    ["Saldo Final de Caixa", "Saldo Inicial + Variação Líquida", "Verde se aumentar vs anterior"],
  ]
));
children.push(spacer());

// 5.3 FCI
children.push(heading2("5.3 Regras Específicas — Fluxo de Caixa Indireto (FCI)"));

children.push(heading3("RN-17 — Linhas da Tabela FCI — Resultado e Ajustes Não-Caixa"));
children.push(makeTable(
  [600, 5160, 1800, 1800],
  ["Nº", "Linha", "Sinal", "Origem Sankhya"],
  [
    ["1", "Resultado Líquido do Período (Lucro/Prejuízo)", "Positivo/Negativo", "DRE — Resultado Líquido"],
    ["2", "(+) Depreciação e Amortização", "Sempre positivo (add-back)", "Contas contábeis — PA-02"],
    ["3", "(+) Provisões para devedores duvidosos", "Sempre positivo (add-back)", "Contas contábeis — PA-02"],
    ["4", "(±) Resultado na alienação de ativos", "Positivo ou negativo", "Contas contábeis — PA-02"],
    ["5", "(±) Outras adições/exclusões não-caixa", "Positivo ou negativo", "Contas contábeis — PA-02"],
    ["6", "SUBTOTAL — Ajustes de Itens Não-Caixa", "Calculado", "Σ linhas 2 a 5"],
  ]
));
children.push(spacer());

children.push(heading3("RN-18 — Linhas da Tabela FCI — Variação no Capital de Giro"));
children.push(makeTable(
  [600, 5160, 1800, 1800],
  ["Nº", "Linha", "Sinal", "Origem Sankhya"],
  [
    ["1", "(±) Variação em Contas a Receber (clientes)", "Negativo se aumentar CaR", "Contas contábeis — PA-02"],
    ["2", "(±) Variação em Estoques", "Negativo se aumentar estoque", "Contas contábeis — PA-02"],
    ["3", "(±) Variação em Fornecedores (contas a pagar)", "Positivo se aumentar CaP", "Contas contábeis — PA-02"],
    ["4", "(±) Variação em Obrigações Fiscais e Trabalhistas", "Positivo se aumentar passivo", "Contas contábeis — PA-02"],
    ["5", "(±) Variação em Outras Contas do Ativo/Passivo Circulante", "Positivo ou negativo", "Contas contábeis — PA-02"],
    ["6", "SUBTOTAL — Variação no Capital de Giro", "Calculado", "Σ linhas 1 a 5"],
  ]
));
children.push(spacer());

children.push(heading3("RN-19 — Cálculo do Caixa Gerado pelas Operações (FCI)"));
children.push(makeTable(
  [3500, 5860],
  ["Elemento", "Especificação"],
  [
    ["Caixa Gerado pelas Operações", "= Resultado Líquido + Subtotal Ajustes Não-Caixa + Subtotal Variação Capital de Giro"],
    ["Atividades de Investimento (FCI)", "Igual ao FCD — ver RN-13. Fonte: Sankhya."],
    ["Atividades de Financiamento (FCI)", "Igual ao FCD — ver RN-14. Fonte: Sankhya."],
    ["Variação Líquida de Caixa (FCI)", "= Caixa Operacional + Subtotal Investimento + Subtotal Financiamento"],
    ["Saldo Final (FCI)", "= Saldo Inicial + Variação Líquida de Caixa"],
  ]
));
children.push(spacer());

children.push(heading3("RN-20 — KPIs do Painel FCI"));
children.push(makeTable(
  [2200, 4360, 2800],
  ["KPI", "Fórmula / Fonte", "Cor da Variação"],
  [
    ["Resultado Líquido", "DRE Sankhya — Resultado do Período", "Verde se lucro; Vermelho se prejuízo"],
    ["Caixa Gerado Operacionalmente", "Resultado Líquido + Ajustes Não-Caixa + Δ Capital de Giro", "Verde se positivo"],
    ["Variação Líquida de Caixa", "Operacional + Investimento + Financiamento", "Verde se positivo"],
    ["Saldo Final de Caixa", "Saldo Inicial + Variação Líquida", "Verde se aumentar vs anterior"],
  ]
));
children.push(spacer());

// 5.4 Estoque e Custos
children.push(heading2("5.4 Regras Específicas — Análise de Estoque e Custos"));

children.push(heading3("RN-21 — Catálogo de Produtos e Categorias"));
children.push(para("O painel de Estoque e Custos exibe todos os produtos do Grupo 10101 (Material Esportivo) cadastrados no Sankhya, organizados por categoria conforme tabela abaixo. O sistema deve respeitar os códigos e descrições oficiais cadastrados no Sankhya."));
children.push(spacer(60));
children.push(makeTable(
  [900, 2200, 3260, 3000],
  ["Código", "Produto", "Categoria", "Observações"],
  [
    ["2470", "CAMISA CHAMPIONS", "Vestuário — Camisas", "Personalização: R$ 10,00/un."],
    ["3006", "REGATA BASQUETE", "Vestuário — Camisas", "Personalização: R$ 10,00/un."],
    ["3007", "CAMISA POLO", "Vestuário — Camisas", "Personalização: R$ 10,00/un."],
    ["3008", "CAMISA OFICIAL", "Vestuário — Camisas", "Personalização: R$ 10,00/un."],
    ["3049", "CAMISA ESPECIAL RETRÔ", "Vestuário — Camisas", "—"],
    ["3009", "BERMUDA", "Vestuário — Inferior", "—"],
    ["3010", "JAQUETA TORCEDOR", "Vestuário — Superior", "Personalização: R$ 10,00/un."],
    ["2550", "BONE LUXO", "Acessórios — Bonés", "—"],
    ["2731", "BONÉ BRIM", "Acessórios — Bonés", "—"],
    ["2953", "CANECA PORTO", "Acessórios — Utilidades", "—"],
    ["2957", "GARRAFA TÉRMICA 660 ML", "Acessórios — Utilidades", "—"],
    ["2946", "COPO TÉRMICO TULIP 500ML", "Acessórios — Utilidades", "—"],
    ["2827", "ETQ. LETRA PRINT FIX", "Insumos — Etiquetas", "Insumo para personalização"],
    ["2828", "ETQ. NÚMERO PRINT FIX", "Insumos — Etiquetas", "Insumo para personalização"],
    ["2946", "MASCOTE PORTO VITÓRIA", "Colecionáveis", "—"],
  ]
));
children.push(spacer());

children.push(heading3("RN-22 — Cálculo de CMV com Custo de Personalização"));
children.push(para("Para produtos com custo de personalização, o CMV unitário é calculado como: CMV Unitário = VLC + Custo de Personalização. Produtos com personalização estão identificados no campo de observações do Sankhya/Econto com a descrição 'Considerando R$ 10,00 de aplicação de detalhes'."));
children.push(spacer(60));
children.push(makeTable(
  [2000, 2000, 2000, 3360],
  ["Produto", "VLC (R$)", "Personalização (R$)", "CMV Unitário (R$)"],
  [
    ["Camisa Champions (2470)", "109,90", "10,00", "119,90"],
    ["Regata Basquete (3006)", "89,92", "10,00", "99,92"],
    ["Camisa Polo (3007)", "129,90", "10,00", "139,90"],
    ["Camisa Oficial (3008)", "129,90", "10,00", "139,90"],
    ["Jaqueta Torcedor (3010)", "159,90", "10,00", "169,90"],
    ["Bermuda (3009)", "79,90", "—", "79,90"],
    ["Camisa Especial Retrô (3049)", "129,90", "—", "129,90"],
    ["Boné Luxo (2550)", "29,00", "—", "29,00"],
    ["Boné Brim (2731)", "29,00", "—", "29,00"],
    ["Caneca Porto (2953)", "15,00", "—", "15,00"],
    ["Garrafa Térmica 660ml (2957)", "180,00", "—", "180,00"],
    ["Copo Térmico Tulip 500ml (2946)", "150,00", "—", "150,00"],
    ["Mascote Porto Vitória (2946)", "62,50", "—", "62,50"],
  ]
));
children.push(highlightBox("Ponto em Aberto PA-04:", "Os preços de venda (PV) por produto não foram informados. Necessário para cálculo de Margem Bruta por produto. A equipe Maelly deve fornecer a tabela de preços de venda vigente.", COLORS.orange));
children.push(spacer());

children.push(heading3("RN-23 — KPIs do Painel de Estoque e Custos"));
children.push(makeTable(
  [2200, 4360, 2800],
  ["KPI", "Fórmula / Fonte", "Interpretação"],
  [
    ["CMV Total do Período", "Σ (VLC + Personalização) × Qtd. Vendida por produto", "Custo total das mercadorias vendidas"],
    ["Margem Bruta (%)", "((Receita Bruta − CMV) / Receita Bruta) × 100", "Verde acima de 30%; Amarelo entre 15-30%; Vermelho abaixo de 15%"],
    ["Estoque Final (unidades)", "Estoque Inicial + Compras − Vendas, por produto", "Quantidade em mãos ao final do período"],
    ["Giro de Estoque", "CMV do Período / Estoque Médio", "Acima de 4x/trimestre: saudável; abaixo de 2x: atenção"],
    ["Cobertura de Estoque (dias)", "(Estoque Final / (CMV / Dias do Período))", "Abaixo de 15 dias: risco de ruptura; acima de 90 dias: excesso"],
    ["Custo Total de Personalização", "R$ 10,00 × Qtd. Personalizada no período", "Impacto da personalização no CMV"],
  ]
));
children.push(spacer());

children.push(heading3("RN-24 — Filtro por Categoria e Produto no Painel Estoque"));
children.push(para("O painel de Estoque e Custos disponibiliza filtros independentes por: Categoria (Vestuário, Acessórios, Insumos, Colecionáveis), Produto específico (dropdown com todos os SKUs ativos) e Fornecedor (referência do fornecedor do Sankhya). Os filtros são cumulativos — é possível filtrar por categoria e depois selecionar um produto específico dentro da categoria."));
children.push(spacer());

children.push(heading3("RN-25 — Alerta de Estoque Mínimo"));
children.push(para("O sistema exibe alerta visual na linha do produto quando o estoque final cair abaixo do estoque mínimo parametrizado. Badge vermelho 'Estoque Baixo' ao lado do nome do produto. Se não houver estoque mínimo parametrizado para o produto, o alerta não é exibido."));
children.push(highlightBox("Ponto em Aberto PA-05:", "Os valores de estoque mínimo por produto ainda não foram definidos pela equipe Maelly. Devem ser informados para que o alerta de ruptura funcione corretamente.", COLORS.orange));
children.push(spacer());
children.push(pageBreak());

// ── 6. CRITÉRIOS DE ACEITE ──
children.push(heading1("6. Critérios de Aceite"));

children.push(heading2("6.1 Login e Autenticação"));
children.push(makeTable(
  [900, 8460],
  ["ID", "Critério"],
  [
    ["CA-01", "Dado usuário e senha válidos do Sankhya, o sistema autentica o usuário e redireciona para o Dashboard em até 3 segundos."],
    ["CA-02", "Dado usuário e/ou senha inválidos, o sistema exibe a mensagem 'Credenciais inválidas. Verifique seu usuário e senha Sankhya.' sem revelar qual campo está incorreto."],
    ["CA-03", "Após período de inatividade correspondente ao timeout configurado no Sankhya, o sistema redireciona o usuário para a tela de login com a mensagem 'Sua sessão expirou.'"],
    ["CA-04", "O campo de senha exibe asteriscos (*) por padrão. Um ícone de olho permite alternar entre ocultar e exibir a senha."],
  ]
));
children.push(spacer());

children.push(heading2("6.2 Dashboard Principal"));
children.push(makeTable(
  [900, 8460],
  ["ID", "Critério"],
  [
    ["CA-05", "Ao acessar o Dashboard, os 4 KPIs principais (Entradas, Saídas, Variação Líquida, Saldo Final) são exibidos com os valores do mês corrente e a variação percentual em relação ao mês anterior."],
    ["CA-06", "A variação percentual dos KPIs é exibida em verde quando favorável e em vermelho quando desfavorável, conforme semântica definida na RN-06."],
    ["CA-07", "Ao selecionar um período diferente (pill de trimestre ou ano), todos os KPIs e gráficos atualizam instantaneamente (em até 2 segundos) sem recarregar a página."],
    ["CA-08", "O gráfico de linha de evolução mensal do saldo de caixa exibe corretamente os dados dos últimos 12 meses com marcação dos valores mínimo e máximo."],
    ["CA-09", "O gráfico de barras de entradas vs saídas mensais exibe corretamente as barras agrupadas para cada mês do período selecionado."],
    ["CA-10", "A data e hora da última atualização dos dados é exibida na topbar com ponto verde quando dados disponíveis."],
  ]
));
children.push(spacer());

children.push(heading2("6.3 Fluxo de Caixa Direto"));
children.push(makeTable(
  [900, 8460],
  ["ID", "Critério"],
  [
    ["CA-11", "O painel FCD exibe o badge 'Base: Econto' em âmbar na topbar."],
    ["CA-12", "A tabela do FCD exibe todas as linhas das Atividades Operacionais (8 linhas), Investimento (6 linhas) e Financiamento (5 linhas) com os valores do período selecionado e do período anterior."],
    ["CA-13", "Os subtotais de cada bloco (Operacional, Investimento, Financiamento) são calculados automaticamente como soma das linhas do bloco."],
    ["CA-14", "A Variação Líquida de Caixa é calculada como soma dos três subtotais e exibida na linha de rodapé da tabela."],
    ["CA-15", "O Saldo Final é calculado como Saldo Inicial + Variação Líquida e exibido na última linha da tabela em destaque (negrito)."],
    ["CA-16", "Valores negativos são exibidos em vermelho com parênteses: (R$ 10.000,00). Valores positivos são exibidos em preto/verde sem parênteses."],
    ["CA-17", "O botão 'Exportar PDF' gera um PDF com o painel completo (KPIs + tabela) identificado com o nome do módulo, período e data de geração."],
    ["CA-18", "O botão 'Exportar Excel' gera um .xlsx com a tabela completa (período atual e anterior) e aba de metadados."],
  ]
));
children.push(spacer());

children.push(heading2("6.4 Fluxo de Caixa Indireto"));
children.push(makeTable(
  [900, 8460],
  ["ID", "Critério"],
  [
    ["CA-19", "O painel FCI exibe o badge 'Base: Sankhya' em verde na topbar."],
    ["CA-20", "A tabela do FCI exibe: Resultado Líquido (linha 1), todas as linhas de Ajustes Não-Caixa (linhas 2-6) e todas as linhas de Variação no Capital de Giro (linhas 7-12) com valores do período selecionado e do anterior."],
    ["CA-21", "O Caixa Gerado pelas Operações é calculado automaticamente como Resultado Líquido + Subtotal Não-Caixa + Subtotal Capital de Giro."],
    ["CA-22", "O gráfico waterfall (cascata) exibe corretamente a composição do Caixa Operacional, partindo do Resultado Líquido e mostrando cada ajuste como barra incremental ou decremental."],
    ["CA-23", "Exportação PDF e Excel do FCI funcionam conforme CA-17 e CA-18, com badge 'Base: Sankhya' identificado nos metadados."],
  ]
));
children.push(spacer());

children.push(heading2("6.5 Análise de Estoque e Custos"));
children.push(makeTable(
  [900, 8460],
  ["ID", "Critério"],
  [
    ["CA-24", "O painel exibe badge 'Base: Econto + Sankhya' em azul na topbar."],
    ["CA-25", "A tabela de produtos exibe: Código, Produto, Categoria, VLC (R$), Custo Personalização (R$), CMV Unitário (R$), Qtd. Vendida, CMV Total, Estoque Final (un.) e Cobertura (dias) para cada SKU ativo."],
    ["CA-26", "Para produtos com custo de personalização, a coluna 'Custo Personalização' exibe 'R$ 10,00' e o CMV Unitário é calculado como VLC + R$ 10,00."],
    ["CA-27", "Para produtos sem personalização, a coluna 'Custo Personalização' exibe '—' e o CMV Unitário é igual ao VLC."],
    ["CA-28", "Os 6 KPIs do painel (CMV Total, Margem Bruta %, Estoque Final, Giro, Cobertura, Custo Total de Personalização) são calculados corretamente conforme as fórmulas da RN-23."],
    ["CA-29", "Ao aplicar filtro por Categoria, a tabela exibe apenas os produtos da categoria selecionada e os KPIs são recalculados para o subconjunto filtrado."],
    ["CA-30", "Produtos com estoque final abaixo do mínimo parametrizado exibem badge vermelho 'Estoque Baixo' ao lado do nome."],
    ["CA-31", "O gráfico de barras horizontais de CMV por produto exibe corretamente todos os SKUs ordenados por CMV Total (maior para menor)."],
    ["CA-32", "O gráfico de pizza de distribuição de CMV por categoria exibe corretamente as fatias para Vestuário, Acessórios, Insumos e Colecionáveis."],
    ["CA-33", "Exportação PDF e Excel do painel de Estoque funcionam conforme CA-17 e CA-18."],
  ]
));
children.push(spacer());
children.push(pageBreak());

// ── 7. TELAS ──
children.push(heading1("7. Especificação de Telas"));

// 7.1 Login
children.push(heading2("7.1 Tela de Login"));
children.push(para("Tela de entrada da plataforma. Autenticação integrada ao ERP Sankhya. Layout centralizado com identidade visual Maelly."));
children.push(spacer(60));
children.push(makeTable(
  [2800, 6560],
  ["Elemento", "Especificação"],
  [
    ["Cabeçalho", "Logo Maelly centralizado no topo. Subtítulo: 'Analytics — Fluxo de Caixa'. Fundo com gradiente na cor primária (#1B5E7B) ou imagem institucional."],
    ["Campo Usuário", "Label flutuante 'Usuário Sankhya'. Input text. Placeholder: 'Digite seu usuário Sankhya'. Ícone de usuário à esquerda."],
    ["Campo Senha", "Label flutuante 'Senha'. Input password. Ícone de olho (toggle mostrar/ocultar). Ícone de cadeado à esquerda."],
    ["Botão Entrar", "Botão primário 100% de largura. Texto: 'Entrar'. Estado: loading spinner durante autenticação."],
    ["Mensagem de erro", "Banner vermelho abaixo dos campos: 'Credenciais inválidas. Verifique seu usuário e senha Sankhya.' Desaparece ao digitar novamente."],
    ["Rodapé", "Texto: 'Acesso restrito a usuários cadastrados no ERP Sankhya.' Versão da plataforma."],
    ["Responsividade", "Layout adaptativo para desktop (≥1280px), tablet (768-1279px) e mobile (≤767px)."],
  ]
));
children.push(spacer());

// 7.2 Dashboard
children.push(heading2("7.2 Dashboard Principal"));
children.push(para("Tela home da plataforma. Visão consolidada de caixa com KPIs, gráficos de evolução temporal e acesso rápido aos demais módulos."));
children.push(spacer(60));

children.push(heading3("7.2.1 Barra de Filtros (Topbar)"));
children.push(makeTable(
  [2800, 6560],
  ["Elemento", "Especificação"],
  [
    ["Pills de Período", "Últimos 6 meses individuais + trimestres disponíveis + ano corrente. Pill ativo destacado com cor primária. Padrão: mês corrente."],
    ["Badge de Fonte", "Exibido à direita dos filtros. Texto dinâmico conforme painel ativo."],
    ["Data de Atualização", "Texto: 'Atualizado em DD/MM/AAAA às HH:MM'. Ponto verde (sincronizado) ou vermelho (erro)."],
    ["Botões de Exportação", "Lado direito: botão 'PDF' (ícone de documento) e botão 'Excel' (ícone de planilha). Ambos com tooltip explicativo."],
  ]
));
children.push(spacer(60));

children.push(heading3("7.2.2 Seção de KPIs"));
children.push(makeTable(
  [2200, 3480, 3680],
  ["KPI", "Ícone / Cor", "Comportamento"],
  [
    ["Entradas Totais (R$)", "Ícone: seta para cima. Cor: verde (#27AE60)", "Valor em moeda BR. Badge Δ% vs período anterior em verde/vermelho."],
    ["Saídas Totais (R$)", "Ícone: seta para baixo. Cor: vermelho (#C0392B)", "Valor em moeda BR. Badge Δ% vs período anterior (vermelho se aumentar)."],
    ["Variação Líquida (R$)", "Ícone: balanço/escala. Cor: azul (#2980B9)", "Pode ser negativo (exibir em vermelho se negativo). Badge Δ%."],
    ["Saldo Final de Caixa (R$)", "Ícone: carteira/cofre. Cor: primária (#1B5E7B)", "Valor em destaque. Badge Δ% vs saldo final do período anterior."],
  ]
));
children.push(spacer(60));

children.push(heading3("7.2.3 Seção de Gráficos"));
children.push(makeTable(
  [2800, 6560],
  ["Gráfico", "Especificação"],
  [
    ["Evolução do Saldo de Caixa (linha)", "Eixo X: últimos 12 meses. Eixo Y: saldo final em R$. Linha suave (tension: 0.4). Área preenchida. Tooltip com valor exato ao hover. Marcadores de mín/máx em destaque."],
    ["Entradas vs Saídas por Mês (barras agrupadas)", "Eixo X: meses do período selecionado. Duas barras por mês: azul (Entradas) e vermelho (Saídas). Tooltip com valores e Δ%. Legenda abaixo do gráfico."],
    ["Composição das Saídas (pizza)", "Fatias por categoria de saída: Fornecedores, Pessoal, Tributos, Personalização, Outros. Tooltip com % e valor. Legenda lateral."],
    ["Top 5 Produtos por CMV (barras horizontais)", "Top 5 SKUs com maior CMV no período. Barra azul. Valor exibido ao final da barra. Link para o painel de Estoque."],
  ]
));
children.push(spacer());

// 7.3 FCD
children.push(heading2("7.3 Painel — Fluxo de Caixa Direto"));
children.push(para("Demonstração das entradas e saídas brutas de caixa, classificadas nas três atividades padrão (Operacional, Investimento, Financiamento). Fonte de dados: Econto + planilha externa."));
children.push(spacer(60));
children.push(makeTable(
  [2800, 6560],
  ["Elemento", "Especificação"],
  [
    ["Topbar", "Badge 'Base: Econto' em âmbar. Data de atualização. Botões PDF e Excel. Pills de período."],
    ["KPIs (4 cards)", "Entradas Totais, Saídas Totais, Variação Líquida de Caixa, Saldo Final de Caixa — conforme RN-16."],
    ["Tabela Principal", "Estrutura em 3 blocos expandíveis/colapsáveis: Atividades Operacionais (8 linhas + subtotal), Atividades de Investimento (6 linhas + subtotal), Atividades de Financiamento (5 linhas + subtotal). Linha final: Variação Líquida de Caixa. Linha de destaque: Saldo Final."],
    ["Colunas da Tabela", "Coluna 1 (fixada): Descrição da linha. Coluna 2: Valor período selecionado (R$). Coluna 3: Valor período anterior (R$). Coluna 4: Variação Δ% com cor semântica."],
    ["Gráfico Waterfall", "Cascata horizontal com as três atividades: barras de Entradas (verde) e Saídas (vermelho). Barra final: Saldo Final (azul). Tooltip com detalhes ao hover."],
    ["Expandir/Colapsar Blocos", "Cada bloco (Operacional, Investimento, Financiamento) tem botão de expand/collapse (chevron). Por padrão: todos expandidos."],
  ]
));
children.push(spacer());

// 7.4 FCI
children.push(heading2("7.4 Painel — Fluxo de Caixa Indireto"));
children.push(para("Demonstração que parte do Resultado Líquido (DRE Sankhya) e aplica ajustes de itens não-caixa e variações de capital de giro. Fonte de dados: ERP Sankhya."));
children.push(spacer(60));
children.push(makeTable(
  [2800, 6560],
  ["Elemento", "Especificação"],
  [
    ["Topbar", "Badge 'Base: Sankhya' em verde. Data de atualização. Botões PDF e Excel. Pills de período."],
    ["KPIs (4 cards)", "Resultado Líquido, Caixa Gerado Operacionalmente, Variação Líquida de Caixa, Saldo Final de Caixa — conforme RN-20."],
    ["Tabela Principal — Bloco 1", "Resultado Líquido (linha de partida, em destaque) + Ajustes de Itens Não-Caixa (4 linhas) + Subtotal Ajustes."],
    ["Tabela Principal — Bloco 2", "Variação no Capital de Giro: Δ Contas a Receber, Δ Estoques, Δ Fornecedores, Δ Obrigações Fiscais/Trabalhistas, Δ Outras Contas + Subtotal ΔCG."],
    ["Tabela Principal — Bloco 3", "Caixa Gerado pelas Operações (destaque primário) + Atividades de Investimento (mesmo layout do FCD) + Atividades de Financiamento + Variação Líquida + Saldo Final."],
    ["Gráfico Waterfall", "Cascata vertical partindo do Resultado Líquido (+/−) → cada ajuste não-caixa → cada variação de CG → Caixa Operacional. Cores: verde para adições, vermelho para deduções, azul para a barra final."],
    ["Tooltip de Detalhe", "Ao passar o mouse sobre cada linha da tabela, exibe: 'Esta linha representa...' com explicação didática do impacto no caixa."],
  ]
));
children.push(spacer());

// 7.5 Estoque e Custos
children.push(heading2("7.5 Painel — Análise de Estoque e Custos"));
children.push(para("Painel de controle do estoque físico e análise de custo e margem por produto. Específico para o mix de Material Esportivo da Maelly."));
children.push(spacer(60));
children.push(makeTable(
  [2800, 6560],
  ["Elemento", "Especificação"],
  [
    ["Topbar", "Badge 'Base: Econto + Sankhya' em azul. Data de atualização. Botões PDF e Excel. Pills de período. Filtro de Categoria (dropdown). Filtro de Produto (dropdown searchable). Filtro de Fornecedor (dropdown)."],
    ["KPIs (6 cards — 2 linhas de 3)", "CMV Total, Margem Bruta (%), Estoque Final (un.), Giro de Estoque, Cobertura (dias), Custo Total de Personalização — conforme RN-23."],
    ["Tabela de Produtos", "Linhas: um SKU por linha. Colunas: Código | Produto | Categoria | VLC | Custo Personaliz. | CMV Unit. | Qtd. Vendida | CMV Total | Estoque Final | Cobertura | Alerta. Ordenação por coluna clicável. Paginação: 20 itens/página."],
    ["Indicador de Personalização", "Ícone de estrela (★) ao lado do nome do produto quando possui custo de personalização. Tooltip: 'Produto com custo de aplicação: R$ 10,00/un.'"],
    ["Badge Estoque Baixo", "Badge vermelho 'Estoque Baixo' na coluna Alerta quando estoque final < estoque mínimo parametrizado."],
    ["Gráfico CMV por Produto (barras horiz.)", "Todos os SKUs, ordenados por CMV Total (maior para menor). Barra azul. Valor no fim da barra. Ao clicar: filtra a tabela para aquele produto."],
    ["Gráfico Distribuição por Categoria (pizza)", "Fatias: Vestuário, Acessórios, Insumos, Colecionáveis. % e valor em R$ no tooltip. Ao clicar: filtra a tabela para aquela categoria."],
    ["Gráfico Evolução de Estoque (linha)", "Evolução do estoque total (unidades) e do CMV acumulado nos últimos 6 meses. Dois eixos Y: unidades (esquerda) e R$ (direita)."],
  ]
));
children.push(spacer());
children.push(pageBreak());

// ── 8. PONTOS EM ABERTO ──
children.push(heading1("8. Pontos em Aberto"));
children.push(makeTable(
  [900, 2600, 5860],
  ["ID", "Ponto em Aberto", "Ação Necessária"],
  [
    ["PA-01", "Layout de exportação do Econto", "A equipe Maelly deve fornecer o layout exato dos arquivos de exportação do Econto (colunas, categorias de receita/despesa, codificação de produtos). Bloqueante para o desenvolvimento do parser de integração FCD."],
    ["PA-02", "Mapeamento de contas contábeis para o FCI", "O time financeiro da Maelly deve mapear as contas contábeis e naturezas financeiras do Sankhya que alimentam cada linha do FCI (depreciação, provisões, variações de CG). Bloqueante para o desenvolvimento do FCI."],
    ["PA-03", "Validade e gestão do link de acesso", "Definir se o link de acesso à plataforma tem prazo de validade ou é permanente. Definir processo de reenvio e política de acesso para novos usuários."],
    ["PA-04", "Tabela de preços de venda (PV) por produto", "A equipe Maelly deve fornecer a tabela de preços de venda vigente por SKU. Bloqueante para o cálculo de Margem Bruta no painel de Estoque e Custos."],
    ["PA-05", "Estoque mínimo por produto (ponto de reposição)", "Definir os valores de estoque mínimo para cada SKU ativo, a fim de habilitar o alerta de ruptura no painel de Estoque e Custos."],
    ["PA-06", "Integração Econto ↔ Sankhya: modo e frequência", "Definir o modo de integração (API em tempo real, sincronização agendada ou upload manual) e a frequência de atualização dos dados do Econto na plataforma Analytics."],
    ["PA-07", "Categorias adicionais de produtos", "Confirmar se o catálogo de produtos cadastrado (Grupo 10101) está completo ou se há novos SKUs a serem incluídos no mix Maelly para 2026."],
    ["PA-08", "Perfis de acesso por usuário", "Definir quais usuários do Sankhya terão acesso a quais painéis. Ex.: Gestor Financeiro acessa todos; Gestor Comercial acessa apenas Estoque e Custos."],
  ]
));
children.push(spacer());
children.push(pageBreak());

// ── 9. FORA DO ESCOPO ──
children.push(heading1("9. Fora do Escopo (Esta Versão)"));
children.push(makeTable(
  [900, 8460],
  ["#", "Item Fora do Escopo"],
  [
    ["1", "DRE completa (Demonstração de Resultado do Exercício) — prevista para módulo separado em versão futura."],
    ["2", "Balanço Patrimonial — previsto para módulo separado em versão futura."],
    ["3", "Contas a Receber e Contas a Pagar com aging report detalhado — previsto para módulo Financeiro em versão futura."],
    ["4", "Emissão de notas fiscais, pedidos de venda ou compra dentro da plataforma Analytics — estas operações são realizadas diretamente no Sankhya."],
    ["5", "Cadastro, edição ou exclusão de produtos na plataforma Analytics — gerenciado exclusivamente no Sankhya."],
    ["6", "Módulo de Recursos Humanos (salários, férias, 13º) — previsto para versão futura."],
    ["7", "Integração com marketplaces (e-commerce, vendas online) — fora do escopo atual."],
    ["8", "Orçamento/Budget vs Realizado — não contratado nesta versão."],
    ["9", "Relatórios de comissionamento ou metas de vendedores — fora do escopo."],
    ["10", "Seleção de range customizado de datas (data inicial e final livres) — apenas períodos predefinidos (pills) estão no escopo."],
    ["11", "Multi-empresa / visão consolidada — a Maelly opera como entidade única nesta versão."],
    ["12", "Módulo de backup e exportação de dados brutos em formato SQL/XML/YAML — não contratado."],
  ]
));
children.push(spacer());
children.push(pageBreak());

// ── 10. CRONOGRAMA / MARCOS ──
children.push(heading1("10. Marcos e Cronograma Referencial"));
children.push(highlightBox("Atenção:", "O cronograma abaixo é referencial e depende da resolução dos Pontos em Aberto PA-01 e PA-02 (layout Econto e contas contábeis Sankhya). As datas devem ser confirmadas em reunião de kickoff após entrega deste escopo.", COLORS.orange));
children.push(spacer(60));
children.push(makeTable(
  [900, 2600, 3660, 2200],
  ["Marco", "Entregável", "Responsável", "Prazo Referencial"],
  [
    ["M-01", "Aprovação do escopo técnico v1.0 pela Maelly", "Maelly (Gestão Financeira e Comercial)", "Semana 1 após entrega"],
    ["M-02", "Entrega do layout Econto (PA-01) e preços de venda (PA-04)", "Maelly", "Semana 1-2"],
    ["M-03", "Mapeamento de contas contábeis Sankhya para FCI (PA-02)", "Maelly + Neuon", "Semana 2"],
    ["M-04", "Desenvolvimento do parser de integração Econto → Analytics", "Neuon", "Semana 3-4"],
    ["M-05", "Desenvolvimento das telas: Login + Dashboard + FCD", "Neuon", "Semana 3-5"],
    ["M-06", "Desenvolvimento: FCI + Análise de Estoque e Custos", "Neuon", "Semana 5-7"],
    ["M-07", "Validação interna (QA) — todos os painéis e CAs", "Neuon", "Semana 8"],
    ["M-08", "Apresentação do protótipo à Maelly — revisão e ajustes", "Neuon + Maelly", "Semana 9"],
    ["M-09", "Ajustes pós-revisão e homologação final", "Neuon + Maelly", "Semana 10-11"],
    ["M-10", "Go-Live — plataforma em produção com usuários reais", "Neuon + Maelly", "Semana 12"],
  ]
));
children.push(spacer());
children.push(pageBreak());

// ── 11. STACK TÉCNICA ──
children.push(heading1("11. Stack Técnica e Integrações"));
children.push(makeTable(
  [2800, 6560],
  ["Componente", "Especificação"],
  [
    ["ERP Principal", "Sankhya — autenticação de usuários, dados financeiros (FCI), cadastro de produtos (Grupo 10101 — Material Esportivo), contas contábeis."],
    ["Sistema de Estoque Auxiliar", "Econto — movimentação de estoque, dados de vendas e compras (fonte do FCD). Modo de integração: a definir (PA-06)."],
    ["Plataforma Analytics", "Aplicação web responsiva. Tecnologia: a confirmar com a Neuon (ex.: Mitra, React, Vue ou similar)."],
    ["Autenticação", "SSO via ERP Sankhya (usuário + senha Sankhya). Sem cadastro adicional na plataforma Analytics."],
    ["Visualização de Dados", "Gráficos: Chart.js ou similar. Tipos: linha, barras agrupadas, pizza, waterfall. Exportação: html2pdf.js (PDF) e SheetJS/xlsx (Excel)."],
    ["Fonte de Dados — FCD", "Econto (exportação agendada ou API) + planilha Excel complementar. Parser interno para normalização dos dados."],
    ["Fonte de Dados — FCI", "ERP Sankhya (API ou views SQL). Contas contábeis e naturezas financeiras conforme mapeamento PA-02."],
    ["Infraestrutura", "Servidor web: a definir pela Neuon. Banco de dados intermediário: a definir. Disponibilidade: 99,5% em horário comercial."],
    ["Segurança", "HTTPS obrigatório. Dados trafegados via TLS 1.2+. Sem armazenamento de senhas na plataforma Analytics (autenticação delegada ao Sankhya)."],
    ["Compatibilidade de Navegadores", "Google Chrome ≥ 110, Mozilla Firefox ≥ 110, Microsoft Edge ≥ 110. Safari (macOS/iOS) ≥ 16. Mobile: Chrome e Safari em iOS/Android."],
  ]
));
children.push(spacer());

// ── ASSINATURAS ──
children.push(pageBreak());
children.push(heading1("12. Assinaturas e Aprovação"));
children.push(para("Este documento deve ser revisado e aprovado pelos representantes da Maelly e da Neuon antes do início do desenvolvimento. A aprovação confirma o entendimento e aceite de todos os requisitos, regras de negócio, critérios de aceite, pontos em aberto e escopo definidos neste documento."));
children.push(spacer(280));
children.push(makeTable(
  [4680, 4680],
  ["Maelly — Aprovação", "Neuon Soluções — Elaboração"],
  [
    [
      { text: "\n\n\nNome: ____________________________\nCargo: ___________________________\nData: ____________________________\nAssinatura: _______________________", italics: true, color: COLORS.muted },
      { text: "\n\n\nNome: ____________________________\nCargo: ___________________________\nData: ____________________________\nAssinatura: _______________________", italics: true, color: COLORS.muted }
    ],
  ]
));
children.push(spacer(280));
children.push(highlightBox("Nota:", "Alterações ao escopo após assinatura deste documento estão sujeitas ao processo formal de Gestão de Mudanças e podem impactar o cronograma e o custo do projeto.", COLORS.blue));

// ── MONTAR DOCUMENTO ──
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
            new TextRun({ text: "Maelly Analytics — Fluxo de Caixa", font: FONTS.main, size: 16, color: COLORS.primary, italics: true }),
            new TextRun({ text: "\tv1.0", font: FONTS.main, size: 16, color: COLORS.muted }),
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
            new TextRun({ text: " | Confidencial — uso restrito Maelly e Neuon Soluções", font: FONTS.main, size: 16, color: COLORS.muted }),
          ],
        })],
      }),
    },
    children,
  }],
});

const OUTPUT = path.join(__dirname, "Escopo_Tecnico_Maelly_FluxoCaixa_v1.0.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log("✓ Documento gerado com sucesso!");
  console.log("→", OUTPUT);
  console.log("→ Tamanho:", (buffer.length / 1024).toFixed(1), "KB");
});
