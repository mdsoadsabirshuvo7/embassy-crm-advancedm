import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ModuleProvider } from './contexts/ModuleContext'
import { I18nProvider } from './contexts/I18nContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'

// Initialize offline storage
import { offlineStorage } from './utils/offlineStorage'
offlineStorage.init().then(() => {
  offlineStorage.setupAutoSync();
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <AuthProvider>
        <DataProvider>
          <ModuleProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </ModuleProvider>
        </DataProvider>
      </AuthProvider>
    </I18nProvider>
  </React.StrictMode>,
)