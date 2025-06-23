import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { InertiaProgress } from '@inertiajs/progress';

createInertiaApp({
  resolve: name => resolvePageComponent(
    `./pages/${name}.jsx`,
    import.meta.glob('./pages/**/*.jsx')
  ),
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
});

InertiaProgress.init();
