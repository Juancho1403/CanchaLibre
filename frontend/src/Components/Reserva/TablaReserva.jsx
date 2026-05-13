import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerReservas } from "../../Services/Reserva";
import { ReservarCancha, obtenerEmpresas } from "../../Services/Socio";
import { obtenerCanchass } from "../../Services/Canchas";
import Swal from "sweetalert2";
import { useAppContext } from "../../context/userContext";

/** Misma grilla que el backend (cupos de alquiler). */
const FRANJAS = ["17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00"];

export function TablaReserva() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [horarioFiltro, setHorarioFiltro] = useState("");
  const [empresaFiltro, setEmpresaFiltro] = useState("");
  const [canchasFiltro, setCanchasFiltro] = useState("");
  const [canchasEmpresa, setCanchasEmpresa] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [empresa, setEmpresa] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    setLoadError("");
    setLoading(true);
    try {
      const [r, e, c] = await Promise.all([obtenerReservas(), obtenerEmpresas(), obtenerCanchass()]);
      setReservas(Array.isArray(r) ? r : []);
      setEmpresa(Array.isArray(e) ? e : []);
      setCanchas(Array.isArray(c) ? c : []);
    } catch (err) {
      setLoadError(err.message || "No se pudieron cargar las reservas.");
      setReservas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
    let list = reservas.filter((reserva) => reserva.estado === "disponible");
    if (fechaFiltro) list = list.filter((reserva) => reserva.fecha === fechaFiltro);
    if (empresaFiltro) {
      list = list.filter((reserva) => String(reserva["Cancha.id_empresa"]) === String(empresaFiltro));
    }
    if (canchasFiltro) list = list.filter((reserva) => String(reserva.id_cancha) === String(canchasFiltro));
    if (horarioFiltro) list = list.filter((reserva) => reserva.horario === horarioFiltro);
    setReservasFiltradas(list);
  }, [reservas, fechaFiltro, empresaFiltro, canchasFiltro, horarioFiltro]);

  const handleEmpresaChange = (value) => {
    setCanchasFiltro("");
    setEmpresaFiltro(value);
    if (!value || !Array.isArray(canchas)) {
      setCanchasEmpresa([]);
      return;
    }
    setCanchasEmpresa(canchas.filter((c) => String(c.id_empresa) === String(value)));
  };

  const obtenerNombreCancha = (id) => {
    const currentCancha = canchas.find((c) => c.id_cancha === id);
    if (!currentCancha) return "Cancha";
    const emp = empresa.find((em) => em.id_empresa === currentCancha.id_empresa);
    if (!emp) return currentCancha.nombre;
    return `${emp.nombre} — ${currentCancha.nombre}`;
  };

  async function handleReserva(reservaHandler) {
    if (!user) {
      Swal.fire({ icon: "info", title: "Iniciá sesión", text: "Necesitás una cuenta de socio para reservar." });
      navigate("/ingresar");
      return;
    }
    const reservaData = {
      id_cancha: parseInt(reservaHandler.id_cancha, 10),
      id_usuario: user.id_usuario,
      fecha: reservaHandler.fecha,
      horario: reservaHandler.horario,
    };
    const nombre = obtenerNombreCancha(reservaHandler.id_cancha);
    const result = await Swal.fire({
      title: "¿Confirmar reserva?",
      html: `<div class="text-left text-slate-700 text-sm space-y-1"><p><strong>${nombre}</strong></p><p>Fecha: ${reservaHandler.fecha}</p><p>Horario: ${reservaHandler.horario}</p><p class="pt-2 text-slate-500">Después podés completar el pago en el checkout.</p></div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, reservar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await ReservarCancha(reservaData);
      await cargarDatos();
      const pay = await Swal.fire({
        icon: "success",
        title: "¡Reserva registrada!",
        text: "¿Querés ir al pago ahora?",
        showCancelButton: true,
        confirmButtonText: "Ir a pagar",
        cancelButtonText: "Seguir buscando",
        confirmButtonColor: "#059669",
      });
      if (pay.isConfirmed) {
        navigate(`/checkout?canchaId=${reservaData.id_cancha}`);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No se pudo reservar",
        text: error.message || "Elegí otro horario o probá de nuevo.",
      });
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-6 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">Reservas</h1>
        <p className="text-slate-400 text-center text-sm mb-10 max-w-xl mx-auto">
          Filtrá por complejo, cancha, horario y fecha. Solo se muestran cupos disponibles.
        </p>

        {loadError && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-red-200 text-sm text-center">
            {loadError}
          </div>
        )}

        <section className="glass-card rounded-2xl border border-slate-700/60 p-5 sm:p-6 mb-8">
          <h2 className="text-slate-200 font-semibold text-sm uppercase tracking-wider mb-4">Seleccioná los parámetros</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filtro-empresa" className="text-xs font-medium text-slate-400">
                Empresa
              </label>
              <select
                id="filtro-empresa"
                className="rounded-xl border border-slate-600 bg-slate-900/90 text-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 outline-none"
                onChange={(e) => handleEmpresaChange(e.target.value)}
                value={empresaFiltro}
              >
                <option value="">Todas</option>
                {empresa?.map((em) => (
                  <option key={em.id_empresa} value={em.id_empresa}>
                    {em.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filtro-cancha" className="text-xs font-medium text-slate-400">
                Cancha
              </label>
              <select
                id="filtro-cancha"
                className="rounded-xl border border-slate-600 bg-slate-900/90 text-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/40 outline-none"
                onChange={(e) => setCanchasFiltro(e.target.value)}
                value={canchasFiltro}
              >
                <option value="">Todas</option>
                {canchasEmpresa.map((c) => (
                  <option key={c.id_cancha} value={c.id_cancha}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filtro-horario" className="text-xs font-medium text-slate-400">
                Horario
              </label>
              <select
                id="filtro-horario"
                className="rounded-xl border border-slate-600 bg-slate-900/90 text-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/40 outline-none"
                onChange={(e) => setHorarioFiltro(e.target.value)}
                value={horarioFiltro}
              >
                <option value="">Todos</option>
                {FRANJAS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filtro-fecha" className="text-xs font-medium text-slate-400">
                Fecha
              </label>
              <input
                id="filtro-fecha"
                type="date"
                className="rounded-xl border border-slate-600 bg-slate-900/90 text-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/40 outline-none"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="rounded-2xl border border-slate-700/60 overflow-hidden bg-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[640px]">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="px-4 py-3 font-semibold">Cancha</th>
                  <th className="px-4 py-3 font-semibold">Horario</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                      Cargando cupos disponibles…
                    </td>
                  </tr>
                )}
                {!loading && reservasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-slate-600 bg-slate-50">
                      No hay canchas disponibles con esos parámetros. Probá otra fecha o relajá los filtros.
                    </td>
                  </tr>
                )}
                {!loading &&
                  reservasFiltradas.map((reserva) => (
                    <tr key={reserva.id_reserva} className="border-t border-slate-200 odd:bg-white even:bg-slate-50 hover:bg-emerald-50/60 transition-colors">
                      <td className="px-4 py-3 text-slate-900 font-medium">{obtenerNombreCancha(reserva.id_cancha)}</td>
                      <td className="px-4 py-3 text-slate-800">{reserva.horario}</td>
                      <td className="px-4 py-3 text-slate-800">{reserva.fecha}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 transition-colors"
                          onClick={() => handleReserva(reserva)}
                        >
                          Reservar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
