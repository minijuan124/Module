const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');

// Prefer the browser build index inside dist/module/browser if present
const preferredBrowserDir = path.join(dist, 'module', 'browser');
const preferredCandidates = [
  path.join(preferredBrowserDir, 'index.html'),
  path.join(preferredBrowserDir, 'index.csr.html'),
  path.join(preferredBrowserDir, 'index.ssr.html')
];

let found = null;
for (const p of preferredCandidates) {
  if (fs.existsSync(p)) { found = p; break; }
}

if (!found) {
  // fallback: search recursively and pick the first index found
  const candidates = ['index.html', 'index.csr.html', 'index.ssr.html'];
  function walk(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          walk(full);
          if (found) return;
        } else if (candidates.includes(e.name)) {
          found = full;
          return;
        }
      }
    } catch (e) {}
  }
  walk(dist);
}

if (!found) {
  console.error('No index.html or index.csr.html found in dist. Build may have output to a different folder.');
  process.exitCode = 2;
} else {
  const dest = path.join(dist, 'index.html');
  if (path.resolve(found) === path.resolve(dest)) {
    console.log('index.html already exists in dist — nothing to do');
    process.exit(0);
  }
  fs.copyFileSync(found, dest);
  // Also ensure the browser publish folder has an index.html so gh-pages publishes it
  try {
    if (fs.existsSync(preferredBrowserDir)) {
      const browserDest = path.join(preferredBrowserDir, 'index.html');
      fs.copyFileSync(found, browserDest);
      console.log(`Also copied ${found} -> ${browserDest}`);
    }
  } catch (e) {
    // ignore
  }
  console.log(`Copied ${found} -> ${dest}`);
  process.exit(0);
}
