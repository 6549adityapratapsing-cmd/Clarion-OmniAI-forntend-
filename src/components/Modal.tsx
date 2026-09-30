import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md'
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={`fixed inset-0 m-auto bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-0 backdrop:bg-slate-950/80 backdrop:backdrop-blur-sm text-slate-100 ${sizes[size]} w-full animate-in fade-in zoom-in-95 duration-200 z-50`}
    >
      <div className="p-6 border-b border-slate-800 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 max-h-[75vh] overflow-y-auto">{children}</div>
    </dialog>
  );
};
