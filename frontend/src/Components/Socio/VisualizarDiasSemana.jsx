import { Link, useParams } from "react-router-dom";

const WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function nextSevenDaysFromToday() {
  const out = [];
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    out.push({
      iso,
      short: WEEK[d.getDay()],
      label: d.toLocaleDateString("es-VE", { weekday: "long", day: "numeric", month: "short" }),
    });
  }
  return out;
}

/** Selector de los próximos 7 días para reservar (sin NavBar: lo envuelve la ruta o VisualizarHorarios). */
export default function SelectorDeDias() {
  const { id } = useParams();
  const { dia: diaSeleccionado } = useParams();
  const slots = nextSevenDaysFromToday();

  return (
    <section className="border-b border-surface-700/60 bg-surface-900/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-lg sm:text-xl font-semibold text-white text-center mb-2">
          Elegí el día
        </h2>
        <p className="text-surface-400 text-sm text-center mb-6 max-w-2xl mx-auto">
          Próximos 7 días a partir de hoy. Luego elegís el horario disponible para esa fecha.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {slots.map((s) => {
            const active = diaSeleccionado && s.iso === diaSeleccionado;
            return (
              <Link
                key={s.iso}
                to={`/socio/elegirhorario/${id}/${s.iso}`}
                className={`rounded-2xl border px-3 py-4 text-center transition-all min-h-[5.5rem] flex flex-col items-center justify-center gap-1 ${
                  active
                    ? "border-brand-400 bg-brand-500/15 text-white shadow-[0_0_0_1px_rgba(52,211,153,0.35)]"
                    : "border-surface-600 bg-surface-950/60 text-surface-100 hover:border-brand-500/50 hover:bg-surface-800/80"
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-300">{s.short}</span>
                <span className="text-sm font-bold text-white leading-tight">{s.label}</span>
                <span className="text-[11px] text-surface-500 tabular-nums">{s.iso}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
