const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const src1 = path.join(dist, 'index.html');
const src2 = path.join(dist, 'index.csr.html');
const dest = path.join(dist, 'index.html');

// Prefer existing index.html if present, otherwise try index.csr.html
if (fs.existsSync(src1)) {
  console.log('index.html already exists in dist — nothing to do');
  process.exit(0);
}

if (fs.existsSync(src2)) {
  fs.copyFileSync(src2, dest);
  console.log('Copied index.csr.html -> index.html');
  process.exit(0);
}

console.error('No index.html or index.csr.html found in dist. Build may have output to a different folder.');
process.exitCode = 2;
