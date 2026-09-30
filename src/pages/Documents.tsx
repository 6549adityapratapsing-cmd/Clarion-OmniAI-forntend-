import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Eye,
  CheckSquare,
  FileText,
  AlertTriangle,
  UploadCloud
} from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { TrustBadge } from '../components/TrustBadge';
import { Button } from '../components/Button';
import { LoadingSkeleton, EmptyState } from '../components/EmptyState';
import { useToast } from '../components/Toast';

export const Documents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['documents-list', { statusFilter, typeFilter, searchTerm, page }],
    queryFn: () =>
      api.documents.list({
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        search: searchTerm || undefined,
        page,
        limit: 15
      }),
    refetchInterval: 8000
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.documents.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      toast.success('Document Deleted', 'Record removed from workspace.');
    },
    onError: (err: any) => {
      toast.error('Delete Failed', err.message);
    }
  });

  const reprocessMutation = useMutation({
    mutationFn: (id: string) => api.documents.reprocess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents-list'] });
      toast.success('Reprocessing Dispatched', 'Pipeline re-executed with latest model schemas.');
    },
    onError: (err: any) => {
      toast.error('Reprocess Failed', err.message);
    }
  });

  const docs = data?.documents || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            Document Management Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, inspect provenance, and manage the complete business document archive.
          </p>
        </div>

        <Link to="/upload">
          <Button size="sm" leftIcon={<UploadCloud className="w-4 h-4" />}>
            Upload Document
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 shadow-lg flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, invoice #, supplier name, line items..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-auto"
          >
            <option value="">All Document Types</option>
            <option value="INVOICE">Invoices</option>
            <option value="PURCHASE_ORDER">Purchase Orders</option>
            <option value="DELIVERY_NOTE">Delivery Notes</option>
            <option value="RECEIPT">Receipts</option>
            <option value="CREDIT_NOTE">Credit Notes</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="REVIEW_REQUIRED">Review Required</option>
            <option value="REJECTED">Rejected</option>
            <option value="PROCESSING">Processing</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      {isLoading ? (
        <LoadingSkeleton lines={6} />
      ) : docs.length === 0 ? (
        <EmptyState
          title="No documents match criteria"
          description="Try broadening your search or filter terms, or upload a new business document."
          actionText="Upload Document"
          onAction={() => window.location.assign('/upload')}
        />
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Document Title & Filename</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Amount (₹)</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Decision</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                {docs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-sans font-medium text-slate-100">
                      <Link to={`/documents/${doc.id}`} className="hover:text-emerald-400 transition-colors block truncate max-w-xs font-semibold">
                        {doc.title}
                      </Link>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-xs">
                        {doc.originalFilename} • Ref: {doc.referenceNumber || 'N/A'}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {doc.documentType || 'UNCLASSIFIED'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-sans text-slate-300 truncate max-w-[140px]">
                      {doc.supplierName || '—'}
                    </td>

                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {doc.documentDate || '—'}
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-slate-100">
                      ₹{(doc.totalAmount || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-3">
                      <ConfidenceBadge confidence={doc.overallConfidence || 0.95} />
                    </td>

                    <td className="py-3 px-3">
                      <StatusBadge status={doc.status} />
                    </td>

                    <td className="py-3 px-3">
                      <TrustBadge decision={doc.decision} />
                    </td>

                    <td className="py-3 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/documents/${doc.id}`}
                          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {doc.status === 'REVIEW_REQUIRED' && (
                          <Link
                            to={`/review/${doc.id}`}
                            className="p-1.5 rounded-lg hover:bg-amber-500/20 text-amber-400 transition-colors"
                            title="Open Review Workspace"
                          >
                            <CheckSquare className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => reprocessMutation.mutate(doc.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Reprocess Pipeline"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete '${doc.title}'?`)) {
                              deleteMutation.mutate(doc.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div>
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total items)
              </div>
              <div className="flex gap-2 font-sans">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
