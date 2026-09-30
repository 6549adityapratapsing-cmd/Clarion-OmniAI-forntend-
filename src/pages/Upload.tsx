import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';
import { DemoScenario } from '../types';

export const Upload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingScenarioId, setLoadingScenarioId] = useState<string | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const { data: scenariosData } = useQuery({
    queryKey: ['demo-scenarios'],
    queryFn: () => api.demo.getScenarios()
  });

  const scenarios = scenariosData?.scenarios || [];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', selectedFile.name.replace(/\.[^/.]+$/, ''));

      const result = await api.documents.upload(formData);
      toast.success('Document Ingested', `File dispatched to processing worker (Job: ${result.jobId.slice(0, 8)}...)`);
      navigate(`/documents/${result.document.id}`);
    } catch (err: any) {
      toast.error('Upload Failed', err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadDemoScenario = async (scenario: DemoScenario) => {
    setLoadingScenarioId(scenario.id);
    try {
      const result = await api.demo.loadScenario(scenario.id);
      toast.success('Demo Scenario Ingested', `${scenario.title} processed with status: ${result.document.status}`);
      navigate(`/documents/${result.document.id}`);
    } catch (err: any) {
      toast.error('Failed to Load Scenario', err.message);
    } finally {
      setLoadingScenarioId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Top Description */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-emerald-400" />
          Document Ingestion & Processing Pipeline
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload commercial invoices, purchase orders, receipts, or logistics challans to trigger full OCR tokenization, strict AI extraction, deterministic math verification, and PO reconciliation.
        </p>
      </div>

      {/* Main Drag & Drop Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-8 border border-slate-800 shadow-xl">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-10 text-center transition-all duration-200 cursor-pointer ${
            dragActive
              ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
              : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
          }`}
          onClick={() => document.getElementById('file-upload-input')?.click()}
        >
          <input
            id="file-upload-input"
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-emerald-400 mb-4 shadow-lg">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-100">
            {selectedFile ? selectedFile.name : 'Drag and drop business documents here'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {selectedFile
              ? `${(selectedFile.size / 1024).toFixed(1)} KB • Ready for cryptographic SHA-256 hash & ingest`
              : 'Supports digital & scanned PDFs, PNG, JPG, and JPEG up to 20MB'}
          </p>

          {selectedFile && (
            <div className="mt-5 flex justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <Button
                onClick={handleUploadSubmit}
                isLoading={isUploading}
                leftIcon={<FileCheck className="w-4 h-4" />}
              >
                Start Ingestion & Analysis
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 10 Golden Demo Scenarios Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              10 Golden Benchmark Scenarios
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any realistic enterprise document to exercise explainability, deterministic checks, and human review
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((scenario) => {
            const isLoading = loadingScenarioId === scenario.id;
            const isAutoApprove = scenario.expectedOutcome === 'AUTO_APPROVE';

            return (
              <div
                key={scenario.id}
                className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {scenario.documentType}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-100 mt-2 group-hover:text-emerald-400 transition-colors">
                        {scenario.title}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isAutoApprove
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {scenario.expectedOutcome}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{scenario.description}</p>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0 font-bold">Key Check:</span>
                    <span>{scenario.keyDifferentiator}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-full sm:max-w-[200px]">
                    {scenario.filename}
                  </span>

                  <Button
                    size="sm"
                    variant={isAutoApprove ? 'primary' : 'secondary'}
                    onClick={() => handleLoadDemoScenario(scenario)}
                    isLoading={isLoading}
                    className="w-full sm:w-auto"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Ingest & Process
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
