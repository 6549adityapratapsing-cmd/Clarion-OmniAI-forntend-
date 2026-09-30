import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { Documents } from '../pages/Documents';
import { DocumentDetails } from '../pages/DocumentDetails';
import { Upload } from '../pages/Upload';
import { ReviewQueue } from '../pages/ReviewQueue';
import { ReviewWorkspace } from '../pages/ReviewWorkspace';
import { Suppliers } from '../pages/Suppliers';
import { SupplierDetails } from '../pages/SupplierDetails';
import Insights from '../pages/Insights';
import AIAssistant from '../pages/AIAssistant';
import TrustDashboard from '../pages/TrustDashboard';
import Settings from '../pages/Settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Authenticated Routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/documents/:id" element={<DocumentDetails />} />
        <Route path="/documents/:id/review" element={<ReviewWorkspace />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/review-queue" element={<ReviewQueue />} />
        <Route path="/review" element={<Navigate to="/review-queue" replace />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/suppliers/:id" element={<SupplierDetails />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/trust-dashboard" element={<TrustDashboard />} />
        <Route path="/trust" element={<Navigate to="/trust-dashboard" replace />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
