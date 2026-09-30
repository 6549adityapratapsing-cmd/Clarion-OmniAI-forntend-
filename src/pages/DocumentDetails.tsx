import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Calendar,
  IndianRupee,
  Building2,
  ShieldCheck,
  Sparkles,
  CheckSquare,
  RefreshCw,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  History,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { TrustBadge } from '../components/TrustBadge';
import { ValidationAlert } from '../components/ValidationAlert';
import { DocumentPreview } from '../components/DocumentPreview';
import { EvidenceViewer } from '../components/EvidenceViewer';
import { LineItemTable } from '../components/LineItemTable';
import { Button } from '../components/Button';
import { LoadingSkeleton, ErrorState } from '../components/EmptyState';
import { useToast } from '../components/Toast';

export const DocumentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'extraction' | 'evidence' | 'validation' | 'lines' | 'history'>('overview');
  const [selectedField, setSelectedField] = useState<string>('total_amount');
  const [newComment, setNewComment] = useState('');

  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['document-details', id],
    queryFn: () => api.documents.getById(id!),
    enabled: !!id,
    refetchInterval: 6000
  });

  const commentMutation = useMutation({
    mutationFn: (text: string) => api.documents.addComment(id!, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-details', id] });
      setNewComment('');
      toast.success('Comment Posted', 'Audit note recorded.');
    }
  });

  const approveMutation = useMutation({
    mutationFn: () => api.documents.approve(id!, 'Approved from document details view'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-details', id] });
      toast.success('Document Approved', 'Record is now verified and trusted.');
    }
  });

  if (isLoading) return <LoadingSkeleton lines={8} />;
  if (error || !data) return <ErrorState message="Could not load document details." />;

  const { document: doc, fields, lineItems, validationResult, versions, comments } = data;
  const activeExtractedField = fields.find((f) => f.fieldName === selectedField) || fields[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-card border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {doc.documentType}
            </span>
            <StatusBadge status={doc.status} />
            <TrustBadge decision={doc.decision} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 mt-1">
            {doc.title}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Ref: <span className="text-slate-200 font-semibold">{doc.referenceNumber || 'N/A'}</span> • Supplier:{' '}
            <span className="text-slate-200">{doc.supplierName || 'Unassigned'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to={`/review/${doc.id}`}>
            <Button size="sm" variant="secondary" leftIcon={<CheckSquare className="w-4 h-4 text-amber-400" />}>
              Review Workspace
            </Button>
          </Link>
          {doc.status !== 'APPROVED' && (
            <Button
              size="sm"
              onClick={() => approveMutation.mutate()}
              isLoading={approveMutation.isPending}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Approve Document
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-6 text-xs font-medium">
        {[
          { key: 'overview', label: 'Overview & Metadata' },
          { key: 'extraction', label: `Extracted Fields (${fields.length})` },
          { key: 'evidence', label: 'Interactive Evidence & Spatial View' },
          { key: 'validation', label: `Deterministic Validation (${validationResult?.issues.length || 0} issues)` },
          { key: 'lines', label: `Line Items (${lineItems.length})` },
          { key: 'history', label: `Audit & Versions (${versions.length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                3-Layer Decision Triad Evaluation
              </h3>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Layer 1: AI Confidence</span>
                  <ConfidenceBadge confidence={doc.overallConfidence || 0.95} size="md" />
                  <p className="text-[11px] text-slate-400 mt-2">
                    Calibrated extraction confidence score based on token certainty.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Layer 2: Validation</span>
                  <span
                    className={`font-mono text-sm font-bold uppercase ${
                      validationResult?.status === 'PASS' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {validationResult?.status || 'PASS'}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {validationResult?.rulePassCount || 0} checks passed, {validationResult?.ruleWarningCount || 0} warnings.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Layer 3: Cross-Doc</span>
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {doc.isExactDuplicate ? 'DUPLICATE' : 'MATCHED'}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Reconciled against supplier ledger and PO records.
                  </p>
                </div>
              </div>

              {doc.decisionReason && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-emerald-400">Decision Reason:</span> {doc.decisionReason}
                </div>
              )}
            </div>

            {/* Validation Alert preview */}
            <ValidationAlert
              result={validationResult}
              onSelectIssue={(f) => {
                if (f) setSelectedField(f);
                setActiveTab('evidence');
              }}
            />
          </div>

          {/* Right Summary Column */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Document Metadata & Audit Hash
              </h3>

              <div className="space-y-3 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">SHA-256 Checksum</span>
                  <span className="text-slate-300 text-[11px] break-all select-all">{doc.documentHash}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">File Size</span>
                    <span className="text-slate-200">{(doc.fileSizeBytes / 1024).toFixed(1)} KB</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">MIME Type</span>
                    <span className="text-slate-200">{doc.mimeType}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Page Count</span>
                    <span className="text-slate-200">{doc.pageCount} page(s)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Quality Score</span>
                    <span className="text-emerald-400 font-semibold">{doc.qualityScore}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Extraction */}
      {activeTab === 'extraction' && (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Field Name</th>
                  <th className="py-3 px-4">Extracted Value</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Source Evidence Snippet</th>
                  <th className="py-3 px-3">Page</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                {fields.map((f) => (
                  <tr key={f.fieldName} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-300 font-sans">{f.fieldName}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{String(f.value || '—')}</td>
                    <td className="py-3 px-4">
                      <ConfidenceBadge confidence={f.confidence} />
                    </td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-xs font-sans text-xs">
                      "{f.sourceText || f.value}"
                    </td>
                    <td className="py-3 px-3 text-slate-400">{f.pageNumber}</td>
                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        onClick={() => {
                          setSelectedField(f.fieldName);
                          setActiveTab('evidence');
                        }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        Spatial View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Evidence & Spatial View */}
      {activeTab === 'evidence' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <DocumentPreview
              document={doc}
              fields={fields}
              selectedFieldName={selectedField}
              onSelectField={setSelectedField}
            />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <EvidenceViewer field={activeExtractedField} />
          </div>
        </div>
      )}

      {/* Tab 4: Validation */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          <ValidationAlert
            result={validationResult}
            onSelectIssue={(f) => {
              if (f) setSelectedField(f);
              setActiveTab('evidence');
            }}
          />
        </div>
      )}

      {/* Tab 5: Line Items */}
      {activeTab === 'lines' && (
        <LineItemTable items={lineItems} />
      )}

      {/* Tab 6: History & Versions */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              Extraction Version History
            </h3>

            <div className="space-y-3">
              {versions.map((ver) => (
                <div key={ver.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400">Version {ver.versionNumber}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {ver.changeType}
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono">{new Date(ver.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300 mt-2 leading-relaxed">{ver.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Notes and Comments */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Reviewer Audit Notes & Comments
            </h3>

            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{c.userFullName}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{new Date(c.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300 mt-1.5">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add compliance note or reviewer comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Button
                size="sm"
                onClick={() => newComment && commentMutation.mutate(newComment)}
                isLoading={commentMutation.isPending}
              >
                Post Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
