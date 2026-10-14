"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { ReportForm } from "@/components/ReportForm";
import { calcCertificado, certificadoEjemplo, certificadoSections } from "@/lib/certificado";
import { num } from "@/lib/format";

export default function CertificadoPage() {
  return (
    <AuthGuard>
      <ReportForm
        title="Certificado de Lixiviación"
        sections={certificadoSections}
        summary={(v) => {
          const c = calcCertificado(v);
          return [
            { label: "Cabeza AU (GR/TM)", value: num(c.cabezaAu, 3) },
            { label: "Cabeza AG (GR/TM)", value: num(c.cabezaAg, 3) },
            { label: "Cabeza AU (OZ/TM)", value: num(c.ozAu, 3) },
            { label: "Cabeza AG (OZ/TM)", value: num(c.ozAg, 3) },
          ];
        }}
        buildDocument={async (v, logo) => {
          const { CertificadoDoc } = await import("@/pdf/CertificadoDoc");
          return <CertificadoDoc values={v} logoSrc={logo} />;
        }}
        fileName={(v) => `CertificadoLixiviacion_${v.lote || "sin-lote"}.pdf`}
        sample={certificadoEjemplo}
      />
    </AuthGuard>
  );
}
