import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { Layout } from "@/components/layout/Layout";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Dashboard } from "@/pages/Dashboard";
import { ClientsPage } from "@/pages/ClientsPage";
import AccountingPage from "@/pages/AccountingPage";
import HRPage from "@/pages/HRPage";
import SettingsPage from "@/pages/SettingsPage";
import InvoicesPage from "@/pages/InvoicesPage";
import ExpensesPage from "@/pages/ExpensesPage";
import TasksPage from "@/pages/TasksPage";
import DocumentsPage from "@/pages/DocumentsPage";
import ReportsPage from "@/pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <LoginForm />;
  }
  
  return <Layout>{children}</Layout>;
};

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
        <ProtectedRoute>
          <ClientsPage />
        </ProtectedRoute>
      } />
      <Route path="/accounting" element={
        <ProtectedRoute>
          <AccountingPage />
        </ProtectedRoute>
      } />
      <Route path="/invoices" element={
        <ProtectedRoute>
          <InvoicesPage />
        </ProtectedRoute>
      } />
      <Route path="/expenses" element={
        <ProtectedRoute>
          <ExpensesPage />
        </ProtectedRoute>
      } />
      <Route path="/hr" element={
        <ProtectedRoute>
          <HRPage />
        </ProtectedRoute>
      } />
      <Route path="/documents" element={
        <ProtectedRoute>
          <DocumentsPage />
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <TasksPage />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <ReportsPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
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
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;