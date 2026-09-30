import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentPreview } from '../components/DocumentPreview';
import { ReviewPanel } from '../components/ReviewPanel';
import { EvidenceViewer } from '../components/EvidenceViewer';
import { ValidationAlert } from '../components/ValidationAlert';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { LoadingSkeleton, ErrorState } from '../components/EmptyState';
import { useToast } from '../components/Toast';

export const ReviewWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedField, setSelectedField] = useState<string>('total_amount');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['review-workspace', id],
    queryFn: () => api.documents.getById(id!),
    enabled: !!id
  });

  const saveCorrectionsMutation = useMutation({
    mutationFn: ({ corrections, reason }: { corrections: Array<{ fieldName: string; correctedValue: any }>; reason?: string }) =>
      api.documents.updateExtraction(id!, corrections, reason),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['review-workspace', id] });
      queryClient.invalidateQueries({ queryKey: ['documents-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      toast.success('Field Corrected', `Created Version ${res.version.versionNumber}. Validation re-executed.`);
    },
    onError: (err: any) => {
      toast.error('Correction Failed', err.message);
    }
  });

  const approveMutation = useMutation({
    mutationFn: () => api.documents.approve(id!, 'Verified and approved by human reviewer in review workspace.'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review-workspace', id] });
      queryClient.invalidateQueries({ queryKey: ['documents-list'] });
      queryClient.invalidateQueries({ queryKey: ['review-queue-docs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      toast.success('Document Approved', 'Record is now verified and trusted.');
      navigate('/review-queue');
    },
    onError: (err: any) => {
      toast.error('Approval Failed', err.message);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => api.documents.reject(id!, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review-workspace', id] });
      queryClient.invalidateQueries({ queryKey: ['documents-list'] });
      queryClient.invalidateQueries({ queryKey: ['review-queue-docs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      toast.warning('Document Rejected', 'Marked as rejected exception.');
      setIsRejectModalOpen(false);
      navigate('/review-queue');
    },
    onError: (err: any) => {
      toast.error('Rejection Failed', err.message);
    }
  });

  if (isLoading) return <LoadingSkeleton lines={10} />;
  if (error || !data) return <ErrorState message="Could not load document for review." />;

  const { document: doc, fields, validationResult } = data;
  const activeField = fields.find((f) => f.fieldName === selectedField) || fields[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-[1600px] mx-auto">
      {/* Top Review Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <Link
            to="/review-queue"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Back to Review Queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                {doc.documentType} Review
              </span>
              <span className="text-xs text-amber-400 font-semibold font-mono">
                {doc.decisionReason || 'Human Review Required'}
              </span>
            </div>
            <h1 className="text-base font-bold text-white mt-0.5">{doc.title}</h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="danger"
            onClick={() => setIsRejectModalOpen(true)}
            leftIcon={<XCircle className="w-4 h-4" />}
          >
            Reject Document
          </Button>

          <Button
            size="sm"
            onClick={() => approveMutation.mutate()}
            isLoading={approveMutation.isPending}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Approve & Trust
          </Button>
        </div>
      </div>

      {/* Split-Pane Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Spatial Document Preview */}
        <div className="lg:col-span-7">
          <DocumentPreview
            document={doc}
            fields={fields}
            selectedFieldName={selectedField}
            onSelectField={setSelectedField}
          />
        </div>

        {/* Right Column: Review Panel, Evidence, and Validation */}
        <div className="lg:col-span-5 space-y-5">
          {/* Validation Alert */}
          <ValidationAlert
            result={validationResult}
            onSelectIssue={(f) => {
              if (f) setSelectedField(f);
            }}
          />

          {/* Interactive Field Review Panel with Inline Edit */}
          <ReviewPanel
            fields={fields}
            selectedFieldName={selectedField}
            onSelectField={setSelectedField}
            onSaveCorrections={async (corrections, reason) => {
              await saveCorrectionsMutation.mutateAsync({ corrections, reason });
            }}
          />

          {/* Explainable Evidence Details */}
          <EvidenceViewer field={activeField} />
        </div>
      </div>

      {/* Reject Reason Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Document Exception"
        description="Provide a formal compliance audit reason for rejecting this document."
      >
        <div className="space-y-4">
          <textarea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Unreconciled ₹7,000 price markup against approved purchase order terms."
            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={!rejectReason.trim()}
              onClick={() => rejectMutation.mutate(rejectReason)}
              isLoading={rejectMutation.isPending}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
