import { Document, Page } from "@react-pdf/renderer";
import type { ComponentProps } from "react";
import type { FormValues } from "@/lib/fields";
import { calcLiquidacion, otrasDeducciones } from "@/lib/liquidacion";
import { fecha, fechaCorta, hora24, num, toNumber } from "@/lib/format";
import { numeroALetras } from "@/lib/numeroALetras";
import { BLUE, Box, HLine, Logo, RED, T, VLine, type FontKind } from "./primitives";

// Carta (Letter) en puntos
const W = 612;

// Tamaños del formato original
const SZ = 7.05; // Cuerpo
const SZN = 7.15; // Números (Arial)
const SZ_XS = 6.95; // Códigos AU/AG, totales en negrita
const OZ = 8.75; // Marca "OZ" y operadores de fila

const P = (p: Omit<ComponentProps<typeof T>, "pageWidth">) => <T pageWidth={W} size={SZ} {...p} />;

/** Operador rojo ("*", "=") del formato original. */
const Mark = ({ x, y, font = "helvB", size = OZ, ch }: { x: number; y: number; font?: FontKind; size?: number; ch: string }) => (
  <P x={x} y={y} font={font} size={size} color={RED}>{ch}</P>
);

function Header({ logoSrc }: { logoSrc?: string }) {
  return (
    <>
      <Logo src={logoSrc} x={22.5} y={18} width={120.75} height={26.25} />
      <P x={152.9} y={38.8} font="timesB" size={12.35}>CONTRATO DE EXPLORACION Y EXPLOTACION</P>
    </>
  );
}

export function LiquidacionDoc({ values: v, logoSrc }: { values: FormValues; logoSrc?: string }) {
  const c = calcLiquidacion(v);
  const n = (k: string) => toNumber(v[k]);

  const leftLabels = ["LIQUIDACION :", "DIRECCION   :", "POR :", "RECIBIDOS  EN :", "FECHA RECEPCION :", "FECHA MUESTRA :"];
  const leftValues = ["MINERAL BAJA LEY", "VIJUS", "MINERAL", "CANCHA MINERAL - VIJUS", fecha(v.fechaRecepcion), fecha(v.fechaMuestra)];
  const rightLabels = ["NRO.  :", "CODIGO :", "LOTE :", "PROCEDENCIA :", "CONCESION:", "TIPO PROCESO  :"];
  const rightLabelX = [450.7, 440.45, 450.3, 419.45, 430.4, 415.05];
  const rightValues = [v.nro, "026", v.lote, v.procedencia, v.concesion, "LABOR ASIGNADA"];
  const headY = [66.885, 78.885, 90.885, 102.885, 114.885, 126.885];
  const rightLabelY = [66.885, 78.885, 90.885, 102.885, 116.385, 126.885];
  const rightValueY = [65.735, 77.735, 89.735, 101.735, 113.735, 124.985];

  const pesoRows: [string, number][] = [
    ["T.M.H.", toNumber(v.pbh)],
    ["T.M.", c.humedad],
    ["T.M.S.", c.pbs],
    ["T.M.S.", c.merma],
    ["T.M.S.", c.pns],
  ];
  const pesoLabelY = [168.885, 180.885, 192.885, 204.885, 216.885];
  const pesoNumY = [167.805, 179.805, 191.805, 203.805, 215.805];

  const odRows = [68.4, 80.4, 92.4, 104.4, 116.4, 128.4];
  const aprobaciones = [
    { label: "Aprobacion de Jefatura :", quien: v.aprobJefatura, fecha: v.fechaAprobJefatura, hora: v.horaAprobJefatura, labelY: 355.875, nameX: 324, nameY: 355.015, dateX: 432, dateY: 355.015, doce: false },
    { label: "Aprobacion de Gerencia de Operaciones :", quien: v.aprobGerencia, fecha: v.fechaAprobGerencia, hora: v.horaAprobGerencia, labelY: 373.875, nameX: 324, nameY: 373.015, dateX: 432, dateY: 373.015, doce: false },
    { label: "APROBACION DE Contabilidad", quien: v.aprobContabilidad, fecha: v.fechaAprobContabilidad, hora: v.horaAprobContabilidad, labelY: 391.575, nameX: 321, nameY: 391.565, dateX: 423, dateY: 391.015, doce: true },
  ];

  return (
    <Document title={`Liquidación ${v.nro}`}>
      {/* ---------------- Página 1 ---------------- */}
      <Page size="LETTER" style={{ position: "relative" }}>
        <Header logoSrc={logoSrc} />

        <Box x1={24.5} y1={55.25} x2={587.5} y2={140.5} w={1} />
        {headY.map((y, i) => (
          <P key={`l${i}`} x={36} y={y} font="timesB">{leftLabels[i]}</P>
        ))}
        {headY.map((y, i) => (
          <P key={`lv${i}`} x={132} y={y - 1.15} font="times">{leftValues[i]}</P>
        ))}
        {rightLabelX.map((x, i) => (
          <P key={`r${i}`} x={x} y={rightLabelY[i]} font="timesB">{rightLabels[i]}</P>
        ))}
        {rightValueY.map((y, i) => (
          <P key={`rv${i}`} x={486} y={y} font="times">{rightValues[i]}</P>
        ))}

        <P x={36} y={150.885} font="timesB">LOTE Nro.</P>
        <P x={132} y={149.805} size={SZN}>{v.lote}</P>
        <P x={306} y={150.885} font="timesB">CERTIF.DE LABORATORIO  Nro</P>

        {/* Pesos / leyes / cotizaciones */}
        <Box x1={24} y1={156.75} x2={588} y2={240.75} w={0.5} />
        <VLine x={426.5} y1={162.75} y2={233.25} w={1} />
        <P x={36} y={pesoLabelY[0]} font="timesB">PESO BRUTO HUMEDO :</P>
        <P x={36} y={pesoLabelY[1]} font="timesB">HUMEDAD  %</P>
        <P x={36} y={pesoLabelY[2]} font="timesB">PESO BRUTO SECO :</P>
        <P x={36} y={pesoLabelY[3]} font="timesB">MERMA         %</P>
        <P x={36} y={pesoLabelY[4]} font="timesB">PESO NETO SECO :</P>
        <P x={195.9} y={pesoNumY[1]} size={SZN} align="right">{num(n("humedadPct"), 3)}</P>
        <P x={195.9} y={pesoNumY[3]} size={SZN} align="right">{num(n("mermaPct"), 3)}</P>
        {pesoRows.map(([unit, val], i) => (
          <P key={`p${i}`} x={297.8} y={pesoNumY[i]} size={SZN} align="right">{num(val, 3)}</P>
        ))}
        {pesoRows.map(([unit], i) => (
          <P key={`pu${i}`} x={318} y={pesoLabelY[i]} font="timesB">{unit}</P>
        ))}

        <P x={432} y={162.885} font="timesB" color={BLUE}>LEYES </P>
        <P x={436.5} y={174.065} font="helvB" size={SZ_XS}>AU</P>
        <P x={489} y={173.805} size={SZN}>OZ/TM</P>
        <P x={568.9} y={173.805} size={SZN} align="right">{num(n("leyAu"), 3)}</P>
        <P x={436.5} y={185.115} font="helvB" size={SZ_XS}>AG</P>
        <P x={489} y={184.855} size={SZN}>OZ/TM</P>
        <P x={568.9} y={184.855} size={SZN} align="right">{num(n("leyAg"), 3)}</P>
        <P x={432} y={198.885} font="timesB" color={BLUE}>COTIZACIONES </P>
        <P x={436.5} y={210.065} font="helvB" size={SZ_XS}>AU</P>
        <P x={488.25} y={209.805} size={SZN}>USD/OZ</P>
        <P x={569.3} y={209.805} size={SZN} align="right">{num(n("cotAu"), 3)}</P>
        <P x={436.5} y={221.115} font="helvB" size={SZ_XS}>AG</P>
        <P x={488.25} y={220.855} size={SZN}>USD/OZ</P>
        <P x={569.3} y={220.855} size={SZN} align="right">{num(n("cotAg"), 3)}</P>
        <P x={432} y={234.885} font="timesB" color={BLUE}>P.U.TM.</P>
        <P x={567.9} y={233.805} size={SZN} align="right">{num(n("putm"), 2)}</P>
        <P x={432} y={246.885} font="timesB">TIPO CAMBIO :</P>
        <P x={567.9} y={245.805} size={SZN} align="right">{num(n("tipoCambio"), 3)}</P>

        <P x={24} y={247.11} font="timesB" size={8.8}>VALORIZACIÓN DE MINERAL:</P>

        {/* Valorización */}
        <Box x1={30.5} y1={259.25} x2={587.5} y2={275.65} w={1} />
        {[
          ["MINERAL", 45.95], ["T.M.S.", 130.75], ["P.U.TM.", 179], ["LEY", 226.75], ["RECUP . %", 275.7],
          ["TOTAL", 353.65], ["UNIDAD", 411.85], ["USD/OZ", 463.85], ["TOTAL (USD)", 526.35],
        ].map(([label, x]) => (
          <P key={label as string} x={x as number} y={270.885} font="timesB">{label}</P>
        ))}
        <Row
          y={281.855}
          name="ORO (AU)"
          nameFont="helv" nameSize={SZN}
          valueFont="helv" valueSize={SZN}
          ozFont="helv" ozSize={OZ}
          pns={c.pns} pnsX={152.8} ley={n("leyAu")} leyX={247.9} rec={n("recAu")} recX={307.8}
          oz={c.auOz} ozX={382.7} ozY={281.375} cot={n("cotAu")} cotX={495.8} usd={c.auUsd} usdX={567.8}
          markY={283.925} markFont="helvB" markSize={OZ}
        />
        <Row
          y={292.675}
          name="PLATA(AG)"
          nameFont="helv" nameSize={SZN}
          valueFont="helv" valueSize={SZN}
          ozFont="helv" ozSize={OZ}
          pns={c.pns} pnsX={157.7} ley={n("leyAg")} leyX={251.9} rec={n("recAg")} recX={312.7}
          oz={c.agOz} ozX={386.7} ozY={292.675} cot={n("cotAg")} cotX={500.7} usd={c.agUsd} usdX={571.9}
          markY={295.225} markFont="helvB" markSize={OZ}
        />

        <HLine x1={504} x2={570} y={305.9} w={1} />
        <P x={30} y={311.535} font="timesB">VALORIZACION TOTAL  ( USD )</P>
        <P x={568.15} y={311.1} font="helvB" size={SZ_XS} align="right">{num(c.valorizacion, 2)}</P>
        <HLine x1={504} x2={570} y={317.9} w={1} />
        <HLine x1={504} x2={570} y={323.9} w={1} />

        <P x={30} y={323.535} font="timesB">DEDUCCIONES     ( USD )</P>
        <P x={198} y={329.535} font="times" color={BLUE}>MANIPULEO  </P>
        <P x={327.9} y={328.455} size={SZN} align="right">{num(n("manipuleo"), 2)}</P>
        <Mark x={344.3} y={330.525} ch="*" />
        <P x={393.9} y={328.455} size={SZN} align="right">{num(n("pbh"), 2)}</P>
        <Mark x={410.95} y={331.455} font="timesB" size={10.65} ch="=" />
        <P x={471.9} y={328.455} size={SZN} align="right">{num(c.manipuleo, 2)}</P>

        <P x={198} y={341.535} font="times" color={BLUE}>MAQUILA</P>
        <P x={327.8} y={340.455} size={SZN} align="right">{num(n("maquila"), 2)}</P>
        <Mark x={344.3} y={342.525} ch="*" />
        <P x={393.9} y={340.455} size={SZN} align="right">{num(c.pbs, 2)}</P>
        <Mark x={410.95} y={343.455} font="timesB" size={10.65} ch="=" />
        <P x={471.8} y={340.455} size={SZN} align="right">{num(c.maquila, 2)}</P>
        <P x={567.8} y={340.455} size={SZN} align="right">{num(c.deducciones, 2)}</P>

        <P x={198} y={359.535} font="times" color={BLUE}>D.S. 180/181-2011-EF</P>
        <P x={392.6} y={358.455} size={SZN} align="right">{num(n("dsPct"), 2)}</P>
        <P x={396} y={359.535} size={SZN}>%</P>
        <Mark x={410.95} y={361.455} font="timesB" size={10.65} ch="=" />
        <P x={572.6} y={358.455} size={SZN} align="right" color={BLUE}>{num(c.ds, 2)}</P>

        <P x={198} y={371.535} font="times" color={BLUE}>CONCESION MINERA</P>
        <P x={395.3} y={370.455} size={SZN} align="right">{num(n("concesionPct"), 4)}</P>
        <P x={396} y={371.535} size={SZN}>%</P>
        <Mark x={410.95} y={373.455} font="timesB" size={10.65} ch="=" />
        <P x={572.6} y={370.455} size={SZN} align="right" color={BLUE}>{num(c.concesion, 2)}</P>

        <P x={30} y={383.535} font="timesB">TOTAL ANTES DE LA PARTICIPACION</P>
        <P x={568.15} y={382.715} font="helvB" size={SZ_XS} align="right" color={BLUE}>{num(c.totalAntes, 2)}</P>
        <P x={30} y={395.535} font="timesB">PARTICIPACION MINERO</P>
        <P x={252} y={395.07} size={8.1} align="right">{num(n("participacionPct"), 2)}</P>
        <P x={264} y={395.535} font="timesB">%</P>
        <P x={567.8} y={394.455} size={SZN} align="right" color={BLUE}>{num(c.participacion, 2)}</P>
        <P x={30} y={407.535} font="timesB">CASTIGO PROVISIONAL</P>
        <P x={252} y={407.07} size={8.1} align="right">{num(n("castigoPct"), 2)}</P>
        <P x={264} y={407.535} font="timesB">%</P>
        <P x={567.9} y={406.455} size={SZN} align="right" color={BLUE}>{num(c.castigo, 2)}</P>
        <P x={30} y={420.015} font="timesB" size={7.95} color={RED}>
          DESCUENTO POR LIQ. ANTERIOR ( Solo en caso de Regularizaciones )
        </P>
        <P x={567.7} y={419.07} size={8.1} align="right" color={RED}>{num(n("descuentoLiq"), 2)}</P>
        <HLine x1={30} x2={582.75} y={432.4} w={2} />
      </Page>

      {/* ---------------- Página 2 ---------------- */}
      <Page size="LETTER" style={{ position: "relative" }}>
        <Header logoSrc={logoSrc} />

        <P x={42} y={54.885} font="timesB">OTRAS DEDUCCIONES   ( $ )</P>
        {otrasDeducciones.map((d, i) => (
          <OtraDeduccion
            key={d.id}
            top={odRows[i]}
            label={d.label}
            unidad={d.unidad}
            precio={n(`od_${d.id}_precio`)}
            cant={n(`od_${d.id}_cant`)}
            importe={n(`od_${d.id}_importe`)}
          />
        ))}

        <P x={42} y={139.435} font="timesB">TOTAL  OTRAS DEDUCCIONES</P>
        <P x={567.3} y={138.485} font="timesB" align="right">{num(c.otrasTotal, 2)}</P>
        <HLine x1={21} x2={579} y={143.5} w={1} />

        <P x={48} y={150.885} font="times">VALOR DE VENTA  </P>
        <P x={482.6} y={151.065} font="times" size={8.95}>$.</P>
        <P x={574.1} y={149.935} font="timesB" align="right">{num(c.valorVenta, 2)}</P>
        <P x={48} y={168.885} font="times">ANTICIPO POR LIQUIDACION PROVISIONA</P>
        <P x={574.1} y={167.935} font="timesB" align="right">{num(n("anticipo"), 2)}</P>
        <P x={48} y={186.885} font="times">VALOR DE VENTA  FINAL</P>
        <P x={234} y={185.805} size={SZN} color={RED}>Nota : Generar Nota de Credito</P>
        <P x={574.1} y={185.935} font="timesB" align="right">{num(c.valorVentaFinal, 2)}</P>
        <P x={48} y={198.885} font="times">I.G.V.</P>
        <P x={90.35} y={198.065} font="helvB" size={SZ_XS}>{num(n("igvPct"), 2)}</P>
        <P x={114} y={198.885} font="timesB">%</P>
        <P x={574.1} y={197.935} font="timesB" align="right">{num(c.igv, 2)}</P>
        <P x={48} y={217.365} font="timesB" size={7.95}>TOTAL A FACTURAR</P>
        <P x={156} y={215.805} size={SZN}>{numeroALetras(c.totalFacturar)}</P>
        <P x={574.1} y={215.935} font="timesB" align="right">{num(c.totalFacturar, 2)}</P>
        <HLine x1={21} x2={579} y={223.25} w={1} />

        <P x={48} y={231.375} font="helvB" size={OZ}>Otros Descuentos :</P>
        <P x={42} y={241.355} size={SZN}>CU</P>
        <P x={84} y={241.355} size={SZN}>CESION EN USO</P>
        <P x={351.9} y={240.605} size={SZN} align="right">{num(n("cuPct"), 2)}</P>
        <P x={359.8} y={240.605} size={SZN}>%</P>
        <P x={420} y={241.355} size={SZN}>{num(c.cu, 2)}</P>

        <P x={42} y={259.365} font="timesB" size={7.95}>NETO A PAGAR</P>
        <P x={573.8} y={258.565} font="timesB" size={7.95} align="right">{num(c.neto, 2)}</P>

        <HLine x1={468} x2={589} y={283.25} w={1} />
        <P x={496} y={288.885} font="times">RECIBI CONFORME</P>

        <P x={42} y={300.885} font="times">CATEADOR        :</P>
        <P x={144} y={301.375} font="helvB" size={OZ}>{v.cateador}</P>
        <P x={42} y={312.885} font="times">RUC                      :</P>
        <P x={144} y={312.76} font="helvB" size={7.8}>{v.ruc}</P>

        <P x={42} y={330.885} font="timesB">GUIA Nro.</P>
        <P x={144} y={329.805} size={SZN}>{v.guia}</P>
        <P x={264} y={330.885} font="timesB">UNIDAD </P>
        <P x={336} y={330.885} font="times">CIA</P>
        <P x={432} y={330.885} font="timesB">PLACA</P>
        <P x={486} y={329.805} size={SZN}>{v.placa}</P>
        <HLine x1={25} x2={575} y={342.75} w={0.5} dashed />

        {aprobaciones.map((a) => (
          <Aprobacion key={a.label} {...a} />
        ))}
      </Page>
    </Document>
  );
}

function Row({
  y, name, nameFont, nameSize, valueFont, valueSize, ozFont, ozSize,
  pns, pnsX, ley, leyX, rec, recX, oz, ozX, ozY, cot, cotX, usd, usdX, markY, markFont, markSize,
}: {
  y: number; name: string; nameFont: FontKind; nameSize: number;
  valueFont: FontKind; valueSize: number; ozFont: FontKind; ozSize: number;
  pns: number; pnsX: number; ley: number; leyX: number; rec: number; recX: number;
  oz: number; ozX: number; ozY: number; cot: number; cotX: number; usd: number; usdX: number;
  markY: number; markFont: FontKind; markSize: number;
}) {
  return (
    <>
      <P x={36} y={y} font={nameFont} size={nameSize}>{name}</P>
      <P x={pnsX} y={y} font={valueFont} size={valueSize} align="right">{num(pns, 3)}</P>
      <Mark x={212.3} y={markY} font={markFont} size={markSize} ch="*" />
      <P x={leyX} y={y} font={valueFont} size={valueSize} align="right">{num(ley, 3)}</P>
      <Mark x={256.8} y={markY} font={markFont} size={markSize} ch="*" />
      <P x={recX} y={y} font={valueFont} size={valueSize} align="right">{num(rec, 3)}</P>
      <Mark x={325.45} y={markY} font={markFont} size={markSize} ch="=" />
      <P x={ozX} y={y} font={valueFont} size={valueSize} align="right">{num(oz, 3)}</P>
      <P x={422.55} y={ozY} font={ozFont} size={ozSize}>OZ</P>
      <P x={cotX} y={y} font={valueFont} size={valueSize} align="right">{num(cot, 3)}</P>
      <P x={usdX} y={y} font={valueFont} size={valueSize} align="right">{num(usd, 2)}</P>
    </>
  );
}

function OtraDeduccion({ top, label, unidad, precio, cant, importe }: {
  top: number; label: string; unidad: string; precio: number; cant: number; importe: number;
}) {
  const y = top - SZ * 0.3;
  return (
    <>
      <P x={45} y={y} font="times" color={BLUE}>{label}</P>
      <P x={330.4} y={y} font="times" align="right">{num(precio, 2)}</P>
      <Mark x={345.75} y={top - 0.785} font="times" size={8.95} ch="*" />
      <P x={375.4} y={y} font="times" align="right">{num(cant, 2)}</P>
      {unidad ? <P x={381} y={top - 2.045} size={SZN}>{unidad}</P> : null}
      <Mark x={414.5} y={top - 0.74} font="timesB" size={8.8} ch="=" />
      <P x={473} y={y} font="times" align="right">{num(importe, 2)}</P>
    </>
  );
}

function Aprobacion({ label, labelY, nameX, nameY, dateX, dateY, quien, fecha, hora, doce }: {
  label: string; labelY: number; nameX: number; nameY: number; dateX: number; dateY: number;
  quien: string; fecha: string; hora: string; doce: boolean;
}) {
  const stamp = doce ? `${fechaCorta(fecha)} ${hora12corta(hora)}` : `${fechaCorta(fecha)}  ${hora24(hora)}`;
  return (
    <>
      <P x={42} y={labelY} font="helvB" size={OZ}>{label}</P>
      <P x={nameX} y={nameY} size={8.95}>{quien}</P>
      <P x={dateX} y={dateY} size={8.95}>{stamp}</P>
    </>
  );
}

/** "18:11:00" -> "6:11PM" (formato de la tercera aprobación, como el original) */
function hora12corta(hhmmss: string): string {
  if (!hhmmss) return "";
  const [h, m] = hhmmss.split(":").map(Number);
  const suf = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")}${suf}`;
}
