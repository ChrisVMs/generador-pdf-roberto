/** @type {import('next').NextConfig} */
// Identificador único por build / arranque del servidor. Se inyecta en el bundle
// y se guarda junto con la sesión: al reiniciar `npm run dev` o recompilar, cambia
// y la sesión anterior queda invalidada (obliga a iniciar sesión de nuevo).
const buildId = Date.now().toString(36);

const nextConfig = {
  // Sitio 100% estǭtico (sin backend): `npm run build` genera la carpeta /out
  output: "export",
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BUILD_ID: buildId },
};

export default nextConfig;
