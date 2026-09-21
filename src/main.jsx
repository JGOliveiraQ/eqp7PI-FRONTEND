import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AcessibilidadeProvider } from './context/AcessibilidadeContext';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AcessibilidadeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AcessibilidadeProvider>
    </BrowserRouter>
  </StrictMode>
);
