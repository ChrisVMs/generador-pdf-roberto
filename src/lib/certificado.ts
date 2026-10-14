import type { FormValues, SectionDef } from "./fields";
import { round, toNumber } from "./format";

/** Gramos por onza troy: GR/TM ÷ 31.1035 = OZ/TM */
export const GRAMOS_POR_ONZA = 31.1035;
/** La solución rica se multiplica por 2 antes de sumarse al relave. */
export const FACTOR_SOLUCION = 2;

export const certificadoSections: SectionDef[] = [
  {
    title: "Datos generales",
    fields: [
      { key: "atencion", label: "Atención a los señores del", type: "text", default: "MARQUINA ABILA ROBERTO", wide: true },
      { key: "lote", label: "Lote", type: "text", placeholder: "MN20268024" },
      { key: "codigoAcopio", label: "Código de acopio", type: "text", placeholder: "1114489" },
      { key: "nroGuia", label: "Nro guía", type: "text", placeholder: "EG07-00008" },
      { key: "fechaRecepcion", label: "Fecha recepción", type: "date" },
      { key: "fechaIniPrueba", label: "Fecha ini. prueba", type: "date" },
      { key: "horaIniPrueba", label: "Hora ini. prueba", type: "time" },
    ],
  },
  {
    title: "Aprobación",
    fields: [
      { key: "aprobadoPor", label: "Aprobado por LM", type: "text", placeholder: "WAPAZAE" },
      { key: "fechaAprobacion", label: "Fecha de aprobación", type: "date" },
      { key: "horaAprobacion", label: "Hora de aprobación", type: "timeSec" },
    ],
  },
  {
    title: "Resultados de laboratorio",
    description: "Cabeza calculada = Solución rica × 2 + Relave sólido. OZ/TM = GR/TM ÷ 31.1035",
    fields: [
      { key: "solAu", label: "Solución rica AU", type: "number", unit: "GR/M3", placeholder: "5.001" },
      { key: "solAg", label: "Solución rica AG", type: "number", unit: "GR/M3", placeholder: "1.677" },
      { key: "relAu", label: "Relave sólido AU", type: "number", unit: "GR/TM", placeholder: "1.600" },
      { key: "relAg", label: "Relave sólido AG", type: "number", unit: "GR/TM", placeholder: "1.000" },
      { key: "recuperacion", label: "Recuperación (Au)", type: "number", unit: "%", placeholder: "87.586" },
    ],
  },
];

export interface CertificadoCalc {
  cabezaAu: number;
  cabezaAg: number;
  ozAu: number;
  ozAg: number;
}

/** Valores del PDF de referencia, para el botón "Datos de prueba". */
export const certificadoEjemplo: FormValues = {
  atencion: "MARQUINA ABILA ROBERTO",
  lote: "MN20268024",
  codigoAcopio: "1114489",
  nroGuia: "EG07-00008",
  fechaRecepcion: "2026-10-02",
  fechaIniPrueba: "2026-10-02",
  horaIniPrueba: "15:00",
  aprobadoPor: "WAPAZAE",
  fechaAprobacion: "2026-10-05",
  horaAprobacion: "07:10:00",
  solAu: "5.001",
  solAg: "1.677",
  relAu: "1.600",
  relAg: "1.000",
  recuperacion: "87.586",
};

export function calcCertificado(v: FormValues): CertificadoCalc {
  const cabezaAu = round(toNumber(v.solAu) * FACTOR_SOLUCION + toNumber(v.relAu), 3);
  const cabezaAg = round(toNumber(v.solAg) * FACTOR_SOLUCION + toNumber(v.relAg), 3);
  return {
    cabezaAu,
    cabezaAg,
    ozAu: round(cabezaAu / GRAMOS_POR_ONZA, 3),
    ozAg: round(cabezaAg / GRAMOS_POR_ONZA, 3),
  };
}
