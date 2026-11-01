/* Standalone browser QA for the shared reference vault, no Vercel required. */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');

(async()=>{
 let server,browser;
 try{
  const {preview}=await import('vite');
  server=await preview({preview:{host:'127.0.0.1',port:4187,strictPort:true}});
  browser=await chromium.launch({
   headless:true,
   args:['--no-sandbox','--enable-unsafe-swiftshader','--disable-dev-shm-usage']
  });
  const page=await browser.newPage({viewport:{width:1280,height:800}});
  page.setDefaultTimeout(90000);
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4187/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>Boolean(window.__YAUTJA_APEX_HUNT__));
  await page.waitForFunction(()=>document.querySelectorAll('#media-coverage-grid .media-coverage-card').length===29);
  const initial=await page.evaluate(()=>({
   title:document.title,
   media:document.querySelectorAll('#media-coverage-grid .media-coverage-card').length,
   technology:document.querySelectorAll('#technology-catalog-grid .content-catalog-card').length,
   archive:document.querySelectorAll('#codex-grid .codex-shared-reference').length,
   shared:document.querySelectorAll('#media-coverage-grid .reference-shared-id').length,
   total:document.querySelector('[data-content-total]')?.textContent
  }));
  assert.equal(initial.media,29);assert.equal(initial.shared,29);
  assert.equal(initial.technology,48);
  assert.equal(initial.archive,40);
  assert.equal(initial.total,'188');
  await page.evaluate(()=>{
   const input=document.getElementById('reference-vault-search');
   input.value='film_predator_1987';input.dispatchEvent(new Event('input',{bubbles:true}));
  });
  const narrowed=await page.evaluate(()=>({
   media:document.querySelectorAll('#media-coverage-grid .media-coverage-card').length,
   technology:document.querySelectorAll('#technology-catalog-grid .content-catalog-card').length
  }));
  assert.deepEqual(narrowed,{media:1,technology:0});
  await page.evaluate(()=>{
   document.getElementById('reference-vault-search').value='';
   document.getElementById('reference-vault-search').dispatchEvent(new Event('input',{bubbles:true}));
   const check=document.getElementById('codex-archives-only');
   check.checked=true;check.dispatchEvent(new Event('change',{bubbles:true}));
   const tier=document.getElementById('codex-source-filter');
   tier.value='RESEARCH';tier.dispatchEvent(new Event('change',{bubbles:true}));
  });
  const archival=await page.evaluate(()=>({
   cards:document.querySelectorAll('#codex-grid .codex-card').length,
   referenceBadges:document.querySelectorAll('#codex-grid .codex-shared-reference').length,
   count:document.getElementById('codex-filter-count')?.textContent
  }));
  assert.equal(archival.cards,20);assert.equal(archival.referenceBadges,20);
  assert.match(archival.count,/^20 \/ /);
  assert.deepEqual(errors,[],'Browser JS errors: '+errors.join('; '));
  console.log(JSON.stringify({status:'PASS',initial,narrowed,archival},null,2));
 }catch(error){console.error('[Apex Alien_base browser smoke] FAIL:',error);process.exitCode=1;}
 finally{
  await browser?.close().catch(()=>{});
  if(server?.httpServer)await new Promise(resolve=>server.httpServer.close(resolve));
 }
})();
