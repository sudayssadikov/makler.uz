import fs from 'node:fs';
import path from 'node:path';

const files = [];
const walk = (dir) => {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(jsx|js)$/.test(f)) files.push(p);
  }
};
walk('src');

// 1. Routes ro'yxatini olish
const routesText = fs.readFileSync('src/app/routes.jsx', 'utf8');
const routes = new Set(['/', '/403']);
for (const m of routesText.matchAll(/path="([^"]+)"/g)) {
  const p = m[1];
  if (p !== '*' && p !== '/') routes.add('/' + p.replace(/^\//, ''));
  else if (p === '/') routes.add('/');
}
console.log('=== ROUTES ===');
console.log([...routes].sort().join('\n'));

// 2. Barcha navigatsiya manbalari (navigate(), to=, href=)
const navs = new Map();
for (const f of files) {
  if (f.includes('routes.jsx')) continue;
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/navigate\(\s*['"`]([^'"`?]+)|to=\{?["'`]([^"'`]+)|window\.location\.href\s*=\s*["'`]([^"'`]+)/g)) {
    const p = (m[1] || m[2] || m[3]).split('?')[0].replace(/\$\{[^}]*\}/g, '*');
    if (p.startsWith('/') && p.length > 1 && !navs.has(p)) navs.set(p, path.basename(f));
  }
}

console.log('\n=== NAV TARGETS ===');
for (const [p, f] of [...navs].sort()) {
  let ok = false;
  for (const r of routes) {
    const rp = r.replace(/:[^/]+/g, '*');
    if (rp === p || (p === '/' && r === '/')) { ok = true; break; }
    if (r.endsWith('*') && p.startsWith(r.slice(0, -1))) { ok = true; break; }
  }
  console.log((ok ? 'OK  ' : 'MISS') + '  ' + p + '    (' + f + ')');
}
