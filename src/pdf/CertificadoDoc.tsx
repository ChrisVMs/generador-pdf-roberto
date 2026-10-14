import { Document, Page } from "@react-pdf/renderer";
import type { ComponentProps } from "react";
import type { FormValues } from "@/lib/fields";
import { calcCertificado } from "@/lib/certificado";
import { fecha, fechaCorta, hora12, hora24, num } from "@/lib/format";
import { Box, HLine, Logo, T } from "./primitives";

// A4 en puntos (mismo tamaño que el formato de referencia)
const W = 595.28;

const P = (p: Omit<ComponentProps<typeof T>, "pageWidth">) => <T pageWidth={W} size={9} {...p} />;

/** `emitidoEn`: fecha y hora de emisión; por defecto, el momento en que se genera el PDF. */
export function CertificadoDoc({ values: v, logoSrc, emitidoEn = new Date() }: {
  values: FormValues;
  logoSrc?: string;
  emitidoEn?: Date;
}) {
  const c = calcCertificado(v);
  const pad = (n: number) => String(n).padStart(2, "0");
  const fechaEmision = `${emitidoEn.getFullYear()}-${pad(emitidoEn.getMonth() + 1)}-${pad(emitidoEn.getDate())}`;
  const horaEmision = `${pad(emitidoEn.getHours())}:${pad(emitidoEn.getMinutes())}:${pad(emitidoEn.getSeconds())}`;
  const [horaA, horaB] = splitHora(hora12(horaEmision, true));

  return (
    <Document title={`Certificado de Lixiviación ${v.lote}`}>
      <Page size="A4" style={{ position: "relative" }}>
        {/* Encabezado */}
        <Logo src={logoSrc} x={10.08} y={25.09} width={145.47} height={40.5} />
        <P x={29.5} y={70.99}>CIA. MINERA PODEROSA S.A.A.</P>
        <P x={306} y={47.69} font="helvB" size={10} align="center">CERTIFICADO DE LIXIVIACIÓN</P>
        <P x={306} y={71.69} font="helvB" size={10} align="center">LABORATORIO METALURGICO - VIJUS</P>
        <P x={527.8} y={46.39} size={8}>{fecha(fechaEmision)}</P>
        <P x={527.8} y={62.99} size={8}>{horaA}</P>
        <P x={527.8} y={72} size={8}>{horaB}</P>

        {/* Datos generales */}
        <Box x1={10.08} y1={105.07} x2={586.8} y2={197.62} />
        <P x={19.4} y={121.99}>ATENCIÓN A LOS SEÑORES DEL:</P>
        <P x={19.4} y={142.89}>LOTE:</P>
        <P x={19.4} y={161.59}>CÓDIGO DE ACOPIO:</P>
        <P x={19.4} y={180.39}>NRO GUIA:</P>
        <P x={184.9} y={123.39} font="timesB">{v.atencion}</P>
        <P x={184.9} y={144.19} font="timesB">{v.lote}</P>
        <P x={184.9} y={162.99} font="timesB">{v.codigoAcopio}</P>
        <P x={184.9} y={181.69} font="timesB">{v.nroGuia}</P>

        <P x={417.4} y={122.09}>FECHA RECEPCIÓN:</P>
        <P x={417.4} y={140.29}>FECHA INI. PRUEBA:</P>
        <P x={417.4} y={158.39}>HORA INI. PRUEBA:</P>
        <P x={579.5} y={122.09} font="helvB" align="right">{fecha(v.fechaRecepcion)}</P>
        <P x={579.5} y={140.09} font="helvB" align="right">{fecha(v.fechaIniPrueba)}</P>
        <P x={581} y={159.99} font="helvB" align="right">{hora12(v.horaIniPrueba)}</P>

        {/* Tabla de resultados */}
        <P x={19} y={213.49} font="helvB">DESCR_MUESTRA</P>
        <P x={215.9} y={213.49} font="helvB" align="center" width={40}>AU</P>
        <P x={307.6} y={213.49} font="helvB" align="center" width={40}>AG</P>
        <P x={402.3} y={213.49} font="helvB" align="center" width={40}>AU</P>
        <P x={494.4} y={213.49} font="helvB" align="center" width={40}>AG</P>
        <HLine x1={17.28} x2={579.6} y={228.22} />

        <P x={19} y={246.09}>SOLUCION RICA</P>
        <P x={220.5} y={246.09} align="right">{num(Number(v.solAu), 3)}</P>
        <P x={231.4} y={246.09}>GR/M3</P>
        <P x={315.2} y={246.09} align="right">{num(Number(v.solAg), 3)}</P>
        <P x={326.1} y={246.09}>GR/M3</P>

        <P x={19} y={272.99}>RELAVE SOLIDO</P>
        <P x={220.5} y={272.99} align="right">{num(Number(v.relAu), 3)}</P>
        <P x={231.4} y={272.99}>GR/TM</P>
        <P x={315.2} y={272.99} align="right">{num(Number(v.relAg), 3)}</P>
        <P x={326.1} y={272.99}>GR/TM</P>

        <HLine x1={17.28} x2={579.6} y={291.67} />

        <P x={19} y={299.99} font="helvB">CABEZA CALCULADA</P>
        <P x={220.5} y={299.99} font="helvB" align="right">{num(c.cabezaAu, 3)}</P>
        <P x={231.4} y={299.99}>GR/TM</P>
        <P x={315.2} y={299.99} font="helvB" align="right">{num(c.cabezaAg, 3)}</P>
        <P x={326.1} y={299.99}>GR/TM</P>
        <P x={410.3} y={299.99} font="helvB" align="right">{num(c.ozAu, 3)}</P>
        <P x={421.2} y={299.99}>OZ/TM</P>
        <P x={501.2} y={299.99} font="helvB" align="right">{num(c.ozAg, 3)}</P>
        <P x={508.3} y={299.99}>OZ/TM</P>

        <P x={19} y={325.49} font="helvB">Recuperación (Au)</P>
        <P x={223} y={325.49} font="helvB" align="right">{num(Number(v.recuperacion), 3)}</P>
        <P x={228.5} y={325.49} font="helvB">%</P>

        <HLine x1={10.08} x2={586.8} y={344.29} />

        {/* Pie */}
        <P x={19} y={398.59} size={8}>Observaciones</P>
        <P x={26.1} y={417.09} size={8} width={308} justify lineHeight={1.23}>
          * De no estar conforme con los resultados emitidos en el certificado, deberan usar su contramuestra de
          solución rica de 24 horas de cianuración, para su análisis externo dentro de los 30 días de emitido este
          certificado
        </P>
        <P x={19} y={454.29} size={8}>Acopio</P>
        <P x={577.8} y={454.89} align="right">CATEADOR</P>

        {/* Aprobación */}
        <P x={378.6} y={382.69} font="helvB">Aprobado</P>
        <P x={378.6} y={399.19} font="helvB">Por LM:</P>
        <P x={447.6} y={398.49}>{v.aprobadoPor}</P>
        <P x={378.6} y={415.79} font="helvB">Fecha:</P>
        <P x={447.6} y={414.99}>{`${fechaCorta(v.fechaAprobacion)} ${hora24(v.horaAprobacion)}`}</P>
      </Page>
    </Document>
  );
}

/** "05:21:46 p. m." -> ["05:21:46 p.", "m."] (el original parte la hora en dos líneas) */
function splitHora(h: string): [string, string] {
  const i = h.lastIndexOf(" ");
  return i > 0 ? [h.slice(0, i), h.slice(i + 1)] : [h, ""];
}
