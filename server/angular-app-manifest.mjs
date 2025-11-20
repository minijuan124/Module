
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: './',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-K6VOXUPF.js",
      "chunk-4Z7O4L62.js",
      "chunk-63XCGYPO.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-52JDTHKE.js",
      "chunk-63XCGYPO.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-JKZBL5NB.js",
      "chunk-AYDDYCN2.js",
      "chunk-4Z7O4L62.js",
      "chunk-63XCGYPO.js"
    ],
    "route": "/admin/users"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-ADU2NHHN.js",
      "chunk-AYDDYCN2.js",
      "chunk-4Z7O4L62.js",
      "chunk-63XCGYPO.js"
    ],
    "route": "/admin/users/new"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-ADU2NHHN.js",
      "chunk-AYDDYCN2.js",
      "chunk-4Z7O4L62.js",
      "chunk-63XCGYPO.js"
    ],
    "route": "/admin/users/*/edit"
  },
  {
    "renderMode": 0,
    "redirectTo": "/login",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 23663, hash: '5a0cd2c3c4bfa70f91aeae2fe26f305302d4aa2eb4f8af7d4ef49c6643ebf7e8', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17237, hash: '160121285c5baea0a518541c63ab880112e6f6f287cabfe65c8e3a178178b0c5', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-36AW6TKX.css': {size: 6979, hash: 'vY6tjD/ce7M', text: () => import('./assets-chunks/styles-36AW6TKX_css.mjs').then(m => m.default)}
  },
};
