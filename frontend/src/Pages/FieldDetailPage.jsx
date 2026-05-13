import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchCatalogoCancha } from "../Services/catalogo";
import { useAppContext } from "../context/userContext";
import { parseMetodosPago, PAYMENT_LABELS } from "../utils/paymentMethods";

export default function FieldDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAppContext();
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCatalogoCancha(id);
        if (!cancelled) setRow(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "No se pudo cargar la cancha");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const reserve = () => {
    if (!row?.Empresa?.id_empresa) return;
    if (!isLoggedIn || !user) {
      navigate(`/ingresar?redirect=/cancha/${id}`);
      return;
    }
    if (user.rol === "socio") {
      navigate(`/socio/elegircancha/${row.Empresa.id_empresa}`);
      return;
    }
    navigate("/registrar");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-surface-950 pt-8 pb-20 px-4">
        <div className="max-w-6xl mx-auto glass-card h-[480px] animate-pulse bg-surface-900/40" />
      </main>
    );
  }

  if (error || !row) {
    return (
      <main className="min-h-screen bg-surface-950 pt-8 pb-20 px-4">
        <div className="max-w-3xl mx-auto glass-card p-10 text-center">
          <p className="text-red-400 mb-6">{error || "Cancha no encontrada"}</p>
          <Link to="/explorar" className="btn-primary inline-block px-6 py-3 rounded-xl">
            Volver al explorador
          </Link>
        </div>
      </main>
    );
  }

  const emp = row.Empresa;
  const img =
    row.imagen_url ||
    "https://images.unsplash.com/photo-1529900740404-1e2b32b87c48?w=1200&q=80";
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    emp?.direccion || emp?.nombre || ""
  )}`;

  let servicios = [];
  try {
    if (emp?.servicios) servicios = JSON.parse(emp.servicios);
  } catch {
    servicios = [];
  }

  const metodos = parseMetodosPago(emp);

  return (
    <main className="min-h-screen bg-surface-950 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <nav className="text-sm text-surface-500 mb-6">
          <Link to="/explorar" className="hover:text-brand-400">
            Explorar
          </Link>
          <span className="mx-2">/</span>
          <span className="text-surface-300">{row.nombre}</span>
        </nav>

        <div className="grid lg:grid-cols-[1.15fr_380px] gap-10 items-start">
          <div>
            <div className="rounded-2xl overflow-hidden border border-surface-800 mb-6">
              <img src={img} alt="" className="w-full h-64 sm:h-80 object-cover" />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 text-brand-300 border border-brand-500/30">
                Fútbol
              </span>
              {emp?.zona && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-800 text-surface-300 border border-surface-700">
                  {emp.zona}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-800 text-surface-300 border border-surface-700">
                {row.hora_inicio || "17:00"} – {row.hora_fin || "22:00"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-800 text-surface-300 border border-surface-700">
                {row.jugadores_min ?? 10}–{row.jugadores_max ?? 20} jugadores
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{row.nombre}</h1>
            <p className="text-surface-400 text-lg leading-relaxed mb-3">
              Alquiler por hora entre <strong className="text-surface-300">{row.hora_inicio || "17:00"}</strong> y{" "}
              <strong className="text-surface-300">{row.hora_fin || "22:00"}</strong>. Equipos de{" "}
              <strong className="text-surface-300">
                {row.jugadores_min ?? 10} a {row.jugadores_max ?? 20}
              </strong>{" "}
              jugadores.
            </p>
            <p className="text-surface-400 text-lg leading-relaxed mb-6">
              {row.descripcion || "Consultá disponibilidad y reservá en pocos pasos desde tu perfil de socio."}
            </p>

            <div className="glass-card p-6 mb-6">
              <h2 className="text-white font-semibold mb-3">Complejo</h2>
              <p className="text-white text-lg">{emp?.nombre}</p>
              <p className="text-surface-400 text-sm mt-2">{emp?.direccion}</p>
              <p className="text-surface-500 text-sm mt-1">Tel: {emp?.telefono}</p>
            </div>

            {servicios.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-white font-semibold mb-3">Servicios</h2>
                <ul className="flex flex-wrap gap-2">
                  {servicios.map((s) => (
                    <li
                      key={s}
                      className="text-sm px-3 py-1.5 rounded-lg bg-surface-800/80 text-surface-200 border border-surface-700"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {metodos.length > 0 && (
              <div className="glass-card p-6 mt-6">
                <h2 className="text-white font-semibold mb-3">Métodos de pago aceptados</h2>
                <ul className="flex flex-wrap gap-2">
                  {metodos.map((id) => (
                    <li
                      key={id}
                      className="text-sm px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-200 border border-brand-500/25"
                    >
                      {PAYMENT_LABELS[id] || id}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="glass-card p-6 border border-brand-500/20 shadow-glow">
              <p className="text-surface-500 text-sm">Precio referencial (por hora)</p>
              <p className="text-4xl font-bold text-gradient mt-1">
                {Number(row.precio).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs
              </p>
              <p className="text-surface-500 text-xs mt-2">
                Pagos: Stripe (tarjeta), PayPal, Mercado Pago o reportar pago móvil en el checkout. Sujeto a confirmación
                del complejo.
              </p>
              <button type="button" className="btn-primary w-full mt-6 py-3 rounded-xl" onClick={reserve}>
                Reservar horario
              </button>
              <a
                href={mapHref}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-center w-full py-3 rounded-xl border border-surface-600 text-surface-200 hover:border-brand-500/40 hover:text-white transition-colors text-sm"
              >
                Cómo llegar (Google Maps)
              </a>
              <Link
                to={`/checkout?canchaId=${row.id_cancha}`}
                className="mt-3 block text-center text-sm text-brand-400 hover:text-brand-300"
              >
                Pago móvil / comprobante
              </Link>
            </div>
            <div className="glass-card p-5 text-sm text-surface-500">
              Tip: si todavía no tenés cuenta, registrate como{" "}
              <span className="text-surface-300">socio</span> para ver calendario y horarios en vivo.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
