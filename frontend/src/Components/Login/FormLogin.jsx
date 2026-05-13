import React, { useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { NavBar } from "../NavBar";
import { decodificar, useAppContext } from "../../context/userContext";
import { loginUser } from "../../Services/Users";
import Swal from 'sweetalert2';

export function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, setIsLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  async function onFormSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const data = await loginUser({ email, password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(decodificar(data.token));
        setIsLoggedIn(true);
        const r = redirectTo;
        const safeRedirect =
          r && r.startsWith("/") && !r.startsWith("//") ? r : null;
        navigate(safeRedirect || "/perfil");
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
        <div className="orb orb-green w-[400px] h-[400px] top-10 right-10 opacity-5" />
        <div className="orb orb-blue w-[300px] h-[300px] bottom-10 left-10 opacity-5" />
        
        <div className="relative z-10 w-full max-w-md animate-fade-in-up">
          {/* Card */}
          <div className="glass-card p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-glow">
                <span className="text-2xl">⚽</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
              <p className="text-surface-400">Ingresa a tu cuenta para continuar</p>
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
                  Correo o usuario
                </label>
                <input
                  autoFocus
                  value={email}
                  type="text"
                  placeholder="admin o tu@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-surface-300 font-medium text-sm mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    value={password}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-premium pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
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
                      Ingresando...
                    </>
                  ) : "Ingresar"}
                </span>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-surface-400 text-sm">
                ¿No tienes cuenta?{" "}
                <NavLink to="/registrar" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                  Regístrate
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}