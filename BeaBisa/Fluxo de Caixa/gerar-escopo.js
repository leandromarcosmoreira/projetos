const fs = require("fs");
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
    ["Módulo", "Controladoria / Fluxo de Caixa (Direto e Indireto)"],
    ["Versão", "v2.1"],
    ["Data", "04/03/2026"],
    ["Elaborado por", "Neuon Soluções — Camila Cruvinel"],
    ["Revisado por", "BeaBisa TI — Luciano Pereira Nunes Neto"],
    ["Status", "Em revisão — Protótipo validado, 5 Pontos em Aberto pendentes"],
  ]
));
children.push(spacer(280));

// Histórico de versões
children.push(heading3("Histórico de Versões"));
children.push(makeTable(
  [1200, 1400, 6760],
  ["Versão", "Data", "Descrição das Alterações"],
  [
    ["v1.0", "06/01/2026", "Rascunho inicial — e-mail de levantamento enviado por Luciano Pereira Nunes Neto a Camila Cruvinel (Neuon). Lista de telas sem especificação funcional."],
    ["v2.0", "04/03/2026", "Primeira versão estruturada. 9 seções completas, 9 RNs, 15 CAs, 8 Pontos em Aberto."],
    ["v2.1", "04/03/2026", "Detalhamento após protótipo HTML. 22 RNs com fórmulas, 30 CAs testáveis, linhas de tabela especificadas, 3 Pontos em Aberto resolvidos (PA-03, PA-04, PA-08)."],
  ]
));
children.push(spacer(400));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ── 1. OBJETIVO ──
children.push(heading1("1. Objetivo"));
children.push(para("Este documento especifica em detalhe os requisitos funcionais do módulo Fluxo de Caixa da plataforma BeaBisa IA Analytics, abrangendo as visões de Fluxo de Caixa Direto (FCD) e Fluxo de Caixa Indireto (FCI), localizadas sob a área de Controladoria. Esta versão incorpora o detalhamento produzido após validação do protótipo de interface."));
children.push(para("O módulo tem como propósito oferecer aos gestores e analistas financeiros da BeaBisa uma visão analítica do fluxo de entrada e saída de recursos financeiros, permitindo o acompanhamento do desempenho de caixa por período, por empresa e em visão consolidada, com comparativo automático em relação ao período anterior."));
children.push(para("O FCD utiliza como base de dados planilha Excel externa ao Sankhya, enquanto o FCI consome dados diretamente do ERP Sankhya, partindo do Resultado Líquido e aplicando ajustes de itens não-caixa e variações no capital de giro. Ambos os painéis são acessados via link web com autenticação integrada ao ERP Sankhya, sem cadastro adicional de usuários na plataforma Analytics."));
children.push(spacer());

// ── 2. ATORES E PERSONAS ──
children.push(heading1("2. Atores e Personas"));
children.push(makeTable(
  [2000, 2500, 4860],
  ["Persona", "Responsabilidade", "Interação com o Sistema"],
  [
    ["Analista Financeiro / Controladoria", "Acompanhar o fluxo de caixa operacional, elaborar análises periódicas e identificar desvios em relação ao período anterior", "Acessa ambos os painéis, aplica filtros de período e empresa, compara com período anterior, exporta dados para análise offline (PDF e Excel)"],
    ["Gestor / Diretor Financeiro", "Validar resultados de caixa, tomar decisões estratégicas de captação, investimento e distribuição com base nos indicadores", "Visualiza os painéis em modo leitura; utiliza os KPIs de topo e os gráficos como visão executiva; aplica filtro consolidado para visão do grupo"],
    ["Administrador da Plataforma", "Manter a base de dados do FCD (planilha Excel) atualizada; gerenciar o processo de carga periódica", "Realiza upload ou integração da planilha Excel que alimenta o painel Direto; monitora data da última carga exibida no sistema"],
    ["Usuário Sankhya (Genérico)", "Qualquer usuário com credenciais Sankhya e acesso ao link Analytics", "Autentica com usuário e senha Sankhya; acessa somente os módulos e empresas autorizados pelo perfil Sankhya"],
  ]
));
children.push(spacer());

// ── 3. PRÉ-CONDIÇÕES ──
children.push(heading1("3. Pré-Condições"));
children.push(makeTable(
  [900, 5600, 2860],
  ["ID", "Descrição", "Tipo"],
  [
    ["PC-01", "ERP Sankhya ativo, acessível pela plataforma Analytics e com movimentações financeiras lançadas e conciliadas para os períodos que serão analisados", "Obrigatória"],
    ["PC-02", "Usuário possui credenciais válidas (usuário e senha) no ERP Sankhya e não está com o acesso bloqueado", "Obrigatória"],
    ["PC-03", "Link de acesso à plataforma Analytics foi distribuído ao usuário por e-mail pelo Administrador", "Obrigatória"],
    ["PC-04", "Planilha Excel com os dados do FCD carregada e atualizada na plataforma, seguindo o layout-padrão acordado com a Neuon (conforme RN-01)", "Obrigatória — somente painel FCD"],
    ["PC-05", "Estrutura de contas, naturezas financeiras e centros de custo necessários para o FCI parametrizados no Sankhya (conforme RN-02)", "Obrigatória — somente painel FCI"],
    ["PC-06", "Usuário possui permissão de acesso ao módulo Analytics no perfil Sankhya", "Obrigatória"],
    ["PC-07", "Para visão consolidada (RN-11): todas as empresas do grupo possuem dados lançados no Sankhya e/ou na planilha Excel para o período selecionado", "Obrigatória — somente visão Consolidado"],
  ]
));
children.push(spacer());

// ── 4. GLOSSÁRIO ──
children.push(heading1("4. Glossário"));
children.push(makeTable(
  [2800, 6560],
  ["Termo", "Definição"],
  [
    ["Fluxo de Caixa Direto (FCD)", "Demonstração financeira que evidencia as entradas e saídas brutas de caixa classificadas em Atividades Operacionais, de Investimento e de Financiamento. Fonte de dados: planilha Excel externa ao Sankhya."],
    ["Fluxo de Caixa Indireto (FCI)", "Demonstração financeira que parte do Resultado Líquido do exercício e aplica ajustes de itens não-caixa e variações no capital de giro para chegar ao caixa gerado pelas operações. Fonte de dados: ERP Sankhya."],
    ["ERP Sankhya", "Sistema de Gestão Empresarial utilizado pela BeaBisa como fonte primária de dados financeiros, contábeis e operacionais. Também provê autenticação dos usuários da plataforma Analytics."],
    ["Período", "Granularidade temporal selecionada pelo usuário como filtro: mês individual (ex.: Jan/2026), trimestre (ex.: T1 2026) ou ano completo (ex.: 2026). Padrão: mês corrente."],
    ["Empresa", "Entidade jurídica ou unidade de negócios da BeaBisa cadastrada no Sankhya: BeaBisa Agro, BeaBisa Empreendimentos, BeaBisa Pecuária. A opção 'Consolidado' representa a soma de todas as empresas."],
    ["Atividades Operacionais", "Bloco do FCD/FCI que registra entradas e saídas de caixa decorrentes das operações principais (recebimentos de clientes, pagamentos a fornecedores, pessoal, tributos e outros)."],
    ["Atividades de Investimento", "Bloco do FCD/FCI que registra entradas e saídas relacionadas à aquisição e venda de ativos de longo prazo (imóveis rurais, equipamentos, aplicações financeiras)."],
    ["Atividades de Financiamento", "Bloco do FCD/FCI que registra entradas e saídas decorrentes de captação de empréstimos, amortização de dívidas e outras operações de financiamento."],
    ["Resultado Líquido", "Lucro ou prejuízo apurado no período, extraído do DRE do Sankhya. É o ponto de partida do FCI."],
    ["Ajustes de Itens Não-Caixa", "Adições e exclusões ao Resultado Líquido de itens que não geram movimentação de caixa: depreciação/amortização, resultado em alienação de ativos e provisões."],
    ["Variação no Capital de Giro (Δ CG)", "Conjunto de variações em ativos e passivos circulantes que impacta o caixa operacional: Δ contas a receber, Δ estoques, Δ fornecedores, Δ obrigações fiscais e outros."],
    ["KPI (Key Performance Indicator)", "Indicador de desempenho exibido em card de destaque no topo de cada painel, calculado automaticamente a partir dos dados carregados e comparado com o período anterior."],
    ["Variação vs Período Anterior (Δ%)", "Diferença percentual entre o valor do indicador no período selecionado e o valor no período imediatamente anterior (ex.: Jan/26 vs Dez/25). Exibida com cor verde para melhora e vermelho para piora."],
    ["Planilha de Base (Excel)", "Arquivo de planilha eletrônica mantido externamente ao Sankhya, que serve de fonte de dados para o painel FCD. Deve seguir o layout-padrão definido pela Neuon (ver PA-01)."],
    ["Carga de Dados", "Processo de importação ou atualização da planilha Excel na plataforma Analytics, disparado pelo Administrador. A data e hora da última carga são exibidas no painel FCD."],
    ["Saldo Inicial / Saldo Final", "Saldo Inicial: caixa disponível no primeiro dia do período selecionado. Saldo Final = Saldo Inicial + Variação Líquida (soma das três atividades)."],
    ["Consolidado", "Visão que agrega os dados de todas as empresas do grupo BeaBisa (Agro + Empreendimentos + Pecuária) em um único relatório, sem dupla contagem entre empresas."],
    ["Waterfall Chart", "Gráfico em cascata (usado no FCI) que representa visualmente a composição do caixa operacional, partindo do Resultado Líquido e exibindo cada ajuste como barra incremental ou decremental."],
    ["Badge de Fonte", "Indicador visual exibido na barra superior de cada painel informando a origem dos dados: 'Excel' (FCD, cor âmbar) ou 'Sankhya' (FCI, cor verde)."],
    ["Analytics / BeaBisa IA", "Plataforma de Business Intelligence da BeaBisa, acessível via link web com autenticação Sankhya, que centraliza os painéis gerenciais de todas as áreas do grupo."],
  ]
));
children.push(spacer());

// ── 5. REGRAS DE NEGÓCIO ──
children.push(heading1("5. Regras de Negócio"));

// Regras transversais
children.push(heading1("5.1 Regras Transversais (aplicam-se a ambos os painéis)"));

children.push(heading2("RN-01 — Fonte de Dados do Fluxo de Caixa Direto"));
children.push(para("O painel FCD obtém seus dados exclusivamente de planilha Excel externa ao Sankhya. Nenhum dado do FCD é extraído do ERP. A planilha deve seguir o layout-padrão definido pela Neuon (colunas, categorias e nomenclatura acordadas). Qualquer dado fora do layout esperado deve ser ignorado e sinalizado no log de carga."));
children.push(highlightBox("Ponto em Aberto PA-01:", "O layout exato da planilha (colunas, ordem das linhas, nomenclatura das categorias) ainda não foi entregue pela BeaBisa. Necessário antes de desenvolver o parser de carga.", COLORS.orange));
children.push(spacer());

children.push(heading2("RN-02 — Fonte de Dados do Fluxo de Caixa Indireto"));
children.push(para("O painel FCI obtém seus dados exclusivamente do ERP Sankhya. O sistema extrai o Resultado Líquido do DRE e as contas contábeis/naturezas financeiras que compõem cada ajuste e variação de capital de giro. Nenhuma planilha Excel é consultada para o FCI."));
children.push(highlightBox("Ponto em Aberto PA-02:", "As contas contábeis e naturezas financeiras específicas do Sankhya que alimentam cada linha do FCI (depreciação, alienações, contas a receber, estoques, fornecedores, etc.) precisam ser levantadas com o time de Controladoria da BeaBisa.", COLORS.orange));
children.push(spacer());

children.push(heading2("RN-03 — Autenticação via ERP Sankhya"));
children.push(para("O acesso à plataforma Analytics é feito exclusivamente com usuário e senha do ERP Sankhya. Não existe cadastro de usuários na plataforma Analytics. A tela de login exibe campo 'Usuário Sankhya' e campo 'Senha'. Após autenticação bem-sucedida, o sistema redireciona para o Dashboard (home). Em caso de credenciais inválidas, exibe mensagem genérica de erro sem revelar qual campo está incorreto, e o usuário permanece na tela de login."));
children.push(spacer());

children.push(heading2("RN-04 — Acesso por Link de E-mail"));
children.push(para("O ponto de entrada da plataforma é um link enviado ao usuário por e-mail pelo Administrador. Ao acessar o link, o usuário é redirecionado à tela de login com autenticação Sankhya. Este comportamento está contratado e acordado. O link direciona para a URL da plataforma Analytics, não para um módulo específico — o usuário navega livremente após o login."));
children.push(highlightBox("Ponto em Aberto PA-05:", "Verificar se o link tem prazo de validade ou é permanente. Definir processo de reenvio caso o link expire.", COLORS.orange));
children.push(spacer());

children.push(heading2("RN-05 — Filtro de Período"));
children.push(para([
  "Ambos os painéis disponibilizam filtro de período em formato de ",
  { text: "pills selecionáveis", bold: true },
  ". As opções disponíveis são fixas e representam meses individuais recentes, trimestres e o ano corrente. O período padrão ao abrir qualquer painel é o mês corrente."
]));
children.push(spacer(60));
children.push(makeTable(
  [2200, 3080, 4080],
  ["Opção de Período", "Cobertura dos Dados", "Exemplo (contexto Jan/2026)"],
  [
    ["Mês individual (pill)", "Dados do mês selecionado", "Out/25, Nov/25, Dez/25, Jan/26"],
    ["Trimestre (pill T1, T2, S1)", "Soma dos meses do trimestre/semestre", "T1 2026 = Jan + Fev + Mar"],
    ["Ano completo (pill 2026)", "Soma de todos os meses do ano", "Jan a Dez/2026 (parcial se ainda não encerrado)"],
  ]
));
children.push(spacer(60));
children.push(highlightBox("Nota:", "A seleção de range customizado de datas (data inicial e data final livre) não está no escopo desta versão. Pode ser levantada para versão futura.", COLORS.blue));
children.push(spacer());

children.push(heading2("RN-06 — Filtro de Empresa e Visão Consolidada"));
children.push(para([
  "Ambos os painéis disponibilizam filtro por empresa em formato de ",
  { text: "dropdown de seleção única", bold: true },
  ". As opções são: BeaBisa Agro, BeaBisa Empreendimentos, BeaBisa Pecuária e Consolidado."
]));
children.push(para("Quando selecionada a opção 'Consolidado', o sistema agrega os dados de todas as empresas do grupo sem dupla contagem. Para o FCD, a consolidação ocorre sobre os dados da planilha Excel (que deve conter uma aba ou marcação por empresa). Para o FCI, a consolidação ocorre sobre os dados do Sankhya com filtro multi-empresa."));
children.push(highlightBox("Ponto em Aberto PA-07:", "Definir se o filtro de empresa respeita o perfil de acesso do usuário Sankhya (cada usuário vê apenas as empresas às quais tem permissão) ou se todos os usuários autenticados veem todas as empresas.", COLORS.orange));
children.push(spacer());

children.push(heading2("RN-07 — Comparativo com Período Anterior"));
children.push(para("Todos os KPIs e a tabela de dados exibem, além do valor do período selecionado, o valor do período imediatamente anterior e a variação percentual (Δ%). A variação é calculada conforme fórmula:"));
children.push(spacer(60));
children.push(makeTable(
  [3500, 5860],
  ["Elemento", "Especificação"],
  [
    ["Fórmula da variação", "Δ% = ((Valor Atual − Valor Anterior) / |Valor Anterior|) × 100"],
    ["Exemplo — Ativ. Operacionais", "Jan/26: R$ 1.340.000 | Dez/25: R$ 1.000.000 → Δ% = +34,0%"],
    ["Exemplo — Saldo Final", "Jan/26: R$ 1.630.000 | Dez/25: R$ 2.340.000 → Δ% = −30,3%"],
    ["Cor — variação positiva (melhora)", "Verde (#10B981) — somente quando a variação é favorável ao caixa (ex.: entradas aumentam ou saídas diminuem)"],
    ["Cor — variação negativa (piora)", "Vermelho (#EF4444) — somente quando a variação é desfavorável ao caixa"],
    ["Período anterior", "Mês anterior ao mês selecionado; trimestre anterior ao trimestre selecionado; ano anterior ao ano selecionado"],
    ["Valor anterior zero", "Se o valor do período anterior for zero, exibir 'N/A' no lugar do Δ%"],
  ]
));
children.push(spacer());

children.push(heading2("RN-08 — Indicação da Fonte de Dados (Badge)"));
children.push(para("Cada painel exibe, na barra superior (topbar), um badge visual identificando a fonte dos dados. O badge é estático (não interativo) e serve para comunicar ao usuário a origem dos dados que está visualizando."));
children.push(spacer(60));
children.push(makeTable(
  [2000, 3680, 3680],
  ["Painel", "Badge", "Cor"],
  [
    ["Fluxo de Caixa Direto", "'Base: Excel'", "Âmbar (#F59E0B) — indica dado externo ao ERP"],
    ["Fluxo de Caixa Indireto", "'Base: Sankhya'", "Verde (#10B981) — indica dado em tempo real do ERP"],
  ]
));
children.push(spacer());

children.push(heading2("RN-09 — Data e Hora da Última Atualização"));
children.push(para("Todos os painéis exibem, na barra de filtros, a data e hora da última sincronização dos dados. Para o FCD: 'Atualizado em DD/MM/AAAA às HH:MM'. Para o FCI: 'Sincronizado com Sankhya: DD/MM/AAAA às HH:MM'. O texto é exibido com ponto verde ao lado indicando que os dados estão disponíveis."));
children.push(spacer());

children.push(heading2("RN-10 — Exportação de Dados"));
children.push(para("Ambos os painéis disponibilizam exportação do conteúdo exibido. Os botões de exportação ficam na barra de filtros, no lado direito."));
children.push(spacer(60));
children.push(makeTable(
  [2000, 3080, 4280],
  ["Botão", "Formato", "Conteúdo Exportado"],
  [
    ["PDF", ".pdf", "Captura visual fiel do painel — inclui filtros selecionados, KPIs, gráficos e tabela completa. Cabeçalho com nome da empresa, período e data de geração."],
    ["Exportar Excel", ".xlsx", "Planilha com os dados da tabela (duas colunas: período atual e período anterior). Inclui aba de metadados (empresa, período, data de extração, fonte dos dados)."],
  ]
));
children.push(spacer());

children.push(heading2("RN-11 — Navegação e Estrutura do Menu"));
children.push(para("A plataforma Analytics possui menu lateral fixo (sidebar) hierárquico com as seções: Financeiro, Controladoria, Fiscal, Suprimentos, Recursos Humanos, Pecuária e Empreendimentos. Dentro de Controladoria estão: DRE, Balanço Patrimonial, Fluxo de Caixa Direto, Fluxo de Caixa Indireto, Highlights e Informações Gerenciais. O item ativo é destacado com cor primária e indicador visual à esquerda. Os itens de módulos ainda não desenvolvidos permanecem no menu, mas sem link ativo."));
children.push(spacer());

children.push(heading2("RN-12 — Sessão e Inatividade"));
children.push(para("A sessão do usuário herda o comportamento de sessão do Sankhya. Após período de inatividade definido pelo Sankhya, a sessão é encerrada automaticamente. O sistema redireciona o usuário para a tela de login exibindo a mensagem: 'Sua sessão expirou. Por favor, faça login novamente.'"));
children.push(spacer());

// Regras específicas FCD
children.push(heading1("5.2 Regras Específicas — Fluxo de Caixa Direto"));

children.push(heading2("RN-13 — Linhas da Tabela FCD — Atividades Operacionais"));
children.push(para("O bloco de Atividades Operacionais do FCD é composto pelas seguintes linhas, nesta ordem:"));
children.push(spacer(60));
children.push(makeTable(
  [600, 5160, 1800, 1800],
  ["Nº", "Linha", "Sinal Esperado", "Origem na Planilha"],
  [
    ["1", "Recebimentos de clientes e adiantamentos", "Positivo (+)", "Conforme PA-01"],
    ["2", "Pagamentos a fornecedores de bens e serviços", "Negativo (−)", "Conforme PA-01"],
    ["3", "Pagamentos de pessoal e encargos sociais", "Negativo (−)", "Conforme PA-01"],
    ["4", "Recolhimento de tributos e contribuições", "Negativo (−)", "Conforme PA-01"],
    ["5", "Outras receitas e despesas operacionais", "Positivo ou Negativo", "Conforme PA-01"],
    ["—", "Caixa líquido das atividades operacionais (Subtotal)", "Calculado: soma das linhas 1 a 5", "Calculado pelo sistema"],
  ]
));
children.push(spacer());

children.push(heading2("RN-14 — Linhas da Tabela FCD — Atividades de Investimento"));
children.push(makeTable(
  [600, 5160, 1800, 1800],
  ["Nº", "Linha", "Sinal Esperado", "Origem na Planilha"],
  [
    ["6", "Aquisição de propriedades rurais e benfeitorias", "Negativo (−)", "Conforme PA-01"],
    ["7", "Venda de ativos imobilizados", "Positivo (+)", "Conforme PA-01"],
    ["8", "Aplicações em títulos financeiros", "Negativo (−)", "Conforme PA-01"],
    ["—", "Caixa líquido das atividades de investimento (Subtotal)", "Calculado: soma das linhas 6 a 8", "Calculado pelo sistema"],
  ]
));
children.push(spacer());

children.push(heading2("RN-15 — Linhas da Tabela FCD — Atividades de Financiamento e Totais"));
children.push(makeTable(
  [600, 5160, 1800, 1800],
  ["Nº", "Linha", "Sinal Esperado", "Origem na Planilha"],
  [
    ["9", "Captação de empréstimos e financiamentos rurais", "Positivo (+)", "Conforme PA-01"],
    ["10", "Amortização de financiamentos e empréstimos", "Negativo (−)", "Conforme PA-01"],
    ["—", "Caixa líquido das atividades de financiamento (Subtotal)", "Calculado: soma das linhas 9 a 10", "Calculado pelo sistema"],
    ["—", "Saldo de caixa e equivalentes no início do período", "Positivo (ou zero)", "Conforme PA-01"],
    ["—", "Variação líquida do caixa no período", "Calculado: Subtotal AO + AI + AF", "Calculado pelo sistema"],
    ["—", "Saldo de Caixa e Equivalentes no Final do Período", "Calculado: Saldo Inicial + Variação Líquida", "Calculado pelo sistema"],
  ]
));
children.push(spacer(60));
children.push(highlightBox("Fórmula de Verificação:", "Saldo Final = Saldo Inicial + Caixa AO + Caixa AI + Caixa AF. Exemplo: R$2.340.000 + R$1.340.000 + (R$3.550.000) + R$1.500.000 = R$1.630.000.", COLORS.blue));
children.push(spacer());

children.push(heading2("RN-16 — KPIs do Painel FCD"));
children.push(para("O painel FCD exibe 5 cartões de KPI no topo da tela, cada um com nome, valor formatado em R$ e variação percentual vs período anterior:"));
children.push(spacer(60));
children.push(makeTable(
  [1400, 2160, 3200, 2600],
  ["KPI", "Valor Exibido", "Fórmula", "Cor da Variação"],
  [
    ["Saldo Inicial", "R$ em moeda", "Saldo de caixa no início do período (da planilha)", "Neutro (cinza)"],
    ["Ativ. Operacionais", "R$ em moeda (+ ou −)", "Subtotal AO do FCD", "Verde se aumentou, Vermelho se diminuiu"],
    ["Ativ. Investimento", "R$ em moeda (− normalmente)", "Subtotal AI do FCD", "Verde se reduziu saída, Vermelho se aumentou saída"],
    ["Ativ. Financiamento", "R$ em moeda (+ ou −)", "Subtotal AF do FCD", "Verde se positivo e maior, conforme contexto"],
    ["Saldo Final", "R$ em moeda", "Saldo Inicial + AO + AI + AF", "Verde se maior que período anterior, Vermelho se menor"],
  ]
));
children.push(spacer());

children.push(heading2("RN-17 — Gráficos do Painel FCD"));
children.push(para("O painel FCD exibe dois gráficos lado a lado abaixo dos KPIs:"));
children.push(spacer(60));
children.push(makeTable(
  [2000, 3680, 3680],
  ["Gráfico", "Tipo", "Dados Exibidos"],
  [
    ["Atividades por Categoria — Comparativo", "Barras horizontais (bar chart)", "3 barras agrupadas (Operacional, Investimento, Financiamento). Cada grupo tem duas barras: período atual (cor plena) e período anterior (cor translúcida). Valores em R$ mil."],
    ["Evolução do Saldo de Caixa", "Linha com área (line chart)", "Saldo final de caixa dos últimos 6 meses anteriores ao período selecionado. Permite visualizar tendência de caixa."],
  ]
));
children.push(spacer());

// Regras específicas FCI
children.push(heading1("5.3 Regras Específicas — Fluxo de Caixa Indireto"));

children.push(heading2("RN-18 — Ponto de Partida do FCI"));
children.push(para("O FCI inicia com o Resultado Líquido do Exercício, extraído do DRE do Sankhya para o período e empresa selecionados. Esta linha é destacada visualmente com borda e cor diferenciada (verde se positivo, vermelho se negativo) e não é parte de nenhum bloco de ajustes — é o ponto de partida da demonstração."));
children.push(spacer());

children.push(heading2("RN-19 — Bloco de Ajustes de Itens Não-Caixa do FCI"));
children.push(para("Após o Resultado Líquido, o FCI apresenta o bloco de 'Ajustes de Itens Não-Caixa' com as seguintes linhas:"));
children.push(spacer(60));
children.push(makeTable(
  [600, 5160, 1800, 1800],
  ["Nº", "Linha", "Sinal", "Origem Sankhya"],
  [
    ["1", "(+) Depreciação e amortização de ativos", "Soma — sempre positivo (adiciona ao caixa)", "Conforme PA-02"],
    ["2", "(−) Resultado na alienação de ativos imobilizados", "Subtração — normalmente negativo (lucro já no RL)", "Conforme PA-02"],
    ["3", "(+) Provisão para créditos de liquidação duvidosa", "Soma — sempre positivo (despesa sem saída de caixa)", "Conforme PA-02"],
  ]
));
children.push(spacer());

children.push(heading2("RN-20 — Bloco de Variações no Capital de Giro do FCI"));
children.push(makeTable(
  [600, 5160, 1800, 1800],
  ["Nº", "Linha", "Sinal Convencional", "Origem Sankhya"],
  [
    ["4", "(−) Aumento em contas a receber de clientes", "Negativo se cresceu (consome caixa)", "Conforme PA-02"],
    ["5", "(−) Aumento em estoques e adiantamentos a fornecedores", "Negativo se cresceu (consome caixa)", "Conforme PA-02"],
    ["6", "(+) Aumento em fornecedores e contas a pagar", "Positivo se cresceu (libera caixa)", "Conforme PA-02"],
    ["7", "(+) Aumento em obrigações fiscais e tributárias", "Positivo se cresceu (libera caixa)", "Conforme PA-02"],
    ["8", "(+/−) Variação em outros ativos e passivos circulantes", "Positivo ou negativo conforme variação", "Conforme PA-02"],
    ["—", "Caixa líquido das atividades operacionais (Subtotal)", "Calculado: RL + todos os ajustes + todas as variações", "Calculado"],
  ]
));
children.push(spacer(60));
children.push(highlightBox("Fórmula FCI:", "Caixa AO = Resultado Líquido + (Ajustes Não-Caixa) + (Δ Capital de Giro). Exemplo: R$1.250.000 + R$335.000 + (R$245.000) = R$1.340.000.", COLORS.blue));
children.push(spacer());

children.push(heading2("RN-21 — Blocos de Investimento e Financiamento do FCI"));
children.push(para("Os blocos de Atividades de Investimento e de Financiamento do FCI são idênticos em conteúdo e cálculo aos do FCD (conforme RN-14 e RN-15). Os dados de investimento e financiamento no FCI são extraídos do Sankhya (não da planilha Excel). O Saldo Final do FCI deve ser numericamente igual ao Saldo Final do FCD para o mesmo período e empresa."));
children.push(highlightBox("Regra de Consistência:", "Saldo Final FCD = Saldo Final FCI (para o mesmo período e empresa). Qualquer divergência indica erro de parametrização das contas no Sankhya ou inconsistência na planilha Excel.", COLORS.red));
children.push(spacer());

children.push(heading2("RN-22 — KPIs do Painel FCI"));
children.push(makeTable(
  [1800, 2000, 3160, 2400],
  ["KPI", "Valor Exibido", "Fórmula", "Cor da Variação"],
  [
    ["Resultado Líquido", "R$ em moeda", "Lucro/Prejuízo do período (DRE Sankhya)", "Verde se lucro maior; Vermelho se menor"],
    ["Ajustes Não-Caixa", "R$ em moeda", "Soma das linhas 1 a 3 (RN-19)", "Neutro — informativo"],
    ["Δ Capital de Giro", "R$ em moeda", "Soma das linhas 4 a 8 (RN-20)", "Verde se Δ favorável ao caixa; Vermelho se desfavorável"],
    ["Caixa Operacional", "R$ em moeda", "RL + Ajustes NC + Δ CG", "Verde se maior que período anterior"],
    ["Saldo Final de Caixa", "R$ em moeda", "Caixa AO + Caixa AI + Caixa AF + Saldo Inicial", "Verde se maior; Vermelho se menor"],
  ]
));
children.push(spacer());

children.push(heading2("RN-23 — Gráficos do Painel FCI"));
children.push(makeTable(
  [2000, 3680, 3680],
  ["Gráfico", "Tipo", "Dados Exibidos"],
  [
    ["Composição do Fluxo — Waterfall", "Gráfico em cascata (waterfall)", "Parte do Resultado Líquido e exibe cada ajuste (RN-19 e RN-20) como barra incremental (positivo = verde) ou decremental (negativo = vermelho). A última barra é o Caixa Operacional Total (cor ciano). Valores em R$ mil."],
    ["Resultado Líquido vs Caixa Operacional", "Duas linhas sobrepostas (line chart)", "Série 1 (violeta): Resultado Líquido dos últimos 6 meses. Série 2 (ciano): Caixa Operacional dos últimos 6 meses. Permite visualizar o gap entre lucro e geração de caixa."],
  ]
));
children.push(spacer());

// ── 6. FLUXO PRINCIPAL ──
children.push(heading1("6. Fluxo Principal (Caminho Feliz)"));
children.push(makeTable(
  [900, 8460],
  ["Passo", "Descrição"],
  [
    ["1", "Usuário recebe o link de acesso à plataforma BeaBisa IA Analytics por e-mail enviado pelo Administrador"],
    ["2", "Usuário acessa o link no navegador. O sistema exibe a tela de login com campos 'Usuário Sankhya' e 'Senha' sobre fundo animado com identidade visual da plataforma"],
    ["3", "Usuário preenche os campos com suas credenciais Sankhya e clica em 'Entrar na Plataforma'"],
    ["4", "O sistema valida as credenciais junto ao Sankhya. Em caso de sucesso, exibe indicador de carregamento ('Autenticando...') e redireciona para o Dashboard em até 5 segundos"],
    ["5", "No Dashboard, o usuário visualiza o menu lateral com todas as seções disponíveis e os cards de acesso rápido aos módulos de Controladoria"],
    ["6", "Usuário clica em 'Fluxo de Caixa Direto' no menu lateral (Controladoria → Fluxo Caixa Direto)"],
    ["7", "O sistema exibe o painel FCD com: barra de filtros, 5 KPIs, 2 gráficos e tabela completa. O período padrão selecionado é o mês corrente. A empresa padrão é a primeira da lista (BeaBisa Agro). O badge 'Base: Excel' e a data da última carga são exibidos."],
    ["8", "Usuário seleciona um período diferente clicando em uma das pills de período (ex.: 'Dez/25')"],
    ["9", "O sistema recarrega imediatamente todos os valores: KPIs atualizados, gráficos redesenhados, tabela com dados do período selecionado e variação vs período anterior recalculada"],
    ["10", "Usuário altera o filtro de empresa para 'Consolidado'"],
    ["11", "O sistema recarrega os dados com a soma de todas as empresas. A empresa na tabela e no período é exibida como 'Consolidado'"],
    ["12", "Usuário analisa a tabela: verifica o Caixa Operacional, compara com período anterior e identifica variações relevantes"],
    ["13", "Usuário clica em 'Exportar Excel' para baixar os dados da tabela em formato .xlsx"],
    ["14", "O sistema gera e disponibiliza o download do arquivo Excel com os dados do período e empresa selecionados"],
    ["15", "Usuário navega para 'Fluxo de Caixa Indireto' via menu lateral para comparar com a visão do FCI"],
    ["16", "O sistema exibe o painel FCI com: badge 'Base: Sankhya', 5 KPIs, waterfall chart, gráfico comparativo e tabela FCI completa"],
    ["17", "Usuário compara o Saldo Final do FCI com o Saldo Final do FCD para validar consistência entre os dois painéis"],
  ]
));
children.push(spacer());

// ── 7. FLUXOS ALTERNATIVOS ──
children.push(heading1("7. Fluxos Alternativos e Exceções"));
children.push(makeTable(
  [900, 2600, 5860],
  ["ID", "Cenário", "Comportamento Esperado"],
  [
    ["FA-01", "Credenciais Sankhya inválidas (usuário ou senha incorretos)", "O sistema exibe mensagem de erro genérica: 'Usuário ou senha incorretos. Verifique suas credenciais.' O usuário permanece na tela de login com os campos limpos para nova tentativa. Não revelar qual campo está incorreto."],
    ["FA-02", "Usuário autenticado sem permissão de acesso ao módulo Analytics", "Após login bem-sucedido, o sistema exibe tela de acesso negado com a mensagem: 'Seu usuário não possui permissão de acesso ao BeaBisa IA Analytics. Contate o administrador de sistema.'"],
    ["FA-03", "Nenhum dado disponível para o período e empresa selecionados (FCD)", "O sistema mantém a estrutura do painel com todos os KPIs exibindo 'R$ 0,00' e a tabela com todas as linhas em zero. Uma mensagem de estado vazio é exibida na área dos gráficos: 'Nenhum dado encontrado para o período selecionado.'"],
    ["FA-04", "Planilha Excel do FCD não carregada ou corrompida", "O painel FCD exibe, no lugar da tabela e dos gráficos, um aviso destacado: 'Dados do Fluxo de Caixa Direto indisponíveis. A planilha Excel não foi carregada ou está com erro. Última carga: [data]. Contate o Administrador.' Os KPIs exibem '--' (traço)."],
    ["FA-05", "Erro de comunicação com o Sankhya durante carregamento do FCI", "O sistema exibe, no lugar da tabela e dos gráficos, mensagem de erro: 'Não foi possível conectar ao Sankhya. Tente novamente em instantes.' Um botão 'Tentar Novamente' dispara nova consulta. Os KPIs exibem '--'."],
    ["FA-06", "Sessão expirada por inatividade", "O sistema detecta a expiração da sessão Sankhya e redireciona o usuário para a tela de login exibindo a mensagem: 'Sua sessão expirou por inatividade. Por favor, faça login novamente.'"],
    ["FA-07", "Erro na geração do arquivo de exportação (PDF ou Excel)", "O sistema exibe mensagem: 'Erro ao gerar o arquivo. Tente novamente.' O botão de exportação retorna ao estado inicial após 3 segundos. Os dados permanecem visíveis na tela."],
    ["FA-08", "Empresa selecionada não possui dados no período selecionado (FCI)", "O sistema exibe o painel com valores zerados e mensagem informativa abaixo dos KPIs: 'Não há lançamentos registrados no Sankhya para [empresa] em [período].'"],
    ["FA-09", "Planilha Excel com formato inválido ou colunas fora do padrão durante carga", "O sistema rejeita a carga, exibe log de erro ao Administrador informando as colunas/linhas que não corresponderam ao layout esperado e mantém os dados da carga anterior. A data da última carga bem-sucedida é preservada."],
    ["FA-10", "Resultado Líquido nulo ou inexistente no Sankhya para o período (FCI)", "O sistema exibe o ponto de partida do FCI como 'R$ 0,00' e processa os demais ajustes normalmente. Exibe aviso: 'Resultado Líquido não encontrado no Sankhya para o período. Verifique o DRE.'"],
  ]
));
children.push(spacer());

// ── 8. CRITÉRIOS DE ACEITE ──
children.push(heading1("8. Critérios de Aceite"));
children.push(makeTable(
  [900, 8460],
  ["ID", "Critério"],
  [
    // Autenticação e acesso
    ["CA-01", "O sistema autentica o usuário com credenciais Sankhya válidas e redireciona para o Dashboard em no máximo 5 segundos após clicar em 'Entrar'"],
    ["CA-02", "O sistema recusa autenticação com credenciais inválidas, exibe mensagem genérica de erro e mantém o usuário na tela de login sem revelar qual campo está incorreto"],
    ["CA-03", "Usuário sem permissão de acesso ao Analytics, após autenticação Sankhya bem-sucedida, recebe tela de acesso negado com orientação para contatar o administrador"],
    ["CA-04", "A sessão é encerrada automaticamente após inatividade e o usuário é redirecionado para login com mensagem explicativa de sessão expirada"],
    // Fonte de dados
    ["CA-05", "O painel FCD carrega dados exclusivamente da planilha Excel — nenhum dado do Sankhya aparece na tabela do FCD"],
    ["CA-06", "O painel FCI carrega dados exclusivamente do Sankhya — nenhum dado de planilha Excel aparece na tabela do FCI"],
    ["CA-07", "O badge 'Base: Excel' (âmbar) é exibido na topbar do FCD e o badge 'Base: Sankhya' (verde) é exibido na topbar do FCI"],
    ["CA-08", "Quando a planilha Excel não está carregada, o FCD exibe aviso explícito de indisponibilidade com a data da última carga — os valores não aparecem como zero sem aviso"],
    // Filtros
    ["CA-09", "Ao clicar em qualquer pill de período, todos os valores (KPIs, gráficos e tabela) são atualizados para o intervalo correspondente sem recarregar a página"],
    ["CA-10", "Ao alterar o filtro de empresa, todos os valores são atualizados para exibir somente os dados da empresa selecionada"],
    ["CA-11", "A opção 'Consolidado' no filtro de empresa exibe a soma das três empresas (BeaBisa Agro + Empreendimentos + Pecuária) sem dupla contagem"],
    ["CA-12", "O período padrão ao abrir qualquer painel é o mês corrente com a primeira empresa da lista selecionada"],
    // KPIs e cálculos FCD
    ["CA-13", "Os 5 KPIs do FCD são calculados corretamente: Saldo Inicial (planilha), AO (subtotal), AI (subtotal), AF (subtotal), Saldo Final (Saldo Inicial + AO + AI + AF)"],
    ["CA-14", "A fórmula Saldo Final = Saldo Inicial + Caixa AO + Caixa AI + Caixa AF é verificável com os valores exibidos na tabela (tolerância: R$0)"],
    ["CA-15", "A variação percentual (Δ%) de cada KPI é calculada corretamente conforme RN-07, exibida em verde (melhora) ou vermelho (piora)"],
    // KPIs e cálculos FCI
    ["CA-16", "Os 5 KPIs do FCI são calculados corretamente: Resultado Líquido (Sankhya), Ajustes NC (soma RN-19), Δ CG (soma RN-20), Caixa Operacional (RL + Aj + Δ), Saldo Final"],
    ["CA-17", "A fórmula Caixa AO = Resultado Líquido + Ajustes Não-Caixa + Δ Capital de Giro produz o mesmo valor que o Caixa AO do FCD para o mesmo período e empresa (tolerância: R$0)"],
    ["CA-18", "O Saldo Final do FCI é numericamente igual ao Saldo Final do FCD para o mesmo período e empresa — qualquer divergência é sinalizada ao Administrador"],
    // Tabela FCD
    ["CA-19", "A tabela do FCD exibe exatamente as linhas definidas em RN-13, RN-14 e RN-15 na ordem especificada, com rótulos idênticos aos definidos no escopo"],
    ["CA-20", "Valores positivos na tabela FCD são exibidos sem parênteses (ex.: 4.520.000) e valores negativos são exibidos entre parênteses (ex.: (2.150.000))"],
    ["CA-21", "A coluna de período anterior é exibida na tabela, com os valores do período imediatamente anterior ao selecionado"],
    // Tabela FCI
    ["CA-22", "A tabela do FCI exibe o Resultado Líquido como linha de destaque inicial (antes de qualquer bloco), as linhas de ajuste (RN-19), as variações de capital de giro (RN-20), os blocos de investimento e financiamento e os totais finais"],
    ["CA-23", "O sinal de cada linha da tabela FCI é exibido conforme convenção: (+) para adições ao caixa, (−) para subtrações"],
    // Gráficos
    ["CA-24", "O bar chart horizontal do FCD exibe corretamente as 3 atividades agrupadas com duas barras cada (período atual e anterior), com cores distintas por atividade"],
    ["CA-25", "O waterfall chart do FCI parte do Resultado Líquido, exibe cada ajuste como barra incremental (verde) ou decremental (vermelho) e termina no Caixa Operacional Total"],
    ["CA-26", "O line chart de evolução do saldo (FCD) e o line chart de Resultado vs Caixa (FCI) exibem dados dos últimos 6 meses em relação ao período selecionado"],
    // Exportação
    ["CA-27", "O botão 'PDF' gera e disponibiliza download de arquivo .pdf com cabeçalho contendo nome da empresa, período selecionado e data de geração"],
    ["CA-28", "O botão 'Exportar Excel' gera e disponibiliza download de arquivo .xlsx com os dados da tabela (período atual e anterior) e uma aba de metadados"],
    ["CA-29", "Em caso de erro na exportação, o sistema exibe mensagem de falha e o botão retorna ao estado inicial — os dados na tela não são afetados"],
    // Navegação
    ["CA-30", "O item ativo no menu lateral é destacado com cor primária e indicador visual à esquerda; itens inativos (módulos não desenvolvidos) são exibidos sem link funcional"],
  ]
));
children.push(spacer());

// ── 9. PONTOS EM ABERTO ──
children.push(heading1("9. Pontos em Aberto"));
children.push(highlightBox("Pontos Resolvidos:", "PA-03 (Granularidade do período) → resolvido em RN-05. PA-04 (Multi-empresa/Consolidado) → resolvido em RN-06. PA-08 (Exportação) → resolvido em RN-10.", COLORS.green));
children.push(spacer(80));
children.push(makeTable(
  [900, 2600, 5860],
  ["ID", "Ponto", "Questão a Responder"],
  [
    ["PA-01", "Layout da planilha Excel (FCD)", "Qual é o layout exato da planilha Excel que alimenta o FCD? Especificar: nome das abas, colunas esperadas, ordem das linhas de cada bloco (AO, AI, AF), nomenclatura exata de cada linha, coluna do saldo inicial, coluna de valores por mês. Quem é o responsável por manter o arquivo e com que frequência é atualizado? Resposta necessária antes de iniciar o desenvolvimento do parser de carga."],
    ["PA-02", "Campos Sankhya para o FCI", "Quais contas contábeis, naturezas financeiras e/ou centros de custo do Sankhya correspondem a cada linha do FCI (depreciação, provisões, contas a receber, estoques, fornecedores, obrigações fiscais)? A estrutura de plano de contas já está mapeada? Resposta necessária antes de desenvolver a extração de dados do FCI."],
    ["PA-05", "Validade e renovação do link de acesso", "O link de acesso enviado por e-mail tem prazo de validade ou é permanente? Se tiver validade, qual é o prazo? Existe processo para o Administrador gerar e reenviar um novo link? Existe suporte a múltiplos links ativos simultaneamente (ex.: um link por usuário)?"],
    ["PA-06", "Processo de carga da planilha Excel", "Como o Administrador realiza a carga da planilha Excel no sistema? Upload manual via interface da plataforma? Integração automática por FTP/SharePoint/OneDrive com horário agendado? Com que frequência mínima a planilha deve ser atualizada? Quem valida os dados após a carga?"],
    ["PA-07", "Segmentação de acesso por empresa", "O acesso ao filtro de empresa respeita o perfil Sankhya do usuário (cada usuário vê somente as empresas às quais tem permissão) ou todos os usuários autenticados têm acesso a todas as empresas e à visão consolidada? Definir antes de implementar o filtro de empresa."],
  ]
));
children.push(spacer());

// ===== ESTRUTURA DO DOCUMENTO =====
const MODULE_NAME = "BeaBisa IA — Fluxo de Caixa";
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
  fs.writeFileSync("Escopo-Tecnico-BeaBisa-FluxoCaixa-v2.1.docx", buffer);
  console.log("Documento criado: Escopo-Tecnico-BeaBisa-FluxoCaixa-v2.1.docx");
});
