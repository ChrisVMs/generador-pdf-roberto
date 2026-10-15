import { jsx as _jsx } from "react/jsx-runtime";
import { Font, Image, Text, View } from "@react-pdf/renderer";
// Sin guiones de separación silábica (el original no corta palabras)
Font.registerHyphenationCallback((word) => [word]);
const FONTS = {
    helv: { fontFamily: "Helvetica" },
    helvB: { fontFamily: "Helvetica", fontWeight: "bold" },
    times: { fontFamily: "Times-Roman" },
    timesB: { fontFamily: "Times-Roman", fontWeight: "bold" },
};
export const BLUE = "#0000ff";
export const RED = "#ff0000";
export function T({ x, y, children, pageWidth, size = 7.5, font = "helv", color = "#000", align = "left", width, justify, lineHeight, }) {
    const top = y - size * 0.6;
    const style = {
        position: "absolute",
        top,
        fontSize: size,
        color,
        lineHeight: lineHeight ?? 1.15,
        ...FONTS[font],
    };
    if (align === "right") {
        return _jsx(Text, { style: { ...style, right: pageWidth - x, textAlign: "right" }, children: children });
    }
    if (align === "center") {
        const w = width ?? 300;
        return _jsx(Text, { style: { ...style, left: x - w / 2, width: w, textAlign: "center" }, children: children });
    }
    return (_jsx(Text, { style: { ...style, left: x, ...(width ? { width } : {}), ...(justify ? { textAlign: "justify" } : {}) }, children: children }));
}
export function HLine({ x1, x2, y, w = 0.75, dashed }) {
    return (_jsx(View, { style: {
            position: "absolute",
            left: x1,
            top: y - w / 2,
            width: x2 - x1,
            borderTopWidth: w,
            borderTopColor: "#000",
            borderTopStyle: dashed ? "dotted" : "solid",
        } }));
}
export function VLine({ x, y1, y2, w = 0.75 }) {
    return (_jsx(View, { style: { position: "absolute", left: x - w / 2, top: y1, height: y2 - y1, borderLeftWidth: w, borderLeftColor: "#000" } }));
}
export function Box({ x1, y1, x2, y2, w = 0.75 }) {
    return (_jsx(View, { style: { position: "absolute", left: x1, top: y1, width: x2 - x1, height: y2 - y1, borderWidth: w, borderColor: "#000" } }));
}
/** Espacio reservado para el logo (public/logo.png). La imagen se ajusta al recuadro sin deformarse. */
export function Logo({ src, x, y, width, height }) {
    return (_jsx(View, { style: { position: "absolute", left: x, top: y, width, height, justifyContent: "center", alignItems: "center" }, children: src ? _jsx(Image, { src: src, style: { width, height, objectFit: "contain" } }) : null }));
}
