import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/userContext";
import { BrandLogoLockup } from "../Components/BrandLogo";
import { fetchAdminResumen } from "../Services/adminResumen";

function fmtBs(n) {
  return `Bs. ${Number(n || 0).toLocaleString("es-VE", { maximumFractionDigits: 0 })}`;
}

export default function AdminDashboardPage() {
  const { user } = useAppContext();
  const [resumen, setResumen] = useState(null);
  const [resumenError, setResumenError] = useState("");
  const [loadingResumen, setLoadingResumen] = useState(true);

  const cargarResumen = useCallback(async () => {
    setLoadingResumen(true);
    setResumenError("");
    try {
      const data = await fetchAdminResumen();
      setResumen(data);
    } catch (e) {
      setResumen(null);
      setResumenError(e.message || "No se pudo cargar el resumen");
    } finally {
      setLoadingResumen(false);
    }
  }, []);

  useEffect(() => {
    if (user?.rol === "administrador") cargarResumen();
    else {
      setLoadingResumen(false);
      setResumenError("Iniciá sesión como administrador para ver datos en vivo.");
    }
  }, [user, cargarResumen]);

  const queue = resumen?.colaPagos || [];
  const stats = resumen
    ? [
        {
          label: "Ingresos estimados (MTD)",
          value: fmtBs(resumen.ingresosEstimados),
          hint: "Suma del precio por hora de las reservas del mes (reservado + confirmado)",
          highlight: false,
        },
        {
          label: "Horas reservadas (MTD)",
          value: `${resumen.horasReservadas} h`,
          hint: `${resumen.reservasMesCount} franjas con reserva en el mes`,
          highlight: false,
        },
        {
          label: "Reservas pendientes de confirmar",
          value: String(resumen.validacionesPendientes),
          hint: "Estado «reservado» · el propietario confirma en su panel",
          highlight: true,
        },
      ]
    : [
        { label: "Ingresos estimados (MTD)", value: "—", hint: loadingResumen ? "Cargando…" : "Sin datos", highlight: false },
        { label: "Horas reservadas (MTD)", value: "—", hint: "", highlight: false },
        { label: "Pendientes", value: "—", hint: "", highlight: true },
      ];

  return (
    <div className="min-h-screen bg-[#f0faf4] text-slate-900">
      <header className="border-b border-emerald-100 bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center min-w-0">
            <BrandLogoLockup imgClassName="max-h-9 max-w-[180px]" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/explorar" className="hover:text-emerald-800">
              Explorar
            </Link>
            <Link to="/comunidad" className="hover:text-emerald-800">
              Comunidad
            </Link>
            <span className="text-emerald-800 border-b-2 border-emerald-700 pb-0.5">Admin</span>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500 hidden sm:inline">{user?.nombre}</span>
            <Link to="/perfil" className="text-emerald-800 font-medium hover:underline">
              Perfil clásico
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1 text-sm">
              KPIs y cola con datos reales de reservas SQLite (ingresos = suma de precios de cancha por franja reservada).
            </p>
            {resumenError && (
              <p className="text-amber-800 text-sm mt-2">{resumenError}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => cargarResumen()}
            disabled={loadingResumen || user?.rol !== "administrador"}
            className="rounded-xl bg-emerald-800 text-white text-sm font-semibold px-5 py-2.5 shadow hover:bg-emerald-900 transition-colors disabled:opacity-50"
          >
            {loadingResumen ? "Actualizando…" : "Actualizar datos"}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <Link
            to="/listar-canchas"
            className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm hover:border-emerald-400 transition-colors text-center"
          >
            <p className="text-xs font-bold uppercase text-emerald-800">Canchas</p>
            <p className="text-sm text-slate-600 mt-1">Ver, crear, editar precios y horarios</p>
          </Link>
          <Link
            to="/listar-empresas"
            className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm hover:border-emerald-400 transition-colors text-center"
          >
            <p className="text-xs font-bold uppercase text-emerald-800">Empresas</p>
            <p className="text-sm text-slate-600 mt-1">Complejos y datos de contacto</p>
          </Link>
          <Link
            to="/listar-socios"
            className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm hover:border-emerald-400 transition-colors text-center"
          >
            <p className="text-xs font-bold uppercase text-emerald-800">Socios</p>
            <p className="text-sm text-slate-600 mt-1">Usuarios registrados</p>
          </Link>
          <Link
            to="/explorar"
            className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm hover:border-emerald-400 transition-colors text-center"
          >
            <p className="text-xs font-bold uppercase text-emerald-800">Catálogo público</p>
            <p className="text-sm text-slate-600 mt-1">Vista como socio</p>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {stats.map((c) => (
            <div
              key={c.label}
              className={`rounded-2xl p-5 shadow-sm border ${
                c.highlight
                  ? "bg-emerald-800 text-white border-emerald-900"
                  : "bg-white border-emerald-100"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${
                  c.highlight ? "text-emerald-200" : "text-slate-500"
                }`}
              >
                {c.label}
              </p>
              <p className={`text-2xl font-bold mt-2 ${c.highlight ? "text-white" : "text-emerald-950"}`}>{c.value}</p>
              {c.hint ? (
                <p className={`text-sm mt-2 ${c.highlight ? "text-emerald-100" : "text-slate-500"}`}>{c.hint}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
            <h2 className="font-bold text-emerald-950 mb-1">Calendario maestro (referencia)</h2>
            <p className="text-slate-500 text-sm mb-4">
              Ejemplo visual de estados. Las cifras de arriba y la cola lateral vienen de la base de datos.
            </p>
            <div className="rounded-xl border border-slate-200 overflow-hidden text-sm">
              <div className="grid grid-cols-4 bg-slate-50 font-semibold text-slate-600">
                <div className="p-3 border-r border-slate-200" />
                <div className="p-3 border-r border-slate-200 text-center">Cancha A</div>
                <div className="p-3 border-r border-slate-200 text-center">Cancha B</div>
                <div className="p-3 text-center">Cancha C</div>
              </div>
              {["18:00", "19:00", "20:00"].map((h) => (
                <div key={h} className="grid grid-cols-4 border-t border-slate-200">
                  <div className="p-3 text-slate-500 font-medium border-r border-slate-200">{h}</div>
                  <div className="p-2 border-r border-slate-200">
                    <div className="rounded-lg bg-emerald-100 text-emerald-900 px-2 py-2 text-xs">Entrenamiento</div>
                  </div>
                  <div className="p-2 border-r border-slate-200">
                    <div className="rounded-lg bg-slate-100 text-slate-600 px-2 py-2 text-xs">Disponible</div>
                  </div>
                  <div className="p-2">
                    <div className="rounded-lg bg-violet-100 text-violet-900 px-2 py-2 text-xs">Pago pendiente</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-emerald-950">Cola de reservas</h2>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-1 rounded-full">
                {queue.length} pend.
              </span>
            </div>
            {queue.length === 0 ? (
              <p className="text-sm text-slate-500">No hay reservas en estado «reservado».</p>
            ) : (
              <ul className="space-y-4">
                {queue.map((q) => (
                  <li key={q.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">{q.name}</p>
                        <p className="text-xs text-slate-500">
                          Ref. {q.ref} · {q.fecha} {q.horario}
                        </p>
                        {q.cancha && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {q.cancha}
                            {q.empresa ? ` · ${q.empresa}` : ""}
                          </p>
                        )}
                        <p className="text-sm font-bold text-emerald-800 mt-1">{fmtBs(q.amount)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      La confirmación la gestiona el propietario del complejo en su panel.
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/listar-canchas"
              className="mt-4 block text-center text-sm text-emerald-800 font-medium hover:underline"
            >
              Ir a gestión de canchas
            </Link>
          </aside>
        </div>
      </main>

      <footer className="mt-16 border-t border-emerald-100 bg-white py-8 text-center text-sm text-slate-500">
        Solo visible para rol administrador · API CanchaYa + SQLite
      </footer>
    </div>
  );
}
