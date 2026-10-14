"use client";

import { useEffect } from "react";

interface Props {
  url: string;
  fileName: string;
  onClose: () => void;
}

export function PdfPreviewModal({ url, fileName, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Previsualización del PDF"
    >
      <div
        className="flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
          <h2 className="truncate text-base font-semibold text-slate-800">{fileName}</h2>
          <div className="flex gap-2">
            <a href={url} download={fileName} className="btn-primary">
              Descargar PDF
            </a>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cerrar y editar
            </button>
          </div>
        </div>
        <iframe src={url} title="Previsualización" className="hidden min-h-0 flex-1 bg-slate-100 sm:block" />
        {/* En móviles los navegadores no suelen mostrar PDF dentro de un iframe */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center sm:hidden">
          <p className="text-sm text-slate-600">El PDF está listo. Ábrelo para verlo o descárgalo directamente.</p>
          <a href={url} target="_blank" rel="noreferrer" className="btn-secondary">
            Abrir vista previa
          </a>
        </div>
      </div>
    </div>
  );
}
