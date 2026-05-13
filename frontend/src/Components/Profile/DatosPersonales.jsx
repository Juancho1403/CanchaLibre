import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/userContext";
import { modifyUser, obtenerSociosConId } from "../../Services/Admin";
import { ButtonShowPassword } from "../../Utils/Butttons";
import Swal from "sweetalert2";

export function DatosPersonales() {
  const { user, setUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordBackup, setPasswordBackup] = useState("");
  const [formValues, setFormValues] = useState({
    id_usuario: user?.id_usuario,
    nombre: user?.nombre || "",
    email: user?.email || "",
    rol: user?.rol || "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!user?.id_usuario) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await obtenerSociosConId(user.id_usuario);
        if (cancelled || !data) return;
        setPasswordBackup(data.password || "");
        setFormValues((prev) => ({
          ...prev,
          id_usuario: data.id_usuario,
          nombre: data.nombre ?? "",
          email: data.email ?? "",
          rol: data.rol ?? "",
          password: "",
        }));
      } catch {
        /* JWT alcanza para mostrar perfil */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id_usuario]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  async function EnviarDatos(e) {
    e.preventDefault();
    setSaving(true);
    if (!formValues.password?.trim() && !passwordBackup) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña requerida",
        text: "Ingresá tu contraseña actual o una nueva para guardar los cambios.",
      });
      setSaving(false);
      return;
    }
    try {
      const payload = {
        id_usuario: formValues.id_usuario,
        nombre: formValues.nombre,
        email: formValues.email,
        rol: formValues.rol,
        password: formValues.password?.trim() ? formValues.password : passwordBackup,
      };
      await modifyUser(payload);
      setUser((prev) => ({
        ...prev,
        nombre: payload.nombre,
        email: payload.email,
        rol: payload.rol,
      }));
      setFormValues((prev) => ({ ...prev, password: "" }));
      setIsEditing(false);
      Swal.fire({ icon: "success", title: "Datos actualizados", timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "No se pudo guardar", text: err.message || "Intentá de nuevo." });
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-surface-600 bg-surface-900/80 px-4 py-3 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-shadow disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="w-full max-w-lg mx-auto text-left">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Datos personales</h2>
      <p className="text-surface-400 text-sm mb-8">Actualizá tu nombre, correo o contraseña.</p>

      <form onSubmit={EnviarDatos} className="glass-card rounded-2xl border border-surface-700/50 p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Nombre</label>
          <input
            disabled={!isEditing}
            type="text"
            name="nombre"
            value={formValues.nombre}
            onChange={handleChange}
            className={inputClass}
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Email</label>
          <input
            disabled={!isEditing}
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            className={inputClass}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              disabled={!isEditing}
              type={showPassword ? "text" : "password"}
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder={isEditing ? "Nueva contraseña (opcional)" : "••••••••"}
              className={`${inputClass} pr-12`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white p-1"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <ButtonShowPassword showPassword={showPassword} />
            </button>
          </div>
          {isEditing && (
            <p className="text-surface-500 text-xs mt-1">Dejá en blanco para mantener la contraseña actual.</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Categoría</label>
          <input disabled type="text" name="rol" value={formValues.rol} readOnly className={`${inputClass} opacity-80`} />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {!isEditing ? (
            <button
              type="button"
              className="btn-primary py-3 px-6 rounded-xl"
              onClick={() => setIsEditing(true)}
            >
              Modificar datos
            </button>
          ) : (
            <>
              <button type="submit" disabled={saving} className="btn-primary py-3 px-6 rounded-xl disabled:opacity-50">
                {saving ? "Guardando…" : "Guardar cambios"}
              </button>
              <button
                type="button"
                className="py-3 px-6 rounded-xl border border-surface-600 text-surface-200 hover:bg-surface-800/80 transition-colors"
                onClick={() => {
                  setIsEditing(false);
                  setFormValues((prev) => ({ ...prev, password: "" }));
                }}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
