import React, { useMemo } from "react";

function parseJsonList(value, maxItems = 4) {
  if (value == null || value === "") return "—";
  try {
    const arr = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(arr)) return String(value).slice(0, 80) + (String(value).length > 80 ? "…" : "");
    const parts = arr.slice(0, maxItems);
    const tail = arr.length > maxItems ? ` (+${arr.length - maxItems})` : "";
    return parts.join(" · ") + tail;
  } catch {
    const s = String(value);
    return s.length > 100 ? `${s.slice(0, 100)}…` : s;
  }
}

function RolBadge({ rol }) {
  const r = String(rol || "").toLowerCase();
  const cls =
    r === "socio"
      ? "bg-emerald-500/20 text-emerald-900 border-emerald-600/40"
      : r === "propietario"
        ? "bg-sky-500/20 text-sky-900 border-sky-600/40"
        : r === "administrador"
          ? "bg-amber-500/25 text-amber-950 border-amber-600/40"
          : "bg-slate-200 text-slate-800 border-slate-400/50";
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${cls}`}>
      {rol || "—"}
    </span>
  );
}

/** Tabla admin: usuarios o empresas, texto oscuro sobre filas claras. */
export default function TableLayout({ data, onEdit, onDelete, layout, variant }) {
  const mode = variant || (layout === "Empresa" ? "empresas" : "users");

  const rows = useMemo(() => {
    if (!data?.length) return [];
    return [...data];
  }, [data]);

  if (!rows.length) {
    return (
      <p className="text-center text-surface-300 py-10 rounded-2xl border border-surface-600/50 bg-surface-900/30">
        No hay registros para mostrar.
      </p>
    );
  }

  if (mode === "empresas") {
    return (
      <div className="w-full overflow-x-auto rounded-2xl border border-surface-600/70 bg-surface-900/25 shadow-xl">
        <table className="w-full min-w-[900px] text-left text-sm text-slate-900">
          <thead>
            <tr className="border-b border-surface-600/90 bg-surface-950 text-brand-200">
              <th className="px-3 py-3 font-semibold whitespace-nowrap">ID</th>
              <th className="px-3 py-3 font-semibold min-w-[180px]">Empresa / complejo</th>
              <th className="px-3 py-3 font-semibold min-w-[140px]">Zona</th>
              <th className="px-3 py-3 font-semibold min-w-[200px]">Dirección</th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap">Teléfono</th>
              <th className="px-3 py-3 font-semibold min-w-[220px]">Propietario (socio vinculado)</th>
              <th className="px-3 py-3 font-semibold min-w-[160px]">Servicios</th>
              <th className="px-3 py-3 font-semibold min-w-[160px]">Métodos de pago</th>
              <th className="px-3 py-3 font-semibold w-24">Imagen</th>
              <th className="px-3 py-3 font-semibold text-right whitespace-nowrap w-[1%]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id_empresa}
                className="border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              >
                <td className="px-3 py-3 font-mono text-xs text-slate-700">{row.id_empresa}</td>
                <td className="px-3 py-3 font-semibold text-slate-900">{row.nombre}</td>
                <td className="px-3 py-3 text-slate-800">{row.zona || "—"}</td>
                <td className="px-3 py-3 text-slate-700 max-w-[260px]">
                  <span className="line-clamp-3" title={row.direccion}>
                    {row.direccion}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-800 whitespace-nowrap">{row.telefono}</td>
                <td className="px-3 py-3 text-slate-800">
                  <span className="line-clamp-3 text-sm" title={row.propietario_label}>
                    {row.propietario_label || `Usuario #${row.id_usuario}`}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-700 text-xs leading-snug max-w-[200px]">
                  <span className="line-clamp-3" title={parseJsonList(row.servicios, 99)}>
                    {parseJsonList(row.servicios)}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-700 text-xs leading-snug max-w-[200px]">
                  {parseJsonList(row.metodos_pago)}
                </td>
                <td className="px-3 py-3 text-xs text-slate-600 break-all max-w-[120px]" title={row.imagen}>
                  {row.imagen ? (
                    <span className="line-clamp-2">{row.imagen}</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-3 text-right whitespace-nowrap align-top">
                  <div className="flex flex-col sm:flex-row gap-2 justify-end">
                    <button
                      type="button"
                      className="text-sm font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2"
                      onClick={() => onEdit(row)}
                    >
                      Modificar
                    </button>
                    <button
                      type="button"
                      className="text-sm font-semibold text-red-700 hover:text-red-900 underline underline-offset-2"
                      onClick={() => onDelete(row)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* Usuarios (socios, propietarios, admin oculto en filas se filtra en datos padre si hace falta) */
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-surface-600/70 bg-surface-900/25 shadow-xl">
      <table className="w-full min-w-[720px] text-left text-sm text-slate-900">
        <thead>
          <tr className="border-b border-surface-600/90 bg-surface-950 text-brand-200">
            <th className="px-3 py-3 font-semibold whitespace-nowrap">ID</th>
            <th className="px-3 py-3 font-semibold min-w-[160px]">Nombre</th>
            <th className="px-3 py-3 font-semibold min-w-[200px]">Email</th>
            <th className="px-3 py-3 font-semibold">Rol</th>
            <th className="px-3 py-3 font-semibold text-surface-400 text-xs font-normal max-w-[140px]">
              Contraseña (no se muestra)
            </th>
            <th className="px-3 py-3 font-semibold text-right whitespace-nowrap w-[1%]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows
            .filter((row) => row.rol !== "administrador")
            .map((row) => (
              <tr
                key={row.id_usuario}
                className="border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              >
                <td className="px-3 py-3 font-mono text-xs text-slate-700">{row.id_usuario}</td>
                <td className="px-3 py-3 font-medium text-slate-900">{row.nombre}</td>
                <td className="px-3 py-3 text-slate-800 break-all">{row.email}</td>
                <td className="px-3 py-3">
                  <RolBadge rol={row.rol} />
                </td>
                <td className="px-3 py-3 text-slate-500 text-xs">••••••••</td>
                <td className="px-3 py-3 text-right whitespace-nowrap align-top">
                  <div className="flex flex-col sm:flex-row gap-2 justify-end">
                    <button
                      type="button"
                      className="text-sm font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2"
                      onClick={() => onEdit(row)}
                    >
                      Modificar
                    </button>
                    <button
                      type="button"
                      className="text-sm font-semibold text-red-700 hover:text-red-900 underline underline-offset-2"
                      onClick={() => onDelete(row)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
