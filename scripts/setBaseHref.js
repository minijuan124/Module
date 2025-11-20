const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const files = ['index.html', 'index.csr.html', 'index.ssr.html'];
const newBase = '/Module/';

files.forEach((file) => {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace any existing <base ...> tag with the correct base
  content = content.replace(/<base[^>]*href=["'][^"']*["'][^>]*>/i, `<base href="${newBase}">`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated base href in ${file}`);
});

// Exit 0 even if nothing changed
process.exit(0);
