import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { NavBar } from "../../Components/NavBar";
import { registerUser } from "../../Services/Users";
import Swal from "sweetalert2";
import { BRAND } from "../../config/brand";

export function FormRegister() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setrePassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function onFormSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== rePassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({ nombre, email, password });
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Tu cuenta ha sido creada correctamente",
          confirmButtonText: "Iniciar sesión",
        }).then(() => navigate("/ingresar"));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-brand-900/20" />
        <div className="orb orb-green w-[400px] h-[400px] bottom-10 right-10 opacity-5" />
        <div className="orb orb-blue w-[300px] h-[300px] top-10 left-10 opacity-5" />

        <div className="relative z-10 w-full max-w-md animate-fade-in-up">
          <div className="glass-card p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-glow">
                <span className="text-2xl">🏟️</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Crear cuenta</h1>
              <p className="text-surface-400">Unite a {BRAND.name} y reservá canchas en minutos</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-fade-in">
                <p className="text-red-400 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onFormSubmit} className="space-y-5">
              <div>
                <label className="block text-surface-300 font-medium text-sm mb-2">
                  Nombre completo
                </label>
                <input
                  autoFocus
                  className="input-premium"
                  type="text"
                  value={nombre}
                  placeholder="Juan Pérez"
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-surface-300 font-medium text-sm mb-2">
                  Email
                </label>
                <input
                  className="input-premium"
                  type="email"
                  value={email}
                  placeholder="tu@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-surface-300 font-medium text-sm mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    className="input-premium pr-12"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-surface-300 font-medium text-sm mb-2">
                  Repetir contraseña
                </label>
                <input
                  className="input-premium"
                  type="password"
                  value={rePassword}
                  placeholder="••••••••"
                  onChange={(e) => setrePassword(e.target.value)}
                  required
                />
              </div>

              <button
                className={`btn-primary w-full py-4 text-base mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={loading}
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="loading-spinner w-5 h-5 border-2" />
                      Creando cuenta...
                    </>
                  ) : "Crear cuenta"}
                </span>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-surface-400 text-sm">
                ¿Ya tienes cuenta?{" "}
                <NavLink to="/ingresar" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                  Ingresar
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
