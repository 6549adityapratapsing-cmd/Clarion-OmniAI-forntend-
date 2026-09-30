import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, FileText, CheckCircle2 } from 'lucide-react';
import { DocumentEntity, ExtractedField } from '../types';

export interface DocumentPreviewProps {
  document: DocumentEntity;
  fields: ExtractedField[];
  selectedFieldName?: string;
  onSelectField?: (fieldName: string) => void;
  className?: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  fields,
  selectedFieldName,
  onSelectField,
  className = ''
}) => {
  const [zoom, setZoom] = useState<number>(100);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 60));
  const handleReset = () => setZoom(100);

  const selectedField = fields.find((f) => f.fieldName === selectedFieldName);

  return (
    <div className={`flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl ${className}`}>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200 truncate max-w-xs">{document.originalFilename}</span>
          <span className="text-slate-500 font-mono">({document.pageCount} page)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-mono text-slate-400 mr-2">{zoom}%</span>
          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document Viewport */}
      <div className="flex-1 overflow-auto p-6 bg-slate-950 flex justify-center items-start min-h-[550px]">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="relative w-[612px] h-[792px] bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl transition-transform duration-200 text-slate-100 p-8 select-none"
        >
          {/* Document Content Simulation */}
          <div className="border-b border-slate-700 pb-4 flex justify-between items-start">
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{document.documentType === 'PURCHASE_ORDER' ? 'PURCHASE ORDER' : 'TAX INVOICE'}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ORIGINAL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Issued under Section 31 of GST Act</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono text-slate-400">
                {document.documentType === 'PURCHASE_ORDER' ? 'PO NUMBER' : 'INVOICE NUMBER'}
              </p>
              <p className="text-sm font-bold font-mono text-emerald-400">
                {document.referenceNumber || 'INV-2026-001'}
              </p>
              <p className="text-xs font-mono text-slate-400 mt-1">
                DATE: <span className="text-slate-200">{document.documentDate || '2026-09-12'}</span>
              </p>
            </div>
          </div>

          {/* Supplier & Buyer Panels */}
          <div className="grid grid-cols-2 gap-4 my-6 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Supplier / Vendor
              </span>
              <p className="font-semibold text-slate-100 text-sm">{document.supplierName || 'Acme Industrial Supplies Ltd'}</p>
              <p className="text-slate-400 mt-1">Plot 45, MIDC Industrial Area, Andheri East</p>
              <p className="text-slate-400">Mumbai, Maharashtra 400093</p>
              <p className="text-emerald-400 font-mono mt-1 font-semibold">GSTIN: 27AABCA1234A1Z5</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To (Buyer)
              </span>
              <p className="font-semibold text-slate-100 text-sm">Clarion Enterprise Systems Pvt Ltd</p>
              <p className="text-slate-400 mt-1">Tech Hub Tower 4, Sector 62</p>
              <p className="text-slate-400">Noida, Uttar Pradesh 201301</p>
              <p className="text-slate-300 font-mono mt-1">GSTIN: 09AAACC8899C1Z8</p>
            </div>
          </div>

          {/* Items Table Simulation */}
          <div className="my-6 border border-slate-800 rounded-lg overflow-hidden text-xs">
            <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 grid grid-cols-12 font-semibold text-slate-400">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Item Description</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-2 text-right">Amount (₹)</div>
            </div>
            <div className="divide-y divide-slate-800/60 bg-slate-900/40">
              <div className="px-3 py-2.5 grid grid-cols-12 text-slate-200">
                <div className="col-span-1 font-mono">1</div>
                <div className="col-span-5 font-medium">
                  {document.documentType === 'PURCHASE_ORDER'
                    ? 'Dell 27-inch 4K UHD UltraSharp Monitor'
                    : 'Industrial CNC Carbide Milling Cutters'}
                </div>
                <div className="col-span-2 text-right font-mono">
                  {document.documentType === 'PURCHASE_ORDER' ? '2 PCS' : '10 PCS'}
                </div>
                <div className="col-span-2 text-right font-mono">
                  {document.documentType === 'PURCHASE_ORDER' ? '32,000.00' : '10,000.00'}
                </div>
                <div className="col-span-2 text-right font-mono font-semibold">
                  {document.documentType === 'PURCHASE_ORDER' ? '64,000.00' : '1,00,000.00'}
                </div>
              </div>
            </div>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mt-8 text-xs font-mono">
            <div className="w-64 space-y-1.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>₹{(document.totalAmount ? (document.totalAmount / 1.18).toFixed(2) : '1,00,000.00')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (GST 18%):</span>
                <span>₹{(document.totalAmount ? (document.totalAmount - (document.totalAmount / 1.18)).toFixed(2) : '18,000.00')}</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-sm text-emerald-400">
                <span>Total Amount:</span>
                <span>₹{(document.totalAmount || 118000).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Interactive Bounding Box Overlays */}
          {fields.map((field) => {
            if (!field.boundingBox) return null;
            const isSelected = selectedFieldName === field.fieldName;

            return (
              <div
                key={field.fieldName}
                onClick={() => onSelectField && onSelectField(field.fieldName)}
                style={{
                  position: 'absolute',
                  left: `${field.boundingBox.x}px`,
                  top: `${field.boundingBox.y}px`,
                  width: `${field.boundingBox.width}px`,
                  height: `${field.boundingBox.height}px`
                }}
                className={`cursor-pointer transition-all duration-200 rounded ${
                  isSelected
                    ? 'border-2 border-emerald-400 bg-emerald-500/25 ring-4 ring-emerald-500/20 z-20 animate-pulse'
                    : 'border border-dashed border-cyan-400/40 hover:border-cyan-400 hover:bg-cyan-500/10 z-10'
                }`}
                title={`${field.fieldName}: ${field.value} (${Math.round(field.confidence * 100)}% conf)`}
              >
                {isSelected && (
                  <div className="absolute -top-6 left-0 px-1.5 py-0.5 rounded bg-emerald-500 text-white font-mono text-[9px] font-bold shadow-md whitespace-nowrap flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {field.fieldName} ({Math.round(field.confidence * 100)}%)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Evidence Preview Strip */}
      {selectedField && (
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Selected Field:</span>
            <span className="font-mono font-semibold text-emerald-400">{selectedField.fieldName}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 font-mono">"{selectedField.sourceText || selectedField.value}"</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Page {selectedField.pageNumber}</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-mono font-semibold">
              {Math.round(selectedField.confidence * 100)}% Confidence
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
