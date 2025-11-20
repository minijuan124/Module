
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
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
      "chunk-UC3GTTA5.js",
      "chunk-4Z7O4L62.js",
      "chunk-63XCGYPO.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-UHILIANP.js",
      "chunk-63XCGYPO.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-VEPM2HQM.js",
      "chunk-AYDDYCN2.js",
      "chunk-4Z7O4L62.js",
      "chunk-63XCGYPO.js"
    ],
    "route": "/admin/users"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-LXMSI36Z.js",
      "chunk-AYDDYCN2.js",
      "chunk-4Z7O4L62.js",
      "chunk-63XCGYPO.js"
    ],
    "route": "/admin/users/new"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-LXMSI36Z.js",
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
    'index.csr.html': {size: 23662, hash: 'b6497367e6f75523e58daf4ad1e1be6516e689dd2d87e101133f1681a10cf56b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17236, hash: 'b1f657ef435cfaf72ec3b9b4566881bb052d102ced6f917bf22ef05267cac14b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-36AW6TKX.css': {size: 6979, hash: 'vY6tjD/ce7M', text: () => import('./assets-chunks/styles-36AW6TKX_css.mjs').then(m => m.default)}
  },
};
