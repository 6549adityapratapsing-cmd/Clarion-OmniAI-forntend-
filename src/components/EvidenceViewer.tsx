import React from 'react';
import { Eye, MapPin, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ExtractedField } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';

export interface EvidenceViewerProps {
  field?: ExtractedField | null;
  className?: string;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ field, className = '' }) => {
  if (!field) {
    return (
      <div className={`p-6 rounded-xl border border-slate-800 bg-slate-900/40 text-center ${className}`}>
        <Eye className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-400">Click any field to inspect explainable evidence</p>
        <p className="text-xs text-slate-500 mt-1">
          Every value is traceable to exact source text, page location, and bounding coordinates.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-slate-100">Explainable Extraction Evidence</h4>
        </div>
        <ConfidenceBadge confidence={field.confidence} />
      </div>

      <div className="grid grid-cols-2 gap-4 my-4 text-xs">
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Field Name</span>
          <span className="font-mono text-slate-200 font-semibold">{field.fieldName}</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Extracted Value</span>
          <span className="font-mono text-emerald-400 font-bold text-sm">
            {field.value !== null && field.value !== undefined ? String(field.value) : 'N/A'}
          </span>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Raw OCR Source Text Snippet:</span>
          </div>
          <p className="font-mono text-slate-200 bg-slate-900 p-2 rounded border border-slate-800 text-[11px] select-all">
            "{field.sourceText || field.value}"
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Spatial Location & Geometry:</span>
          </div>
          <div className="flex items-center justify-between text-slate-300 font-mono text-[11px] pt-1">
            <span>Page: {field.pageNumber}</span>
            {field.boundingBox && (
              <span>
                Coordinates: [x: {field.boundingBox.x}, y: {field.boundingBox.y}, w: {field.boundingBox.width}, h: {field.boundingBox.height}]
              </span>
            )}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audit & Extraction Provenance:</span>
          </div>
          <div className="text-slate-400 text-[11px] space-y-0.5 pt-1">
            <p>
              Method: <span className="font-mono text-slate-200">{field.extractionMethod || 'OCR_LLM'}</span>
            </p>
            {field.isHumanCorrected && (
              <p className="text-amber-400 font-medium">
                ✏️ Manually corrected by human reviewer (Original AI value: "{field.originalAiValue}")
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
