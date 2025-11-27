const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');
const targets = [
  path.join(dist, 'index.html'),
  path.join(dist, 'index.csr.html'),
  path.join(dist, 'module', 'browser', 'index.html'),
  path.join(dist, 'module', 'browser', 'index.csr.html')
];

const injector = `\n<script>/* runtime asset path shim */(function(){try{var base='/Module/';function rewrite(){try{document.querySelectorAll('img[src^="/assets/"]').forEach(function(i){i.src=base+i.getAttribute('src').replace(/^\//,'');});document.querySelectorAll('source[src^="/assets/"]').forEach(function(i){i.src=base+i.getAttribute('src').replace(/^\//,'');});document.querySelectorAll('style').forEach(function(s){s.innerHTML=s.innerHTML.replace(/url\\(\\/assets\\/)/g,'url('+base+'assets/');});document.querySelectorAll('[style]').forEach(function(el){el.style.cssText=el.style.cssText.replace(/url\\(\\/assets\\/)/g,'url('+base+'assets/');});}catch(e){} } if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',rewrite);}else{rewrite();}}catch(e){} })();</script>\n`;

targets.forEach(file => {
  try {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    if (content.indexOf('runtime asset path shim') !== -1) return;
    // insert before closing </head>
    content = content.replace(/<\/head>/i, injector + '</head>');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Injected runtime asset shim into', file);
  } catch (err) {
    console.warn('Failed to inject shim into', file, err && err.message);
  }
});

// Also patch nested dist/module/browser/index.html if present (already included in targets)
