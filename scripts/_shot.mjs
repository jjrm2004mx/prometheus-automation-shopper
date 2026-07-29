import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
const DIST=path.resolve('dist'), PORT=4179;
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
const s=createServer(async(req,res)=>{const u=decodeURIComponent((req.url??'/').split('?')[0]);
let f=path.join(DIST,u); if(!existsSync(f)||u.endsWith('/'))f=path.join(DIST,u,'index.html');
if(!existsSync(f))f=path.join(DIST,'index.html');
try{res.writeHead(200,{'Content-Type':MIME[path.extname(f)]??'application/octet-stream'});res.end(await readFile(f));}catch{res.writeHead(404).end();}}).listen(PORT);
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
const p=await b.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:2});
for (const [route,name] of [['/','home'],['/agendar','agendar'],['/calculadora','calculadora'],['/transferencia','transferencia']]) {
  await p.goto(`http://localhost:${PORT}${route}`,{waitUntil:'networkidle'});
  await p.waitForTimeout(800);
  await p.screenshot({path:`/tmp/psp/preview-${name}.png`, fullPage: route==='/'});
  console.log('shot', name);
}
await b.close(); s.close();
