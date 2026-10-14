"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn, login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.replace("/menu");
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (await login(user, password)) {
      router.replace("/menu");
    } else {
      setError("Usuario o contraseña incorrectos");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-sm space-y-4">
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="mx-auto mb-3 h-14 w-auto object-contain" />
          <h1 className="text-xl font-bold text-slate-800">Generador de PDF</h1>
          <p className="text-sm text-slate-500">Ingresa tus credenciales</p>
        </div>
        <div>
          <label htmlFor="user" className="mb-1 block text-sm font-medium text-slate-700">Usuario</label>
          <input id="user" className="input" autoComplete="username" required value={user} onChange={(e) => setUser(e.target.value)} />
        </div>
        <div>
          <label htmlFor="pass" className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
          <input
            id="pass"
            type="password"
            className="input"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading || !user || !password}>
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
