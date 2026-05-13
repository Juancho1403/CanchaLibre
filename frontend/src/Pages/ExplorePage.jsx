import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCatalogoCanchas } from "../Services/catalogo";
import { USE_LOCAL_STORAGE } from "../Services/api";

const ZONAS = [
  { value: "", label: "Todas las zonas" },
  { value: "Caracas", label: "Caracas" },
  { value: "Barcelona", label: "Barcelona (Camp Nou)" },
  { value: "Atlanta", label: "Atlanta (USA)" },
  { value: "Ciudad de México", label: "Ciudad de México" },
  { value: "Río de Janeiro", label: "Río de Janeiro" },
  { value: "Madrid", label: "Madrid" },
  { value: "Manchester", label: "Manchester" },
];

/** Misma grilla que genera el backend (`tareaProgramada`). */
const FRANJAS = [
  { value: "", label: "Cualquier horario (17:00–22:00)" },
  { value: "17:00-18:00", label: "17:00 – 18:00" },
  { value: "18:00-19:00", label: "18:00 – 19:00" },
  { value: "19:00-20:00", label: "19:00 – 20:00" },
  { value: "20:00-21:00", label: "20:00 – 21:00" },
  { value: "21:00-22:00", label: "21:00 – 22:00" },
];

function FilterFields({
  zona,
  setZona,
  precioMax,
  setPrecioMax,
  q,
  setQ,
  fecha,
  setFecha,
  franja,
  setFranja,
  jugadores,
  setJugadores,
  onApply,
  onReset,
}) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-surface-500 leading-relaxed border border-surface-700/60 rounded-lg p-3 bg-surface-900/40">
        Alquiler por <strong className="text-surface-300">hora</strong>, de <strong className="text-surface-300">17:00 a 22:00</strong>.
        Equipos entre <strong className="text-surface-300">10 y 20 jugadores</strong>. Pagos: Stripe, PayPal, Mercado Pago o reportar pago móvil en checkout.
      </p>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">
          Zona
        </label>
        <select
          value={zona}
          onChange={(e) => setZona(e.target.value)}
          className="w-full rounded-xl bg-surface-900/80 border border-surface-700 text-white text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        >
          {ZONAS.map((z) => (
            <option key={z.value || "all"} value={z.value}>
              {z.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">
          Día (solo canchas con cupo libre)
        </label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full rounded-xl bg-surface-900/80 border border-surface-700 text-white text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        />
        <p className="text-[11px] text-surface-500 mt-1.5">
          Vacío = listás todas las sedes. Con fecha = solo las que tienen al menos un turno disponible ese día.
        </p>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">
          Franja horaria
        </label>
        <select
          value={franja}
          onChange={(e) => setFranja(e.target.value)}
          disabled={!fecha}
          className="w-full rounded-xl bg-surface-900/80 border border-surface-700 text-white text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-40"
        >
          {FRANJAS.map((f) => (
            <option key={f.value || "any"} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">
          Jugadores en tu equipo
        </label>
        <input
          type="number"
          min={10}
          max={20}
          placeholder="10 – 20"
          value={jugadores}
          onChange={(e) => setJugadores(e.target.value)}
          className="w-full rounded-xl bg-surface-900/80 border border-surface-700 text-white text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">
          Precio máximo (Bs / hora)
        </label>
        <input
          type="number"
          min={0}
          placeholder="Ej. 200"
          value={precioMax}
          onChange={(e) => setPrecioMax(e.target.value)}
          className="w-full rounded-xl bg-surface-900/80 border border-surface-700 text-white text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">
          Buscar
        </label>
        <input
          type="search"
          placeholder="Nombre de cancha o complejo"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-xl bg-surface-900/80 border border-surface-700 text-white text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" className="btn-primary flex-1 text-sm py-3 rounded-xl" onClick={onApply}>
          Aplicar filtros
        </button>
        <button type="button" className="btn-secondary text-sm py-3 px-4 rounded-xl" onClick={onReset}>
          Limpiar
        </button>
      </div>
    </div>
  );
}

function CanchaCard({ row }) {
  const emp = row.Empresa;
  const img =
    row.imagen_url ||
    "https://images.unsplash.com/photo-1529900740404-1e2b32b87c48?w=800&q=80";
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    emp?.direccion || emp?.nombre || ""
  )}`;
  const hi = row.hora_inicio || "17:00";
  const hf = row.hora_fin || "22:00";
  const jmin = row.jugadores_min ?? 10;
  const jmax = row.jugadores_max ?? 20;

  return (
    <article className="glass-card overflow-hidden flex flex-col h-full group">
      <div className="relative h-44 overflow-hidden">
        <img
          src={img}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/90 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-black/50 text-white border border-white/10">
          Fútbol
        </span>
        <span className="absolute top-3 right-3 text-[10px] font-medium px-2 py-1 rounded-md bg-brand-500/90 text-white">
          {hi}–{hf}
        </span>
        <span className="absolute bottom-3 left-3 text-sm text-surface-200">
          {emp?.zona || "Zona"} · {emp?.nombre}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white mb-1">{row.nombre}</h3>
        <p className="text-surface-500 text-xs mb-2">
          {jmin}–{jmax} jugadores · alquiler por hora
        </p>
        <p className="text-surface-400 text-sm line-clamp-2 mb-4">
          {row.descripcion || "Reserva online y llega a jugar sin vueltas."}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-surface-500">Desde / hora</p>
            <p className="text-xl font-bold text-gradient">
              {Number(row.precio).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-end">
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="text-center text-sm py-2 px-3 rounded-lg border border-surface-600 text-surface-300 hover:text-white hover:border-brand-500/40 transition-colors"
            >
              Mapa
            </a>
            <Link to={`/cancha/${row.id_cancha}`} className="btn-primary text-sm py-2 px-4 rounded-lg text-center">
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [zona, setZona] = useState(searchParams.get("zona") || "");
  const [precioMax, setPrecioMax] = useState(searchParams.get("precioMax") || "");
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [fecha, setFecha] = useState(searchParams.get("fecha") || "");
  const [franja, setFranja] = useState(searchParams.get("franja") || "");
  const [jugadores, setJugadores] = useState(searchParams.get("jugadores") || "");

  const load = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCatalogoCanchas(params);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "No se pudo cargar el catálogo");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setZona(searchParams.get("zona") || "");
    setPrecioMax(searchParams.get("precioMax") || "");
    setQ(searchParams.get("q") || "");
    setFecha(searchParams.get("fecha") || "");
    setFranja(searchParams.get("franja") || "");
    setJugadores(searchParams.get("jugadores") || "");
  }, [searchParams]);

  useEffect(() => {
    load({
      zona: searchParams.get("zona") || undefined,
      precioMax: searchParams.get("precioMax") || undefined,
      q: searchParams.get("q") || undefined,
      fecha: searchParams.get("fecha") || undefined,
      franja: searchParams.get("franja") || undefined,
      jugadores: searchParams.get("jugadores") || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const applyFilters = () => {
    const next = new URLSearchParams();
    if (zona) next.set("zona", zona);
    if (precioMax) next.set("precioMax", precioMax);
    if (q) next.set("q", q);
    if (fecha) next.set("fecha", fecha);
    if (fecha && franja) next.set("franja", franja);
    const j = String(jugadores).trim();
    if (j) {
      const n = parseInt(j, 10);
      if (!Number.isNaN(n)) next.set("jugadores", String(Math.min(20, Math.max(10, n))));
    }
    setSearchParams(next);
    setFiltersOpen(false);
  };

  const resetFilters = () => {
    setZona("");
    setPrecioMax("");
    setQ("");
    setFecha("");
    setFranja("");
    setJugadores("");
    setSearchParams({});
    setFiltersOpen(false);
  };

  const emptyHint = () => {
    if (error) return null;
    const hasFecha = Boolean(searchParams.get("fecha"));
    const hasFranja = Boolean(searchParams.get("franja"));
    if (hasFecha && hasFranja) {
      return "No hay canchas con cupo libre en esa fecha y franja. Probá otro día u horario, o quitá la franja para ver todas las opciones del día.";
    }
    if (hasFecha) {
      return "Ninguna cancha tiene turnos libres ese día con los filtros actuales. Probá otra fecha o limpiá filtros.";
    }
    return "No hay canchas con esos filtros. Probá otra zona, ampliá el precio máximo o revisá que el backend esté corriendo y la base tenga datos (seed + reinicio del servidor).";
  };

  return (
    <main className="min-h-screen bg-surface-950 pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider">Explorador</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Encontrá tu <span className="text-gradient">cancha de fútbol</span>
            </h1>
            <p className="text-surface-400 mt-3 max-w-2xl">
              Alquiler vespertino <span className="text-surface-300">17:00–22:00</span>, equipos de{" "}
              <span className="text-surface-300">10 a 20 jugadores</span>. Filtrá por zona, día, franja y tamaño de
              equipo. Pagá con Stripe, PayPal, Mercado Pago o reportá pago móvil desde el checkout.
            </p>
          </div>
          <button
            type="button"
            className="lg:hidden btn-secondary text-sm py-3 px-5 rounded-xl self-start"
            onClick={() => setFiltersOpen(true)}
          >
            Filtros
          </button>
        </header>

        <div className="grid lg:grid-cols-[300px_1fr] gap-10">
          <aside className="hidden lg:block">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-white font-semibold mb-4">Filtros</h2>
              <FilterFields
                zona={zona}
                setZona={setZona}
                precioMax={precioMax}
                setPrecioMax={setPrecioMax}
                q={q}
                setQ={setQ}
                fecha={fecha}
                setFecha={setFecha}
                franja={franja}
                setFranja={setFranja}
                jugadores={jugadores}
                setJugadores={setJugadores}
                onApply={applyFilters}
                onReset={resetFilters}
              />
            </div>
          </aside>

          <section>
            {loading && (
              <div className="grid sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="glass-card h-80 animate-pulse bg-surface-900/50" />
                ))}
              </div>
            )}
            {!loading && error && (
              <div className="glass-card p-8 text-center space-y-3">
                <p className="text-red-400">{error}</p>
                <p className="text-surface-500 text-sm">
                  {USE_LOCAL_STORAGE ? (
                    <>
                      Estás en modo datos locales (localStorage). Probá recargar la página o borrar datos del sitio
                      en el navegador y volver a entrar para regenerar el demo.
                    </>
                  ) : (
                    <>
                      Comprobá que la API esté en <code className="text-brand-300">http://localhost:3001</code> y{" "}
                      <code className="text-brand-300">VITE_API_URL</code> en el frontend si usás otro puerto.
                    </>
                  )}
                </p>
              </div>
            )}
            {!loading && !error && items.length === 0 && (
              <div className="glass-card p-10 text-center text-surface-400 text-sm leading-relaxed max-w-xl mx-auto">
                {emptyHint()}
              </div>
            )}
            {!loading && !error && items.length > 0 && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((row) => (
                  <CanchaCard key={row.id_cancha} row={row} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Cerrar filtros"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-surface-700 bg-surface-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Filtros</h2>
              <button type="button" className="text-surface-400 hover:text-white" onClick={() => setFiltersOpen(false)}>
                Cerrar
              </button>
            </div>
            <FilterFields
              zona={zona}
              setZona={setZona}
              precioMax={precioMax}
              setPrecioMax={setPrecioMax}
              q={q}
              setQ={setQ}
              fecha={fecha}
              setFecha={setFecha}
              franja={franja}
              setFranja={setFranja}
              jugadores={jugadores}
              setJugadores={setJugadores}
              onApply={applyFilters}
              onReset={resetFilters}
            />
          </div>
        </div>
      )}
    </main>
  );
}
