import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { TenantProvider } from './lib/tenant';
import './index.css';

const root = document.getElementById('root')!;
const tree = (
  <React.StrictMode>
    <TenantProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TenantProvider>
  </React.StrictMode>
);

// Si el HTML llegó prerenderizado, se hidrata en vez de reemplazar el DOM:
// así el contenido indexable nunca parpadea.
if (root.dataset.prerendered === 'true') {
  ReactDOM.hydrateRoot(root, tree);
} else {
  ReactDOM.createRoot(root).render(tree);
}
