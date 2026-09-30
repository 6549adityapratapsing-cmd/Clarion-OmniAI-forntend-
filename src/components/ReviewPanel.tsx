import React, { useState } from 'react';
import { Edit2, Check, X, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { ExtractedField } from '../types';
import { Button } from './Button';
import { ConfidenceBadge } from './ConfidenceBadge';

export interface ReviewPanelProps {
  fields: ExtractedField[];
  selectedFieldName?: string;
  onSelectField: (fieldName: string) => void;
  onSaveCorrections: (corrections: Array<{ fieldName: string; correctedValue: any }>, reason?: string) => Promise<void>;
  className?: string;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  fields,
  selectedFieldName,
  onSelectField,
  onSaveCorrections,
  className = ''
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [pendingCorrections, setPendingCorrections] = useState<Map<string, any>>(new Map());
  const [correctionReason, setCorrectionReason] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const startEditing = (field: ExtractedField) => {
    setEditingField(field.fieldName);
    setTempValue(field.value !== null && field.value !== undefined ? String(field.value) : '');
  };

  const applyInlineCorrection = (fieldName: string) => {
    setPendingCorrections((prev) => {
      const next = new Map(prev);
      next.set(fieldName, tempValue);
      return next;
    });
    setEditingField(null);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleSaveAll = async () => {
    if (pendingCorrections.size === 0) return;
    setIsSaving(true);
    try {
      const correctionsArray = Array.from(pendingCorrections.entries()).map(([fieldName, correctedValue]) => ({
        fieldName,
        correctedValue
      }));
      await onSaveCorrections(correctionsArray, correctionReason);
      setPendingCorrections(new Map());
      setCorrectionReason('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Structured Extraction Fields
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Click any field to view evidence or click edit to correct</p>
        </div>
        {pendingCorrections.size > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-medium">
            {pendingCorrections.size} pending edit(s)
          </span>
        )}
      </div>

      {/* Field List */}
      <div className="flex-1 divide-y divide-slate-800/60 overflow-y-auto max-h-[480px]">
        {fields.map((field) => {
          const isSelected = selectedFieldName === field.fieldName;
          const isBeingEdited = editingField === field.fieldName;
          const hasPendingChange = pendingCorrections.has(field.fieldName);
          const displayValue = hasPendingChange
            ? pendingCorrections.get(field.fieldName)
            : field.value !== null && field.value !== undefined
            ? String(field.value)
            : '—';

          return (
            <div
              key={field.fieldName}
              onClick={() => onSelectField(field.fieldName)}
              className={`p-3.5 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/80 border-l-4 border-l-emerald-500 pl-3'
                  : 'hover:bg-slate-800/40'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 font-semibold">{field.fieldName}</span>
                  {field.isHumanCorrected && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Corrected
                    </span>
                  )}
                  {hasPendingChange && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Modified
                    </span>
                  )}
                </div>

                {isBeingEdited ? (
                  <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full text-xs font-mono bg-slate-950 border border-emerald-500/60 rounded px-2.5 py-1 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      autoFocus
                    />
                    <button
                      onClick={() => applyInlineCorrection(field.fieldName)}
                      className="p-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white"
                      title="Apply correction"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 font-mono text-sm text-slate-100 truncate font-medium">
                    {displayValue}
                  </div>
                )}
              </div>

              {/* Confidence & Edit Action */}
              <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <ConfidenceBadge confidence={field.confidence} />
                {!isBeingEdited && (
                  <button
                    onClick={() => startEditing(field)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Correct field"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Corrections Strip */}
      {pendingCorrections.size > 0 && (
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          <input
            type="text"
            placeholder="Audit reason for changes (e.g. Corrected vendor PAN checksum)"
            value={correctionReason}
            onChange={(e) => setCorrectionReason(e.target.value)}
            className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPendingCorrections(new Map())}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Discard changes
            </button>
            <Button
              size="sm"
              onClick={handleSaveAll}
              isLoading={isSaving}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Save Corrections & Revalidate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
