export type FieldType = "text" | "number" | "date" | "time" | "timeSec";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  /** Valor inicial: los campos que coinciden en todos los PDF de ejemplo vienen prellenados. */
  default?: string;
  /** Sufijo/unidad a mostrar junto al input. */
  unit?: string;
  placeholder?: string;
  /** Ocupa toda la fila en el grid. */
  wide?: boolean;
}

export interface SectionDef {
  title: string;
  description?: string;
  fields: FieldDef[];
}

export type FormValues = Record<string, string>;

export function initialValues(sections: SectionDef[]): FormValues {
  const v: FormValues = {};
  for (const s of sections) for (const f of s.fields) v[f.key] = f.default ?? "";
  return v;
}

export function fieldError(f: FieldDef, value: string): string | null {
  if (value == null || String(value).trim() === "") return "Obligatorio";
  if (f.type === "number") {
    const n = Number(value);
    if (!Number.isFinite(n)) return "Número inválido";
    if (n < 0) return "No puede ser negativo";
  }
  return null;
}

export function allValid(sections: SectionDef[], values: FormValues): boolean {
  return sections.every((s) => s.fields.every((f) => fieldError(f, values[f.key]) === null));
}
