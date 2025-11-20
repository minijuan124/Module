import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    /* Use Server (SSR-on-demand) instead of Prerender to avoid
       build-time prerendering of parameterized routes (e.g. /admin/users/:id/edit).
       If you need static prerendered pages for routes with params, define
       `getPrerenderParams` that returns the list of param values to generate. */
    renderMode: RenderMode.Server
  }
];
