import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/userContext";
import { crearPartidoAbierto, fetchPartidosAbiertos, unirsePartidoAbierto } from "../Services/comunidad";

const NIVELES = ["Principiante", "Intermedio", "Avanzado", "Relajado"];

function formatPartidoCuando(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startTarget = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((startTarget - startToday) / 86400000);
  const hour = d.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (diffDays === 0) return `Hoy ${hour}`;
  if (diffDays === 1) return `Mañana ${hour}`;
  return (
    d.toLocaleDateString("es-VE", { weekday: "short", day: "numeric", month: "short" }) + ` · ${hour}`
  );
}

export default function CommunityPage() {
  const { user, isLoggedIn } = useAppContext();
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    zona: "",
    fecha_hora: "",
    nivel: "Intermedio",
    cupos_buscados: 2,
  });

  const socio = isLoggedIn && user?.rol === "socio";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPartidosAbiertos();
      setPartidos(data.partidos || []);
    } catch (e) {
      setError(e.message || "No se pudo cargar la comunidad");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUnirse(id) {
    if (!socio) return;
    setActionId(id);
    setError("");
    try {
      await unirsePartidoAbierto(id);
      await load();
    } catch (e) {
      setError(e.message || "No se pudo unir");
    } finally {
      setActionId(null);
    }
  }

  async function handlePublicar(e) {
    e.preventDefault();
    if (!socio) return;
    setError("");
    try {
      await crearPartidoAbierto({
        titulo: form.titulo.trim(),
        zona: form.zona.trim(),
        fecha_hora: form.fecha_hora,
        nivel: form.nivel,
        cupos_buscados: Number(form.cupos_buscados),
      });
      setForm({ titulo: "", zona: "", fecha_hora: "", nivel: "Intermedio", cupos_buscados: 2 });
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e.message || "No se pudo publicar");
    }
  }

  return (
    <main className="min-h-screen bg-surface-950 pt-10 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider">Comunidad</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
          Partidos <span className="text-gradient">abiertos</span>
        </h1>
        <p className="text-surface-400 mb-6 max-w-2xl">
          Publicá un partido y sumá jugadores, o unite a uno que ya esté buscando rivales. Las plazas se actualizan al instante
          (API o modo local).
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          {socio ? (
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 text-sm font-semibold px-4 py-2.5 transition-colors"
            >
              {showForm ? "Cerrar formulario" : "+ Publicar partido"}
            </button>
          ) : (
            <Link
              to="/ingresar?redirect=/comunidad"
              className="rounded-xl bg-brand-500/90 hover:bg-brand-400 text-surface-950 text-sm font-semibold px-4 py-2.5 transition-colors inline-block"
            >
              Iniciá sesión como socio para publicar o unirte
            </Link>
          )}
          <button
            type="button"
            onClick={() => load()}
            className="rounded-xl border border-surface-600 text-surface-200 text-sm font-medium px-4 py-2.5 hover:bg-surface-900/80"
          >
            Actualizar
          </button>
        </div>

        {showForm && socio && (
          <form
            onSubmit={handlePublicar}
            className="glass-card p-5 sm:p-6 mb-8 space-y-4 border border-brand-500/20"
          >
            <h2 className="text-lg font-semibold text-white">Nuevo partido abierto</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-surface-400 mb-1">Título</label>
                <input
                  required
                  className="w-full rounded-xl bg-surface-900 border border-surface-600 text-white px-3 py-2 text-sm"
                  value={form.titulo}
                  onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                  placeholder="Ej. Fut5 mixto — faltan 2"
                />
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Zona / ciudad</label>
                <input
                  required
                  className="w-full rounded-xl bg-surface-900 border border-surface-600 text-white px-3 py-2 text-sm"
                  value={form.zona}
                  onChange={(e) => setForm((f) => ({ ...f, zona: e.target.value }))}
                  placeholder="Naguanagua, Barcelona…"
                />
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Fecha y hora</label>
                <input
                  required
                  type="datetime-local"
                  className="w-full rounded-xl bg-surface-900 border border-surface-600 text-white px-3 py-2 text-sm"
                  value={form.fecha_hora}
                  onChange={(e) => setForm((f) => ({ ...f, fecha_hora: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-surface-400 mb-1">Nivel</label>
                  <select
                    className="w-full rounded-xl bg-surface-900 border border-surface-600 text-white px-3 py-2 text-sm"
                    value={form.nivel}
                    onChange={(e) => setForm((f) => ({ ...f, nivel: e.target.value }))}
                  >
                    {NIVELES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-surface-400 mb-1">Jugadores buscados</label>
                  <input
                    required
                    type="number"
                    min={1}
                    max={20}
                    className="w-full rounded-xl bg-surface-900 border border-surface-600 text-white px-3 py-2 text-sm"
                    value={form.cupos_buscados}
                    onChange={(e) => setForm((f) => ({ ...f, cupos_buscados: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="btn-primary text-sm py-2.5 px-6 rounded-xl font-semibold">
              Publicar en el tablón
            </button>
          </form>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-surface-500 text-center py-12">Cargando partidos…</p>
        ) : partidos.length === 0 ? (
          <p className="text-surface-500 text-center py-12">No hay partidos abiertos en las próximas horas. ¡Sé el primero en publicar!</p>
        ) : (
          <ul className="space-y-4">
            {partidos.map((p) => {
              const puedeUnirse =
                socio && !p.yo_creador && !p.yo_unido && p.faltan > 0;
              const labelUnirse = p.yo_unido
                ? "Ya estás anotado"
                : p.yo_creador
                  ? "Tu partido"
                  : p.faltan <= 0
                    ? "Completo"
                    : "Unirse";
              return (
                <li
                  key={p.id_partido}
                  className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-white">{p.titulo}</h2>
                    <p className="text-surface-500 text-sm mt-1">
                      {p.zona} · {formatPartidoCuando(p.fecha_hora)} · Nivel {p.nivel}
                      {p.creador_nombre ? (
                        <span className="text-surface-600"> · Organiza {p.creador_nombre}</span>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
                    <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/25">
                      {p.faltan <= 0 ? "Completo" : `Faltan ${p.faltan}`}
                    </span>
                    <button
                      type="button"
                      disabled={!puedeUnirse || actionId === p.id_partido}
                      onClick={() => handleUnirse(p.id_partido)}
                      className={`text-sm py-2 px-5 rounded-xl font-semibold transition-opacity ${
                        puedeUnirse
                          ? "btn-primary"
                          : "bg-surface-800 text-surface-500 cursor-not-allowed border border-surface-600"
                      }`}
                    >
                      {actionId === p.id_partido ? "Uniendo…" : labelUnirse}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="text-center text-surface-500 text-sm mt-12">
          ¿Reservar cancha?{" "}
          <Link to="/explorar" className="text-brand-400 hover:text-brand-300">
            Explorar canchas
          </Link>
        </p>
      </div>
    </main>
  );
}
