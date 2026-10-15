const UNIDADES = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
const ESPECIALES = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
const VEINTES = ["VEINTE", "VEINTIUN", "VEINTIDOS", "VEINTITRES", "VEINTICUATRO", "VEINTICINCO", "VEINTISEIS", "VEINTISIETE", "VEINTIOCHO", "VEINTINUEVE"];
const DECENAS = ["", "", "", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
const CENTENAS = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];
function decenas(n) {
    if (n < 10)
        return UNIDADES[n];
    if (n < 20)
        return ESPECIALES[n - 10];
    if (n < 30)
        return VEINTES[n - 20];
    const d = Math.floor(n / 10);
    const u = n % 10;
    return u ? `${DECENAS[d]} Y ${UNIDADES[u]}` : DECENAS[d];
}
function centenas(n) {
    if (n === 100)
        return "CIEN";
    const c = Math.floor(n / 100);
    const r = n % 100;
    return [CENTENAS[c], decenas(r)].filter(Boolean).join(" ");
}
function miles(n) {
    const m = Math.floor(n / 1000);
    const r = n % 1000;
    const pre = m === 0 ? "" : m === 1 ? "MIL" : `${centenas(m)} MIL`;
    return [pre, centenas(r)].filter(Boolean).join(" ");
}
function entero(n) {
    if (n === 0)
        return "CERO";
    const mill = Math.floor(n / 1000000);
    const r = n % 1000000;
    const pre = mill === 0 ? "" : mill === 1 ? "UN MILLON" : `${miles(mill)} MILLONES`;
    return [pre, miles(r)].filter(Boolean).join(" ");
}
/** 12378.87 -> "DOCE MIL TRESCIENTOS SETENTA Y OCHO Y 87 / 100" */
export function numeroALetras(value) {
    const cents = Math.round(Math.abs(value) * 100);
    const ent = Math.floor(cents / 100);
    const dec = cents % 100;
    return `${entero(ent)} Y ${String(dec).padStart(2, "0")} / 100`;
}
