require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const WORKSPACE_ID = process.env.MITRA_WORKSPACE_ID || 2724;
const PROJECT_ID = process.env.MITRA_PROJECT_ID || 19983;
const USER_DATA_DIR = path.join(__dirname, '..', '.mitra-browser-data');
const OUTPUT_DIR = path.join(__dirname, 'backup-interface', new Date().toISOString().slice(0, 10));

const CODER_BASE = 'https://coder.mitralab.io';
const CODER_PROJECT = `${CODER_BASE}/w/${WORKSPACE_ID}/p/${PROJECT_ID}`;
const BUILD_BASE = `https://${WORKSPACE_ID}-${PROJECT_ID}.build.mitralab.io`;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function captureScreen(page, name, outputDir) {
  const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeDir = path.join(outputDir, safeName);
  ensureDir(safeDir);
  await page.screenshot({ path: path.join(safeDir, 'screenshot.png'), fullPage: true });
  const html = await page.content();
  fs.writeFileSync(path.join(safeDir, 'page.html'), html);
  fs.writeFileSync(path.join(safeDir, 'url.txt'), page.url());
  console.log(`  -> ${safeName}/`);
}

async function main() {
  console.log('=== BACKUP INTERFACE Security4iT ===');
  console.log(`Output: ${OUTPUT_DIR}\n`);
  ensureDir(OUTPUT_DIR);

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: USER_DATA_DIR,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--window-size=1920,1080']
  });

  const page = await browser.newPage();

  // ===== FASE 1: CODER - Login =====
  console.log('[1] Acessando Mitra Coder...');
  await page.goto(CODER_PROJECT, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  const isLogin = await page.evaluate(() => window.location.href.includes('/login'));
  if (isLogin) {
    console.log('  Tela de login. Clicando "Continue com Google"...');
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button, a, div')].find(b => b.textContent?.includes('Google'));
      if (btn) btn.click();
    });
    const start = Date.now();
    while (Date.now() - start < 120000) {
      await new Promise(r => setTimeout(r, 2000));
      const still = await page.evaluate(() => window.location.href.includes('/login')).catch(() => true);
      if (!still) { console.log('  Login concluído!'); await new Promise(r => setTimeout(r, 5000)); break; }
    }
    if (!page.url().includes(`/p/${PROJECT_ID}`)) {
      await page.goto(CODER_PROJECT, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 5000));
    }
  } else {
    console.log('  Já autenticado!');
  }

  await new Promise(r => setTimeout(r, 5000));

  // ===== FASE 2: Captura tela principal do Coder =====
  console.log('\n[2] Capturando tela principal...');
  await captureScreen(page, '00_coder_main', OUTPUT_DIR);

  // ===== FASE 3: Clica nos ícones da sidebar esquerda por coordenadas =====
  // A sidebar tem ícones em coluna vertical (x=20), cada ~30px de distância
  console.log('\n[3] Navegando sidebar do Coder...');

  // Primeiro, descobre os ícones clicáveis da sidebar
  const sidebarElements = await page.evaluate(() => {
    const items = [];
    // Busca TODOS os elementos clicáveis à esquerda (x < 45)
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.left >= 0 && rect.left < 45 && rect.width > 15 && rect.width < 50 &&
          rect.height > 15 && rect.height < 50 && rect.top > 40 && rect.top < 500) {
        // Verifica se é elemento leaf (sem filhos grandes)
        const hasLargeChild = [...el.children].some(c => {
          const cr = c.getBoundingClientRect();
          return cr.width > 15 && cr.height > 15;
        });
        if (!hasLargeChild || el.children.length === 0) {
          const tooltip = el.getAttribute('title') || el.getAttribute('aria-label') ||
                         el.getAttribute('data-tooltip') || '';
          items.push({
            x: Math.round(rect.left + rect.width / 2),
            y: Math.round(rect.top + rect.height / 2),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
            tag: el.tagName,
            tooltip,
            classes: (el.className || '').toString().slice(0, 60),
          });
        }
      }
    }
    // Deduplica por posição Y (agrupa a cada 15px)
    const seen = new Set();
    return items.filter(item => {
      const key = Math.round(item.y / 15) * 15;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a, b) => a.y - b.y);
  });

  console.log(`  ${sidebarElements.length} elementos de sidebar encontrados:`);
  for (const el of sidebarElements) {
    console.log(`    (${el.x}, ${el.y}) ${el.w}x${el.h} <${el.tag}> ${el.tooltip || el.classes.slice(0, 30)}`);
  }

  const sidebarNames = [
    'tela_preview', 'telas_editor', 'tabelas', 'conexoes', 'usuarios',
    'funcoes_servidor', 'arquivos', 'configuracoes'
  ];

  for (let i = 0; i < sidebarElements.length && i < sidebarNames.length; i++) {
    const el = sidebarElements[i];
    const name = sidebarNames[i] || `sidebar_${i}`;
    console.log(`  Clicando ícone #${i + 1} "${name}" (${el.x}, ${el.y})`);
    try {
      await page.mouse.click(el.x, el.y);
      await new Promise(r => setTimeout(r, 3000));

      // Verifica se a URL mudou ou o conteúdo mudou
      const currentUrl = page.url();
      await captureScreen(page, `coder_${String(i + 1).padStart(2, '0')}_${name}`, OUTPUT_DIR);
    } catch (e) {
      console.log(`    ERRO: ${e.message}`);
    }
  }

  // ===== FASE 4: Captura o Build app via iframe autenticado =====
  console.log('\n[4] Capturando Build app...');

  // Volta ao code-builder que tem o iframe
  await page.goto(CODER_PROJECT, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));

  // Encontra o iframe do Build app
  const iframeSrc = await page.evaluate(() => {
    const iframe = document.querySelector('iframe');
    return iframe ? iframe.src : null;
  });

  if (iframeSrc) {
    console.log(`  Iframe encontrado: ${iframeSrc.slice(0, 80)}`);

    // Acessa o iframe diretamente - vai usar a sessão do Coder
    const buildPage = await browser.newPage();
    await buildPage.setViewport({ width: 1920, height: 1080 });

    // Navega para o Build app diretamente
    await buildPage.goto(iframeSrc, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    // Verifica se está na tela de login
    const buildIsLogin = await buildPage.evaluate(() => {
      const text = document.body?.innerText || '';
      return text.includes('Continue com Google') || text.includes('Entrar com E-mail') ||
             window.location.href.includes('/login');
    });

    if (buildIsLogin) {
      console.log('  Build app requer login. Tentando via E-mail...');

      // Clica "Entrar com E-mail"
      await buildPage.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('E-mail'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 3000));

      // Captura o estado após clicar E-mail
      const afterEmailClick = await buildPage.evaluate(() => ({
        url: window.location.href,
        bodyText: document.body?.innerText?.slice(0, 300) || '',
        inputs: [...document.querySelectorAll('input')].map(i => ({ type: i.type, name: i.name, placeholder: i.placeholder })),
      }));
      console.log(`  Após clicar E-mail: ${afterEmailClick.inputs.length} inputs`);
      console.log(`  URL: ${afterEmailClick.url}`);
      console.log(`  Inputs: ${JSON.stringify(afterEmailClick.inputs)}`);

      if (afterEmailClick.inputs.length > 0) {
        // Preenche os campos
        for (const input of afterEmailClick.inputs) {
          if (input.type === 'email' || input.type === 'text' || input.name?.includes('email') || input.placeholder?.toLowerCase().includes('email')) {
            await buildPage.type(`input[type="${input.type}"]`, 'leandro.moreira@neuonconsultoria.com');
          } else if (input.type === 'password' || input.name?.includes('password') || input.placeholder?.toLowerCase().includes('senha')) {
            await buildPage.type('input[type="password"]', 'Leandro@2025');
          }
        }
        await new Promise(r => setTimeout(r, 500));

        // Submit
        await buildPage.evaluate(() => {
          const btn = [...document.querySelectorAll('button')].find(b =>
            b.textContent?.includes('Login') || b.textContent?.includes('Entrar') || b.type === 'submit'
          );
          if (btn) btn.click();
        });

        console.log('  Credenciais submetidas. Aguardando...');
        await new Promise(r => setTimeout(r, 8000));
      }

      // Captura o resultado
      await captureScreen(buildPage, 'build_after_login', OUTPUT_DIR);

      const buildState = await buildPage.evaluate(() => ({
        url: window.location.href,
        bodyTextLen: (document.body?.innerText || '').length,
        bodyPreview: (document.body?.innerText || '').slice(0, 200),
      }));
      console.log(`  Build state: ${buildState.url}`);
      console.log(`  Body: ${buildState.bodyTextLen} chars`);
      console.log(`  Preview: ${buildState.bodyPreview.slice(0, 100)}`);
    }

    // Se logou com sucesso, navega as telas
    const buildLoggedIn = !await buildPage.evaluate(() =>
      window.location.href.includes('/login') ||
      (document.body?.innerText || '').includes('Continue com Google')
    );

    if (buildLoggedIn) {
      console.log('\n  Build app autenticado! Capturando telas...');
      await captureScreen(buildPage, 'build_00_main', OUTPUT_DIR);

      // Descobre navegação
      const nav = await buildPage.evaluate(() => {
        const items = [];
        document.querySelectorAll('a[href], button, [role="tab"], [role="menuitem"]').forEach(el => {
          const text = el.textContent?.trim();
          const href = el.getAttribute('href');
          if (text && text.length > 1 && text.length < 80) {
            items.push({ text, href, tag: el.tagName });
          }
        });
        // Sidebar items
        document.querySelectorAll('[class*="sidebar"] *, [class*="Sidebar"] *, [class*="menu"] *').forEach(el => {
          const text = el.textContent?.trim();
          if (text && text.length > 1 && text.length < 60 && !items.some(i => i.text === text)) {
            items.push({ text, href: el.getAttribute('href'), tag: el.tagName, type: 'sidebar' });
          }
        });
        const seen = new Set();
        return items.filter(l => { if (seen.has(l.text)) return false; seen.add(l.text); return true; });
      });

      fs.writeFileSync(path.join(OUTPUT_DIR, 'build_navigation.json'), JSON.stringify(nav, null, 2));
      console.log(`  ${nav.length} itens de navegação`);

      // Navega links internos
      let buildIdx = 1;
      for (const item of nav) {
        if (!item.href || item.href === '#' || item.href.startsWith('javascript:')) continue;
        const fullUrl = item.href.startsWith('http') ? item.href : new URL(item.href, buildPage.url()).href;
        if (!fullUrl.includes('build.mitralab.io')) continue;

        console.log(`  -> "${item.text}"`);
        try {
          await buildPage.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 20000 });
          await new Promise(r => setTimeout(r, 3000));
          await captureScreen(buildPage, `build_${String(buildIdx).padStart(2, '0')}_${item.text.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)}`, OUTPUT_DIR);
          buildIdx++;
        } catch (e) {
          console.log(`    ERRO: ${e.message}`);
        }
      }

      // Clica em botões/tabs
      const clickableNav = nav.filter(n => !n.href && !['Continue com Google', 'Continue com Microsoft', 'Entrar com E-mail'].includes(n.text));
      for (const item of clickableNav) {
        console.log(`  Clicando: "${item.text}"`);
        try {
          await buildPage.evaluate((text) => {
            const els = [...document.querySelectorAll('button, [role="tab"], [class*="sidebar"] *, [class*="menu"] *')];
            const el = els.find(e => e.textContent?.trim() === text);
            if (el) el.click();
          }, item.text);
          await new Promise(r => setTimeout(r, 3000));
          await captureScreen(buildPage, `build_click_${item.text.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)}`, OUTPUT_DIR);
        } catch (e) {
          console.log(`    ERRO: ${e.message}`);
        }
      }
    } else {
      console.log('  Build app não autenticou. Capturando tela de login.');
      await captureScreen(buildPage, 'build_login', OUTPUT_DIR);
    }

    await buildPage.close();
  }

  // ===== FASE 5: Intercepta API do Coder =====
  console.log('\n[5] Interceptando API do Coder...');
  const apiData = [];
  const listener = async (response) => {
    const url = response.url();
    if (response.status() === 200 && (url.includes('/api/') || url.includes('mitraecp'))) {
      try {
        const ct = response.headers()['content-type'] || '';
        if (ct.includes('json')) {
          const body = await response.json().catch(() => null);
          if (body) apiData.push({ url, body: JSON.stringify(body).slice(0, 2000) });
        }
      } catch (e) {}
    }
  };
  page.on('response', listener);
  await page.goto(CODER_PROJECT, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 10000));
  page.off('response', listener);

  if (apiData.length > 0) {
    fs.writeFileSync(path.join(OUTPUT_DIR, 'coder_api_data.json'), JSON.stringify(apiData, null, 2));
    console.log(`  ${apiData.length} API responses`);
  }

  // Manifesto final
  const allDirs = fs.readdirSync(OUTPUT_DIR).filter(f =>
    fs.statSync(path.join(OUTPUT_DIR, f)).isDirectory()
  );
  fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify({
    projectId: PROJECT_ID,
    workspaceId: WORKSPACE_ID,
    coderUrl: CODER_PROJECT,
    buildUrl: BUILD_BASE,
    backupDate: new Date().toISOString(),
    screensCapturadas: allDirs.length,
    screens: allDirs,
  }, null, 2));

  console.log(`\n=== BACKUP INTERFACE COMPLETO ===`);
  console.log(`Telas capturadas: ${allDirs.length}`);
  console.log(`Diretório: ${OUTPUT_DIR}`);

  await browser.close();
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
