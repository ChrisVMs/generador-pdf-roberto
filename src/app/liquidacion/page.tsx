"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { ReportForm } from "@/components/ReportForm";
import { calcLiquidacion, liquidacionEjemplo, liquidacionSections } from "@/lib/liquidacion";
import { num } from "@/lib/format";

export default function LiquidacionPage() {
  return (
    <AuthGuard>
      <ReportForm
        title="Liquidación"
        sections={liquidacionSections}
        summary={(v) => {
          const c = calcLiquidacion(v);
          return [
            { label: "Humedad (T.M.)", value: num(c.humedad, 3) },
            { label: "Peso bruto seco (T.M.S.)", value: num(c.pbs, 3) },
            { label: "Merma (T.M.S.)", value: num(c.merma, 3) },
            { label: "Peso neto seco (T.M.S.)", value: num(c.pns, 3) },
            { label: "Oro (OZ)", value: num(c.auOz, 3) },
            { label: "Plata (OZ)", value: num(c.agOz, 3) },
            { label: "Oro (USD)", value: num(c.auUsd, 2) },
            { label: "Plata (USD)", value: num(c.agUsd, 2) },
            { label: "Valorización total", value: num(c.valorizacion, 2) },
            { label: "Deducciones", value: num(c.deducciones, 2) },
            { label: "Total antes de participación", value: num(c.totalAntes, 2) },
            { label: "Participación minero", value: num(c.participacion, 2) },
            { label: "Total otras deducciones", value: num(c.otrasTotal, 2) },
            { label: "Valor de venta final", value: num(c.valorVentaFinal, 2) },
            { label: "I.G.V.", value: num(c.igv, 2) },
            { label: "Total a facturar", value: num(c.totalFacturar, 2) },
            { label: "Cesión en uso", value: num(c.cu, 2) },
            { label: "Neto a pagar", value: num(c.neto, 2) },
          ];
        }}
        buildDocument={async (v, logo) => {
          const { LiquidacionDoc } = await import("@/pdf/LiquidacionDoc");
          return <LiquidacionDoc values={v} logoSrc={logo} />;
        }}
        fileName={(v) => `Liquidacion${v.nro || ""}.pdf`}
        sample={liquidacionEjemplo}
        logoPath="/logoliquidacion.png"
      />
    </AuthGuard>
  );
}
