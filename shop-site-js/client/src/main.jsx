import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Vazirmatn is self-hosted (bundled by Vite), so the Persian typography renders
// correctly even on a demo machine with no internet connection.
import '@fontsource-variable/vazirmatn';

import App from './App.jsx';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
