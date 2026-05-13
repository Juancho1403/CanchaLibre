import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchCalendarioEmpresa } from "../../Services/Canchas";
import { ReservarCancha } from "../../Services/Socio";
import { useAppContext } from "../../context/userContext";
import { NavBar } from "../NavBar";

function formatBs(n) {
  try {
    return `${Number(n).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
  } catch {
    return `${n} Bs`;
  }
}

function labelHora(franja) {
  const [a, b] = String(franja).split("-");
  return `${a} – ${b}`;
}

function CalendarioReservasSocio() {
  const { idEmpresa, fecha: fechaParam } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [fecha, setFecha] = useState(fechaParam || new Date().toISOString().slice(0, 10));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sel, setSel] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    setSel(null);
    try {
      const json = await fetchCalendarioEmpresa(idEmpresa, fecha);
      setData(json);
    } catch (e) {
      setError(e.message || "No se pudo cargar el calendario");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [idEmpresa, fecha]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const estadoCelda = (id_cancha, horario) => {
    const c = data?.celdas?.find((x) => x.id_cancha === id_cancha && x.horario === horario);
    return c?.estado || "reservado";
  };

  const idReserva = (id_cancha, horario) => {
    const c = data?.celdas?.find((x) => x.id_cancha === id_cancha && x.horario === horario);
    return c?.id_reserva;
  };

  const onReservar = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({ icon: "info", title: "Iniciá sesión", text: "Necesitás cuenta de socio para reservar." });
      navigate("/ingresar");
      return;
    }
    if (!sel) {
      Swal.fire({ icon: "warning", title: "Elegí un cupo", text: "Marcá una celda DISPONIBLE." });
      return;
    }
    try {
      await ReservarCancha({
        id_cancha: sel.id_cancha,
        id_usuario: user.id_usuario,
        fecha,
        horario: sel.horario,
      });
      Swal.fire({ icon: "success", title: "Reserva registrada", text: `Turno ${sel.horario}` });
      cargar();
    } catch (err) {
      Swal.fire({ icon: "error", title: "No se pudo reservar", text: String(err?.message || err) });
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-slate-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              CALENDARIO Y RESERVAS
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600">FECHA</span>
              <input
                type="date"
                value={fecha}
                onChange={(e) => {
                  const v = e.target.value;
                  setFecha(v);
                  navigate(`/socio/calendario/${idEmpresa}/${v}`, { replace: true });
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
              {loading && <p className="p-8 text-center text-slate-500">Cargando…</p>}
              {!loading && error && <p className="p-8 text-center text-red-600">{error}</p>}
              {!loading && !error && data && (
                <table className="w-full text-sm border-collapse min-w-[640px]">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="p-3 text-left font-bold border border-slate-600">HORA</th>
                      {data.canchas.map((c) => (
                        <th key={c.id_cancha} className="p-3 text-center font-bold border border-slate-600 min-w-[120px]">
                          <div className="flex flex-col items-center gap-1">
                            <img
                              src={c.imagen_url || "/canchas/estadio-azteca.png"}
                              alt=""
                              className="w-14 h-10 object-cover rounded border border-slate-500"
                            />
                            <span className="text-xs leading-tight">{c.nombre}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.franjas.map((franja) => (
                      <tr key={franja} className="bg-white">
                        <td className="p-3 font-semibold text-slate-700 border border-slate-200 whitespace-nowrap">
                          {labelHora(franja)}
                        </td>
                        {data.canchas.map((c) => {
                          const st = estadoCelda(c.id_cancha, franja);
                          const disp = st === "disponible";
                          const checked =
                            sel?.id_cancha === c.id_cancha && sel?.horario === franja;
                          return (
                            <td key={`${c.id_cancha}-${franja}`} className="p-2 border border-slate-200 align-top">
                              {disp ? (
                                <label className="flex flex-col items-center gap-1 cursor-pointer rounded-lg p-2 hover:bg-emerald-50">
                                  <input
                                    type="radio"
                                    name="cupo"
                                    checked={checked}
                                    onChange={() =>
                                      setSel({ id_cancha: c.id_cancha, horario: franja, id_reserva: idReserva(c.id_cancha, franja) })
                                    }
                                    className="accent-emerald-600"
                                  />
                                  <span className="text-xs font-bold text-emerald-700">DISPONIBLE</span>
                                  <div className="w-12 h-8 rounded bg-emerald-500/90 border border-emerald-700 shadow-inner" title="Cancha libre" />
                                  <span className="text-xs font-semibold text-slate-800">{formatBs(c.precio)}</span>
                                </label>
                              ) : (
                                <div className="flex flex-col items-center gap-1 p-2 opacity-90">
                                  <span className="text-xs font-bold text-red-600">Reservada</span>
                                  <div className="w-12 h-8 rounded bg-slate-300 border border-slate-400 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#fff_2px,#fff_4px)] opacity-40" />
                                  </div>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <aside className="w-full lg:w-56 shrink-0">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm sticky top-24">
                <img
                  src="/canchas/calendario-reservas-ref.png"
                  alt="Promo"
                  className="w-full rounded-lg border border-slate-200 mb-3"
                />
                <p className="text-xs font-bold text-amber-800 bg-amber-100 rounded px-2 py-2 text-center">
                  Preguntá por nuestras promociones
                </p>
                <Link
                  to={`/socio/elegircancha/${idEmpresa}`}
                  className="mt-4 block text-center text-sm text-blue-700 hover:underline"
                >
                  ← Volver a canchas
                </Link>
                <form onSubmit={onReservar} className="mt-4">
                  <button
                    type="submit"
                    disabled={!user}
                    className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 text-sm"
                  >
                    {user ? "Reservar selección" : "Iniciá sesión para reservar"}
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export default CalendarioReservasSocio;
