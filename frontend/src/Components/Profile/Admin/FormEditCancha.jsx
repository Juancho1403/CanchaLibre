import React, { useEffect, useState } from "react";
import { obtenerEmpresas } from "../../../Services/Admin";

const empty = {
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

export function FormEditCancha({ cancha, onSave, title, cancel }) {
  const [formValues, setFormValues] = useState(empty);
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    obtenerEmpresas()
      .then((data) => setEmpresas(Array.isArray(data) ? data : []))
      .catch(() => setEmpresas([]));
  }, []);

  useEffect(() => {
    if (cancha && cancha.id_cancha != null && cancha.id_cancha !== "") {
      setFormValues({
        id_cancha: cancha.id_cancha,
        nombre: cancha.nombre ?? "",
        tipo: cancha.tipo || "futbol",
        precio: cancha.precio ?? "",
        id_empresa: cancha.id_empresa ?? "",
        descripcion: cancha.descripcion ?? "",
        imagen_url: cancha.imagen_url ?? "",
        hora_inicio: cancha.hora_inicio || "17:00",
        hora_fin: cancha.hora_fin || "22:00",
        jugadores_min: cancha.jugadores_min ?? 10,
        jugadores_max: cancha.jugadores_max ?? 20,
      });
    } else {
      setFormValues(empty);
    }
  }, [cancha]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      nombre: formValues.nombre,
      tipo: "futbol",
      precio: Number(formValues.precio),
      id_empresa: Number(formValues.id_empresa),
      descripcion: formValues.descripcion || "",
      imagen_url: formValues.imagen_url || "",
      hora_inicio: formValues.hora_inicio,
      hora_fin: formValues.hora_fin,
      jugadores_min: Number(formValues.jugadores_min),
      jugadores_max: Number(formValues.jugadores_max),
    };
    if (formValues.id_cancha !== "" && formValues.id_cancha != null) {
      payload.id_cancha = Number(formValues.id_cancha);
    }
    onSave(payload);
  };

  const input =
    "w-full rounded-xl border border-slate-600 bg-slate-900/90 text-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/40 outline-none";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-slate-600 bg-slate-950 shadow-2xl p-6 sm:p-8 my-8"
      >
        <h3 className="text-xl font-bold text-white text-center mb-6">{title}</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre</label>
            <input required type="text" name="nombre" value={formValues.nombre} onChange={handleChange} className={input} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Empresa</label>
            <select
              required
              name="id_empresa"
              value={formValues.id_empresa}
              onChange={handleChange}
              className={input}
            >
              <option value="">Seleccioná un complejo</option>
              {empresas.map((em) => (
                <option key={em.id_empresa} value={em.id_empresa}>
                  {em.nombre} ({em.zona || "—"})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Precio (Bs / hora)</label>
              <input required type="number" min="0" step="0.01" name="precio" value={formValues.precio} onChange={handleChange} className={input} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Imagen (URL)</label>
              <input type="text" name="imagen_url" value={formValues.imagen_url} onChange={handleChange} className={input} placeholder="/canchas/..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Hora inicio</label>
              <input type="time" name="hora_inicio" value={formValues.hora_inicio} onChange={handleChange} className={input} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Hora fin</label>
              <input type="time" name="hora_fin" value={formValues.hora_fin} onChange={handleChange} className={input} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Jugadores mín.</label>
              <input type="number" min="1" name="jugadores_min" value={formValues.jugadores_min} onChange={handleChange} className={input} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Jugadores máx.</label>
              <input type="number" min="1" name="jugadores_max" value={formValues.jugadores_max} onChange={handleChange} className={input} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Descripción</label>
            <textarea name="descripcion" rows={3} value={formValues.descripcion} onChange={handleChange} className={input} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button type="submit" className="btn-primary flex-1 py-3 rounded-xl font-semibold">
            Guardar
          </button>
          <button type="button" className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800" onClick={cancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
