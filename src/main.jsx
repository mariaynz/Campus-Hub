import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/tokens.css';
import './styles/base.css';
import { applyProfile, loadProfile } from './utils/profile.js';

// Antes de pintar: evita el parpadeo de tema al recargar
applyProfile(loadProfile());

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
