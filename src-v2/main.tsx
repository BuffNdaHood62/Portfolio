import React from 'react';
import { createRoot } from 'react-dom/client';
import { LazyMotion, domAnimation } from 'framer-motion';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* `m.*` + domAnimation instead of `motion.*`, which pulls the full domMax
        feature set. The app uses only initial/animate/whileInView and springs —
        no layout or drag — so domAnimation is sufficient. `strict` throws in
        dev if a `motion.*` component is ever reintroduced, so the smaller
        bundle cannot silently regress. */}
    <LazyMotion features={domAnimation} strict>
      <App />
    </LazyMotion>
  </React.StrictMode>,
);
