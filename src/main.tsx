import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Chart.js defaults for consistent styling
import { Chart } from 'chart.js';
import { registerables } from 'chart.js';
Chart.register(...registerables);

Chart.defaults.color = 'rgba(255, 255, 255, 0.8)';
Chart.defaults.font.family = 'system-ui, sans-serif';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);