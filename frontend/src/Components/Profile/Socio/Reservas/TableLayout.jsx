import React, { useMemo } from "react";

function nombreCancha(row) {
  if (row == null) return "—";
  if (row["Cancha.nombre"]) return row["Cancha.nombre"];
  if (row.Cancha?.nombre) return row.Cancha.nombre;
  return "—";
}

function etiquetaEstado(estado) {
  const e = String(estado || "").toLowerCase();
  if (e === "confirmado") return { texto: "Confirmada", tone: "ok" };
  if (e === "reservado") return { texto: "Pendiente de confirmación", tone: "pend" };
  return { texto: estado || "—", tone: "muted" };
}

const COLS = [
  { key: "fecha", header: "Fecha" },
  { key: "horario", header: "Horario" },
  { key: "estado", header: "Estado" },
  { key: "cancha", header: "Cancha" },
];

export function TableLayout({ data, OnDelete }) {
  const rows = useMemo(() => {
    if (!data?.length) return [];
    return [...data].sort((a, b) => {
      const cmp = String(b.fecha || "").localeCompare(String(a.fecha || ""));
      if (cmp !== 0) return cmp;
      return String(b.horario || "").localeCompare(String(a.horario || ""));
    });
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="max-w-3xl mx-auto rounded-2xl border border-surface-600/60 bg-surface-900/40 px-6 py-10 text-center text-surface-300">
        No tenés reservas registradas. Podés reservar desde{" "}
        <span className="text-brand-300 font-medium">Explorar</span> o{" "}
        <span className="text-brand-300 font-medium">Buscar canchas</span>.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 pb-12">
      <div className="overflow-hidden rounded-2xl border border-surface-600/70 bg-surface-900/30 shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-surface-600/80 bg-surface-950/90">
                {COLS.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className="px-4 py-3 font-semibold text-brand-200/95 tracking-wide"
                  >
                    {c.header}
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold text-brand-200/95 text-right w-[1%] whitespace-nowrap"
                >
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const { texto, tone } = etiquetaEstado(row.estado);
                const badge =
                  tone === "ok"
                    ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
                    : tone === "pend"
                      ? "bg-amber-500/15 text-amber-100 border-amber-500/35"
                      : "bg-surface-700/50 text-surface-200 border-surface-600/60";
                return (
                  <tr
                    key={row.id_reserva ?? `${row.id_cancha}-${row.fecha}-${row.horario}`}
                    className="border-b border-surface-700/50 bg-white text-slate-900 last:border-0 hover:bg-slate-50/95 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium tabular-nums text-slate-800">{row.fecha}</td>
                    <td className="px-4 py-3 text-slate-700 tabular-nums">{row.horario}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge}`}
                      >
                        {texto}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 max-w-[220px] sm:max-w-xs">
                      <span className="line-clamp-2" title={nombreCancha(row)}>
                        {nombreCancha(row)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="inline-flex rounded-lg bg-red-600/95 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors"
                        onClick={() =>
                          OnDelete(row.id_usuario, row.id_cancha, row.id_reserva)
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
