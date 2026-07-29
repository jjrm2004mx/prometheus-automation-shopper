/**
 * Prerender de las rutas públicas.
 *
 * Este script es la respuesta al problema #1 del sitio de referencia: una SPA
 * sirve un body vacío y el contenido solo existe después de ejecutar JS. Aquí
 * el build produce un HTML por ruta con el contenido ya dentro, y el cliente
 * hidrata encima.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const PORT = 4178;

const ROUTES = [
  '/',
  '/como-funciona',
  '/numeros',
  '/preguntas',
  '/sobre',
  '/lotes',
  '/calculadora',
  '/transferencia',
  '/antes-de-tu-cita',
  '/envio',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

function serve() {
  return createServer(async (req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let file = path.join(DIST, url);
    if (!existsSync(file) || url.endsWith('/')) file = path.join(DIST, 'index.html');
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  }).listen(PORT);
}

const server = serve();
// CHROMIUM_PATH permite usar un Chromium ya instalado (CI, contenedores).
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage();

let ok = 0;
for (const route of ROUTES) {
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#root > *', { timeout: 15000 });

  const html = await page.evaluate(() => {
    document.getElementById('root').setAttribute('data-prerendered', 'true');
    return '<!doctype html>\n' + document.documentElement.outerHTML;
  });

  const outDir = route === '/' ? DIST : path.join(DIST, route);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'index.html'), html, 'utf8');

  const textLength = await page.evaluate(() => document.body.innerText.trim().length);
  if (textLength < 200) {
    console.error(`  FALLO ${route}: solo ${textLength} caracteres de texto`);
  } else {
    ok++;
    console.log(`  ok ${route.padEnd(20)} ${textLength} caracteres`);
  }
}

await browser.close();
server.close();

console.log(`\nPrerender: ${ok}/${ROUTES.length} rutas con contenido.`);
if (ok < ROUTES.length) process.exit(1);
