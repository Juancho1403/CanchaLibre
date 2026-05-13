import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { obtenerCanchas } from "../../Services/Socio";
import { NavBar } from "../NavBar";

export const VisualizarCanchas = () => {
  const { id } = useParams();
  const [canchas, setCanchas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hoy = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setLoading(true);
    obtenerCanchas(id)
      .then((data) => setCanchas(data))
      .catch((err) => setError(String(err?.message || err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <NavBar />
        <p className="text-center text-surface-400 pt-24">Cargando…</p>
      </>
    );
  }
  if (error) {
    return (
      <>
        <NavBar />
        <p className="text-center text-red-400 pt-24 px-4">{error}</p>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-surface-950 text-surface-100 pb-20">
        <div className="max-w-5xl mx-auto px-4 pt-8">
          <p className="text-center text-surface-300 mb-2 text-sm uppercase tracking-wide">
            Complejo #{id}
          </p>
          <p className="text-center mt-2 mb-8 text-2xl font-bold text-white">
            Elegí cómo reservar
          </p>
          <div className="flex justify-center mb-10">
            <Link
              to={`/socio/calendario/${id}/${hoy}`}
              className="inline-block rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-semibold py-3 px-8 text-base shadow-lg transition-colors"
            >
              Ver calendario (grilla por hora)
            </Link>
          </div>
          <p className="text-center text-surface-400 mb-8 text-sm max-w-md mx-auto">
            O elegí una cancha y el día en el flujo clásico:
          </p>
          <div className="flex flex-wrap justify-center gap-8 pb-16">
            {canchas.length !== 0 ? (
              canchas.map((cancha, index) => (
                <div
                  className="glass-card rounded-2xl border border-surface-600/80 p-4 max-w-xs w-full sm:w-[280px]"
                  key={cancha.id_cancha ?? index}
                >
                  <img
                    className="w-full h-52 object-cover rounded-xl border border-surface-600"
                    src={cancha.imagen_url || "/canchas/estadio-azteca.png"}
                    alt={cancha.nombre || "Cancha"}
                  />
                  <h2 className="mt-4 text-white font-semibold text-lg">{cancha.nombre}</h2>
                  <p className="text-brand-300 text-sm mt-1">
                    {Number(cancha.precio).toLocaleString("es-VE")} Bs / hora
                  </p>
                  <Link to={`/socio/elegirhorario/${cancha.id_cancha}`} className="mt-4 block">
                    <span className="flex w-full justify-center rounded-xl bg-brand-500/90 hover:bg-brand-400 text-surface-950 font-semibold py-2.5 px-4 transition-colors">
                      Elegir día y horario
                    </span>
                  </Link>
                </div>
              ))
            ) : (
              <p className="mt-10 text-surface-400">No hay canchas disponibles en este momento</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default VisualizarCanchas;
