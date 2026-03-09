require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const AUTH_URL = process.env.MITRA_AUTH_URL || 'https://coder.mitralab.io/sdk-auth/';
const PROJECT_ID = process.env.MITRA_PROJECT_ID || 19983;
const ENV_PATH = path.join(__dirname, '.env');
const COOKIES_PATH = path.join(__dirname, '.mitra-cookies.json');

async function authenticate() {
  console.log('Abrindo browser para autenticação Mitra...\n');

  // Carrega cookies salvos (se existirem) para tentar login automático
  const hasSavedCookies = fs.existsSync(COOKIES_PATH);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 500, height: 700 },
    args: ['--window-size=500,700']
  });

  const page = await browser.newPage();

  // Restaura cookies de sessão do Google (se existirem)
  if (hasSavedCookies) {
    try {
      const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
      await page.setCookie(...cookies);
      console.log('Cookies de sessão anteriores restaurados.');
      console.log('Se o Google já estiver logado, a autenticação será automática.\n');
    } catch (e) {
      // ignora cookies inválidos
    }
  }

  // Monta a URL de auth com redirect mode
  // Usamos uma página local fictícia como returnTo para capturar o token na URL
  const returnTo = 'https://localhost:19983/auth-callback';
  const authUrl = `${AUTH_URL}?method=google&projectId=${PROJECT_ID}&returnTo=${encodeURIComponent(returnTo)}`;

  console.log(`Navegando para: ${authUrl}\n`);
  console.log('Faça login com sua conta Google...');
  console.log('(O browser fechará automaticamente após o login)\n');

  // Intercepta o redirect final que contém o token
  let tokenData = null;

  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('tokenMitra=') || url.includes('auth-callback')) {
      try {
        const parsed = new URL(url);
        const token = parsed.searchParams.get('tokenMitra');
        const baseURL = parsed.searchParams.get('backURLMitra');
        const integrationURL = parsed.searchParams.get('integrationURLMitra');

        if (token && token !== 'error') {
          tokenData = { token, baseURL, integrationURL };
        }
      } catch (e) {
        // ignora URLs inválidas
      }
    }
  });

  await page.goto(authUrl, { waitUntil: 'networkidle2' });

  // Espera até capturar o token (timeout 120s)
  const startTime = Date.now();
  while (!tokenData && Date.now() - startTime < 120000) {
    await new Promise(r => setTimeout(r, 500));
  }

  if (!tokenData) {
    // Tenta capturar da URL final da página
    const currentUrl = page.url();
    try {
      const parsed = new URL(currentUrl);
      const token = parsed.searchParams.get('tokenMitra');
      const baseURL = parsed.searchParams.get('backURLMitra');
      const integrationURL = parsed.searchParams.get('integrationURLMitra');
      if (token && token !== 'error') {
        tokenData = { token, baseURL, integrationURL };
      }
    } catch (e) {}
  }

  // Salva cookies para próxima vez (login automático)
  try {
    const cookies = await page.cookies();
    // Também pega cookies de accounts.google.com
    const allPages = await browser.pages();
    let allCookies = [...cookies];
    for (const p of allPages) {
      try {
        const c = await p.cookies();
        allCookies = allCookies.concat(c);
      } catch (e) {}
    }
    // Deduplica
    const unique = {};
    for (const c of allCookies) {
      unique[`${c.domain}:${c.name}`] = c;
    }
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(Object.values(unique), null, 2));
    console.log('Cookies de sessão salvos para próximo login automático.');
  } catch (e) {}

  await browser.close();

  if (!tokenData) {
    console.error('\nERRO: Não foi possível capturar o token. Tente novamente.');
    process.exit(1);
  }

  console.log('\nToken capturado com sucesso!');

  // Decodifica JWT para mostrar info
  const payload = JSON.parse(Buffer.from(tokenData.token.split('.')[1], 'base64').toString());
  console.log(`  Usuário: ${payload.sub}`);
  console.log(`  Expira em: ${new Date(payload.exp * 1000).toLocaleString()}`);

  // Atualiza o .env
  updateEnvFile(tokenData);

  return tokenData;
}

function updateEnvFile(tokenData) {
  let envContent = fs.readFileSync(ENV_PATH, 'utf-8');

  // Atualiza MITRA_TOKEN
  envContent = envContent.replace(
    /^MITRA_TOKEN=.*/m,
    `MITRA_TOKEN=${tokenData.token}`
  );

  // Atualiza MITRA_BASE_URL se veio
  if (tokenData.baseURL) {
    envContent = envContent.replace(
      /^MITRA_BASE_URL=.*/m,
      `MITRA_BASE_URL=${tokenData.baseURL}`
    );
  }

  // Atualiza MITRA_INTEGRATION_URL se veio
  if (tokenData.integrationURL) {
    envContent = envContent.replace(
      /^MITRA_INTEGRATION_URL=.*/m,
      `MITRA_INTEGRATION_URL=${tokenData.integrationURL}`
    );
  }

  fs.writeFileSync(ENV_PATH, envContent);
  console.log('\n.env atualizado com novo token!');
}

// Se executado diretamente, autentica e sai
// Se importado, exporta a função
if (require.main === module) {
  authenticate().then(data => {
    console.log('\nPronto! Execute seus scripts normalmente.');
  });
} else {
  module.exports = { authenticate };
}
