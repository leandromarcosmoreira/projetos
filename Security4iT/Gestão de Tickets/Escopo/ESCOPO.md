# Escopo Tecnico e Visual Detalhado - Projeto BI Gestao de Tickets Security4iT

> **FONTES PRIMARIAS:**
> - **`Escopo validado - Gestao de ticket - SECURITY4IT.docx`** - Documento **validado pela cliente** em 24/02/2026. Fonte autoritativa e definitiva de requisitos.
> - `Projeto BI Gestao de Tickets - Security4it.pdf` (e-mail de Mercia Maria da Silva, Gerente Suporte - Security4iT, datado de 01/12/2025) - Referencia visual original.
> - `TELAS SECURITY.xlsx` (abas DASHS e ESFORCO) - Nomenclatura oficial, visoes, foco, observacoes tecnicas e plano de esforco.
>
> **Em caso de divergencia, prevalece o DOCX validado (24/02/2026).** Cada requisito e rastreavel a uma imagem de referencia e/ou celula da planilha.

---

## Indice

1. [Contexto do Projeto](#1-contexto-do-projeto)
2. [Identidade Visual Global](#2-identidade-visual-global)
3. [Componentes Globais de Interface](#3-componentes-globais-de-interface)
4. [TELA 1 - Chamados Mensais](#4-tela-1--chamados-mensais)
5. [TELA 2 - Chamados Detalhes](#5-tela-2--chamados-detalhes)
6. [TELA 3 - Tempo de Resolucao](#6-tela-3--tempo-de-resolucao)
7. [TELA 4 - SLA de Resolucao](#7-tela-4--sla-de-resolucao)
8. [TELA 5 - SLA de Primeira Resposta](#8-tela-5--sla-de-primeira-resposta)
9. [TELA 6 - Pesquisa de Satisfacao](#9-tela-6--pesquisa-de-satisfacao)
10. [TELA 7 - Horas de Suporte](#10-tela-7--horas-de-suporte)
11. [TELA 8 - Horas por Analista](#11-tela-8--horas-por-analista)
12. [Taxonomia de Dados e Classificacoes Validas](#12-taxonomia-de-dados-e-classificacoes-validas)
13. [Diretrizes Transversais](#13-diretrizes-transversais)
14. [Seguranca e Niveis de Acesso](#14-seguranca-e-niveis-de-acesso)
15. [Plano de Etapas do Projeto](#15-plano-de-etapas-do-projeto)
16. [Matriz de Rastreabilidade - Planilha DASHS](#16-matriz-de-rastreabilidade--planilha-dashs)
17. [Mapeamento Completo de Imagens](#17-mapeamento-completo-de-imagens)
18. [Especificacao Tecnica Funcional](#18-especificacao-tecnica-funcional)
19. [Regras de Negocio Tecnicas (RN-01 a RN-13)](#19-regras-de-negocio-tecnicas-rn-01-a-rn-13)
20. [Fluxo Principal e Fluxos Alternativos](#20-fluxo-principal-e-fluxos-alternativos)
21. [Criterios de Aceite](#21-criterios-de-aceite)
22. [Pontos Pendentes de Confirmacao](#22-pontos-pendentes-de-confirmacao)
23. [Referencias de Ativos](#23-referencias-de-ativos)

---

## 1. Contexto do Projeto

O projeto consiste na construcao de um dashboard BI para gestao de tickets oriundos do sistema **Movidesk**, destinado a Security4iT. Conforme o escopo validado: *"O desenvolvimento sera realizado no workspace do Mitra, com o objetivo de permitir ao cliente a visualizacao dos indicadores relacionados aos chamados abertos em seu nome."*

**Cliente:** Security4iT
**Solicitante:** Mercia Maria da Silva (mercia.silva@security4it.com.br) - Gerente Suporte
**Gerente de Projetos:** Camila Cruvinel
**Data da solicitacao original:** 01/12/2025
**Data da validacao do escopo:** 24/02/2026
**Workspace de desenvolvimento:** Mitra
**Fonte de dados:** API Movidesk
**Total de telas (BIs) obrigatorias:** 8 telas, sendo o BI #4 subdividido em Alerta e Suporte, e o BI #7 subdividido em 3 sub-visoes
**Total de visoes/graficos:** 16 visoes distribuidas nas 8 telas (conforme planilha DASHS)
**Historico minimo de dados:** 12 meses (carga inicial retroativa)
**Frequencia de atualizacao:** Diaria incremental via API Movidesk

### 1.1 Status Geral de Validacao (conforme DOCX validado 24/02/2026)

| Item | Status | Observacao |
|---|---|---|
| TELA 1 - Chamados Mensais | **DESENVOLVIDO** | Validado |
| TELA 2 - Chamados Detalhes | **DESENVOLVIDO** | Validado |
| TELA 3 - Tempo de Resolucao | **DESENVOLVIDO** | Validado |
| TELA 4 - SLA de Resolucao | **DESENVOLVIDO** | Validado |
| TELA 5 - SLA de Primeira Resposta | **DESENVOLVIDO** | Validado |
| TELA 6 - Pesquisa de Satisfacao | **DESENVOLVIDO** | Validado |
| TELA 7 - Horas de Suporte | **DESENVOLVIDO** | Validado |
| TELA 8 - Horas por Analista | **DESENVOLVIDO** | Validado |
| Obs 1 - Tipo de Demanda | **OK** | Sem "Outros" |
| Obs 2 - Urgencia | **OK** | Sem "Nao classificado" |
| Obs 3 - Categoria | **OK** | Sem "Outros" |
| Obs 4 - Legendas | **OK** | Esquerda, abaixo titulo, so filtrados |
| Obs 5 - Filtro de Meses | **OK** | Global |
| Obs 6 - Exportacao PDF | **OK** | Botao com selecao |
| Obs 7 - Parametrizacao de Cores | **PENDENTE** | Mercia deseja controle por coluna, persistido em banco |

### 1.2 Resumo Quantitativo por Tela (Fonte: `TELAS SECURITY.xlsx` - aba DASHS)

| BI # | Nome Oficial | N. de Visoes | Foco |
|---|---|---|---|
| 1 | Chamados Mensais | 3 | Volume mensal por tipo, urgencia e categoria |
| 2 | Chamados por Cliente x Contrato | 2 | Volume por cliente e tipo de contrato |
| 3 | Tempo de Resolucao dos Chamados | 1 | Tempo medio segmentado por faixas + drill-down |
| 4 | SLA de Resolucao: Alerta | 1 | % tickets no prazo vs fora (todos os tipos) |
| 4 | SLA de Resolucao: Suporte | 1 | % tickets no prazo vs fora (somente Suporte) |
| 5 | SLA de Primeira Resposta | 1 | % primeiro contato em tempo habil |
| 6 | Pesquisa de Satisfacao | 2 | Media mensal + detalhe por cliente |
| 7 | Horas de Suporte Apontadas (sem Projeto) | 3* | Horas por cliente, MSS e projeto |
| 8 | Horas por Analista x Tipo de Demanda | 2 | Horas por tipo + ranking de analistas |

> *BI #7 contem 3 sub-visoes: (7a) Horas por Cliente sem Projeto, (7b) Horas Cliente MSS, (7c) Horas Cliente Projeto.

---

## 2. Identidade Visual Global

### 2.1 Tema e Fundo

| Propriedade | Valor | Observacao |
|---|---|---|
| Tema | **Premium Dark Mode** | Todas as telas sem excecao |
| Cor de fundo global | `#202020` | Cinza escuro profundo, uniforme em todas as telas |
| Cor de fundo dos paineis de grafico | `#2D2D2D` a `#333333` | Leve elevacao visual em relacao ao fundo |
| Bordas dos paineis | Ausentes ou `1px solid #444` | Separacao sutil entre secoes |

> **Ref. Visual:** Todas as imagens de telas (`pdf_img-000.jpg` a `pdf_img-015.jpg`) confirmam o fundo escuro uniforme `#202020`.

### 2.2 Logotipo e Branding

| Elemento | Descricao | Imagem de Referencia |
|---|---|---|
| Logo principal | Icone circular laranja/dourado com detalhe prateado + texto "security4it" em cinza com "4" em laranja | `images/pdf_img-020.jpg`, `images/pdf_img-021.jpg` |
| Posicao do logo | **Canto superior direito** de cada tela, alinhado horizontalmente com os filtros | Visivel em `images/pdf_img-000.jpg`, `images/pdf_img-001.jpg`, `images/pdf_img-004.jpg`, `images/pdf_img-009.jpg`, `images/pdf_img-013.jpg` |
| Banner institucional | "Proteger suas informacoes e nosso negocio." sobre fundo azul escuro com hexagonos | `images/pdf_img-021.jpg` |

### 2.3 Tipografia

| Elemento | Estilo | Cor | Tamanho Relativo |
|---|---|---|---|
| Titulo da tela (ex: "CHAMADOS MENSAIS") | **Bold, MAIUSCULAS** | Branco `#FFFFFF` | Grande (~18-20px) |
| Subtitulo "Apresentacao Mensal" | Regular | Cinza claro `#AAAAAA` | Pequeno (~10-12px), acima do titulo |
| Titulo de grafico (ex: "CHAMADOS ABERTOS POR TIPO DE DEMANDA") | **Bold, MAIUSCULAS** | Branco `#FFFFFF` | Medio (~14px) |
| Labels de legenda | Regular | Branco `#FFFFFF` | Pequeno (~11px) |
| Valores sobre barras (data labels) | **Bold** | Branco `#FFFFFF` | Medio (~12px) |
| Labels de eixo (meses, nomes) | Regular | Cinza claro `#CCCCCC` | Pequeno (~11px) |
| Percentuais dentro de barras (SLA) | **Bold** | Branco `#FFFFFF` | Grande (~16px), centralizado na barra |

### 2.4 Paleta de Cores dos Graficos

A paleta padrao identificada nas imagens de referencia e:

| Funcao | Cor | Hex Aproximado | Uso |
|---|---|---|---|
| Cor primaria 1 | Azul royal | `#3498DB` | Barras principais, "No prazo", nota 9, mes primario |
| Cor primaria 2 | Laranja | `#E67E22` | Segundo mes, contraponto visual |
| Cor primaria 3 | Verde | `#27AE60` | Terceiro mes, nota 10, satisfacao |
| Cor primaria 4 | Amarelo/Dourado | `#F1C40F` | Urgencia media, rotina |
| Destaque critico | Vermelho | `#E74C3C` | "Fora do prazo", urgencia critica, **OBRIGATORIO para itens fora do prazo** |
| Cor MSS / 3o mes | Rosa/Magenta | `#E91E90` | Mes de julho em telas de Horas de Suporte (3 meses) |
| Cor secundaria | Roxo | `#8E44AD` | Tipo "Rotina" na Tela 8 |
| Cor neutra | Cinza | `#7F8C8D` | "(Em branco)", dados sem classificacao |

> **REGRA CRITICA:** Chamados criticos ou fora do prazo **DEVEM SEMPRE** ser destacados em **VERMELHO** (`#E74C3C`). Esta regra e inegociavel e se aplica a todas as telas.

### 2.5 Parametrizacao de Cores `STATUS: PENDENTE`

> **DOCX Validado (Observacao Geral #7 - marcada como "pendente"):**
> *"Implementar funcionalidade que permita ao cliente escolher as cores do dashboard. A parametrizacao deve respeitar a consistencia visual entre telas."*
> *"Obs.: criar um recurso para parametrizar tela a tela como definir as cores de cada uma das colunas."*
> *"A Mercia quer ter a possibilidade de definir a cor de cada uma das colunas e ser persistido no banco de forma a escolher determinada para coluna e persistir."*

**Requisitos detalhados:**

- O sistema deve possuir um recurso de **parametrizacao de cores por coluna** que permita ao usuario definir a cor de **cada coluna individualmente**, **tela a tela**.
- As cores escolhidas devem ter **persistencia em banco de dados**, ou seja, a configuracao e mantida entre sessoes e entre acessos.
- A **consistencia visual entre telas** deve ser respeitada (ex: se "Suporte" e azul em uma tela, deve manter a mesma cor nas demais, a menos que o usuario explicitamente altere).
- A regra do vermelho para itens criticos/fora do prazo e **superior** a qualquer parametrizacao manual.

**Regra obrigatoria (DOCX Validado):** *"Chamados classificados como criticos ou fora do prazo devem ser destacados na cor vermelha."*

---

## 3. Componentes Globais de Interface

### 3.1 Barra de Cabecalho (Header)

Presente em **todas as telas**. Layout horizontal, da esquerda para a direita:

```
[Apresentacao Mensal]  [TITULO DA TELA]  |  Tipo [dropdown]  |  Cliente [dropdown]  |  Data de abertura [date_ini] [date_fim]  |  [Logo Security4iT]
```

> **Ref. Visual:** `images/pdf_img-000.jpg` (Chamados Mensais), `images/pdf_img-001.jpg` (Chamados Detalhes), `images/pdf_img-004.jpg` (Tempo de Resolucao), `images/pdf_img-009.jpg` (Horas de Suporte), `images/pdf_img-013.jpg` (Horas por Analista)

#### 3.1.1 Detalhamento dos Filtros

| Filtro | Tipo de Componente | Valor Padrao | Comportamento |
|---|---|---|---|
| **Tipo** | Dropdown/Select | "Todos" | Filtra por tipo de chamado (Evento, Projeto, Rotina, Suporte) |
| **Cliente** | Dropdown/Select | "Todos" | Filtra por nome do cliente |
| **Data de abertura** | Dois campos de data (intervalo) | Dinamico (ultimo trimestre) | Campo "De" e campo "Ate" com icone de calendario |

**REGRA GLOBAL DOS FILTROS:**
- O filtro de **Meses/Periodo** tem comportamento **GLOBAL**: a selecao em uma tela **REFLETE em todo o dashboard**.
- Ao alterar o periodo em qualquer tela, **todas as demais telas** devem atualizar seus dados automaticamente.
- Os filtros Tipo e Cliente tambem devem ser globais (comportamento consistente observado nas imagens).

#### 3.1.2 Variacao de Filtros por Tela

| Tela | Label do filtro de data | Exemplo observado |
|---|---|---|
| Chamados Mensais | "Data de abertura" | 01/08/2025 - 23/10/2025 |
| Chamados Detalhes | "Data de abertura" | 01/08/2025 - 23/10/2025 |
| Tempo de Resolucao | (sem label explicito) | 01/06/2025 - 23/10/2025 |
| Horas de Suporte | "Data de lancamento" | 01/08/2025 - 30/09/2025 |
| Horas por Analista | "Data de lancamento" | 01/07/2025 - 30/09/2025 |

> **Nota:** Algumas telas usam "Data de abertura" e outras "Data de lancamento" conforme a natureza do dado (abertura de ticket vs. lancamento de horas).

### 3.2 Legendas

- **Posicao:** Obrigatoriamente no **lado esquerdo**, abaixo do titulo do grafico.
- **Formato:** Circulos ou quadrados coloridos pequenos seguidos do texto da serie.
- **Regra:** Devem exibir **apenas os itens presentes nos dados filtrados**. Se um filtro exclui determinado tipo, a legenda nao deve mostra-lo.
- **Cor do texto:** Branco `#FFFFFF` sobre o fundo escuro.

> **Ref. Visual:** Todas as telas confirmam legendas a esquerda. Exemplos claros em `images/pdf_img-000.jpg` (legendas com circulos coloridos para Evento, Projeto, Rotina, Suporte).

### 3.3 Botoes de Acao nos Graficos

Observados no canto superior direito de alguns graficos, uma barra de icones com funcionalidades:

```
[ Home ] [ Pagina ] [ Pagina ] [ Pagina ] [ Lupa ] [ Editar ] [ Expandir ] [ Menu ]
```

| Icone | Funcao | Onde aparece |
|---|---|---|
| Setas de paginacao | Navegar entre paginas de dados quando ha muitos registros | `images/pdf_img-004.jpg`, `images/pdf_img-005.jpg` |
| Lupa (zoom) | Ampliar grafico | `images/image1.png`, `images/image4.png` |
| Icone de edicao | Editar/configurar o grafico | `images/image1.png` |
| Icone de expandir | Abrir grafico em tela cheia | `images/image1.png` |
| Tres pontos (menu) | Menu de opcoes adicionais | `images/image1.png`, `images/image3.png` |

### 3.4 Exportacao PDF `STATUS: OK`

> **DOCX Validado (Observacao Geral #6):**
> *"Deve ser disponibilizado botao de 'Exportar PDF'. O usuario devera poder selecionar e parametrizar quais graficos deseja exportar. A exportacao nao deve ocorrer de forma automatica para todos os graficos; apenas os selecionados devem compor o arquivo final."*
> *"Obs.: A opcao de salvar PDF devera questionar qual grafico sera exportado (uma alternativa e criar um botao para cada grafico)."*

- **Botao dedicado:** "Exportar PDF" presente na interface.
- **Comportamento:** O usuario deve poder **selecionar e parametrizar quais graficos deseja exportar** antes de gerar o PDF.
- A exportacao **NAO** deve ser automatica para todos os graficos - apenas os selecionados.
- **Alternativa sugerida (DOCX):** Criar um botao de exportacao **para cada grafico** individualmente.

### 3.5 Drill-down / Tabela Detalhada

Varios graficos exigem a capacidade de **abrir uma tabela detalhada** ao clicar em uma barra ou segmento. Este comportamento e descrito tela a tela nas secoes abaixo.

> **Ref. Visual:** `images/image7.png` mostra um exemplo claro de drill-down na tela de Tempo de Resolucao, onde ao clicar abre-se um painel com tabela "CHAMADOS DE CLIENTES ACIMA DE 30 DIAS". `images/image9.png` mostra o detalhe dessa tabela.

---

## 4. TELA 1 -- Chamados Mensais `STATUS: DESENVOLVIDO`

> **Imagens de Referencia:**
> - `images/pdf_img-000.jpg` - Visao completa da tela (fonte: PDF)
> - `images/image14.png` - Visao completa da tela (fonte: DOCX, identica)

### 4.1 Objetivo

> **Fonte Planilha:** BI #1, 3 visoes.
> **DOCX Validado:** *"A tela devera apresentar o volume de chamados por periodo, contemplando tres graficos distintos."*

Apresentar o **volume total de chamados por periodo**, segmentado por tipo de demanda, nivel de urgencia e categoria. Fornece a visao macro de entrada de tickets.

### 4.1.1 Regras de Negocio Especificas (Fonte: Planilha DASHS, coluna E)

- **Rotina NAO tem SLA** - Chamados do tipo "Rotina" nao possuem acordo de nivel de servico e portanto nao entram nos calculos de SLA das Telas 4 e 5.
- **Categoria define a area que atendera** - A categoria do chamado determina para qual area/equipe o ticket sera direcionado.
- **Suporte afeta diretamente o cliente** - Chamados do tipo "Suporte" tem impacto direto no cliente e por isso sao priorizados nos calculos de SLA.

### 4.2 Layout da Tela

```
+-----------------------------------------------------------------------------------+
| Apresentacao Mensal                                                               |
| CHAMADOS MENSAIS    [Tipo: Todos v] [Cliente: Todos v] [01/08/2025 - 23/10/2025] |
+------------------------------------------+----------------------------------------+
| CHAMADOS ABERTOS POR TIPO DE DEMANDA    | CHAMADOS ABERTOS POR URGENCIA          |
| [Legenda a esquerda]                     | [Legenda a esquerda]                   |
|                                          |                                        |
| [Grafico de barras agrupadas por mes]    | [Grafico de barras agrupadas por mes]  |
|                                          |                                        |
+------------------------------------------+----------------------------------------+
| CHAMADOS ABERTOS POR CATEGORIA                                                   |
| [Legenda a esquerda]                                                              |
|                                                                                   |
| [Grafico de barras agrupadas por mes]                                             |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

- **Disposicao:** 2 graficos na linha superior (lado a lado, ~50%/50%) e 1 grafico na linha inferior (largura total).
- **Fundo:** `#202020` com paineis de grafico em `#2D2D2D`.

### 4.3 Grafico 1: Chamados Abertos por Tipo de Demanda

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais agrupadas (clustered bar chart) |
| **Eixo X** | Meses (ex: agosto, setembro 2025, outubro) |
| **Eixo Y** | Quantidade de chamados (numerico) |
| **Agrupamento** | Por tipo de demanda |
| **Data labels** | Sim, valor numerico no topo de cada barra, branco, bold |
| **Posicao na tela** | Metade esquerda superior |

**Series e Cores (conforme legenda visivel na imagem):**

| Serie | Cor | Hex Aproximado | Icone na Legenda |
|---|---|---|---|
| Evento | Azul | `#3498DB` | Circulo azul |
| Projeto | Laranja | `#E67E22` | Circulo laranja |
| Rotina | Amarelo/Dourado | `#F1C40F` | Circulo amarelo |
| Suporte | Verde | `#27AE60` | Circulo verde |

**Dados de exemplo extraidos da imagem `pdf_img-000.jpg`:**

| Mes | Evento | Projeto | Rotina | Suporte |
|---|---|---|---|---|
| Agosto | 243 | 142 | 211 | 1 |
| Setembro 2025 | 255 | 157 | 211 | 1 |
| Outubro | 186 | 117 | 174 | - |

> **REGRA:** Nao deve existir a categoria/tipo **"Outros"** ou **"Nao classificado"**. Apenas os 4 tipos listados sao validos.

### 4.4 Grafico 2: Chamados Abertos por Urgencia

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais agrupadas (clustered bar chart) |
| **Eixo X** | Meses |
| **Eixo Y** | Quantidade de chamados |
| **Agrupamento** | Por nivel de urgencia |
| **Data labels** | Sim, valor numerico no topo de cada barra |
| **Posicao na tela** | Metade direita superior |

**Series e Cores (conforme legenda visivel):**

| Serie | Cor | Hex Aproximado | Observacao |
|---|---|---|---|
| (Em branco) | Cinza | `#7F8C8D` | Chamados sem urgencia classificada |
| Alta | Laranja | `#E67E22` | |
| Baixa | Verde | `#27AE60` | |
| Critica | Vermelho | `#E74C3C` | **DESTAQUE OBRIGATORIO** |
| Media | Amarelo | `#F1C40F` | |

**Dados de exemplo extraidos da imagem:**

| Mes | (Em branco) | Alta | Baixa | Critica | Media |
|---|---|---|---|---|---|
| Agosto | 287 | 160 | 147 | ~1 | ~2 |
| Setembro | 291 | 164 | 162 | 1 | ~2 |
| Outubro | 203 | 111 | 161 | ~2 | ~1 |

> **Nota visual:** Na imagem de referencia, a barra "(Em branco)" aparece como a maior em cada mes, indicando grande volume de chamados sem classificacao de urgencia. A barra "Critica" (vermelha) e muito pequena mas **deve** ser visivel com destaque.

### 4.5 Grafico 3: Chamados Abertos por Categoria

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais agrupadas (clustered bar chart) |
| **Eixo X** | Meses |
| **Eixo Y** | Quantidade de chamados |
| **Agrupamento** | Por categoria de chamado |
| **Data labels** | Sim, valor numerico no topo de cada barra |
| **Posicao na tela** | Largura total, abaixo dos 2 graficos superiores |

**Series e Cores (conforme legenda visivel):**

| Serie | Cor | Hex Aproximado |
|---|---|---|
| Evento | Azul claro | `#3498DB` |
| Incidente | Laranja | `#E67E22` |
| Mudanca | Vermelho | `#E74C3C` |
| Projeto | Verde | `#27AE60` |
| Requisicao | Azul escuro | `#2980B9` |
| Rotina | Amarelo | `#F1C40F` |

**Dados de exemplo:**

| Mes | Evento | Incidente | Mudanca | Projeto | Requisicao | Rotina |
|---|---|---|---|---|---|---|
| Agosto | 243 | 47 | 2 | 1 | ~162 | 142 |
| Setembro | 255 | 28 | 1 | 1 | 182 | 157 |
| Outubro | 186 | ~39 | - | - | 135 | 117 |

> **REGRA:** Nao deve existir a categoria **"Outros"** ou **"Nao classificado"**. Apenas as 6 categorias acima sao validas.

---

## 5. TELA 2 -- Chamados Detalhes `STATUS: DESENVOLVIDO`

> **Imagens de Referencia:**
> - `images/pdf_img-001.jpg` - Grafico superior "Chamados Abertos por Cliente" (fonte: PDF)
> - `images/image11.png` - Grafico superior "Chamados Abertos por Cliente" (fonte: DOCX, identica)
> - `images/pdf_img-002.jpg` - Grafico inferior "Chamados Abertos por Tipo de Contrato" (fonte: PDF)
> - `images/image6.png` - Grafico inferior "Chamados Abertos por Tipo de Contrato" (fonte: DOCX, identica)

### 5.1 Objetivo

> **Fonte Planilha:** BI #2, 2 visoes.
> **DOCX Validado:** *"A tela devera apresentar a quantidade de chamados por periodo, contendo dois graficos. As barras dos graficos representarao os meses."*

Detalhar a **quantidade de chamados por periodo** com foco em **clientes** e **tipos de contrato**. Permite identificar quais clientes geram mais demanda e sob quais modelos contratuais.

### 5.2 Layout da Tela

```
+-----------------------------------------------------------------------------------+
| Apresentacao Mensal                                                               |
| CHAMADOS DETALHES   [Tipo: Todos v] [Cliente: Todos v] [01/08/2025 - 23/10/2025] |
+-----------------------------------------------------------------------------------+
| CHAMADOS ABERTOS POR CLIENTE                                                     |
| [Legenda: agosto / setembro / outubro]                                            |
|                                                                                   |
| [Grafico de barras verticais agrupadas - eixo X = nomes de clientes]             |
|                                                                                   |
+-----------------------------------------------------------------------------------+
| CHAMADOS ABERTOS POR TIPO DE CONTRATO                                            |
| [Legenda: agosto / setembro / outubro]                                            |
|                                                                                   |
| [Grafico de barras verticais agrupadas - eixo X = tipos de contrato]             |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

- **Disposicao:** 2 graficos empilhados verticalmente, cada um ocupando largura total.

### 5.3 Grafico 1: Chamados Abertos por Cliente

> **DOCX Validado:** *"Eixo X: Nome do cliente. Metrica: Quantidade de chamados por mes."*
> **Imagem de referencia no DOCX:** `images/image11.png` (posicionada logo apos a descricao do Grafico 1)

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais agrupadas (clustered bar chart) |
| **Eixo X** | Nome do cliente (texto) |
| **Eixo Y** | Quantidade de chamados por mes |
| **Agrupamento** | Por mes (cada mes e uma barra de cor diferente) |
| **Data labels** | Sim, valor numerico no topo de cada barra |
| **Posicao** | Secao superior da tela |

**Cores das series (por mes):**

| Serie | Cor | Hex Aproximado |
|---|---|---|
| Agosto | Azul | `#3498DB` |
| Setembro | Verde | `#27AE60` |
| Outubro | Laranja | `#E67E22` |

**Dados de exemplo (extraidos de `pdf_img-001.jpg`):**

Multiplos clientes no eixo X com barras agrupadas por mes. Destaques visiveis:
- Um cliente com pico de **180** chamados em um mes (setembro, barra verde)
- Outro cliente com **142** (agosto) e **133/129** (setembro/outubro)
- A maioria dos clientes com volumes entre 1-10 chamados
- Clientes menores exibem valores como: 2, 3, 6, 4, 1, 1, 3, etc.
- Alguns clientes aparecem com valores: 33, 28, 40, 33, 53

> **Aspecto visual:** O grafico e bastante largo para acomodar todos os clientes. As barras sao relativamente finas para caberem lado a lado. Os nomes dos clientes aparecem no eixo X com rotacao ou na horizontal, dependendo do espaco.

### 5.4 Grafico 2: Chamados Abertos por Tipo de Contrato

> **DOCX Validado:** *"Eixo X: Tipo de contrato. SLA 24x7 / SLA 8x5 / Sem SLA de resolucao. Quando nao houver contrato especifico, devera ser exibido o nome do cliente (maioria dos casos)."*
> **Imagem de referencia no DOCX:** `images/image6.png` (posicionada logo apos a descricao do Grafico 2)

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais agrupadas (clustered bar chart) |
| **Eixo X** | Tipo de contrato |
| **Eixo Y** | Quantidade de chamados por mes |
| **Agrupamento** | Por mes |
| **Data labels** | Sim, valor numerico no topo de cada barra |
| **Posicao** | Secao inferior da tela |

**Cores:** Mesmas do Grafico 1 (Agosto=Azul, Setembro=Verde, Outubro=Laranja).

**Tipos de contrato esperados no eixo X (nomenclatura validada):**
- SLA 24x7
- SLA 8x5
- Sem SLA de resolucao

**Dados de exemplo (de `pdf_img-002.jpg`):**

| Contrato | Agosto | Setembro | Outubro |
|---|---|---|---|
| (Contrato dominante - provavelmente Sem SLA ou SLA 8x5) | 407 | 400 | 306 |
| Outros contratos | 33, 28, 14 | 2, 5, 4 | 2, 2, 1 | etc. |

> **Aspecto visual:** Uma categoria domina amplamente (barras de ~400), enquanto as demais sao muito pequenas (1-33). O grafico precisa de boa escala para nao "achatar" os valores menores.

> **REGRA:** Se nao houver contrato especifico associado ao chamado, exibir o **nome do cliente** no lugar do tipo de contrato. Conforme a planilha: "os outros sao o nome do cliente (a maioria)" - isto significa que a **maior parte dos clientes NAO possui contrato tipificado** (SLA 24x7 ou 8x5), e portanto o eixo X mostrara predominantemente nomes de clientes em vez de tipos de contrato.

> **REGRA VISUAL (Planilha):** "As barras serao os meses" - cada barra individual representa um mes, agrupadas por cliente/contrato. Confirmado pelas legendas visiveis nas imagens (agosto=azul, setembro=verde, outubro=laranja).

---

## 6. TELA 3 -- Tempo de Resolucao `STATUS: DESENVOLVIDO`

> **Imagens de Referencia:**
> - `images/pdf_img-004.jpg` - Visao principal com grafico de faixas de tempo (fonte: PDF)
> - `images/image10.png` - Visao principal (fonte: DOCX, identica)
> - `images/image7.png` - Visao com drill-down aberto mostrando tabela de chamados acima de 30 dias
> - `images/image9.png` - Detalhe da tabela de drill-down (colunas Protocolo, Cliente, Dias, Assunto)

### 6.1 Objetivo

> **Fonte Planilha:** BI #3, 1 visao.
> **DOCX Validado:** *"A tela devera conter dois graficos."*

Analisar a **media de tempo ate a resolucao** dos chamados, segmentada por faixas de dias e por cliente. Permite identificar gargalos e chamados cronicamente atrasados.

### 6.2 Layout da Tela

```
+-----------------------------------------------------------------------------------+
| Apresentacao Mensal                                                               |
| TEMPO DE RESOLUCAO  [Todos v] [Todos v] [01/06/2025 - 23/10/2025]               |
+-----------------------------------------------------------------------------------+
| MEDIA DE TEMPO ATE RESOLUCAO POR CLIENTE          [1] [2] [3] [4] [5] [6] [7]   |
|                                                                                   |
| [Grafico de barras verticais - faixas de tempo no eixo X]                        |
|                                                                                   |
+-----------------------------------------------------------------------------------+
| [Ao clicar: Tabela detalhada "CHAMADOS DE CLIENTES ACIMA DE 30 DIAS"]           |
+-----------------------------------------------------------------------------------+
```

### 6.3 Grafico 1: Media de Tempo ate Resolucao por Cliente

> **DOCX Validado:** *"Tempo medio para resolucao de tickets, segmentado por cliente, com as seguintes faixas: 0 a 7 dias, 8 a 15 dias, 15 a 21 dias, 21 a 28 dias, Acima de 28 dias."*
> **Imagem de referencia no DOCX:** `images/image10.png` (posicionada logo apos as faixas)

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais simples |
| **Eixo X** | Faixas de tempo (categorias) |
| **Eixo Y** | Quantidade de chamados |
| **Data labels** | Sim, valor numerico no topo de cada barra |
| **Cor das barras** | Azul royal `#3498DB` |
| **Paginacao** | Botoes numericos no canto superior direito para navegar entre clientes |

**Faixas de tempo obrigatorias no eixo X:**

| Faixa | Valor Exemplo (de `pdf_img-004.jpg`) |
|---|---|
| **0-7 dias** | 1562 |
| **8-15 dias** | 52 |
| **15-21 dias** | 15 |
| **21-28 dias** | 6 |
| **Mais de 28 dias** | 8 |

> **Aspecto visual critico:** A faixa "0-7 dias" domina amplamente (1562 vs. 52 na segunda faixa). A barra azul e muito alta e as demais sao quase invisveis proporcionalmente. Os labels de faixa aparecem em texto branco abaixo do eixo X com sublinhado/barra branca fina.

**Detalhes visuais das faixas:**
- Cada faixa tem seu label centralizado abaixo da barra
- Uma **barra horizontal fina branca** aparece abaixo de cada label de faixa, funcionando como separador
- Os valores (1562, 52, 15, 6, 8) aparecem **acima** de cada barra

### 6.4 Grafico 2 / Interacao: Chamados Acima de 30 Dias (Drill-down)

> **DOCX Validado:** *"Chamados de clientes com tempo superior a 30 dias. Este grafico devera permitir abertura de tabela detalhada contendo os chamados correspondentes."*
> **Imagem de referencia no DOCX:** `images/image7.png` (visao com drill-down aberto, posicionada logo apos a descricao)

| Propriedade | Valor |
|---|---|
| **Tipo** | Tabela detalhada (abre ao clicar) |
| **Titulo** | "CHAMADOS DE CLIENTES ACIMA DE 30 DIAS" |
| **Gatilho** | Clique na barra "Mais de 28 dias" ou botao dedicado |

> **Ref. Visual:** `images/image7.png` mostra a tela com o painel de drill-down aberto. Um overlay escurecido aparece no fundo e a tabela se exibe como um painel lateral ou popup.

**Colunas da tabela de drill-down (conforme `images/image9.png`):**

| Coluna | Descricao | Exemplo |
|---|---|---|
| **Protocolo** | Numero unico do ticket | SEC4IT202507010000033 |
| **Cliente** | Nome do cliente | ANB |
| **Dias** | Quantidade de dias desde abertura | 0, 1, etc. |
| **Assunto** | Descricao do chamado | [ANB] Assinaturas de IPS com eventos |

> **Formato do protocolo:** Segue o padrao `SEC4IT` + `AAAAMMDDHHMM` + sequencial (ex: SEC4IT202507080000417).

> **ACAO OBRIGATORIA:** Esta tela **deve** permitir abertura de tabela detalhada. A funcionalidade de drill-down e mandatoria.

---

## 7. TELA 4 -- SLA de Resolucao `STATUS: DESENVOLVIDO`

> **Imagens de Referencia:**
> - `images/pdf_img-005.jpg` - Grafico "SLA DE RESOLUCAO: SUPORTE" (fonte: PDF)
> - `images/image13.png` - Grafico "SLA DE RESOLUCAO: SUPORTE" (fonte: DOCX - posicionada apos descricao de ambas visoes)
> - `images/image9.png` - Formato da tabela detalhada de drill-down (fonte: DOCX - **reutilizada nas Telas 3, 4 e 5**)

### 7.1 Objetivo

> **Fonte Planilha:** BI #4, subdividido em duas sub-visoes.
> **DOCX Validado:** *"A tela devera apresentar dois graficos:"*
> - *"SLA de Resolucao: Alerta - Percentual de todos tickets resolvidos dentro do prazo combinado versus fora do prazo, por periodo."*
> - *"SLA de Resolucao: Suporte - Percentual de tickets de suporte resolvidos fora do prazo. Considerar apenas chamados classificados como Suporte."*
> - *"Ambas visualizacoes devem permitir abertura de tabela detalhada dos chamados."*
> **Imagens de referencia no DOCX:** `images/image13.png` (grafico SLA), `images/image9.png` (formato da tabela detalhada, posicionada logo apos a descricao de drill-down)

Medir a **conformidade com prazos combinados** de resolucao. Mostra o percentual de tickets resolvidos dentro e fora do prazo acordado. **O DOCX validado confirma duas visualizacoes distintas: Alerta (todos os tipos) e Suporte (apenas categoria Suporte).**

### 7.2 Layout da Tela

```
+-----------------------------------------------------------------------------------+
| SLA DE RESOLUCAO: SUPORTE                          [1] [2] [3] [lupa] [edit] [+] |
+-----------------------------------------------------------------------------------+
| [Legenda: Fora do prazo (vermelho) / No prazo (azul)]                            |
|                                                                                   |
| [Barras empilhadas verticais - uma por mes]                                      |
| [Cada barra mostra % No prazo (azul) + % Fora do prazo (vermelho)]              |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 7.3 Grafico: SLA de Resolucao - Suporte

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais empilhadas (100% stacked) |
| **Eixo X** | Meses (janeiro a outubro 2025) |
| **Eixo Y** | Percentual (0% a 100%) |
| **Data labels** | Sim, percentual centralizado dentro da porcao azul (ex: "100,00%", "99,51%") |
| **Formato dos labels** | Numero com 2 casas decimais + "%" (ex: 99,30%) |

**Cores obrigatorias:**

| Serie | Cor | Hex | Posicao na Barra |
|---|---|---|---|
| **No prazo** | Azul royal | `#3498DB` | Porcao inferior (dominante) |
| **Fora do prazo** | Vermelho | `#E74C3C` | Porcao superior (topo da barra) |

**Dados de exemplo (extraidos de `pdf_img-005.jpg`):**

| Mes | % No Prazo | % Fora do Prazo |
|---|---|---|
| Janeiro | 100,00% | 0,00% |
| Fevereiro | 100,00% | 0,00% |
| Marco | 100,00% | 0,00% |
| Abril | 99,51% | 0,49% |
| Maio | 100,00% | 0,00% |
| Junho | 99,39% | 0,61% |
| Julho | 100,00% | 0,00% |
| Agosto | 100,00% | 0,00% |
| Setembro | 100,00% | 0,00% |
| Outubro | 99,30% | 0,70% |

> **Aspecto visual:** As barras sao quase inteiramente azuis (>99%), com uma fatia vermelha **muito fina** no topo nos meses que nao atingiram 100%. Mesmo sendo pequena, a faixa vermelha **deve ser visivel** para destacar o desvio.

> **REGRA:** Considerar **apenas a categoria "Suporte"** para este calculo. Abertura de **tabela detalhada obrigatoria** ao clicar na barra.

### 7.4 Desdobramento Obrigatorio: Alerta vs Suporte (Fonte: Planilha DASHS)

A planilha DASHS (linhas 5 e 6) define explicitamente **duas sub-telas separadas** para o BI #4:

| Sub-tela | Titulo | Escopo de Dados | Drill-down |
|---|---|---|---|
| **4a - SLA de Resolucao: Alerta** | "SLA DE RESOLUCAO: ALERTA" | **Todos os tipos de chamado** (Evento, Projeto, Rotina, Suporte) | Sim - abre tabela detalhando os chamados fora do prazo |
| **4b - SLA de Resolucao: Suporte** | "SLA DE RESOLUCAO: SUPORTE" | **Apenas categoria Suporte** | Sim - abre tabela detalhando os chamados fora do prazo |

A imagem de referencia (`pdf_img-005.jpg` / `image13.png`) mostra apenas a sub-tela 4b (Suporte). A sub-tela 4a (Alerta) **deve ser construida com o mesmo padrao visual** (barras empilhadas azul/vermelho, percentuais mensais) mas considerando **todas as categorias**.

> **IMPORTANTE:** Ambas as sub-telas devem ter drill-down obrigatorio. Ao clicar em qualquer barra mensal, deve abrir uma tabela detalhada listando os chamados fora do prazo daquele periodo.

> **Lembrete de regra de negocio (TELA 1):** Chamados do tipo "Rotina" **NAO tem SLA**. Na sub-tela 4a (Alerta), que inclui todos os tipos, e necessario definir como tratar chamados sem SLA: excluir do calculo ou considerar como "no prazo" por ausencia de meta.

---

## 8. TELA 5 -- SLA de Primeira Resposta `STATUS: DESENVOLVIDO`

> **Imagens de Referencia:**
> - `images/pdf_img-006.jpg` - Grafico "SLA DE PRIMEIRA RESPOSTA: SUPORTE" (fonte: PDF)
> - `images/image12.png` - Grafico "SLA DE PRIMEIRA RESPOSTA: SUPORTE" (fonte: DOCX - posicionada apos descricao dos parametros de SLA)
> - `images/image9.png` - Formato da tabela detalhada de drill-down (fonte: DOCX - **reutilizada nas Telas 3, 4 e 5**)

### 8.1 Objetivo

> **Fonte Planilha:** BI #5, 1 visao.
> **DOCX Validado:** *"A tela devera apresentar um grafico: Percentual de tickets com primeiro contato realizado dentro do tempo acordado. O grafico devera permitir abertura de tabela detalhada com os chamados correspondentes."*

Medir a **agilidade no primeiro contato** com o cliente apos a abertura do chamado. Avalia se o primeiro retorno ocorre dentro do tempo acordado por nivel de urgencia.

### 8.2 Layout da Tela

```
+-----------------------------------------------------------------------------------+
| SLA DE PRIMEIRA RESPOSTA: SUPORTE                                                |
+-----------------------------------------------------------------------------------+
| [Legenda: Fora do prazo (vermelho) / No prazo (azul)]                            |
|                                                                                   |
| +----------+    +----------+    +----------+                                      |
| |          |    |          |    |          |                                      |
| |  97,08%  |    |  95,18%  |    |  98,77%  |    <-- Blocos grandes por mes       |
| |          |    |          |    |          |                                      |
| |  (azul)  |    |  (azul)  |    |  (azul)  |                                      |
| |__________|    |__________|    |__________|                                      |
| | vermelho |    | vermelho |    | vermelho |                                      |
|   julho          agosto          setembro                                         |
+-----------------------------------------------------------------------------------+
```

### 8.3 Grafico: SLA de Primeira Resposta - Suporte

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais empilhadas (100% stacked) - formato de **blocos grandes** |
| **Eixo X** | Meses |
| **Eixo Y** | Percentual (0% a 100%) |
| **Data labels** | Sim, percentual centralizado dentro do bloco azul, fonte grande e bold |
| **Formato** | Numero com 2 casas decimais + "%" |

**DIFERENCIAL VISUAL em relacao a Tela 4:**
- As barras sao **significativamente mais largas e altas** que na Tela 4, ocupando quase como "cards" retangulares por mes.
- Cada mes e um **bloco retangular grande**, nao uma barra fina.
- A proporcao vermelha (fora do prazo) aparece como uma **faixa na base** do bloco.

**Cores:**

| Serie | Cor | Hex | Posicao |
|---|---|---|---|
| **No prazo** | Azul royal | `#3498DB` | Area principal do bloco (grande) |
| **Fora do prazo** | Vermelho | `#E74C3C` | Faixa fina na **base** do bloco |

**Dados de exemplo:**

| Mes | % No Prazo | % Fora do Prazo |
|---|---|---|
| Julho | 97,08% | 2,92% |
| Agosto | 95,18% | 4,82% |
| Setembro | 98,77% | 1,23% |

### 8.4 Parametros de Referencia para SLA de Primeira Resposta

> **DOCX Validado:** *"Exemplos de parametros:"*

| Nivel de Urgencia | Tempo Maximo para Primeira Resposta | Fonte |
|---|---|---|
| **Chamados criticos** | Ate **1 hora** | DOCX validado |
| **Chamados de alta urgencia** | Ate **4 horas** | DOCX validado |

> **ACAO OBRIGATORIA (DOCX Validado):** *"O grafico devera permitir abertura de tabela detalhada com os chamados correspondentes."* A tabela segue o mesmo formato de `images/image9.png` (colunas: Protocolo, Cliente, Dias, Assunto).

---

## 9. TELA 6 -- Pesquisa de Satisfacao `STATUS: DESENVOLVIDO`

> **Imagens de Referencia:**
> - `images/pdf_img-007.jpg` - Grafico "RESULTADOS POR MES" isolado (fonte: PDF)
> - `images/pdf_img-008.jpg` - Grafico "RESPOSTAS POR CLIENTE" isolado (fonte: PDF)
> - `images/image4.png` - Visao completa com ambos os graficos e nomes de clientes visiveis (fonte: DOCX)

### 9.1 Objetivo

> **Fonte Planilha:** BI #6, 2 visoes.
> **DOCX Validado:** *"A tela devera apresentar dois graficos: Resultado por mes (As barras representarao as notas atribuidas) e Respostas por cliente (Eixo X: Clientes, Barras representando as notas atribuidas)."*
> **Imagem de referencia no DOCX:** `images/image4.png` (visao completa com ambos os graficos)

Monitorar a **qualidade do atendimento** atraves das notas atribuidas pelos clientes na pesquisa de satisfacao, com **evolucao temporal** (mensal) e **detalhe por cliente/resposta**.

### 9.2 Layout da Tela

```
+-----------------------------------------------------------------------------------+
| RESULTADOS POR MES                                 [icones de acao]              |
| [Legenda: 9 (azul) / 10 (verde)]                                                |
|                                                                 9,9              |
| [Barras agrupadas por mes]                          Media do periodo             |
|                                                                                   |
+-----------------------------------------------------------------------------------+
| RESPOSTAS POR CLIENTE                              [icones de acao]              |
| [Legenda: 9 (azul) / 10 (verde)]                                                |
|                                                                                   |
| [Barras agrupadas por cliente]                                                   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 9.3 Grafico 1: Resultados por Mes

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais agrupadas |
| **Eixo X** | Meses (ex: outubro 2025) |
| **Eixo Y** | Quantidade de respostas |
| **Agrupamento** | Por nota (9 e 10) |
| **Data labels** | Sim, valor numerico no topo |
| **Metrica adicional** | "**Media do periodo**" exibida no canto superior direito como um **KPI grande** |

**Cores:**

| Nota | Cor | Hex Aproximado |
|---|---|---|
| **9** | Azul escuro / Indigo | `#2C3E50` ou `#0000CD` |
| **10** | Verde escuro | `#27AE60` ou `#228B22` |

**Dados de exemplo (de `pdf_img-007.jpg` e `image4.png`):**

| Mes | Nota 9 | Nota 10 |
|---|---|---|
| Outubro 2025 | 2 | 13 |

**KPI "Media do periodo":**
- Valor: **9,9**
- Posicao: Canto superior direito do grafico
- Formatacao: Numero grande e bold (`~36px`), branco
- Subtitulo: "Media do periodo" em texto menor, cinza claro

### 9.4 Grafico 2: Respostas por Cliente

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais agrupadas |
| **Eixo X** | Nome do cliente |
| **Eixo Y** | Quantidade de respostas |
| **Agrupamento** | Por nota (9 e 10) |
| **Data labels** | Sim, valor numerico dentro ou acima da barra |

**Cores:** Mesmas do Grafico 1 (9 = Azul escuro, 10 = Verde escuro).

**Dados de exemplo (de `image4.png` - nomes visiveis):**

| Cliente | Nota 9 | Nota 10 |
|---|---|---|
| BYX CAPITAL | 1 (verde) | - |
| Fundacao Butantan | - | 2 (azul) |
| MPSP | - | 2 (verde) |
| Security4IT | - | 10 (verde, barra grande) |

> **Aspecto visual:** No grafico de respostas por cliente, as barras de nota 10 (verde) sao dominantes. O cliente "Security4IT" tem uma barra verde significativamente maior (10 respostas). As barras de nota 9 (azul) sao muito menores. Nas imagens `pdf_img-008.jpg` e `image4.png`, os clientes com nota 10 tem barras verdes altas e as de nota 9 sao retangulares horizontais muito achatadas.

> **Metrica NPS:** A media NPS do periodo deve ficar em **destaque** (grande, no canto superior direito do primeiro grafico).

---

## 10. TELA 7 -- Horas de Suporte `STATUS: DESENVOLVIDO`

> **Imagens de Referencia:**
> - `images/pdf_img-009.jpg` - Cabecalho "HORAS DE SUPORTE" com filtros (fonte: PDF)
> - `images/pdf_img-010.jpg` - Grafico horizontal "Horas Apontadas por Cliente (Sem Projeto)" - barras (fonte: PDF)
> - `images/image2.png` - Visao completa da tela com cabecalho + grafico horizontal completo com todos os clientes (fonte: DOCX)
> - `images/pdf_img-011.jpg` - Grafico "Clientes MSS - Horas Apontadas por Tipo de Demanda (Sem Projeto)" com 2 meses (fonte: PDF)
> - `images/image3.png` - Grafico "Clientes MSS" com 3 meses e nomes de clientes visiveis (fonte: DOCX)
> - `images/pdf_img-012.jpg` - Grafico "Horas Apontadas por Cliente - Projeto" com 2 meses (fonte: PDF)
> - `images/image1.png` - Grafico "Horas Apontadas por Cliente - Projeto" com 3 meses e nomes visiveis (fonte: DOCX)

### 10.1 Objetivo

> **Fonte Planilha:** BI #7, 3 sub-visoes.
> **DOCX Validado:** *"A tela devera conter tres graficos:"*
> - *"Horas apontadas por cliente - Considerar apenas chamados cuja categoria seja Suporte. Excluir projetos."* -> `images/image2.png`
> - *"Horas apontadas do cliente MSS - MSS corresponde a um tipo de contrato especifico."* -> `images/image3.png`
> - *"Horas apontadas do cliente Projeto - Considerar chamados cuja categoria seja Projeto."* -> `images/image1.png`
>
> **Obs Planilha (col. E):** Campo MSS = campo "contrato" no Movidesk (pendente confirmacao exata)

Analisar o **faturamento e esforco acumulado** em horas de suporte, separando horas por cliente (sem projeto), horas de clientes MSS e horas de projeto.

### 10.1.1 Mapeamento de Campos Movidesk para esta Tela

| Sub-visao | Campo Movidesk para Filtro | Valor do Filtro | Status |
|---|---|---|---|
| 7a - Horas Suporte | Campo **categoria** | = "Suporte" | Confirmado |
| 7b - Horas MSS | Campo **contrato** | Contem "MSS" | **PENDENTE DE CONFIRMACAO** - A Security4iT precisa validar a regra exata |
| 7c - Horas Projeto | Campo **categoria** | = "Projeto" | Confirmado |

> **PONTO DE ATENCAO:** O sub-item 7a tem a nota "A Security levantara a regra para definirmos o que sera puxado", indicando que a regra de negocio para filtrar horas de suporte **ainda pode ser refinada** pela Security4iT. Atualmente, a classificacao da categoria sera "Suporte".

> **PONTO DE ATENCAO:** O sub-item 7b depende de confirmacao sobre como o campo "contrato" no Movidesk identifica clientes MSS. E necessario validar: qual o valor exato do campo contrato que define um cliente como MSS? E um texto literal "MSS", um codigo, ou o nome do contrato contem "MSS"?

### 10.2 Layout da Tela

```
+-----------------------------------------------------------------------------------+
| Apresentacao Mensal                                                               |
| HORAS DE SUPORTE    [Tipo: Todos v] [Cliente: Todos v] [01/08/2025 - 30/09/2025] |
+-----------------------------------------------------------------------------------+
| HORAS APONTADAS POR CLIENTE (SEM PROJETO)                                        |
| [Legenda: julho (rosa/magenta) / agosto (azul) / setembro (laranja)]             |
|                                                                                   |
| [Grafico de barras HORIZONTAIS - cliente no eixo Y]                              |
|                                                                                   |
+-----------------------------------------------------------------------------------+
| CLIENTES MSS - HORAS APONTADAS POR TIPO DE DEMANDA (SEM PROJETO)                |
| [Legenda: julho (rosa) / agosto (azul) / setembro (laranja)]                     |
|                                                                                   |
| [Grafico de barras VERTICAIS agrupadas por cliente MSS]                          |
|                                                                                   |
+-----------------------------------------------------------------------------------+
| HORAS APONTADAS POR CLIENTE - PROJETO                                            |
| [Legenda: julho (rosa) / agosto (azul) / setembro (laranja)]                     |
|                                                                                   |
| [Grafico de barras VERTICAIS agrupadas por cliente]                              |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 10.3 Grafico 1: Horas Apontadas por Cliente (Sem Projeto)

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | **Barras HORIZONTAIS** agrupadas |
| **Eixo Y** | Nome do cliente (texto, na esquerda) |
| **Eixo X** | Horas (numerico) |
| **Agrupamento** | Por mes |
| **Data labels** | Sim, valor numerico na extremidade direita de cada barra |
| **Ordenacao** | Decrescente por total de horas (cliente com mais horas no topo) |

> **NOTA:** Este e o **unico grafico com orientacao horizontal** em todo o dashboard. A escolha se justifica pela quantidade de clientes (20+) que nao caberiam confortavelmente no eixo X.

**Cores (por mes) - com 3 meses:**

| Serie | Cor | Hex Aproximado |
|---|---|---|
| Julho | Rosa/Magenta | `#E91E90` |
| Agosto | Azul | `#3498DB` |
| Setembro | Laranja | `#E67E22` |

**Cores (por mes) - com 2 meses (quando periodo selecionado for menor):**

| Serie | Cor | Hex Aproximado |
|---|---|---|
| Agosto | Azul | `#3498DB` |
| Setembro | Laranja | `#E67E22` |

**Dados de exemplo (de `image2.png`, lista completa de clientes visiveis):**

| Cliente | Julho (Rosa) | Agosto (Azul) | Setembro (Laranja) |
|---|---|---|---|
| Fundacao Butantan | ~134 (rosa) | ~131 | ~116 |
| MPSP | ~133 | ~106 | ~109 |
| BOAB | ~109 | ~83 | ~51 |
| Security4IT | ~83 | ~109 | ~79 |
| ANB | ~69 | ~83 | ~79 |
| Safra | ~54 | ~65 | ~79 |
| Prefeitura de Santos | ~35 | ~40 | - |
| Banco ABC | ~24 | ~31 | ~48 |
| Metalfrio | ~5 | ~24 | ~42 |
| Raizen | ~17 | ~26 | ~35 |
| GRU Airport | ~5 | ~22 | - |
| Credibelm | ~13 | - | - |
| Banco Volkswagen | ~12 | ~13 | - |
| TIM Brasil | ~4 | ~11 | - |
| Dock (Conductor) | ~5 | - | - |
| Banco Sofisa | ~7 | - | - |
| 2M Plastic (PAV2) | - | - | - |
| Invepar | - | - | - |
| ELO | - | - | - |
| Centurion | - | - | - |
| PRODESAN | ~1 | - | - |

> **Aspecto visual:** As barras horizontais criam um efeito de "ranking" visual, com os clientes mais demandantes no topo. As 3 cores (rosa, azul, laranja) ficam empilhadas verticalmente para cada cliente, criando um padrao visual ritmado.

> **REGRA:** Considerar **apenas a categoria "Suporte"**, excluindo projetos.

### 10.4 Grafico 2: Clientes MSS - Horas por Tipo de Demanda (Sem Projeto)

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais agrupadas |
| **Eixo X** | Nome do cliente MSS |
| **Eixo Y** | Horas |
| **Agrupamento** | Por mes |
| **Data labels** | Sim, valor no topo |

**Clientes MSS identificados (de `image3.png`):**

| Cliente MSS | Julho (Rosa) | Agosto (Azul) | Setembro (Laranja) |
|---|---|---|---|
| Fundacao Butantan | 204 | 131 | 116 |
| MPSP | 133 | 106 | 91 |
| BOAB | - | 83 | 109 |
| ANB | - | 83 | 69 (azul) / 79 (laranja) |

> **DOCX Validado:** *"MSS corresponde a um tipo de contrato especifico."* Refere-se a clientes com contrato de **Managed Security Services**. Este grafico filtra automaticamente apenas estes clientes.

> **REGRA:** Excluir projetos. Filtrar pelo campo "contrato" do Movidesk para identificar clientes MSS.

### 10.5 Grafico 3: Horas Apontadas por Cliente - Projeto

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais agrupadas |
| **Eixo X** | Nome do cliente |
| **Eixo Y** | Horas |
| **Agrupamento** | Por mes |
| **Data labels** | Sim, valor no topo |

**Dados de exemplo (de `image1.png`):**

| Cliente | Julho (Rosa) | Agosto (Azul) | Setembro (Laranja) |
|---|---|---|---|
| Security4IT | - | 158 | 16 |
| ANB | - | 0 | 33 |
| BYX CAPITAL | - | 0 | 3 / 1 |

> **Aspecto visual:** Security4IT domina com 158 horas em agosto (barra azul muito alta). As demais barras sao significativamente menores.

> **REGRA:** Considerar **apenas a categoria "Projeto"**.

---

## 11. TELA 8 -- Horas por Analista `STATUS: DESENVOLVIDO`

> **Imagens de Referencia:**
> - `images/pdf_img-013.jpg` - Cabecalho + Grafico "Horas Apontadas por Tipo de Demanda" (fonte: PDF)
> - `images/image5.png` - Visao completa com ambos os graficos (fonte: DOCX)
> - `images/pdf_img-014.jpg` - Grafico "Horas por Analista" - barras horizontais (parte superior) (fonte: PDF)
> - `images/pdf_img-015.jpg` - Grafico "Horas por Analista" - barras horizontais (parte inferior/continuacao) (fonte: PDF)

### 11.1 Objetivo

> **Fonte Planilha:** BI #8, 2 visoes.
> **DOCX Validado:** *"A tela devera conter dois graficos: Horas por tipo de demanda; Horas por analista - Considerar apenas agentes de suporte."*
> **Imagem de referencia no DOCX:** `images/image5.png` (visao completa com ambos os graficos)

Medir a **produtividade individual** de cada membro da equipe, segmentando as horas por tipo de demanda e por analista.

### 11.2 Layout da Tela

```
+-----------------------------------------------------------------------------------+
| Apresentacao Mensal                                                               |
| HORAS POR ANALISTA  [Tipo: Todos v] [Cliente: Todos v] [01/07/2025 - 30/09/2025] |
+-----------------------------------------------------------------------------------+
| HORAS APONTADAS POR TIPO DE DEMANDA                                              |
| [Legenda: Evento (azul) / Projeto (laranja) / Rotina (roxo) / Suporte (azul)]   |
|                                                                                   |
| [Grafico de barras VERTICAIS agrupadas por mes]                                  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
| HORAS APONTADAS POR ANALISTA                                                     |
| [Legenda: julho (rosa) / agosto (azul) / setembro (laranja)]                     |
|                                                                                   |
| [Grafico de barras HORIZONTAIS - analista no eixo Y]                             |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 11.3 Grafico 1: Horas Apontadas por Tipo de Demanda

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | Barras verticais agrupadas |
| **Eixo X** | Meses (julho, agosto 2025, setembro) |
| **Eixo Y** | Horas |
| **Agrupamento** | Por tipo de demanda |
| **Data labels** | Sim, valor no topo de cada barra |

**Cores por tipo de demanda (conforme `image5.png`):**

| Tipo | Cor | Hex Aproximado |
|---|---|---|
| Evento | Azul claro | `#3498DB` |
| Projeto | Laranja | `#E67E22` |
| Rotina | Roxo | `#8E44AD` |
| Suporte | Azul escuro / marinho | `#2C3E50` |

**Dados de exemplo (de `pdf_img-013.jpg` / `image5.png`):**

| Mes | Evento | Projeto | Rotina | Suporte |
|---|---|---|---|---|
| Julho | 81 | ~74 | 345 | 708 |
| Agosto 2025 | 74 | 161 | 358 | 474 |
| Setembro | 71 | 50 | 341 | 483 |

> **Aspecto visual:** "Suporte" (azul escuro) domina em todos os meses, seguido por "Rotina" (roxo). "Evento" e "Projeto" sao significativamente menores. As 4 barras ficam lado a lado para cada mes.

### 11.4 Grafico 2: Horas Apontadas por Analista

| Propriedade | Valor |
|---|---|
| **Tipo de grafico** | **Barras HORIZONTAIS** agrupadas |
| **Eixo Y** | Nome do analista (texto, na esquerda) |
| **Eixo X** | Horas (numerico) |
| **Agrupamento** | Por mes |
| **Data labels** | Sim, valor na extremidade direita de cada barra |
| **Ordenacao** | Decrescente por total de horas (analista mais produtivo no topo) |

**Cores (por mes):**

| Serie | Cor | Hex Aproximado |
|---|---|---|
| Julho | Rosa/Magenta | `#E91E90` |
| Agosto | Azul | `#3498DB` |
| Setembro | Laranja | `#E67E22` |

**Dados de exemplo (de `image5.png` e `pdf_img-014.jpg` / `pdf_img-015.jpg`):**

| Analista | Julho (Rosa) | Agosto (Azul) | Setembro (Laranja) |
|---|---|---|---|
| Hugo Lima | ~185 | 160 | 125 |
| Savio Dias | ~130 | 115 | 85 |
| Cristian Santos | ~110 | 68 | 106 |
| Luan Oliveira Santos | ~96 | 101 | ~30 |
| Gabriela Marcelino | ~113 | ~104 | - |
| (Analista 6) | ~76 | ~86 | ~48 |
| (Analista 7) | ~101 | ~102 | - |
| (Analista 8) | ~63 | ~69 | - |
| (Analista 9) | ~76 | - | ~96 |
| (Analista 10) | ~40 | ~48 | - |
| (Analista 11) | ~38 | ~47 | - |
| (Analista 12) | ~33 | ~35 | - |
| (Analista 13) | ~25 | ~22 | - |
| (Analista 14) | ~23 | ~22 | - |
| (Analista 15) | ~10 | ~30 | - |
| (Analista 16) | ~9 | - | - |
| (Analista 17) | ~6 | - | - |

> **Aspecto visual:** O grafico de barras horizontais cria um "ranking" de produtividade. Hugo Lima aparece consistentemente no topo. As barras azuis e laranjas se alternam verticalmente para cada analista, criando ritmo visual. O grafico e extenso verticalmente (15+ analistas) e pode necessitar scroll ou paginacao.

> **REGRA:** Considerar **apenas agentes de suporte** (nao incluir gestores ou outros perfis).

---

## 12. Taxonomia de Dados e Classificacoes Validas

> **DOCX Validado:** *"Os chamados possuem tres classificacoes principais"* (Tipo, Urgencia, Categoria), todas marcadas como *"(aplicado)"*, mais a classificacao por contrato. Confirma tambem 3 observacoes gerais validadas como "ok": (1) Tipo sem "Outros", (2) Urgencia sem "Nao classificado", (3) Categoria sem "Outros".

### 12.1 Tipos de Chamado (4 valores unicos) `APLICADO`

| Valor | Uso | Tem SLA? | Afeta Cliente? |
|---|---|---|---|
| **Evento** | Chamados relativos a eventos de seguranca | Sim | Indireto |
| **Projeto** | Demandas de projeto | Sim | Indireto |
| **Rotina** | Atividades recorrentes e operacionais | **NAO** | Nao |
| **Suporte** | Atendimento reativo a incidentes e requisicoes | Sim | **SIM - Direto** |

> **PROIBIDO:** Nao deve existir "Outros", "Nao classificado", "(Em branco)" como tipo valido.
> **Fonte Planilha (col. E):** "Rotina nao tem SLA; Categoria e pra que area ira atender; Suporte afetam diretamente o cliente"

### 12.2 Niveis de Urgencia (4 valores unicos) `APLICADO`

| Valor | SLA Primeira Resposta | Cor Obrigatoria |
|---|---|---|
| **Baixa** | - | Verde `#27AE60` |
| **Media** | - | Amarelo `#F1C40F` |
| **Alta** | Ate 4 horas | Laranja `#E67E22` |
| **Critica** | Ate 1 hora | **Vermelho `#E74C3C`** |

> **Nota:** Nas imagens de referencia, aparece a classificacao "(Em branco)" como a mais volumosa. Isso indica chamados sem urgencia definida no Movidesk. O sistema deve tratar/exibir esses casos, mas nao deve incentiva-los.

### 12.3 Categorias de Chamado (6 valores unicos) `APLICADO`

| Valor |
|---|
| **Evento** |
| **Incidente** |
| **Mudanca** |
| **Projeto** |
| **Requisicao** |
| **Rotina** |

> **PROIBIDO:** Nao deve existir "Outros" ou "Nao classificado".

### 12.4 Tipos de Contrato (3 valores unicos + fallback)

> **DOCX Validado:** Classificacao disponivel no campo "Contrato" das tabelas do Movidesk.

| Valor (nomenclatura validada) | Descricao | Observacao |
|---|---|---|
| **SLA 24x7** | Cobertura ininterrupta | Contrato com SLA de resolucao |
| **SLA 8x5** | Horario comercial | Contrato com SLA de resolucao |
| **Sem SLA de resolucao** | Sem acordo de nivel de servico | Nomenclatura exata conforme DOCX validado |
| *(nome do cliente)* | Fallback quando nao ha contrato tipificado | **A maioria dos clientes** cai nesta categoria (DOCX: "maioria dos casos") |

> **REGRA (DOCX Validado):** *"Quando nao houver contrato especifico, devera ser exibido o nome do cliente (maioria dos casos)."*

### 12.5 Mapeamento de Campos Movidesk

| Campo Dashboard | Campo Movidesk (API) | Observacao |
|---|---|---|
| Tipo de chamado | Campo tipo / tipo de demanda | Evento, Projeto, Rotina, Suporte |
| Urgencia | Campo urgencia / prioridade | Baixa, Media, Alta, Critica |
| Categoria | Campo categoria | Define area de atendimento (Evento, Incidente, Mudanca, Projeto, Requisicao, Rotina) |
| Contrato | Campo **contrato** | Usado para filtrar MSS na Tela 7 (pendente confirmacao) |
| Cliente | Campo organizacao / cliente | Nome do cliente |
| Analista | Campo agente / responsavel | Somente agentes de suporte para Tela 8 |
| Protocolo | Campo id / numero do ticket | Formato SEC4IT + timestamp |
| Data de abertura | Campo data_criacao | Usado como filtro global |
| Data de lancamento | Campo data_lancamento | Usado em telas de horas (7 e 8) |
| Tempo de resolucao | Campo tempo_resolucao / diferenca entre abertura e fechamento | Calculado em dias |
| Primeira resposta | Campo data_primeira_resposta | Diferenca entre abertura e primeiro contato |
| Nota satisfacao | Campo nota / avaliacao | Escala inclui notas 9 e 10 (identificadas nas imagens) |

---

## 13. Diretrizes Transversais

### 13.1 Regras de Negocio Criticas

| # | Regra | Prioridade | Fonte |
|---|---|---|---|
| 1 | Chamados criticos ou fora do prazo DEVEM ser vermelho `#E74C3C` | **MAXIMA** | PDF/DOCX |
| 2 | Nao deve existir "Outros" ou "Nao classificado" em nenhuma taxonomia | **MAXIMA** | PDF/DOCX |
| 3 | Rotina **NAO tem SLA** - excluir de calculos SLA ou tratar como "sem meta" | **MAXIMA** | Planilha DASHS col. E |
| 4 | Suporte afeta **diretamente o cliente** - prioridade nos calculos de SLA | **ALTA** | Planilha DASHS col. E |
| 5 | Filtro de periodo e GLOBAL (afeta todas as telas simultaneamente) | **ALTA** | PDF/DOCX |
| 6 | Legendas sempre a esquerda, abaixo do titulo do grafico | **ALTA** | PDF/DOCX |
| 7 | Legendas exibem apenas itens presentes nos dados filtrados | **ALTA** | PDF/DOCX |
| 8 | Drill-down obrigatorio nas telas 3, 4 e 5 (abre tabela que detalha os chamados) | **ALTA** | Planilha DASHS |
| 9 | SLA de Resolucao possui 2 sub-telas: Alerta (todos) e Suporte (so suporte) | **ALTA** | Planilha DASHS linhas 5-6 |
| 10 | Cores parametrizaveis tela a tela com persistencia em banco | **MEDIA** | PDF/DOCX |
| 11 | Exportacao PDF com selecao de graficos | **MEDIA** | PDF/DOCX |
| 12 | Historico minimo de 12 meses na carga inicial | **MEDIA** | Planilha ESFORCO |

### 13.2 Logica de Dados (Orchestrator)

| Aspecto | Detalhe | Fonte |
|---|---|---|
| **Sanitizacao** | Remocao de NBSP, TAB, CR, LF antes da persistencia | DOCX |
| **Integracao** | UPSERT diario via `generic_workflow.py` consumindo API Movidesk | DOCX |
| **Seguranca** | Uso de tokens parametrizados em `workflow_settings` | DOCX |
| **Frequencia** | Carga diaria automatica incremental | Planilha ESFORCO |
| **Historico** | Carga inicial retroativa de **minimo 12 meses** | Planilha ESFORCO |
| **Tratamento de inconsistencias** | Tempos negativos, status duplicados | Planilha ESFORCO |
| **Validacao** | Reconciliacao com Movidesk (teste de integridade) | Planilha ESFORCO |
| **Modelagem** | Modelo estrela (dimensoes: Tempo, Categoria, Analista, Prioridade, Canal, etc.) | Planilha ESFORCO |

### 13.3 Comportamento Responsivo

- O dashboard deve funcionar adequadamente em monitores widescreen (16:9 e 21:9).
- Graficos com muitos clientes (Tela 2, Tela 7) devem suportar scroll horizontal ou paginacao.
- Labels de eixo devem se ajustar (rotacao, truncamento com tooltip) quando houver muitos itens.

---

## 14. Seguranca e Niveis de Acesso

> **Fonte:** Planilha `TELAS SECURITY.xlsx`, aba ESFORCO, Etapa 2 - Estruturacao Analitica.

O sistema deve implementar **seguranca por nivel de acesso**, conforme definido na camada semantica:

| Nivel | Visibilidade | Descricao |
|---|---|---|
| **Analista** | Somente seus proprios tickets | O analista de suporte ve apenas os chamados e horas atribuidos a ele |
| **Gestor** | Tickets da equipe | O gestor ve todos os chamados e horas de sua equipe/area |
| **Diretor** | Todos os dados | Acesso irrestrito a todos os tickets, clientes e analistas |

### 14.1 Impacto nos Filtros por Nivel

| Tela | Analista | Gestor | Diretor |
|---|---|---|---|
| TELA 1 - Chamados Mensais | Ve apenas seus chamados | Ve chamados da equipe | Ve todos |
| TELA 2 - Chamados Detalhes | Ve apenas seus clientes | Ve clientes da equipe | Ve todos |
| TELA 3 - Tempo de Resolucao | Ve apenas seus chamados | Ve chamados da equipe | Ve todos |
| TELA 4 - SLA de Resolucao | Ve apenas seus SLAs | Ve SLAs da equipe | Ve todos |
| TELA 5 - SLA Primeira Resposta | Ve apenas seus SLAs | Ve SLAs da equipe | Ve todos |
| TELA 6 - Pesquisa de Satisfacao | Ve apenas suas notas | Ve notas da equipe | Ve todos |
| TELA 7 - Horas de Suporte | Ve apenas suas horas | Ve horas da equipe | Ve todos |
| TELA 8 - Horas por Analista | Ve apenas suas horas | Ve ranking da equipe | Ve todos |

> **Nota:** A implementacao de seguranca por nivel requer que o modelo de dados inclua o vinculo entre usuario logado e agente/analista no Movidesk.

---

## 15. Plano de Etapas do Projeto

> **Fonte:** Planilha `TELAS SECURITY.xlsx`, aba ESFORCO.

### 15.1 Etapa 1 - Conexao e Consolidacao de Dados (35% do esforco)

**Atividades-chave:**
- Mapeamento dos campos relevantes no Movidesk (tickets, status, tempos, categorias, analistas, SLA)
- Desenvolvimento de pipeline de extracao (via API) e carga no banco do Analytics
- Tratamento de inconsistencias (ex: tempos negativos, status duplicados)
- Configuracao de atualizacao diaria incremental + historico inicial (minimo 12 meses)

**Entregas:**
- Modelo de dados bruto validado
- Documentacao de fontes e regras de transformacao

### 15.2 Etapa 2 - Estruturacao Analitica / Camada Semantica (40% do esforco)

**Atividades-chave:**
- Modelagem dimensional (dimensoes: Tempo, Categoria, Analista, Prioridade, Canal, etc.)
- Validacao de integridade (reconciliacao com Movidesk)
- Configuracao de seguranca por nivel (analista -> so seus tickets; gestor -> equipe; diretor -> todos)

**Entregas:**
- Modelo estrela validado
- Lista de metricas com definicao, formula e fonte
- Teste de reconciliacao assinado

### 15.3 Etapa 3 - Desenvolvimento dos BIs (25% do esforco)

**Atividades-chave:**
- Criacao dos paineis interativos com: layout otimizado, filtros dinamicos, drill-down e comparacoes
- Teste de usabilidade (tempo de carregamento)

**Entregas:**
- BIs funcionais e validados
- Checklist de aceite por BI

### 15.4 Distribuicao de Esforco (Visual)

```
[============================= 35% ===============================] Etapa 1 - Dados
[====================================== 40% ======================================] Etapa 2 - Semantica
[=================== 25% ===================] Etapa 3 - BIs
```

---

## 16. Matriz de Rastreabilidade -- Planilha DASHS

Tabela consolidada cruzando cada linha da planilha DASHS com a tela do ESCOPO, imagens e observacoes:

| Linha | BI# | Nome Planilha | Tela ESCOPO | Visoes | Imagens Ref. | Observacoes (col. E) |
|---|---|---|---|---|---|---|
| 2 | 1 | Chamados Mensais | TELA 1 (secao 4) | 3 | `pdf_img-000.jpg`, `image14.png` | Rotina nao tem SLA; Categoria define area; Suporte afeta cliente |
| 3 | 2 | Chamados por Cliente x Contrato | TELA 2 (secao 5) | 2 | `pdf_img-001.jpg`, `pdf_img-002.jpg`, `image11.png`, `image6.png` | As barras serao os meses |
| 4 | 3 | Tempo de Resolucao dos Chamados | TELA 3 (secao 6) | 1 | `pdf_img-004.jpg`, `image10.png`, `image7.png`, `image9.png` | - |
| 5 | 4 | SLA de Resolucao: Alerta | TELA 4a (secao 7.4) | 1 | *(sem imagem de ref. - mesmo padrao visual da 4b)* | Abre tabela detalhada |
| 6 | 4 | SLA de Resolucao: Suporte | TELA 4b (secao 7.3) | 1 | `pdf_img-005.jpg`, `image13.png` | Abre tabela detalhada |
| 7 | 5 | SLA de Primeira Resposta | TELA 5 (secao 8) | 1 | `pdf_img-006.jpg`, `image12.png` | Tambem abre tabela detalhada |
| 8 | 6 | Pesquisa de Satisfacao | TELA 6 (secao 9) | 2 | `pdf_img-007.jpg`, `pdf_img-008.jpg`, `image4.png` | - |
| 9 | 7 | Horas de Suporte (sem Projeto) | TELA 7a (secao 10.3) | 1 | `pdf_img-009.jpg`, `pdf_img-010.jpg`, `image2.png` | Categoria = Suporte |
| 10 | 7 | Horas cliente MSS | TELA 7b (secao 10.4) | 1 | `pdf_img-011.jpg`, `image3.png` | Campo "contrato" = MSS (confirmar) |
| 11 | 7 | Horas cliente Projeto | TELA 7c (secao 10.5) | 1 | `pdf_img-012.jpg`, `image1.png` | Categoria = Projeto |
| 12 | 8 | Horas por Analista x Tipo | TELA 8 (secao 11) | 2 | `pdf_img-013.jpg`, `pdf_img-014.jpg`, `pdf_img-015.jpg`, `image5.png` | Somente agentes de suporte |

---

## 17. Mapeamento Completo de Imagens

### 17.1 Imagens do PDF (pdf_img-*.jpg)

| Arquivo | Tela | Conteudo | Descricao Detalhada |
|---|---|---|---|
| `pdf_img-000.jpg` | TELA 1 | Chamados Mensais (completa) | Visao completa com 3 graficos: Tipo de Demanda, Urgencia e Categoria. Fundo escuro, filtros no topo, logo Security4iT a direita. |
| `pdf_img-001.jpg` | TELA 2 | Chamados por Cliente | Grafico "CHAMADOS ABERTOS POR CLIENTE" com barras verticais agrupadas (azul/verde/laranja) por multiplos clientes. |
| `pdf_img-002.jpg` | TELA 2 | Chamados por Contrato | Grafico "CHAMADOS ABERTOS POR TIPO DE CONTRATO" com barras verticais. Uma categoria dominante (~400). |
| `pdf_img-004.jpg` | TELA 3 | Tempo de Resolucao | Grafico "MEDIA DE TEMPO ATE RESOLUCAO POR CLIENTE" com 5 faixas (0-7, 8-15, 15-21, 21-28, +28 dias). Barras azuis. |
| `pdf_img-005.jpg` | TELA 4 | SLA de Resolucao | Grafico "SLA DE RESOLUCAO: SUPORTE" com barras empilhadas (azul/vermelho) de janeiro a outubro. Percentuais 99-100%. |
| `pdf_img-006.jpg` | TELA 5 | SLA de Primeira Resposta | Grafico "SLA DE PRIMEIRA RESPOSTA: SUPORTE" com 3 blocos grandes (julho 97,08%, agosto 95,18%, setembro 98,77%). |
| `pdf_img-007.jpg` | TELA 6 | Satisfacao - Por Mes | Grafico "RESULTADOS POR MES" com barras nota 9 (azul) e 10 (verde). KPI "9,9 Media do periodo". |
| `pdf_img-008.jpg` | TELA 6 | Satisfacao - Por Cliente | Grafico "RESPOSTAS POR CLIENTE" com barras por cliente (notas 9 e 10). |
| `pdf_img-009.jpg` | TELA 7 | Horas de Suporte (header) | Cabecalho "HORAS DE SUPORTE" com filtros e titulo "HORAS APONTADAS POR CLIENTE (SEM PROJETO)". |
| `pdf_img-010.jpg` | TELA 7 | Horas por Cliente (barras) | Grafico de barras horizontais (azul/laranja) com valores de horas por cliente. Sem nomes visiveis. |
| `pdf_img-011.jpg` | TELA 7 | Clientes MSS | Grafico "CLIENTES MSS - HORAS APONTADAS POR TIPO DE DEMANDA (SEM PROJETO)" com barras verticais (azul/laranja, 2 meses). |
| `pdf_img-012.jpg` | TELA 7 | Horas Projeto | Grafico "HORAS APONTADAS POR CLIENTE - PROJETO" com barras verticais (azul/laranja, 2 meses). |
| `pdf_img-013.jpg` | TELA 8 | Horas por Tipo de Demanda | Cabecalho "HORAS POR ANALISTA" + grafico "HORAS APONTADAS POR TIPO DE DEMANDA" com 4 series (Evento, Projeto, Rotina, Suporte). |
| `pdf_img-014.jpg` | TELA 8 | Horas por Analista (topo) | Barras horizontais (azul/laranja) com horas por analista - parte superior do ranking. |
| `pdf_img-015.jpg` | TELA 8 | Horas por Analista (base) | Continuacao das barras horizontais - parte inferior do ranking com analistas de menor volume. |
| `pdf_img-020.jpg` | Branding | Logo Security4iT | Logo completo "security4it" com icone circular laranja/prata. |
| `pdf_img-021.jpg` | Branding | Banner institucional | Banner "Proteger suas informacoes e nosso negocio." sobre fundo azul escuro com hexagonos. |

### 17.2 Imagens do DOCX Validado (image*.png) - Posicao Exata no Documento

| Arquivo | Tela | Posicao no DOCX Validado | Contexto (apos qual descricao aparece) |
|---|---|---|---|
| `image14.png` | TELA 1 | Apos lista de categorias (Rotina) | Referencia visual para "Chamados por Tipo", "Chamados por Urgencia" e "Chamados por Categoria" |
| `image11.png` | TELA 2 | Apos "Grafico 1: Eixo X: Nome do cliente, Metrica: Qtd por mes" | Referencia visual para Chamados Abertos por Cliente |
| `image6.png` | TELA 2 | Apos "Grafico 2: Quando nao houver contrato... nome do cliente" | Referencia visual para Chamados por Tipo de Contrato |
| `image10.png` | TELA 3 | Apos faixas de tempo (0-7, 8-15, 15-21, 21-28, >28 dias) | Referencia visual para Grafico 1 - Tempo medio por faixa |
| `image7.png` | TELA 3 | Apos "permitir abertura de tabela detalhada" | Referencia visual para Grafico 2 - Drill-down de chamados >30 dias |
| `image13.png` | TELA 4 | Apos "Ambas visualizacoes devem permitir abertura de tabela" | Referencia visual para SLA de Resolucao (Alerta + Suporte) |
| `image9.png` | TELA 4 e 5 | Apos image13.png (TELA 4) e apos image12.png (TELA 5) | **REUTILIZADA**: Formato padrao da tabela detalhada de drill-down (Protocolo, Cliente, Dias, Assunto). Aparece 2x no DOCX. |
| `image12.png` | TELA 5 | Apos "abertura de tabela detalhada com os chamados" | Referencia visual para SLA de Primeira Resposta |
| `image4.png` | TELA 6 | Apos "Barras representando as notas atribuidas" | Referencia visual completa: Resultado por Mes + Respostas por Cliente. Clientes visiveis: BYX CAPITAL, Fundacao Butantan, MPSP, Security4IT |
| `image2.png` | TELA 7 | Apos "Considerar apenas categoria Suporte. Excluir projetos" | Referencia visual para Horas por Cliente (sem Projeto). 21 clientes nomeados, 3 meses (rosa/azul/laranja) |
| `image3.png` | TELA 7 | Apos "MSS corresponde a um tipo de contrato especifico" | Referencia visual para Horas Cliente MSS. Clientes: Fundacao Butantan, MPSP, BOAB, ANB |
| `image1.png` | TELA 7 | Apos "Considerar chamados cuja categoria seja Projeto" | Referencia visual para Horas Cliente Projeto. Clientes: Security4IT, ANB, BYX CAPITAL |
| `image5.png` | TELA 8 | Apos "Considerar apenas agentes de suporte" | Referencia visual completa: Horas por Tipo + Horas por Analista. Analistas: Hugo Lima, Savio Dias, Cristian Santos, Luan Oliveira Santos, Gabriela Marcelino |

### 17.3 Imagens Ausentes (deletadas do repositorio)

Os seguintes arquivos foram deletados do repositorio mas constam no historico:
- `pdf_img-003.jpg` - (nao disponivel)
- `pdf_img-016.jpg` - (nao disponivel)
- `pdf_img-017.jpg` - (nao disponivel)
- `pdf_img-018.jpg` - (nao disponivel)
- `pdf_img-019.jpg` - (nao disponivel)

---

## 18. Especificacao Tecnica Funcional

> **Fonte:** `Escopo_Tecnico_Security4iT_v2.0.docx` (v2.0, 02/03/2026, Status: Em elaboracao)
>
> Esta secao consolida os requisitos funcionais e tecnicos do sistema, originalmente documentados no escopo tecnico funcional. Complementa as secoes anteriores (visuais e de negocio) com detalhes de implementacao.

### 18.1 Ficha Tecnica

| Campo | Valor |
|---|---|
| Projeto | Security4iT - Gestao de Tickets |
| Modulo | Dashboard BI - Sincronizacao e Visualizacao |
| Versao | v2.0 |
| Data | 02/03/2026 |
| Status | Em elaboracao |

### 18.2 Objetivo Tecnico

O sistema sincroniza tickets via API REST do Movidesk, persiste os dados em **MySQL 8.0+** e os apresenta por meio de dashboards interativos em **HTML5** com foco em gestao de SLA, produtividade de analistas e satisfacao do cliente.

O ecossistema contempla:
- **(a)** Motor de sincronizacao incremental e exaustiva configurado via JSON (`PlanningDevelopmentMitra.json`)
- **(b)** Engine de execucao generico em Python (`generic_workflow.py`) que interpreta o plano
- **(c)** 8 telas de dashboard premium com filtros globais, drill-down, exportacao PDF e parametrizacao visual por usuario

### 18.3 Atores e Personas

| Persona | Responsabilidade | Interacao com o Sistema |
|---|---|---|
| **Gestor de TI (Security4iT)** | Acompanhar SLAs, produtividade da equipe e satisfacao dos clientes | Visualiza dashboards, aplica filtros globais, exporta relatorios em PDF, configura cores dos graficos |
| **Analista de Suporte** | Executar atendimentos e registrar horas trabalhadas | Consulta tickets atribuidos, visualiza metricas individuais na tela Horas por Analista |
| **Administrador do Sistema** | Configurar usuarios, permissoes e parametros do sistema | Gerencia usuarios na tela Controle de Usuarios, configura parametrizacoes visuais e executa sincronizacao |
| **Cliente Final (Security4iT)** | Abrir chamados e responder pesquisas de satisfacao | Interage indiretamente via Movidesk; seus dados de satisfacao aparecem na tela Pesquisa de Satisfacao |

### 18.4 Pre-Condicoes Tecnicas

| ID | Descricao | Tipo |
|---|---|---|
| PC-01 | Conta ativa no Movidesk com token de API valido e permissoes de leitura de tickets | Obrigatoria |
| PC-02 | Instancia MySQL 8.0+ operacional e acessivel (Docker container na porta 3307 mapeada para 3306) | Obrigatoria |
| PC-03 | Python 3.8+ instalado com bibliotecas `requests` e `mysql-connector-python` | Obrigatoria |
| PC-04 | Docker e Docker Compose instalados para provisionamento do banco de dados | Obrigatoria |
| PC-05 | Arquivo `PlanningDevelopmentMitra.json` configurado com credenciais de API e conexao de banco | Obrigatoria |
| PC-06 | Navegador moderno (Chrome, Firefox, Edge) com suporte a HTML5, CSS3 e JavaScript ES6+ | Obrigatoria |
| PC-07 | Acesso a rede para comunicacao entre o motor de sincronizacao e a API do Movidesk | Obrigatoria |
| PC-08 | Historico de tickets no Movidesk com pelo menos 3 meses de dados para dashboards significativos | Desejavel |

### 18.5 Glossario Tecnico

| Termo | Definicao |
|---|---|
| **Movidesk** | Plataforma SaaS de gestao de atendimento (helpdesk/service desk) utilizada pela Security4iT |
| **Ticket** | Registro unitario de uma solicitacao, incidente, evento ou projeto aberto por um cliente |
| **SLA (Service Level Agreement)** | Acordo de nivel de servico que define os tempos maximos para primeira resposta e resolucao |
| **SLA de Primeira Resposta** | Tempo maximo entre a abertura do ticket e a primeira interacao do analista. Critica: 1h, Alta: 4h, Media: 24h, Baixa: 24h |
| **SLA de Resolucao** | Tempo maximo entre a abertura do ticket e seu encerramento com solucao definitiva |
| **NPS (Net Promoter Score)** | Metrica de satisfacao: Notas 9-10 = Promotores, 7-8 = Neutros, 0-6 = Detratores. Formula: %Promotores - %Detratores |
| **Drill-down** | Funcionalidade de clicar em um elemento do grafico para exibir tabela detalhada dos registros subjacentes |
| **UPSERT** | Operacao INSERT ... ON DUPLICATE KEY UPDATE que garante idempotencia |
| **Buffer-Clean-Extract** | Padrao em 3 etapas: (1) Buffer - salvar resposta bruta, (2) Clean - sanitizar, (3) Extract - extrair campos |
| **Workflow Orchestrator** | Motor de execucao (`generic_workflow.py`) que interpreta o `PlanningDevelopmentMitra.json` |
| **Contrato SLA 24x7** | Cobertura de atendimento 24 horas por dia, 7 dias por semana |
| **Contrato SLA 8x5** | Cobertura de atendimento em horario comercial (8h diarias, 5 dias uteis) |
| **Apontamento de Tempo** | Registro de horas trabalhadas por um analista em um ticket especifico |
| **Parametrizacao Visual** | Capacidade de o usuario customizar cores dos graficos por coluna, tela a tela, com persistencia em banco |

---

## 19. Regras de Negocio Tecnicas (RN-01 a RN-13)

> **Fonte:** `Escopo_Tecnico_Security4iT_v2.0.docx`, secao 5.

### RN-01 -- Sincronizacao Incremental e Exaustiva

O sistema realiza dois tipos de sincronizacao com a API do Movidesk:

| Tipo | Endpoint | Quando |
|---|---|---|
| **Exaustiva** | `tickets/past?` | Primeira execucao - coleta todos os tickets historicos |
| **Incremental** | `tickets?` com filtro de data | Execucoes subsequentes - apenas tickets atualizados |

O parametro `last_sync_date` na tabela `workflow_settings` controla a data de corte.

> **Exemplo:** Na primeira execucao, o sistema busca todos os tickets via `tickets/past?`. Ao finalizar, grava `last_sync_date = '2026-03-01T23:59:59'`. Na proxima execucao, busca via `tickets?` apenas registros com `lastUpdate > '2026-03-01T23:59:59'`.

### RN-02 -- Sanitizacao de Dados (Buffer-Clean-Extract)

Toda resposta da API deve passar pelo padrao **Buffer-Clean-Extract** antes da persistencia:

| Etapa | Acao |
|---|---|
| **Buffer** | Salvar resposta bruta da API |
| **Clean** | Remover: NBSP (`U+00A0`), TAB (`0x09`), CR (`0x0D`), LF (`0x0A`) |
| **Extract** | Extrair campos relevantes para persistencia |

### RN-03 -- Idempotencia via UPSERT

Todas as operacoes de persistencia devem utilizar `INSERT ... ON DUPLICATE KEY UPDATE` para garantir **idempotencia**. Permite re-execucao segura do workflow sem duplicacao de registros.

### RN-04 -- Classificacao de Tickets

Tickets devem ser classificados em tres dimensoes mutuamente exclusivas:

| Eixo | Valores Validos |
|---|---|
| Tipo | Evento, Projeto, Rotina, Suporte |
| Urgencia | Baixa, Media, Alta, Critica |
| Categoria | Evento, Incidente, Mudanca, Projeto, Requisicao, Rotina |

> **REGRA:** Tickets sem classificacao valida (marcados como "Nao classificado" ou "Outros") devem ser **excluidos** dos graficos e calculos de SLA.

### RN-05 -- Calculo de SLA de Primeira Resposta

O SLA de primeira resposta mede o tempo entre a **abertura do ticket** e a **primeira acao registrada** por um analista.

| Urgencia | Tempo Maximo | Criterio |
|---|---|---|
| **Critica** | <= 1 hora | Dentro do SLA se respondido em ate 60 minutos |
| **Alta** | <= 4 horas | Dentro do SLA se respondido em ate 240 minutos |
| **Media** | <= 24 horas | Dentro do SLA se respondido em ate 1440 minutos |
| **Baixa** | <= 24 horas | Dentro do SLA se respondido em ate 1440 minutos |

> **Exemplo:** Ticket critico aberto as 10:00. Primeira resposta as 10:45. Tempo = 45 min. **SLA = Dentro** (limite era 60 min).

> **NOVO (Escopo Tecnico):** Media e Baixa agora tem SLA definido de **24 horas**. No escopo validado original, apenas Critica (1h) e Alta (4h) tinham parametros explicitos.

### RN-06 -- Calculo de SLA de Resolucao

O SLA de resolucao mede o tempo entre a abertura e o **encerramento definitivo** do ticket.

- Considerar **apenas tickets da categoria "Suporte"**
- Formula: `% no prazo = (tickets dentro do SLA / total de tickets) * 100`

> **Exemplo:** Em janeiro, 80 tickets de suporte foram fechados. 68 resolvidos dentro do prazo. % no prazo = (68/80) * 100 = **85%**.

### RN-07 -- Faixas de Tempo de Resolucao

| Faixa | Intervalo | Tratamento Visual |
|---|---|---|
| Faixa 1 | 0 a 7 dias | Cor padrao do grafico |
| Faixa 2 | 8 a 14 dias | Cor padrao do grafico |
| Faixa 3 | 15 a 21 dias | Cor padrao do grafico |
| Faixa 4 | 22 a 28 dias | Cor de alerta (laranja) |
| Faixa 5 | > 28 dias | **Cor critica `#E74C3C` (vermelho)** |

> **REGRA:** Tickets com mais de 30 dias sem resolucao devem exibir um **badge de alerta vermelho** (`#E74C3C`) em destaque.

> **NOTA DE DIVERGENCIA:** O escopo visual (secao 6.3) usa faixas "8-15" e "15-21", enquanto o escopo tecnico usa "8-14" e "15-21". Recomenda-se alinhar para a versao tecnica (sem sobreposicao no dia 15).

### RN-08 -- Calculo do NPS (Net Promoter Score)

| Classificacao | Notas | Peso no Calculo |
|---|---|---|
| **Promotores** | 9 e 10 | Positivo |
| **Neutros** | 7 e 8 | Descartados |
| **Detratores** | 0 a 6 | Negativo |

**Formula:** `NPS = %Promotores - %Detratores`

> **Exemplo:** 100 respostas: 60 notas 9-10 (60% Promotores), 25 notas 7-8 (25% Neutros), 15 notas 0-6 (15% Detratores). **NPS = 60% - 15% = 45**.

> **ENRIQUECIMENTO:** A secao 9 (TELA 6 - Pesquisa de Satisfacao) mostra apenas notas 9 e 10 nas imagens de referencia. O escopo tecnico agora formaliza a formula completa do NPS incluindo Neutros e Detratores.

### RN-09 -- Horas de Suporte versus Projeto

| Grupo | Filtro | Tela/Grafico |
|---|---|---|
| **Horas de Suporte** | Categoria = "Suporte", excluindo projetos | TELA 7 - Grafico 1 (Horas por Cliente) |
| **Horas de Projeto** | Categoria = "Projeto" | TELA 7 - Grafico 3 (Horas por Cliente Projeto) |
| **Horas MSS** | Subgrupo de Suporte, campo contrato = MSS | TELA 7 - Grafico 2 (Clientes MSS) |

### RN-10 -- Filtros Globais e Comportamento de Drill-down

**Filtros globais** que se aplicam a todas as telas simultaneamente:

| Filtro | Comportamento |
|---|---|
| Data Inicio | Todas as queries re-executadas com novo parametro |
| Data Fim | Todas as queries re-executadas com novo parametro |
| Cliente | Todas as queries re-executadas com novo parametro |

**Drill-down:** Ao clicar em elementos dos graficos (barras, fatias), o sistema exibe uma tabela detalhada com os registros subjacentes ao ponto clicado. A selecao de mes deve refletir em todas as telas abertas.

### RN-11 -- Parametrizacao Visual de Cores

- O usuario pode personalizar as cores de **cada coluna** de **cada grafico**, em **cada tela**, independentemente.
- As preferencias sao **persistidas no banco de dados** e carregadas automaticamente.
- **Cada usuario pode ter sua propria configuracao visual** (configuracao por usuario, nao global).

### RN-12 -- Exportacao de Relatorios em PDF

- O usuario pode selecionar quais graficos incluir antes de gerar o PDF.
- Biblioteca utilizada: **html2pdf.js** para conversao do conteudo HTML renderizado.

### RN-13 -- Controle de Concorrencia do Workflow

| Estado | Significado | Acao |
|---|---|---|
| `IDLE` | Nenhuma execucao em andamento | Nova execucao pode iniciar |
| `BUSY` | Execucao em andamento | Nova execucao **abortada** |
| `COMPLETED` | Execucao concluida com sucesso | Nova execucao pode iniciar |

A tabela `workflow_control` armazena o estado. Em caso de erro, o status permanece `BUSY` ate intervencao manual ou timeout.

---

## 20. Fluxo Principal e Fluxos Alternativos

> **Fonte:** `Escopo_Tecnico_Security4iT_v2.0.docx`, secoes 6 e 7.

### 20.1 Fluxo Principal (Caminho Feliz)

| Passo | Descricao |
|---|---|
| 1 | O Administrador inicia a execucao do motor de sincronizacao via linha de comando |
| 2 | O sistema verifica `workflow_control.status`. Se `BUSY`, aborta. Se nao, marca como `BUSY` |
| 3 | O sistema executa a sincronizacao exaustiva: busca todos os tickets historicos via `tickets/past?` em lotes |
| 4 | Para cada lote, aplica o padrao **Buffer-Clean-Extract**: salva resposta bruta, sanitiza, extrai campos e persiste via UPSERT |
| 5 | Apos esgotar os tickets historicos, alterna para o endpoint `tickets?` com filtro de data para incremental |
| 6 | Ao finalizar, atualiza `last_sync_date` com a maior data de atualizacao encontrada e marca status como `COMPLETED` |
| 7 | O Gestor de TI acessa o sistema pelo navegador na tela de Login (`Login.html`) e autentica-se |
| 8 | O sistema valida as credenciais e redireciona para o Painel Principal (`Painel_Principal.html`) |
| 9 | O Gestor seleciona os filtros globais (Data Inicio, Data Fim, Cliente) que serao aplicados a todas as telas |
| 10 | O Gestor navega para "Chamados Mensais" e visualiza graficos de volume de tickets por tipo, urgencia e categoria |
| 11 | O Gestor clica em uma barra do grafico mensal para realizar drill-down e visualizar a tabela detalhada |
| 12 | O Gestor navega para "SLA de Primeira Resposta" e verifica o percentual de tickets atendidos dentro do prazo |
| 13 | O Gestor navega para "Pesquisa de Satisfacao" e visualiza o NPS medio do periodo e respostas por cliente |
| 14 | O Gestor seleciona graficos especificos e exporta o relatorio em formato PDF |

### 20.2 Fluxos Alternativos e Excecoes

| ID | Cenario | Comportamento Esperado |
|---|---|---|
| FA-01 | API do Movidesk indisponivel durante sincronizacao | Registra erro no log (`workflow_execution.log`), mantem `BUSY`, retry na proxima execucao |
| FA-02 | Resposta da API com JSON invalido ou corrompido | Tenta sanitizar na etapa Clean. Se invalido, registra no log e pula para o proximo lote |
| FA-03 | Execucao concorrente do workflow | Se status = `BUSY`, aborta imediatamente com mensagem no log |
| FA-04 | Ticket sem classificacao (tipo, urgencia ou categoria nulos) | Ticket persistido no banco, mas **excluido** dos calculos de SLA e dos graficos de classificacao |
| FA-05 | Cliente sem contrato definido | Grafico de contratos exibe o **nome do cliente** na coluna de contrato |
| FA-06 | Pesquisa de satisfacao sem resposta | Ticket nao aparece nos graficos de Pesquisa de Satisfacao. Calculo do NPS considera apenas tickets com resposta |
| FA-07 | Usuario sem permissao para acessar uma tela | Redireciona para tela de Login unificada em modo "acesso negado" com mensagem |
| FA-08 | Falha na conexao com o banco de dados | Registra erro completo (stack trace) no log, mantem status `BUSY`, requer intervencao manual |
| FA-09 | Timeout da API (resposta lenta) | Aguarda ate timeout configurado (padrao 30s). Se excedido, registra erro e pula para proximo lote |
| FA-10 | Exportacao PDF com graficos sem dados | PDF gerado com graficos vazios exibindo mensagem "Sem dados para o periodo selecionado" |

### 20.3 Telas do Sistema (Mapeamento Tecnico)

O fluxo principal referencia as seguintes telas HTML:

| Tela HTML | Correspondencia no Escopo | Funcao |
|---|---|---|
| `Login.html` | (Tela auxiliar) | Autenticacao, acesso negado, ativacao de conta e criacao de senha (unificada) |
| `Painel_Principal.html` | (Tela auxiliar) | Painel de navegacao com filtros globais |
| `Chamados_Mensais.html` | TELA 1 | Volume de chamados por tipo, urgencia, categoria |
| `Chamados_Detalhes.html` | TELA 2 | Chamados por cliente e contrato |
| `Tempo_de_Resolucao.html` | TELA 3 | Tempo medio de resolucao por faixa |
| `SLA_de_Resolucao.html` | TELA 4 | % tickets dentro/fora do prazo |
| `SLA_de_Primeira_Resposta.html` | TELA 5 | % primeiro contato no prazo |
| `Pesquisa_de_Satisfacao.html` | TELA 6 | NPS e satisfacao por cliente |
| `Horas_de_Suporte.html` | TELA 7 | Horas por cliente, MSS e projeto |
| `Horas_por_Analista.html` | TELA 8 | Produtividade por analista |

---

## 21. Criterios de Aceite

> **Fonte:** `Escopo_Tecnico_Security4iT_v2.0.docx`, secao 8.

| ID | Criterio de Aceite |
|---|---|
| **CA-01** | O workflow de sincronizacao exaustiva deve importar 100% dos tickets historicos do Movidesk sem perda de dados |
| **CA-02** | A sincronizacao incremental deve importar apenas tickets com `lastUpdate` posterior a `last_sync_date` |
| **CA-03** | Caracteres especiais (NBSP, TAB, CR, LF) devem ser removidos de todos os campos texto antes da persistencia |
| **CA-04** | O grafico Chamados Mensais deve exibir corretamente a distribuicao por tipo (Evento, Projeto, Rotina, Suporte), urgencia e categoria |
| **CA-05** | O calculo de SLA de Primeira Resposta deve classificar corretamente tickets como "Dentro" ou "Fora" conforme tabela RN-05 |
| **CA-06** | O calculo de SLA de Resolucao deve considerar apenas tickets da categoria "Suporte" |
| **CA-07** | O NPS deve ser calculado corretamente: Promotores (9-10), Neutros (7-8), Detratores (0-6). Formula: %Promotores - %Detratores |
| **CA-08** | O drill-down ao clicar em uma barra de grafico deve exibir tabela detalhada com os registros subjacentes |
| **CA-09** | Os filtros globais (Data Inicio, Data Fim, Cliente) devem ser aplicados simultaneamente a todas as telas |
| **CA-10** | A exportacao PDF deve gerar documento legivel com os graficos selecionados pelo usuario |
| **CA-11** | O controle de concorrencia deve impedir a execucao simultanea de dois workflows |
| **CA-12** | A parametrizacao de cores deve persistir no banco de dados e ser carregada automaticamente nas proximas sessoes |
| **CA-13** | Tickets com mais de 30 dias sem resolucao devem ser destacados com badge vermelho (`#E74C3C`) |
| **CA-14** | A tela Horas de Suporte deve segregar corretamente horas de Suporte (excluindo projetos) e horas de Projeto |
| **CA-15** | O sistema deve tratar respostas de API com JSON invalido sem interromper o workflow completo |
| **CA-16** | A tela de Login deve autenticar usuarios e redirecionar para o Painel Principal; credenciais invalidas exibem mensagem de erro |

---

## 22. Pontos Pendentes de Confirmacao

> **Consolidacao de pontos pendentes de todas as fontes.** Atualizado conforme DOCX validado (24/02/2026) e Escopo Tecnico v2.0 (02/03/2026).

### 22.1 Pontos Pendentes do Escopo Validado

| # | Ponto | Status | Tela | Origem | Resolucao |
|---|---|---|---|---|---|
| 1 | Regra de filtragem horas de suporte (7a) | **RESOLVIDO** | TELA 7 | Planilha DASHS | DOCX validado: *"Considerar apenas chamados cuja categoria seja Suporte. Excluir projetos."* |
| 2 | Campo "contrato" para identificar MSS | **PARCIAL** | TELA 7 | Planilha DASHS | DOCX validado: *"MSS corresponde a um tipo de contrato especifico."* Valor exato no Movidesk a confirmar. |
| 3 | Tratamento de "Rotina" no SLA Alerta | **ABERTO** | TELA 4 | Planilha DASHS | Rotina nao tem SLA. Definir se exclui ou trata como "sem meta". |
| 4 | Visual da sub-tela 4a (SLA Alerta) | **ABERTO** | TELA 4 | Planilha DASHS | DOCX confirma que deve existir, sem imagem de referencia. Seguir padrao da 4b. |
| 5 | Mapeamento de campos Movidesk | **EM ANDAMENTO** | Todas | Planilha ESFORCO | Secao 12.5 contem mapeamento preliminar. |
| 6 | **Parametrizacao de Cores** | **PENDENTE** | Todas | DOCX validado | Unico item "(pendente)" no DOCX. Mercia deseja controle por coluna, tela a tela, persistido em banco. |
| 7 | Alternativa de exportacao PDF | **ABERTO** | Todas | DOCX validado | DOCX sugere: "criar um botao para cada grafico". Escopo tecnico define html2pdf.js. |

### 22.2 Pontos em Aberto do Escopo Tecnico (PA-01 a PA-08)

> **Fonte:** `Escopo_Tecnico_Security4iT_v2.0.docx`, secao 9. *"Este documento sera atualizado conforme os Pontos em Aberto forem respondidos. Cada resposta sera transformada em Regra de Negocio ou Fluxo Alternativo."*

| ID | Ponto | Questao |
|---|---|---|
| **PA-01** | Parametros de SLA de Resolucao por tipo de contrato | Os tempos maximos de resolucao sao diferentes para contratos SLA 24x7 versus SLA 8x5? Se sim, quais sao os tempos para cada tipo? |
| **PA-02** | Politica de retencao de dados | Existe prazo de retencao para tickets antigos no banco? Apos quanto tempo podem ser arquivados/removidos? |
| **PA-03** | Niveis de permissao de usuarios | Quais perfis de acesso existem alem de Administrador e Gestor? O Analista pode visualizar dados de outros analistas? |
| **PA-04** | Frequencia da sincronizacao automatica | A sincronizacao incremental deve ser executada manualmente, via cron job (de quantas em quantas horas?) ou por gatilho? |
| **PA-05** | Tratamento de tickets reabertos | Quando um ticket e reaberto no Movidesk, como isso afeta o calculo de SLA de Resolucao? Reinicia a contagem ou soma ao tempo anterior? |
| **PA-06** | Backup e recuperacao de dados | Qual a estrategia de backup do banco MySQL? Frequencia, retencao de backups, procedimento de restauracao? |
| **PA-07** | Meta de NPS | Existe uma meta de NPS definida pela Security4iT? Se sim, o dashboard deve exibir indicador visual de meta atingida/nao atingida? |
| **PA-08** | Horario comercial para calculo de SLA | O calculo de SLA (primeira resposta e resolucao) deve considerar apenas horario comercial (8x5) ou calendario corrido (24x7)? Depende do tipo de contrato? |

---

## 23. Referencias de Ativos

| Ativo | Caminho | Tipo | Data |
|---|---|---|---|
| **DOCX Validado (FONTE AUTORITATIVA)** | **`docs/Escopo validado - Gestao de ticket - SECURITY4IT.docx`** | **Escopo definitivo validado pela cliente** | **24/02/2026** |
| **Escopo Tecnico Funcional v2.0** | **`docs/Escopo_Tecnico_Security4iT_v2.0.docx`** | **Especificacao tecnica: regras de negocio, fluxos, criterios de aceite** | **02/03/2026** |
| Documento PDF original | `docs/Projeto BI Gestao de Tickets - Security4it.pdf` | Referencia visual original (e-mail cliente) | 01/12/2025 |
| Planilha de Telas | `docs/TELAS SECURITY.xlsx` | Nomenclatura oficial, visoes, foco, observacoes e esforco | - |
| Diretorio de imagens | `docs/images/` | 30 imagens de referencia (13 do DOCX + 17 do PDF) | - |
| Workflow Engine | `generic_workflow.py` | Pipeline de dados | - |
| Plano de Implementacao | `PlanningDevelopmentMitra.json` | Plano tecnico | - |
