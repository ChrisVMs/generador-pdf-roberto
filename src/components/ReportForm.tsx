"use client";

import Link from "next/link";
import type { DocumentProps } from "@react-pdf/renderer";
import { useCallback, useMemo, useState, type ReactElement, type ReactNode } from "react";
import { allValid, fieldError, initialValues, type FieldDef, type FormValues, type SectionDef } from "@/lib/fields";
import { PdfPreviewModal } from "./PdfPreviewModal";

interface Props {
  title: string;
  sections: SectionDef[];
  /** Resumen de valores calculados que se muestra en vivo. */
  summary: (values: FormValues) => { label: string; value: string }[];
  /** Construye el documento react-pdf con los valores del formulario (puede cargarse bajo demanda). */
  buildDocument: (values: FormValues, logoSrc: string) => ReactElement | Promise<ReactElement>;
  fileName: (values: FormValues) => string;
  /** Valores de ejemplo para el botón "Datos de prueba". */
  sample?: FormValues;
  /** Ruta del logo (relativa a /public) que se incrusta en el PDF. */
  logoPath?: string;
}

export function ReportForm({ title, sections, summary, buildDocument, fileName, sample, logoPath = "/logo.png" }: Props) {
  const [values, setValues] = useState<FormValues>(() => initialValues(sections));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(() => allValid(sections, values), [sections, values]);
  const pending = useMemo(
    () => sections.reduce((n, s) => n + s.fields.filter((f) => fieldError(f, values[f.key])).length, 0),
    [sections, values],
  );

  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  function fillSample() {
    if (!sample) return;
    setValues((v) => ({ ...v, ...sample }));
    setTouched({});
  }

  async function generar() {
    if (!valid) return;
    setGenerating(true);
    setError(null);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const doc = (await buildDocument(values, `${window.location.origin}${logoPath}`)) as ReactElement<DocumentProps>;
      const blob = await pdf(doc).toBlob();
      setPreview({ url: URL.createObjectURL(blob), name: fileName(values) });
    } catch (e) {
      console.error(e);
      setError("No se pudo generar el PDF. Revisa los datos e inténtalo de nuevo.");
    } finally {
      setGenerating(false);
    }
  }

  const closePreview = useCallback(() => {
    setPreview((p) => {
      if (p) URL.revokeObjectURL(p.url);
      return null;
    });
  }, []);


  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">{title}</h1>
        <Link href="/menu" className="btn-secondary">
          ← Volver
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          generar();
        }}
        className="space-y-6"
        noValidate
      >
        {sections.map((s) => (
          <fieldset key={s.title} className="card">
            <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-brand-dark">{s.title}</legend>
            {s.description && <p className="mb-3 text-xs text-slate-500">{s.description}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {s.fields.map((f) => (
                <Field
                  key={f.key}
                  def={f}
                  value={values[f.key]}
                  showError={!!touched[f.key]}
                  onChange={(val) => set(f.key, val)}
                  onBlur={() => setTouched((t) => ({ ...t, [f.key]: true }))}
                />
              ))}
            </div>
          </fieldset>
        ))}

        <div className="card">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-dark">Valores calculados</h2>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {summary(values).map((r) => (
              <div key={r.label} className="flex justify-between gap-3 border-b border-dashed border-slate-200 py-1">
                <dt className="text-slate-500">{r.label}</dt>
                <dd className="font-mono font-medium text-slate-800">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t bg-white/95 px-4 py-3 backdrop-blur">
          {!valid && <span className="mr-auto text-sm text-slate-500">Faltan {pending} campo(s) por completar</span>}
          {sample && (
            <button type="button" className="btn-secondary" onClick={fillSample}>
              Datos de prueba
            </button>
          )}
          <Link href="/menu" className="btn-secondary">
            Volver
          </Link>
          <button type="submit" className="btn-primary" disabled={!valid || generating}>
            {generating ? "Generando…" : "Generar PDF"}
          </button>
        </div>
      </form>

      {preview && <PdfPreviewModal url={preview.url} fileName={preview.name} onClose={closePreview} />}
    </div>
  );
}

function Field({ def, value, showError, onChange, onBlur }: {
  def: FieldDef;
  value: string;
  showError: boolean;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const err = fieldError(def, value);
  const id = `f_${def.key}`;
  const inputType = def.type === "timeSec" ? "time" : def.type;
  let input: ReactNode = (
    <input
      id={id}
      type={inputType}
      step={def.type === "timeSec" ? 1 : def.type === "number" ? "any" : undefined}
      inputMode={def.type === "number" ? "decimal" : undefined}
      min={def.type === "number" ? 0 : undefined}
      required
      value={value}
      placeholder={def.placeholder}
      onChange={(e) => onChange(def.type === "text" ? e.target.value.toUpperCase() : e.target.value)}
      onBlur={onBlur}
      className={`input ${showError && err ? "input-error" : ""} ${def.unit ? "pr-16" : ""}`}
    />
  );
  if (def.unit) {
    input = (
      <div className="relative">
        {input}
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
          {def.unit}
        </span>
      </div>
    );
  }
  return (
    <div className={def.wide ? "sm:col-span-2 lg:col-span-3" : ""}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {def.label} <span className="text-red-500">*</span>
      </label>
      {input}
      {showError && err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  );
}
