import type { FormValues, SectionDef } from "./fields";
import { round, toNumber } from "./format";

/** Filas de "OTRAS DEDUCCIONES". El importe se ingresa aparte porque en los
 *  PDF de origen no siempre es precio × cantidad. */
export const otrasDeducciones = [
  { id: "lab", label: "ANALISIS LABORATORIO", unidad: "Und.", precio: "14.87", cant: "1.00", importe: "14.87" },
  { id: "flete", label: "FLETE", unidad: "Hrs.", precio: "", cant: "0.00", importe: "" },
  { id: "cargador", label: "CARGADOR FRONTAL", unidad: "Hrs.", precio: "80.00", cant: "0.00", importe: "0.00" },
  { id: "logHist", label: "SERVICIO LOGISTICO HISTORICO", unidad: "", precio: "0.00", cant: "0.00", importe: "0.00" },
  { id: "log", label: "SERVICIO LOGISTICO", unidad: "", precio: "0.00", cant: "0.00", importe: "0.00" },
  { id: "otros", label: "OTROS SERVICIOS OPERATIVOS", unidad: "", precio: "0.00", cant: "0.00", importe: "" },
] as const;

export const liquidacionSections: SectionDef[] = [
  {
    title: "Cabecera",
    fields: [
      { key: "nro", label: "Nro.", type: "text", placeholder: "00108949" },
      { key: "lote", label: "Lote", type: "text", placeholder: "806-0497" },
      { key: "procedencia", label: "Procedencia", type: "text", default: "JIMENA" },
      { key: "concesion", label: "Concesión", type: "text", placeholder: "LA PODEROSA N° 3" },
      { key: "fechaRecepcion", label: "Fecha recepción", type: "date" },
      { key: "fechaMuestra", label: "Fecha muestra", type: "date" },
    ],
  },
  {
    title: "Pesos",
    description: "Humedad = PBH × %; Peso bruto seco = PBH − Humedad; Merma = PBS × %; Peso neto seco = PBS − Merma",
    fields: [
      { key: "pbh", label: "Peso bruto húmedo", type: "number", unit: "T.M.H.", placeholder: "10.780" },
      { key: "humedadPct", label: "Humedad", type: "number", unit: "%", placeholder: "2.150" },
      { key: "mermaPct", label: "Merma", type: "number", unit: "%", default: "0.500" },
    ],
  },
  {
    title: "Leyes, cotizaciones y recuperación",
    description: "Total (OZ) = T.M.S. × Ley × Recup. %; Total (USD) = OZ × USD/OZ",
    fields: [
      { key: "leyAu", label: "Ley AU", type: "number", unit: "OZ/TM", placeholder: "0.469" },
      { key: "leyAg", label: "Ley AG", type: "number", unit: "OZ/TM", placeholder: "0.160" },
      { key: "cotAu", label: "Cotización AU", type: "number", unit: "USD/OZ", placeholder: "4351.021" },
      { key: "cotAg", label: "Cotización AG", type: "number", unit: "USD/OZ", placeholder: "64.635" },
      { key: "recAu", label: "Recuperación AU", type: "number", unit: "%", placeholder: "89.190" },
      { key: "recAg", label: "Recuperación AG", type: "number", unit: "%", default: "30.000" },
      { key: "putm", label: "P.U.TM.", type: "number", default: "0.00" },
      { key: "tipoCambio", label: "Tipo de cambio", type: "number", placeholder: "3.379" },
    ],
  },
  {
    title: "Deducciones y participación",
    description: "Participación = Valorización total × % − (Manipuleo + Maquila + D.S. + Concesión)",
    fields: [
      { key: "manipuleo", label: "Manipuleo (tarifa × PBH)", type: "number", unit: "USD", default: "0.00" },
      { key: "maquila", label: "Maquila (tarifa × PBS)", type: "number", unit: "USD", placeholder: "139.00" },
      { key: "dsPct", label: "D.S. 180/181-2011-EF", type: "number", unit: "%", default: "0.00" },
      { key: "concesionPct", label: "Concesión minera", type: "number", unit: "%", default: "0.0000" },
      { key: "participacionPct", label: "Participación minero", type: "number", unit: "%", default: "65.00" },
      { key: "castigoPct", label: "Castigo provisional", type: "number", unit: "%", default: "0.00" },
      { key: "descuentoLiq", label: "Descuento por liq. anterior", type: "number", unit: "USD", default: "0.00" },
    ],
  },
  {
    title: "Otras deducciones ($)",
    description: "El importe se ingresa directamente (en los originales no siempre es precio × cantidad).",
    fields: otrasDeducciones.flatMap((d) => [
      { key: `od_${d.id}_precio`, label: `${d.label} · precio`, type: "number" as const, default: d.precio },
      { key: `od_${d.id}_cant`, label: `Cantidad${d.unidad ? ` (${d.unidad})` : ""}`, type: "number" as const, default: d.cant },
      { key: `od_${d.id}_importe`, label: "Importe", type: "number" as const, default: d.importe },
    ]),
  },
  {
    title: "Facturación",
    description: "IGV sobre el valor de venta final. Cesión en uso (CU) = % de la valorización total.",
    fields: [
      { key: "anticipo", label: "Anticipo por liquidación provisional", type: "number", unit: "USD", default: "0.00" },
      { key: "igvPct", label: "I.G.V.", type: "number", unit: "%", default: "18.00" },
      { key: "cuPct", label: "Cesión en uso (CU)", type: "number", unit: "%", default: "2.00" },
    ],
  },
  {
    title: "Cateador y transporte",
    fields: [
      { key: "cateador", label: "Cateador", type: "text", default: "MARQUINA ABILA ROBERTO", wide: true },
      { key: "ruc", label: "RUC", type: "text", default: "10410122915" },
      { key: "guia", label: "Guía Nro.", type: "text", placeholder: "01-000713" },
      { key: "placa", label: "Placa", type: "text", placeholder: "TAQ-813" },
    ],
  },
  {
    title: "Aprobación",
    description: "Firmas que aparecen al pie de la página 2 (nombre, fecha y hora).",
    fields: [
      { key: "aprobJefatura", label: "Aprobación de Jefatura · nombre", type: "text", placeholder: "ADELACRUZ" },
      { key: "fechaAprobJefatura", label: "Aprob. Jefatura · fecha", type: "date" },
      { key: "horaAprobJefatura", label: "Aprob. Jefatura · hora", type: "timeSec" },
      { key: "aprobGerencia", label: "Aprobación Gerencia de Operaciones · nombre", type: "text", placeholder: "ECCARITA" },
      { key: "fechaAprobGerencia", label: "Aprob. Gerencia · fecha", type: "date" },
      { key: "horaAprobGerencia", label: "Aprob. Gerencia · hora", type: "timeSec" },
      { key: "aprobContabilidad", label: "Aprobación de Contabilidad · nombre", type: "text", placeholder: "ADELACRUZ" },
      { key: "fechaAprobContabilidad", label: "Aprob. Contabilidad · fecha", type: "date" },
      { key: "horaAprobContabilidad", label: "Aprob. Contabilidad · hora", type: "timeSec" },
    ],
  },
];

/** Valores del PDF de referencia, para el botón "Datos de prueba". */
export const liquidacionEjemplo: FormValues = {
  nro: "00108949",
  lote: "806-0497",
  procedencia: "JIMENA",
  concesion: "LA PODEROSA N° 3",
  fechaRecepcion: "2026-09-16",
  fechaMuestra: "2026-09-16",
  pbh: "10.780",
  humedadPct: "2.150",
  mermaPct: "0.500",
  leyAu: "0.469",
  leyAg: "0.160",
  cotAu: "4351.021",
  cotAg: "64.635",
  recAu: "89.190",
  recAg: "30.000",
  putm: "0.00",
  tipoCambio: "3.379",
  manipuleo: "0.00",
  maquila: "139.00",
  dsPct: "0.00",
  concesionPct: "0.0000",
  participacionPct: "65.00",
  castigoPct: "0.00",
  descuentoLiq: "0.00",
  od_lab_precio: "14.87",
  od_lab_cant: "1.00",
  od_lab_importe: "14.87",
  od_flete_precio: "529.07",
  od_flete_cant: "0.00",
  od_flete_importe: "156.58",
  od_cargador_precio: "80.00",
  od_cargador_cant: "0.00",
  od_cargador_importe: "0.00",
  od_logHist_precio: "0.00",
  od_logHist_cant: "0.00",
  od_logHist_importe: "0.00",
  od_log_precio: "0.00",
  od_log_cant: "0.00",
  od_log_importe: "0.00",
  od_otros_precio: "0.00",
  od_otros_cant: "0.00",
  od_otros_importe: "308.62",
  anticipo: "0.00",
  igvPct: "18.00",
  cuPct: "2.00",
  cateador: "MARQUINA ABILA ROBERTO",
  ruc: "10410122915",
  guia: "01-000713",
  placa: "TAQ-813",
  aprobJefatura: "ADELACRUZ",
  fechaAprobJefatura: "2026-09-24",
  horaAprobJefatura: "18:05:00",
  aprobGerencia: "ECCARITA",
  fechaAprobGerencia: "2026-09-24",
  horaAprobGerencia: "11:35:00",
  aprobContabilidad: "ADELACRUZ",
  fechaAprobContabilidad: "2026-09-24",
  horaAprobContabilidad: "18:11:00",
};

export interface LiquidacionCalc {
  humedad: number;
  pbs: number;
  merma: number;
  pns: number;
  auOz: number;
  agOz: number;
  auUsd: number;
  agUsd: number;
  valorizacion: number;
  manipuleo: number;
  maquila: number;
  deducciones: number;
  ds: number;
  concesion: number;
  totalAntes: number;
  participacion: number;
  castigo: number;
  otrasTotal: number;
  valorVenta: number;
  valorVentaFinal: number;
  igv: number;
  totalFacturar: number;
  cu: number;
  neto: number;
}

export function calcLiquidacion(v: FormValues): LiquidacionCalc {
  const n = (k: string) => toNumber(v[k]);
  const pbh = n("pbh");

  // Cada paso se redondea como en el reporte original (3 decimales en pesos)
  const humedad = round((pbh * n("humedadPct")) / 100, 3);
  const pbs = round(pbh - humedad, 3);
  const merma = round((pbs * n("mermaPct")) / 100, 3);
  const pns = round(pbs - merma, 3);

  const auOz = round((pns * n("leyAu") * n("recAu")) / 100, 3);
  const agOz = round((pns * n("leyAg") * n("recAg")) / 100, 3);
  const auUsd = round(auOz * n("cotAu"), 2);
  const agUsd = round(agOz * n("cotAg"), 2);
  const valorizacion = round(auUsd + agUsd, 2);

  const manipuleo = round(n("manipuleo") * pbh, 2);
  const maquila = round(n("maquila") * pbs, 2);
  const deducciones = round(manipuleo + maquila, 2);
  const ds = round((valorizacion * n("dsPct")) / 100, 2);
  const concesion = round((valorizacion * n("concesionPct")) / 100, 2);
  const totalAntes = round(valorizacion - deducciones - ds - concesion, 2);

  const participacion = round((valorizacion * n("participacionPct")) / 100 - deducciones - ds - concesion, 2);
  const castigo = round((participacion * n("castigoPct")) / 100, 2);

  const otrasTotal = round(otrasDeducciones.reduce((s, d) => s + n(`od_${d.id}_importe`), 0), 2);
  const valorVenta = round(participacion - castigo - n("descuentoLiq") - otrasTotal, 2);
  const valorVentaFinal = round(valorVenta - n("anticipo"), 2);
  const igv = round((valorVentaFinal * n("igvPct")) / 100, 2);
  const totalFacturar = round(valorVentaFinal + igv, 2);
  const cu = round((valorizacion * n("cuPct")) / 100, 2);
  const neto = round(valorVentaFinal - cu, 2);

  return {
    humedad, pbs, merma, pns, auOz, agOz, auUsd, agUsd, valorizacion,
    manipuleo, maquila, deducciones, ds, concesion, totalAntes, participacion, castigo,
    otrasTotal, valorVenta, valorVentaFinal, igv, totalFacturar, cu, neto,
  };
}
