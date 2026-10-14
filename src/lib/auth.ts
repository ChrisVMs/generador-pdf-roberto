// Login sin backend: solo se guarda el hash SHA-256 de "usuario:contraseña",
// nunca las credenciales en texto plano.
const CREDENTIAL_HASH = "bf8f76b10f8e6081db88895b62cb4ceb554408778c82e11a36722e7f46cf5d0a";
const SESSION_KEY = "pdfgen.session";

// Identificador del build/arranque actual (inyectado por next.config.mjs).
// La sesión sólo es válida para el mismo build: al reiniciar el servidor o
// recompilar, cambia y se exige iniciar sesión de nuevo.
const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || "dev";

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function login(user: string, password: string): Promise<boolean> {
  const ok = (await sha256(`${user.trim().toLowerCase()}:${password}`)) === CREDENTIAL_HASH;
  if (ok) sessionStorage.setItem(SESSION_KEY, BUILD_ID);
  return ok;
}

export function isLoggedIn(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === BUILD_ID;
  } catch {
    return false;
  }
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
