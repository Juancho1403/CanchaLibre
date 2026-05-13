import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { CanchasDisponiblesFecha } from "../../Services/Canchas";
import { fetchMercadoPago } from "../../Services/mercadopago";
import { ReservarCancha } from "../../Services/Socio";
import { NavBar } from "../NavBar";
import SelectorDeDias from "./VisualizarDiasSemana";
import { useAppContext } from "../../context/userContext";

export const VisualizarHorarios = () => {
  const { user } = useAppContext();
  const { id, dia } = useParams();
  const [horarios, setHorarios] = useState([]);
  const [hora, setHora] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      setHora("");
      try {
        const data = await CanchasDisponiblesFecha(id, dia);
        if (!cancelled) setHorarios(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, dia]);

  const handleReservar = async (e) => {
    e.preventDefault();
    if (!user) return;
    const reserva = {
      id_cancha: parseInt(id, 10),
      id_usuario: user.id_usuario,
      fecha: dia,
      horario: hora,
    };

    if (!reserva.horario) {
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Debés seleccionar un horario",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    try {
      await ReservarCancha(reserva);
      await Swal.fire({
        icon: "success",
        title: "Reserva registrada",
        text: "Podés continuar con el pago.",
        showConfirmButton: false,
        timer: 2200,
      });
      await fetchMercadoPago();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: err?.message || String(err),
        confirmButtonColor: "#EF4444",
      });
    }
    try {
      const data = await CanchasDisponiblesFecha(id, dia);
      setHorarios(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    }
  };

  if (!user) {
    return (
      <>
        <NavBar />
        <p className="text-center text-surface-400 pt-24">Iniciá sesión para reservar.</p>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <NavBar />
        <SelectorDeDias />
        <p className="text-center text-surface-400 pt-12">Cargando horarios…</p>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-surface-950 text-surface-100 pb-20">
        <SelectorDeDias />

        <div className="max-w-lg mx-auto px-4 pt-10">
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="glass-card rounded-2xl border border-surface-600/80 p-6 sm:p-8">
            <h1 className="text-xl font-bold text-white text-center mb-1">
              Horarios disponibles
            </h1>
            <p className="text-surface-400 text-sm text-center mb-6">
              Fecha seleccionada: <span className="text-brand-300 font-medium">{dia}</span>
            </p>

            <form onSubmit={handleReservar} className="space-y-5">
              <div>
                <label htmlFor="horario" className="block text-surface-300 text-sm font-medium mb-2">
                  Elegí un horario
                </label>
                <select
                  id="horario"
                  name="horario"
                  value={hora}
                  onChange={(event) => setHora(event.target.value)}
                  className="w-full rounded-xl border border-surface-600 bg-surface-900/90 text-white px-3 py-3 text-sm focus:ring-2 focus:ring-brand-500/40 outline-none"
                >
                  <option value="">Seleccioná un horario disponible</option>
                  {horarios.map((hor) => (
                    <option key={hor.horario} value={hor.horario}>
                      {hor.horario}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full btn-primary py-3 rounded-xl font-semibold text-surface-950"
              >
                Reservar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
