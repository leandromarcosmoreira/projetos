require('dotenv').config();
const sdk = require('mitra-sdk');

const PROJECT_ID = 19983;

async function tryCall(name, fn) {
  try {
    const result = await fn();
    console.log(`=== ${name} ===`);
    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (err) {
    console.log(`=== ${name} === ERRO: ${err.response?.status || err.message}`);
    return null;
  }
}

async function main() {
  sdk.configureSdkMitra({
    baseURL: process.env.MITRA_BASE_URL,
    token: process.env.MITRA_TOKEN
  });

  await tryCall('Project Context', () => sdk.getProjectContextMitra({ projectId: PROJECT_ID }));
  await tryCall('Online Tables', () => sdk.listOnlineTablesMitra({ projectId: PROJECT_ID }));
  await tryCall('Tables (query)', () => sdk.runQueryMitra({ projectId: PROJECT_ID, query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name" }));
  await tryCall('Server Functions', () => sdk.listServerFunctionsMitra({ projectId: PROJECT_ID }));
  await tryCall('DB Actions', () => sdk.listDbActionsMitra({ projectId: PROJECT_ID }));
  await tryCall('Data Loaders', () => sdk.listDataLoadersMitra({ projectId: PROJECT_ID }));
  await tryCall('Variáveis', () => sdk.listVariablesMitra({ projectId: PROJECT_ID }));
  await tryCall('Integrações', () => sdk.listIntegrationsMitra({ projectId: PROJECT_ID }));
  await tryCall('JDBC Connections', () => sdk.listJdbcConnectionsMitra({ projectId: PROJECT_ID }));
  await tryCall('Arquivos', () => sdk.listProjectFilesMitra({ projectId: PROJECT_ID }));
  await tryCall('Usuários', () => sdk.listProjectUsersMitra({ projectId: PROJECT_ID }));
}

main();
