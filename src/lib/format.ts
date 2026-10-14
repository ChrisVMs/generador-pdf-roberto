/** Redondeo a n decimales evitando errores de coma flotante (0.005 -> 0.01). */
export function round(value: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.sign(value) * Math.round(Math.abs(value) * f + 1e-9) / f;
}

/** 19133.56 -> "19,133.56" */
export function num(value: number, decimals: number): string {
  return round(value, decimals).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const pad = (n: number) => String(n).padStart(2, "0");

function parseDate(iso: string): [number, number, number] {
  const [y, m, d] = iso.split("-").map(Number);
  return [y, m, d];
}

/** "2026-10-02" -> "02/10/2026" */
export function fecha(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = parseDate(iso);
  return `${pad(d)}/${pad(m)}/${y}`;
}

/** "2026-10-05" -> "5/10/2026" (día sin cero, como en las aprobaciones del sistema) */
export function fechaCorta(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = parseDate(iso);
  return `${d}/${pad(m)}/${y}`;
}

/** "17:21:46" -> "05:21:46 p. m." ; "15:00" -> "03:00 p. m." */
export function hora12(hhmm: string, withSeconds = false): string {
  if (!hhmm) return "";
  const [h, m, s = 0] = hhmm.split(":").map(Number);
  const suf = h >= 12 ? "p. m." : "a. m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${pad(h12)}:${pad(m)}${withSeconds ? ":" + pad(s) : ""} ${suf}`;
}

/** "07:10" -> "07:10:00" */
export function hora24(hhmm: string): string {
  if (!hhmm) return "";
  const [h, m, s = 0] = hhmm.split(":").map(Number);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function toNumber(v: string): number {
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}
