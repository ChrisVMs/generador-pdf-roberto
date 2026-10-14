import { Font, Image, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

// Sin guiones de separación silábica (el original no corta palabras)
Font.registerHyphenationCallback((word) => [word]);

/*
 * Primitivas de maquetación absoluta (coordenadas en puntos PDF, origen arriba-izquierda).
 * `y` es el centro vertical de la línea de texto, para poder copiar posiciones
 * medidas directamente sobre los PDF originales.
 */

export type FontKind = "helv" | "helvB" | "times" | "timesB";

const FONTS: Record<FontKind, { fontFamily: string; fontWeight?: "bold" }> = {
  helv: { fontFamily: "Helvetica" },
  helvB: { fontFamily: "Helvetica", fontWeight: "bold" },
  times: { fontFamily: "Times-Roman" },
  timesB: { fontFamily: "Times-Roman", fontWeight: "bold" },
};

export const BLUE = "#0000ff";
export const RED = "#ff0000";

interface TProps {
  x: number;
  y: number;
  children: ReactNode;
  pageWidth: number;
  size?: number;
  font?: FontKind;
  color?: string;
  align?: "left" | "right" | "center";
  /** Ancho de caja (para centrar o para texto que hace salto de línea). */
  width?: number;
  justify?: boolean;
  lineHeight?: number;
}

export function T({
  x, y, children, pageWidth, size = 7.5, font = "helv", color = "#000",
  align = "left", width, justify, lineHeight,
}: TProps) {
  const top = y - size * 0.6;
  const style = {
    position: "absolute" as const,
    top,
    fontSize: size,
    color,
    lineHeight: lineHeight ?? 1.15,
    ...FONTS[font],
  };
  if (align === "right") {
    return <Text style={{ ...style, right: pageWidth - x, textAlign: "right" }}>{children}</Text>;
  }
  if (align === "center") {
    const w = width ?? 300;
    return <Text style={{ ...style, left: x - w / 2, width: w, textAlign: "center" }}>{children}</Text>;
  }
  return (
    <Text style={{ ...style, left: x, ...(width ? { width } : {}), ...(justify ? { textAlign: "justify" } : {}) }}>
      {children}
    </Text>
  );
}

export function HLine({ x1, x2, y, w = 0.75, dashed }: { x1: number; x2: number; y: number; w?: number; dashed?: boolean }) {
  return (
    <View
      style={{
        position: "absolute",
        left: x1,
        top: y - w / 2,
        width: x2 - x1,
        borderTopWidth: w,
        borderTopColor: "#000",
        borderTopStyle: dashed ? "dotted" : "solid",
      }}
    />
  );
}

export function VLine({ x, y1, y2, w = 0.75 }: { x: number; y1: number; y2: number; w?: number }) {
  return (
    <View
      style={{ position: "absolute", left: x - w / 2, top: y1, height: y2 - y1, borderLeftWidth: w, borderLeftColor: "#000" }}
    />
  );
}

export function Box({ x1, y1, x2, y2, w = 0.75 }: { x1: number; y1: number; x2: number; y2: number; w?: number }) {
  return (
    <View
      style={{ position: "absolute", left: x1, top: y1, width: x2 - x1, height: y2 - y1, borderWidth: w, borderColor: "#000" }}
    />
  );
}

/** Espacio reservado para el logo (public/logo.png). La imagen se ajusta al recuadro sin deformarse. */
export function Logo({ src, x, y, width, height }: { src?: string; x: number; y: number; width: number; height: number }) {
  return (
    <View style={{ position: "absolute", left: x, top: y, width, height, justifyContent: "center", alignItems: "center" }}>
      {src ? <Image src={src} style={{ width, height, objectFit: "contain" }} /> : null}
    </View>
  );
}

