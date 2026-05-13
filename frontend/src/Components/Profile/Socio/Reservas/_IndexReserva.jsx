import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

import { NavBar } from "../../../NavBar";
import { LayoutProfile } from "../../LayoutProfile";
import { TableLayout } from "./TableLayout";
import { useAppContext } from "../../../../context/userContext";
import { ObtenerReservas, eliminarReservas } from "../../../../Services/Socio";

export function IndexReserva() {
  const { user } = useAppContext();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reservasEliminadas, setReservasEliminadas] = useState(0);
  const [error, setError] = useState(null);

  const cargarReservas = async () => {
    if (user) {
      setLoading(true);
      try {
        const data = await ObtenerReservas(user.id_usuario);
        setReservas(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleDelete = (id_usuario, id_cancha, id_reserva) => {
    Swal.fire({
      title: "¿Seguro que desea eliminar la reserva seleccionada?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarReservas(id_usuario, id_cancha, id_reserva).then(() => {
          Swal.fire(
            "Eliminado",
            "La reserva ha sido eliminada exitosamente.",
            "success"
          );
          setReservasEliminadas((valor) => valor + 1);
          cargarReservas();
        });
      }
    });
  };

  return (
    <>
      <NavBar />
      <LayoutProfile>
        {loading ? (
          <p className="text-center text-surface-400 py-12">Cargando reservas…</p>
        ) : (
          <div className="flex flex-col w-full max-w-6xl mx-auto px-2 sm:px-4">
            <div className="flex justify-center w-full mb-8 pt-4">
              <h1 className="text-2xl sm:text-4xl font-bold text-white text-center tracking-tight">
                Reservas realizadas
              </h1>
            </div>
            {error ? (
              <p className="text-center text-red-300">El servidor no está disponible.</p>
            ) : (
              <TableLayout data={reservas} OnDelete={handleDelete} />
            )}
          </div>
        )}
      </LayoutProfile>
    </>
  );
}