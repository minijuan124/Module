const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
// Recursively search for index files under dist (handles nested layouts like dist/module/browser)
let files = [];
const rootCandidates = ['index.html', 'index.csr.html', 'index.ssr.html'];
const newBase = '/Module/';

function walk(dir) {
  try {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
      const full = path.join(dir, dirent.name);
      if (dirent.isDirectory()) return walk(full);
      if (rootCandidates.includes(dirent.name)) files.push(full);
    });
  } catch (e) {
    // ignore missing dirs
  }
}

walk(distDir);

files.forEach((filePath) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.match(/<base[^>]*href=["'][^"']*["'][^>]*>/i)) {
    content = content.replace(/<base[^>]*href=["'][^"']*["'][^>]*>/i, `<base href="${newBase}">`);
  } else {
    // insert base after opening <head> if missing
    content = content.replace(/<head(.*?)>/i, `<head$1>\n  <base href="${newBase}">`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated base href in ${filePath}`);
});

// Exit 0 even if nothing changed
process.exit(0);
