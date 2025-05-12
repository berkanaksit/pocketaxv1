import React from 'react';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExpenseCalculator from './pages/ExpenseCalculator';
import IncomeAnalyzer from './pages/IncomeAnalyzer';
import HelpCenter from './pages/HelpCenter';
import AccountSettings from './pages/AccountSettings';
import BankStatements from './pages/BankStatements';
import SubmissionSummary from './pages/SubmissionSummary';
import CreateAdmin from './pages/CreateAdmin'; 

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1,
});

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-admin" element={
            <ProtectedRoute requireAdmin={true}>
              <CreateAdmin />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="expense-calculator" element={<ExpenseCalculator />} />
            <Route path="income-analyzer" element={<IncomeAnalyzer />} />
            <Route path="help-center" element={<HelpCenter />} />
            <Route path="account-settings" element={<AccountSettings />} />
            <Route path="bank-statements" element={<BankStatements />} />
            <Route path="submission-summary" element={<SubmissionSummary />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;