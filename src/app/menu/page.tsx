"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { logout } from "@/lib/auth";

const reportes = [
  { href: "/certificado", title: "Certificado de Lixiviación", desc: "Resultados de laboratorio: solución rica, relave y cabeza calculada." },
  { href: "/liquidacion", title: "Liquidación", desc: "Valorización de mineral, deducciones, participación y neto a pagar." },
];

export default function MenuPage() {
  const router = useRouter();
  return (
    <AuthGuard>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
            <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">Reportes</h1>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              logout();
              router.replace("/");
            }}
          >
            Cerrar sesión
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {reportes.map((r) => (
            <Link key={r.href} href={r.href} className="card group transition hover:border-brand hover:shadow-md">
              <h2 className="mb-1 text-lg font-semibold text-slate-800 group-hover:text-brand-dark">{r.title}</h2>
              <p className="text-sm text-slate-500">{r.desc}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-dark">Abrir →</span>
            </Link>
          ))}
        </div>
      </main>
    </AuthGuard>
  );
}
