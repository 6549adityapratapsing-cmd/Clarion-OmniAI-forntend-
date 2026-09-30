import React from 'react';
import { LineItem } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';

export interface LineItemTableProps {
  items: LineItem[];
  onSelectItem?: (item: LineItem) => void;
  className?: string;
}

export const LineItemTable: React.FC<LineItemTableProps> = ({ items, onSelectItem, className = '' }) => {
  if (!items || items.length === 0) {
    return (
      <div className={`p-6 text-center text-slate-500 text-xs ${className}`}>
        No tabular line items detected for this document.
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow-lg ${className}`}>
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
          <tr>
            <th className="py-3 px-3 w-12 text-center">#</th>
            <th className="py-3 px-4">Item & Description</th>
            <th className="py-3 px-3">HSN/SAC</th>
            <th className="py-3 px-3 text-right">Qty</th>
            <th className="py-3 px-3 text-right">Unit Price (₹)</th>
            <th className="py-3 px-3 text-right">Tax (₹)</th>
            <th className="py-3 px-4 text-right">Line Total (₹)</th>
            <th className="py-3 px-3 text-center">Confidence</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
          {items.map((item) => (
            <tr
              key={item.id || item.lineNumber}
              onClick={() => onSelectItem && onSelectItem(item)}
              className="hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <td className="py-3 px-3 text-center text-slate-400 font-semibold">{item.lineNumber}</td>
              <td className="py-3 px-4 font-sans font-medium text-slate-100">
                <div>{item.itemName}</div>
                {item.skuCode && <div className="text-[10px] text-slate-500 font-mono">SKU: {item.skuCode}</div>}
              </td>
              <td className="py-3 px-3 text-slate-400 text-[11px]">{item.hsnSac || '—'}</td>
              <td className="py-3 px-3 text-right">
                {item.quantity} <span className="text-[10px] text-slate-400 font-sans">{item.unit}</span>
              </td>
              <td className="py-3 px-3 text-right font-medium">₹{item.unitPrice.toLocaleString('en-IN')}</td>
              <td className="py-3 px-3 text-right text-slate-400">
                ₹{(item.taxAmount || 0).toLocaleString('en-IN')}
                {item.taxRate ? <span className="text-[10px] ml-1">({item.taxRate}%)</span> : ''}
              </td>
              <td className="py-3 px-4 text-right font-bold text-emerald-400">
                ₹{item.lineTotal.toLocaleString('en-IN')}
              </td>
              <td className="py-3 px-3 text-center">
                <ConfidenceBadge confidence={item.confidence} showLabel={false} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
