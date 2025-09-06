import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import './index.css'
import { ModuleProvider } from './contexts/ModuleContext'
import { I18nProvider } from './contexts/I18nContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { TenantProvider } from './contexts/TenantContext'

// Initialize offline storage
import { offlineStorage } from './utils/offlineStorage'
offlineStorage.init().then(() => {
  offlineStorage.setupAutoSync();
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <AuthProvider>
        <TenantProvider>
          <QueryClientProvider client={queryClient}>
            <DataProvider>
              <ModuleProvider>
                <NotificationProvider>
                  <App />
                </NotificationProvider>
              </ModuleProvider>
            </DataProvider>
          </QueryClientProvider>
        </TenantProvider>
      </AuthProvider>
    </I18nProvider>
  </React.StrictMode>,
)

// Optional service worker registration (non-blocking)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {/* ignore */});
  });
}