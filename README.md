# PDF Generator

App Next.js 15 sin backend (export estático) para generar en PDF el **Certificado de Lixiviación** y la **Liquidación**.
Los documentos se marcan como simulación (no oficiales).

## Uso

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # genera /out (sitio estático)
```

Requiere Node 18.18 o superior.

El build no se minifica: el JS y el CSS salen legibles (`next.config.mjs`) y el HTML exportado se formatea
con Prettier en `postbuild`. En `.prettierrc`, `htmlWhitespaceSensitivity: "strict"` es obligatorio: el formato
por defecto agrega espacios entre etiquetas y rompe la hidratación de React (error #418).

## Logo

`public/logo.png` es un logo de prueba. Reemplázalo por tu propio PNG o JPG con el mismo nombre. Funciona mejor
en formato horizontal (≈ 3.5:1) y con fondo transparente. Se muestra en el login, en el menú y en ambos PDF.

## Estructura

- `src/lib/certificado.ts` / `src/lib/liquidacion.ts`: campos del formulario y fórmulas.
- `src/pdf/*Doc.tsx`: plantillas PDF (`@react-pdf/renderer`, licencia MIT) con posiciones medidas sobre los originales.
- `src/lib/auth.ts`: login local; solo se guarda el hash SHA-256 de las credenciales.

## Fórmulas

**Certificado**
- Cabeza calculada = Solución rica × 2 + Relave sólido
- OZ/TM = GR/TM ÷ 31.1035
- La recuperación (Au) se ingresa a mano

**Liquidación** (los pesos se redondean a 3 decimales en cada paso)
- Humedad = PBH × %; PBS = PBH − Humedad; Merma = PBS × %; PNS = PBS − Merma
- OZ = PNS × Ley × Recup%; USD = OZ × Cotización; Valorización = Au + Ag
- Manipuleo = tarifa × PBH; Maquila = tarifa × PBS
- Participación = Valorización × % − (Manipuleo + Maquila + D.S. + Concesión)
- Valor de venta = Participación − Castigo − Descuento liq. anterior − Total otras deducciones
- Valor de venta final = Valor de venta − Anticipo; IGV = VVF × 18 %; Total a facturar = VVF + IGV
- CU (cesión en uso) = Valorización × 2 %; Neto a pagar = VVF − CU
- En "Otras deducciones" el importe se ingresa a mano (en los originales no siempre es precio × cantidad)
