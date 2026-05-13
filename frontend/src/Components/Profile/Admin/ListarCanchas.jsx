import React, { useCallback, useEffect, useState } from "react";
import { deleteCancha, listarCanchas, modifyCancha, registerCancha } from "../../../Services/Canchas";
import { FormEditCancha } from "./FormEditCancha";
import { ScrollButton } from "./ListarEmpresas";
import Swal from "sweetalert2";

const emptyCancha = {
  id_cancha: "",
  nombre: "",
  tipo: "futbol",
  precio: "",
  id_empresa: "",
  descripcion: "",
  imagen_url: "",
  hora_inicio: "17:00",
  hora_fin: "22:00",
  jugadores_min: 10,
  jugadores_max: 20,
};

export default function ListarCanchas() {
  const [canchas, setCanchas] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modify, setModify] = useState(false);
  const [create, setCreate] = useState(false);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState(emptyCancha);

  const load = useCallback(() => {
    listarCanchas()
      .then((data) => setCanchas(Array.isArray(data) ? data : []))
      .catch(() => setCanchas([]));
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleEditCancha = (row) => {
    setCreate(false);
    setCanchaSeleccionada(row);
    setModify(true);
  };

  const handleSaveCancha = (values) => {
    modifyCancha(values)
      .then(() => {
        setModify(false);
        setCanchaSeleccionada(emptyCancha);
        refresh();
        Swal.fire({ icon: "success", title: "Cancha actualizada", timer: 1800, showConfirmButton: false });
      })
      .catch((e) => Swal.fire({ icon: "error", title: "Error", text: e.message || "No se pudo guardar" }));
  };

  const handleDeleteCancha = (row) => {
    Swal.fire({
      title: `¿Eliminar la cancha "${row.nombre}"?`,
      text: "Se borrarán también las reservas asociadas en la base.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCancha(row)
          .then(() => {
            refresh();
            Swal.fire({ icon: "success", title: "Eliminada", timer: 1800, showConfirmButton: false });
          })
          .catch((e) => Swal.fire({ icon: "error", title: "Error", text: e.message }));
      }
    });
  };

  const handleCancel = () => {
    setModify(false);
    setCreate(false);
    setCanchaSeleccionada(emptyCancha);
  };

  async function handleCreateCancha(values) {
    try {
      await registerCancha(values);
      setCreate(false);
      refresh();
      Swal.fire({ icon: "success", title: "Cancha creada", text: "Se generaron cupos para los próximos 7 días.", timer: 2500 });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error", text: e.message || "No se pudo crear" });
    }
  }

  return (
    <>
      <ScrollButton />
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white px-4 pb-20">
        <div className="max-w-6xl mx-auto pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold">Gestión de canchas</h1>
            <button
              type="button"
              className="btn-primary px-6 py-3 rounded-xl font-semibold w-full sm:w-auto"
              onClick={() => {
                setModify(false);
                setCanchaSeleccionada(emptyCancha);
                setCreate(true);
              }}
            >
              Agregar cancha
            </button>
          </div>

          <div className="rounded-2xl border border-slate-700 overflow-hidden bg-slate-900/50">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[720px]">
                <thead>
                  <tr className="bg-slate-800 text-slate-200">
                    <th className="px-3 py-3">ID</th>
                    <th className="px-3 py-3">Nombre</th>
                    <th className="px-3 py-3">Empresa</th>
                    <th className="px-3 py-3">Precio Bs</th>
                    <th className="px-3 py-3">Horario</th>
                    <th className="px-3 py-3">Jugadores</th>
                    <th className="px-3 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {canchas.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                        No hay canchas cargadas.
                      </td>
                    </tr>
                  )}
                  {canchas.map((row) => (
                    <tr key={row.id_cancha} className="border-t border-slate-700 hover:bg-slate-800/60">
                      <td className="px-3 py-3 text-slate-300">{row.id_cancha}</td>
                      <td className="px-3 py-3 font-medium text-white">{row.nombre}</td>
                      <td className="px-3 py-3 text-slate-300">{row.id_empresa}</td>
                      <td className="px-3 py-3 text-emerald-300">{Number(row.precio).toLocaleString("es-VE")}</td>
                      <td className="px-3 py-3 text-slate-300">
                        {row.hora_inicio || "—"} – {row.hora_fin || "—"}
                      </td>
                      <td className="px-3 py-3 text-slate-300">
                        {row.jugadores_min ?? "—"}–{row.jugadores_max ?? "—"}
                      </td>
                      <td className="px-3 py-3 text-center space-x-2 whitespace-nowrap">
                        <button type="button" className="text-emerald-400 hover:underline font-medium" onClick={() => handleEditCancha(row)}>
                          Editar
                        </button>
                        <button type="button" className="text-red-400 hover:underline font-medium" onClick={() => handleDeleteCancha(row)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {modify && (
        <FormEditCancha cancha={canchaSeleccionada} onSave={handleSaveCancha} title="Modificar cancha" cancel={handleCancel} />
      )}
      {create && <FormEditCancha cancha={null} onSave={handleCreateCancha} title="Nueva cancha" cancel={handleCancel} />}
    </>
  );
}
