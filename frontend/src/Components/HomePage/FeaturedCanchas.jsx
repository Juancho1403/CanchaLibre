import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCatalogoCanchas } from "../../Services/catalogo";
import { BRAND } from "../../config/brand";

export function FeaturedCanchas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchCatalogoCanchas({});
        if (!cancelled) setItems(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="orb orb-blue w-[360px] h-[360px] -bottom-20 -left-20 opacity-10" />
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-brand-400 font-semibold text-sm uppercase tracking-wider">Destacadas</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Canchas con <span className="text-gradient">más demanda</span>
            </h2>
            <p className="text-surface-400 mt-3 max-w-xl">
              Elegidas por ubicación, servicios del complejo y relación calidad-precio.
            </p>
          </div>
          <Link to="/explorar" className="btn-secondary text-sm py-3 px-6 rounded-xl self-start md:self-auto">
            Ver todas
          </Link>
        </div>

        {loading && (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card h-72 animate-pulse bg-surface-900/40" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="glass-card p-8 text-center text-surface-400">
            Aún no hay canchas en el catálogo. Iniciá el backend para cargar datos demo en {BRAND.name}.
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {items.map((row) => {
              const img =
                row.imagen_url ||
                "https://images.unsplash.com/photo-1529900740404-1e2b32b87c48?w=800&q=80";
              return (
                <article key={row.id_cancha} className="glass-card overflow-hidden flex flex-col group">
                  <div className="relative h-48">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-950/90 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-xs font-semibold text-white/90">
                      {row.Empresa?.zona || "Zona"} · Fútbol
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white">{row.nombre}</h3>
                    <p className="text-surface-500 text-sm mt-1">{row.Empresa?.nombre}</p>
                    <p className="text-surface-400 text-sm mt-3 line-clamp-2 flex-1">
                      {row.descripcion || `Reservá en segundos con ${BRAND.name} y recibí la confirmación por correo.`}
                    </p>
                    <div className="flex items-center justify-between mt-5">
                      <span className="text-xl font-bold text-gradient">
                        {Number(row.precio).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                        Bs
                      </span>
                      <Link to={`/cancha/${row.id_cancha}`} className="btn-primary text-sm py-2 px-4 rounded-lg">
                        Detalle
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
