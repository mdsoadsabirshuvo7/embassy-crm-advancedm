import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useModules, ModuleName } from '@/contexts/ModuleContext';
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { Layout } from "@/components/layout/Layout";
// Using custom ErrorBoundary component
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import React, { Suspense, lazy } from 'react';
import AccessDenied from '@/components/AccessDenied';
// Route components (lazy loaded for code splitting)
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const ClientsPage = lazy(() => import('@/pages/ClientsPage').then(m => ({ default: m.ClientsPage })));
const AccountingPage = lazy(() => import('@/pages/AccountingPage'));
const HRPage = lazy(() => import('@/pages/HRPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const InvoicesPage = lazy(() => import('@/pages/InvoicesPage'));
const ExpensesPage = lazy(() => import('@/pages/ExpensesPage'));
const TasksPage = lazy(() => import('@/pages/TasksPage'));
const DocumentsPage = lazy(() => import('@/pages/DocumentsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdvancedFeaturePage = lazy(() => import('./pages/AdvancedFeaturePage'));

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  module?: string; // module id for gating
}

const ProtectedRoute = ({ children, requiredRoles, module }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { isModuleEnabled } = useModules();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) return <LoginForm />;

  if (requiredRoles && user.role && !requiredRoles.includes(user.role)) {
    return <Layout><AccessDenied reason="role" requiredRoles={requiredRoles} /></Layout>;
  }

  if (module && !isModuleEnabled(module as ModuleName)) {
    return <Layout><AccessDenied reason="module" moduleId={module} /></Layout>;
  }
  
  return <Layout>{children}</Layout>;
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute module="clients" requiredRoles={["SUPER_ADMIN","ADMIN","EMPLOYEE"]}>
          <ErrorBoundary label="Clients module error"><ClientsPage /></ErrorBoundary>
        </ProtectedRoute>
      } />
      <Route path="/accounting" element={
        <ProtectedRoute module="accounting" requiredRoles={["SUPER_ADMIN","ADMIN","ACCOUNTANT"]}>
          <ErrorBoundary label="Accounting module error"><AccountingPage /></ErrorBoundary>
        </ProtectedRoute>
      } />
      <Route path="/invoices" element={
        <ProtectedRoute module="invoices" requiredRoles={["SUPER_ADMIN","ADMIN","ACCOUNTANT"]}>
          <ErrorBoundary label="Invoices module error"><InvoicesPage /></ErrorBoundary>
        </ProtectedRoute>
      } />
      <Route path="/expenses" element={
        <ProtectedRoute module="expenses" requiredRoles={["SUPER_ADMIN","ADMIN","ACCOUNTANT"]}>
          <ErrorBoundary label="Expense module error"><ExpensesPage /></ErrorBoundary>
        </ProtectedRoute>
      } />
      <Route path="/hr" element={
        <ProtectedRoute module="hr" requiredRoles={["SUPER_ADMIN","ADMIN","HR_MANAGER"]}>
          <ErrorBoundary label="HR module error"><HRPage /></ErrorBoundary>
        </ProtectedRoute>
      } />
      <Route path="/documents" element={
        <ProtectedRoute module="documents" requiredRoles={["SUPER_ADMIN","ADMIN","ACCOUNTANT","HR_MANAGER"]}>
          <ErrorBoundary label="Documents module error"><DocumentsPage /></ErrorBoundary>
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute module="tasks" requiredRoles={["SUPER_ADMIN","ADMIN","HR_MANAGER","EMPLOYEE"]}>
          <ErrorBoundary label="Tasks module error"><TasksPage /></ErrorBoundary>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute module="reports" requiredRoles={["SUPER_ADMIN","ADMIN","ACCOUNTANT","HR_MANAGER"]}>
          <ErrorBoundary label="Reports module error"><ReportsPage /></ErrorBoundary>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={<Navigate to="/settings/general" replace />} />
      <Route path="/settings/:section" element={
        <ProtectedRoute module="dashboard" requiredRoles={["SUPER_ADMIN","ADMIN"]}>
          <SettingsPage />
        </ProtectedRoute>
      } />
      <Route path="/advanced/:feature" element={
        <ProtectedRoute requiredRoles={["SUPER_ADMIN","ADMIN"]}>
          <AdvancedFeaturePage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;