require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const sdk = require('mitra-sdk');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = parseInt(process.env.MITRA_PROJECT_ID) || 19983;
const BACKUP_DIR = path.join(__dirname, 'backup', new Date().toISOString().slice(0, 10));

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function saveJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  -> ${filePath}`);
}

async function backupProjectContext() {
  console.log('\n[1/6] Contexto do projeto...');
  const ctx = await sdk.getProjectContextMitra({ projectId: PROJECT_ID });
  saveJson(path.join(BACKUP_DIR, 'projeto', 'context.json'), ctx.result);
  return ctx.result;
}

async function backupTableData(tables) {
  console.log('\n[2/6] Dados das tabelas...');
  const tablesDir = path.join(BACKUP_DIR, 'tabelas');

  for (const table of tables) {
    const tableName = table.name;
    console.log(`  Tabela: ${tableName}`);

    // Salva schema
    saveJson(path.join(tablesDir, tableName, 'schema.json'), table);

    // Exporta dados paginados
    let allRows = [];
    let offset = 0;
    const limit = 500;

    while (true) {
      try {
        const result = await sdk.runQueryMitra({
          projectId: PROJECT_ID,
          sql: `SELECT * FROM ${tableName} LIMIT ${limit} OFFSET ${offset}`
        });

        const rows = result.result?.rows || [];
        if (rows.length === 0) break;

        allRows = allRows.concat(rows);
        offset += limit;

        if (rows.length < limit) break;
      } catch (err) {
        const msg = typeof err.message === 'object' ? JSON.stringify(err.message) : err.message;
        console.log(`    ERRO ao ler dados: ${msg}`);
        break;
      }
    }

    saveJson(path.join(tablesDir, tableName, 'data.json'), allRows);
    console.log(`    ${allRows.length} registros`);
  }
}

async function backupServerFunctions(serverFunctions) {
  console.log('\n[3/6] Server Functions...');
  const fnDir = path.join(BACKUP_DIR, 'server-functions');

  // Filtra apenas as reais (ignora _temp_count_)
  const realFunctions = serverFunctions.filter(f => !f.name.startsWith('_temp_count_'));
  console.log(`  ${realFunctions.length} functions (${serverFunctions.length - realFunctions.length} temporarias ignoradas)`);

  for (const fn of realFunctions) {
    try {
      const detail = await sdk.readServerFunctionMitra({
        projectId: PROJECT_ID,
        serverFunctionId: fn.id
      });
      saveJson(path.join(fnDir, `${fn.name}.json`), detail.result || detail);
    } catch (err) {
      console.log(`    ERRO ${fn.name}: ${err.message}`);
      // Salva pelo menos os metadados
      saveJson(path.join(fnDir, `${fn.name}.json`), fn);
    }
  }
}

async function backupVariables(variables) {
  console.log('\n[4/6] Variáveis...');
  // Mascara tokens sensíveis no backup
  const safeVars = variables.map(v => ({
    ...v,
    value: v.key.includes('TOKEN') ? '***MASKED***' : v.value
  }));
  saveJson(path.join(BACKUP_DIR, 'variaveis', 'variables.json'), safeVars);
  // Salva versão completa separada (com tokens)
  saveJson(path.join(BACKUP_DIR, 'variaveis', 'variables-full.json'), variables);
}

async function backupIntegrations() {
  console.log('\n[5/6] Integrações...');
  try {
    sdk.configureSdkMitra({
      baseURL: process.env.MITRA_BASE_URL,
      token: process.env.MITRA_TOKEN,
      integrationURL: process.env.MITRA_INTEGRATION_URL
    });
    const integrations = await sdk.listIntegrationsMitra({ projectId: PROJECT_ID });
    saveJson(path.join(BACKUP_DIR, 'integracoes', 'integrations.json'), integrations.result || integrations);
  } catch (err) {
    console.log(`  ERRO: ${err.message}`);
  }
}

async function backupFiles() {
  console.log('\n[6/6] Arquivos do projeto...');
  try {
    const files = await sdk.listProjectFilesMitra({ projectId: PROJECT_ID });
    saveJson(path.join(BACKUP_DIR, 'arquivos', 'files.json'), files.result || files);
  } catch (err) {
    console.log(`  ERRO: ${err.message}`);
  }
}

async function main() {
  console.log('=== BACKUP Security4iT-Gestão de Tickets ===');
  console.log(`Destino: ${BACKUP_DIR}`);
  console.log(`Data: ${new Date().toISOString()}\n`);

  sdk.configureSdkMitra({
    baseURL: process.env.MITRA_BASE_URL,
    token: process.env.MITRA_TOKEN,
    integrationURL: process.env.MITRA_INTEGRATION_URL
  });

  const startTime = Date.now();

  // 1. Contexto do projeto (inclui schema das tabelas, lista de functions, variaveis)
  const context = await backupProjectContext();

  // 2. Dados das tabelas
  await backupTableData(context.inventory.tables);

  // 3. Server Functions (código fonte completo)
  await backupServerFunctions(context.inventory.serverFunctions);

  // 4. Variáveis
  await backupVariables(context.inventory.variables);

  // 5. Integrações
  await backupIntegrations();

  // 6. Arquivos
  await backupFiles();

  // Resumo
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== BACKUP COMPLETO em ${elapsed}s ===`);
  console.log(`Diretório: ${BACKUP_DIR}`);

  // Salva manifesto
  saveJson(path.join(BACKUP_DIR, 'manifest.json'), {
    projectId: PROJECT_ID,
    projectName: context.project.name,
    backupDate: new Date().toISOString(),
    tables: context.inventory.tables.map(t => t.name),
    serverFunctions: context.inventory.serverFunctions.filter(f => !f.name.startsWith('_temp_')).length,
    variables: context.inventory.variables.length,
    elapsedSeconds: parseFloat(elapsed)
  });
}

main().catch(err => {
  console.error('ERRO FATAL:', err.message);
  if (err.response) console.error('Status:', err.response.status, err.response.data);
  process.exit(1);
});
