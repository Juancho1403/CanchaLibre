import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerEmpresas } from "../../Services/Socio";
import { NavBar } from "../NavBar";

export function VisualizarEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await obtenerEmpresas();
        if (!cancelled) setEmpresas(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || "No se pudieron cargar los complejos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-b from-surface-950 via-surface-900 to-surface-950 pt-8 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center text-2xl sm:text-3xl font-bold text-white mb-2">
            Elegí el complejo donde querés reservar
          </h1>
          <p className="text-center text-surface-400 text-sm mb-10 max-w-xl mx-auto">
            Seleccioná una empresa para ver sus canchas, horarios y reservar con pago seguro.
          </p>

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card h-72 rounded-2xl animate-pulse bg-surface-800/40" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="glass-card border border-red-500/30 rounded-2xl p-6 text-center text-red-300">{error}</div>
          )}

          {!loading && !error && empresas.length === 0 && (
            <div className="glass-card rounded-2xl p-10 text-center text-surface-300 border border-surface-700/50">
              No hay complejos disponibles por ahora. Probá más tarde o revisá que la API esté en marcha.
            </div>
          )}

          {!loading && !error && empresas.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {empresas.map((empresa) => (
                <article
                  key={empresa.id_empresa}
                  className="glass-card rounded-2xl border border-surface-700/50 overflow-hidden flex flex-col shadow-lg hover:border-brand-500/30 transition-colors"
                >
                  <div className="aspect-[16/10] bg-surface-800 overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={empresa.imagen || "/canchas/calendario-reservas-ref.png"}
                      alt={empresa.nombre}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-2">
                    <h2 className="text-lg font-semibold text-white leading-snug">{empresa.nombre}</h2>
                    <p className="text-surface-400 text-sm line-clamp-2">{empresa.direccion}</p>
                    <p className="text-surface-500 text-sm">Tel: {empresa.telefono}</p>
                    {empresa.zona && (
                      <span className="inline-flex w-fit text-xs font-medium px-2 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/25">
                        {empresa.zona}
                      </span>
                    )}
                    <div className="mt-auto pt-4 flex flex-wrap gap-2">
                      <Link
                        to={`/socio/elegircancha/${empresa.id_empresa}`}
                        className="btn-primary text-sm py-2.5 px-4 rounded-xl text-center flex-1 min-w-[8rem]"
                      >
                        Ver canchas
                      </Link>
                      <Link
                        to={`/socio/calendario/${empresa.id_empresa}/${new Date().toISOString().slice(0, 10)}`}
                        className="text-sm py-2.5 px-4 rounded-xl border border-surface-600 text-surface-200 hover:border-brand-500/40 hover:text-white text-center transition-colors"
                      >
                        Calendario
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
