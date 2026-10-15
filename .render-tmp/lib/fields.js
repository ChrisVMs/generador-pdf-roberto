export function initialValues(sections) {
    const v = {};
    for (const s of sections)
        for (const f of s.fields)
            v[f.key] = f.default ?? "";
    return v;
}
export function fieldError(f, value) {
    if (value == null || String(value).trim() === "")
        return "Obligatorio";
    if (f.type === "number") {
        const n = Number(value);
        if (!Number.isFinite(n))
            return "Número inválido";
        if (n < 0)
            return "No puede ser negativo";
    }
    return null;
}
export function allValid(sections, values) {
    return sections.every((s) => s.fields.every((f) => fieldError(f, values[f.key]) === null));
}
