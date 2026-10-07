// Builds a static HTML export of the site that opens directly from a folder
// (file://) in any browser — no server required.
//
// Usage:  node scripts/static-export.mjs   → writes ./out/
//
// What it does:
//  1. Temporarily moves app/api aside (API routes can't be statically exported).
//  2. Runs `next build` with STATIC_EXPORT=1 (see next.config.mjs).
//  3. Restores app/api.
//  4. Post-processes ./out so it works from file://
//     - strips the Next.js client runtime (it can't hydrate under file://)
//     - rewrites absolute /paths to relative ones per page depth
//     - fixes font URLs inside the CSS
//     - injects a small vanilla script for reveal animations, counters,
//       FAQ accordion and the mobile menu.

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'out');
const API_DIR = path.join(ROOT, 'app', 'api');
const API_BACKUP = path.join(ROOT, '_api_backup'); // same drive → rename works

// ---------- 1–3. build ----------
if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });

const hadApi = fs.existsSync(API_DIR);
if (hadApi) fs.renameSync(API_DIR, API_BACKUP);
try {
  execSync('npm run build', { stdio: 'inherit', env: { ...process.env, STATIC_EXPORT: '1' } });
} finally {
  if (hadApi) fs.renameSync(API_BACKUP, API_DIR);
}

// ---------- 4. post-process ----------
const walk = (dir, ext, acc = []) => {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, ext, acc);
    else if (p.endsWith(ext)) acc.push(p);
  }
  return acc;
};

const HELPER = `
<script>
(function(){
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'-50px'});
    els.forEach(function(el){io.observe(el);});
  } else { els.forEach(function(el){el.classList.add('in');}); }
  document.querySelectorAll('.counter').forEach(function(el){var t=+el.getAttribute('data-target')||0;el.textContent=t.toLocaleString();});
  setTimeout(function(){document.querySelectorAll('.bar-fill').forEach(function(el,i){setTimeout(function(){el.style.width=(el.getAttribute('data-width')||0)+'%';},i*150);});},400);
  document.querySelectorAll('.faq-btn').forEach(function(btn){btn.addEventListener('click',function(){var item=btn.closest('.faq-item');var was=item.classList.contains('open');document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');});if(!was)item.classList.add('open');});});
  var mb=document.querySelector('button[aria-label="Toggle menu"]'),mm=document.querySelector('.mobile-menu');
  if(mb&&mm){mb.addEventListener('click',function(){mm.classList.toggle('open');});}
  var note='This is a static preview. Live chat and the quote form need the running website.';
  document.querySelectorAll('button').forEach(function(b){if(/chat with us/i.test(b.textContent)||b.getAttribute('aria-label')==='Chat with us'){b.addEventListener('click',function(){alert(note);});}});
  document.querySelectorAll('form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();alert(note);});});
})();
</script>`;

for (const file of walk(OUT, '.html')) {
  const rel = path.relative(path.dirname(file), OUT).split(path.sep).join('/') || '.';
  let html = fs.readFileSync(file, 'utf8');

  // Strip the Next.js client runtime (script tags + inline RSC payload + preloads)
  html = html.replace(/<script[^>]*src="\/_next\/[^"]*"[^>]*><\/script>/g, '');
  html = html.replace(/<script>[^<]*__next_f[\s\S]*?<\/script>/g, '');
  html = html.replace(/<link[^>]*as="script"[^>]*>/g, '');
  html = html.replace(/<link[^>]*rel="modulepreload"[^>]*>/g, '');

  // Relative asset + link paths (order matters: _next first)
  html = html.replace(/href="\/_next\//g, `href="${rel}/_next/`);
  html = html.replace(/src="\/(?!\/)/g, `src="${rel}/`);
  html = html.replace(/href="\/"/g, `href="${rel}/index.html"`);
  html = html.replace(/href="\/([^"#?:]+?)\/?"/g, (m, p) => {
    const last = p.split('/').pop();
    return last.includes('.') ? `href="${rel}/${p}"` : `href="${rel}/${p}/index.html"`;
  });

  html = html.replace('</body>', HELPER + '\n</body>');
  fs.writeFileSync(file, html);
}

// Fonts referenced from inside the CSS bundle
for (const css of walk(path.join(OUT, '_next'), '.css')) {
  let text = fs.readFileSync(css, 'utf8');
  text = text.replace(/\/_next\/static\/media\//g, '../media/');
  fs.writeFileSync(css, text);
}

const pages = walk(OUT, '.html').length;
console.log(`\nStatic export ready → ${OUT}  (${pages} HTML pages). Open out/index.html in a browser.`);
