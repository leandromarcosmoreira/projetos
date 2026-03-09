# Projetos Mitra - Neuon Soluções

Repositório de projetos desenvolvidos na plataforma [Mitra](https://coder.mitralab.io) (low-code), incluindo scripts de automação, backup e documentação técnica.

## Estrutura do Repositório

```
projetos/
├── BeaBisa/                    # Projeto BeaBisa
│   └── Fluxo de Caixa/        #   Escopo, telas HTML, gerador de escopo
├── GlobalWeb/                  # Projeto GlobalWeb
│   └── Fluxo de Caixa/        #   (em andamento)
├── Maelly/                     # Projeto Maelly
│   ├── Controle Fiscal/        #   Escopo técnico (v2.0 a v2.3)
│   ├── Fluxo de Caixa/         #   Escopo e hierarquia
│   └── Gestão de Estoque/      #   Escopo técnico
├── Security4iT/                # Projeto Security4iT - Gestão de Tickets
│   ├── backup/                 #   Backup completo via SDK (dados + funções)
│   ├── backup-interface/       #   Screenshots do Coder + dados da API
│   ├── docs/                   #   Documentação, escopo, imagens, telas
│   ├── backup-projeto.js       #   Script de backup completo
│   └── backup-interface.js     #   Script de captura da interface via Puppeteer
├── Skill Mitra/                # Skill de escopo técnico para Claude
├── mitra-auth.js               # Autenticação OAuth via Puppeteer (Google)
├── test-mitra.js               # Script de teste do SDK
├── package.json                # Dependências do projeto
├── .env.example                # Template de variáveis de ambiente
└── .gitignore                  # Ignora node_modules, .env, cookies
```

## Configuração

### Pré-requisitos

- Node.js 18+
- Google Chrome (para Puppeteer)

### Instalação

```bash
npm install
cp .env.example .env
```

### Variáveis de Ambiente (.env)

```env
MITRA_BASE_URL=https://api0.mitraecp.com:1004
MITRA_TOKEN=Bearer <jwt-token>
MITRA_AUTH_URL=https://coder.mitralab.io/sdk-auth/
MITRA_INTEGRATION_URL=https://api0.mitraecp.com:1003
MITRA_WORKSPACE_ID=2724
MITRA_PROJECT_ID=19983
```

### Obtendo o Token

O token JWT expira em 24h. Para obter um novo:

```bash
node mitra-auth.js
```

Abre um browser, faz login via Google OAuth e atualiza o `.env` automaticamente.
Os cookies do Google são persistidos em `.mitra-cookies.json` para login automático nas próximas execuções.

---

## Security4iT - Gestão de Tickets

Projeto principal neste repositório. Sistema de gestão de tickets construído na plataforma Mitra.

- **Workspace:** 2724 (Neuon - Coder)
- **Projeto:** 19983
- **Plano:** Enterprise
- **Privacidade:** Público com Login (SSO Google/Microsoft)
- **URL Coder:** https://coder.mitralab.io/w/2724/p/19983
- **URL Build:** https://2724-19983.build.mitralab.io

### Backup Completo (SDK)

Localização: `Security4iT/backup/2026-03-09/`

Executar:
```bash
node Security4iT/backup-projeto.js
```

#### O que é salvo:

| Categoria | Qtd | Descrição |
|-----------|-----|-----------|
| **Tabelas** | 24 | Schema (colunas + tipos) + dados completos (paginado) |
| **Server Functions** | 85 | Código-fonte completo (JavaScript + SQL) |
| **Variáveis** | 15 | Todas as variáveis do projeto (tokens mascarados) |
| **Integrações** | - | Configurações de integrações externas |
| **Arquivos** | - | Lista de arquivos do projeto |
| **Projeto** | - | Contexto e metadados do projeto |

#### Tabelas com dados (108.122 registros totais):

| Tabela | Registros | Descrição |
|--------|-----------|-----------|
| ACOES | 28.495 | Ações/interações dos tickets |
| STATUS_HISTORICO | 28.940 | Histórico de mudanças de status |
| APONTAMENTOS | 14.316 | Apontamentos de horas |
| OWNER_HISTORICO | 8.569 | Histórico de responsáveis |
| TICKET_TAGS | 7.076 | Tags dos tickets |
| PESQUISAS | 6.397 | Pesquisas de satisfação |
| TICKET_CLIENTES | 5.300 | Relação ticket-cliente |
| CUSTOM_FIELD_VALUES | 4.452 | Valores de campos customizados |
| TICKETS | 2.991 | Tickets principais |
| CUSTOM_FIELD_ITEMS | 705 | Definição de campos customizados |
| CLIENTES | 312 | Cadastro de clientes |
| ACOES_ANEXOS | 156 | Anexos das ações |
| SYNC_LOG | 103 | Logs de sincronização |
| ANALISTAS | 90 | Cadastro de analistas |
| SYNC_STATUS | 66 | Status de sincronização |
| TICKET_CHILDREN | 50 | Tickets filhos |
| TICKET_PARENT | 47 | Tickets pai |
| AUDIT_LOG | 21 | Log de auditoria |
| INT_USER | 12 | Usuários de integração |
| TICKET_ASSETS | 8 | Assets dos tickets |
| CONFIGURACOES | 7 | Configurações do sistema |
| SYNC_AUDIT | 7 | Auditoria de sync |

#### Estrutura do backup:

```
Security4iT/backup/2026-03-09/
├── manifest.json                # Metadados do backup
├── projeto/
│   └── contexto.json            # Configuração do projeto
├── tabelas/
│   ├── ACOES/
│   │   ├── schema.json          # Colunas e tipos
│   │   └── data.json            # Todos os registros
│   ├── TICKETS/
│   │   ├── schema.json
│   │   └── data.json
│   └── ... (24 tabelas)
├── server-functions/
│   ├── syncTriggerDirect.json   # Código JavaScript
│   ├── detalheTicket.json       # Query SQL
│   └── ... (85 funções)
├── variaveis/
│   ├── variables.json           # Com tokens mascarados
│   └── variables-full.json      # Com valores completos
├── integracoes/
│   └── integracoes.json
└── arquivos/
    └── files.json
```

### Backup da Interface (Puppeteer)

Localização: `Security4iT/backup-interface/2026-03-09/`

Executar:
```bash
node Security4iT/backup-interface.js
```

Captura screenshots + HTML + dados da API do Mitra Coder via Puppeteer.
Usa `userDataDir` para persistir a sessão Google entre execuções.

#### Telas capturadas (11):

| Tela | Seção do Coder |
|------|----------------|
| 00_coder_main | Visão principal com preview do app e Agent |
| coder_01_tela_preview | Interface - Preview do app (iframe Build) |
| coder_02_telas_editor | Database - Lista de tabelas MySQL |
| coder_03_tabelas | Server Functions - Funções JS + SQL |
| coder_04_conexoes | Integrações - Bearer Token, Sankhya, Stripe, HubSpot, etc. |
| coder_05_usuarios | Membros & Acessos - 11 membros com roles |
| coder_06_funcoes_servidor | Server Functions (SQL functions) |
| coder_07_arquivos | Environment - Deploy status, snapshots |
| coder_08_configuracoes | Configurações - Nome, logo, SSO, privacidade |
| build_login | Tela de login do Build app |
| build_after_login | Build app (não publicado - assets 404) |

#### API Data capturada:

31 responses da API incluindo:
- Configuração do projeto e workspace
- Tokens refreshed
- Lista de colaboradores e permissões
- Configuração do tenant (MySQL, locale, features)
- Status de publicação
- Lista de arquivos do output (assets compilados)
- Status da integração com Claude AI

### Documentação

Localização: `Security4iT/docs/`

```
docs/
├── Escopo/                          # Documentos de escopo técnico
│   ├── ESCOPO.md                    # Escopo em Markdown
│   ├── Escopo_Tecnico_*.docx        # Versões Word
│   ├── Escopo validado*.docx        # Versão validada pelo cliente
│   ├── Projeto BI*.pdf              # Apresentação do projeto
│   └── TELAS SECURITY.xlsx          # Especificação de telas
├── Telas/                           # Screenshots das telas do sistema
│   ├── Painel Principal/
│   ├── Chamados Detalhes/
│   ├── Chamados Mensais/
│   ├── Horas de Suporte Apontadas/
│   ├── Horas por Analista/
│   ├── SLA de Primeira Resposta/
│   ├── SLA de Resolução/
│   ├── Tempo de Resolução/
│   ├── Pesquisa de Satisfação/
│   ├── Controle de Usuários/
│   ├── Configurações/
│   └── Documentação/
├── imagens/                         # Logos e imagens do projeto
├── corrigir_interface_grafica.txt   # Notas sobre correções visuais
├── prompt_sincronização.txt         # Prompt de sincronização de dados
└── files.zip                        # Arquivos adicionais
```

---

## Scripts de Automação

### `mitra-auth.js` - Autenticação OAuth

Abre um browser Puppeteer para autenticação Google OAuth na plataforma Mitra.
Captura o token JWT do redirect e atualiza o `.env` automaticamente.

```bash
node mitra-auth.js
```

- Persiste cookies Google em `.mitra-cookies.json`
- Login automático se a sessão Google estiver ativa
- Token expira em 24h

### `Security4iT/backup-projeto.js` - Backup Completo via SDK

Faz backup completo do projeto usando o `mitra-sdk`:
- Contexto do projeto
- Todas as 24 tabelas (schema + dados paginados via SQL)
- 85 server functions (código-fonte completo)
- 15 variáveis (com mascaramento de tokens)
- Integrações e arquivos

```bash
node Security4iT/backup-projeto.js
```

### `Security4iT/backup-interface.js` - Captura de Interface via Puppeteer

Navega pelo Mitra Coder autenticado e captura screenshots de todas as seções:
- Usa `userDataDir` para persistir sessão Google
- Clica nos ícones da sidebar por coordenadas
- Intercepta API responses para capturar dados adicionais

```bash
node Security4iT/backup-interface.js
```

---

## Dependências

| Pacote | Versão | Uso |
|--------|--------|-----|
| [mitra-sdk](https://www.npmjs.com/package/mitra-sdk) | ^1.0.41 | Backend SDK - CRUD, SQL, server functions, variáveis |
| [mitra-interactions-sdk](https://www.npmjs.com/package/mitra-interactions-sdk) | ^1.0.36 | Frontend SDK - Auth, CRUD, interactions |
| [puppeteer](https://www.npmjs.com/package/puppeteer) | ^24.38.0 | Automação de browser - OAuth, screenshots |
| [dotenv](https://www.npmjs.com/package/dotenv) | ^17.3.1 | Carregamento de variáveis de ambiente |

## Notas Técnicas

- **Mitra usa MySQL** internamente (não PostgreSQL). Queries SQL não devem usar aspas duplas em nomes de tabelas.
- O SDK usa `runQueryMitra({ sql: "..." })` (parâmetro `sql`, não `query`).
- Os resultados vêm em `result.result?.rows`.
- O token JWT contém: `iss: Mitra, jti: userId, sub: email, tni: projectId, accessType: CREATOR`
- O Coder autentica via Google OAuth; o Build app autentica separadamente.
- A API do MitraSpace fica em `api0.mitraecp.com:1005`, a API de dados em `api0.mitraecp.com:1004`.
