import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/userContext";
import { BRAND } from "../../config/brand";

const ZONAS = [
  { value: "", label: "¿Dónde querés jugar hoy?" },
  { value: "Valencia", label: "Valencia" },
  { value: "Naguanagua", label: "Naguanagua" },
  { value: "San Diego", label: "San Diego" },
  { value: "Los Guayos", label: "Los Guayos" },
];

export function Hero() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [zona, setZona] = useState("");

  const buscar = () => {
    const params = new URLSearchParams();
    if (zona) params.set("zona", zona);
    navigate(`/explorar?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-brand-900/30" />
      
      {/* Decorative orbs */}
      <div className="orb orb-green w-[500px] h-[500px] -top-20 -right-20" />
      <div className="orb orb-blue w-[400px] h-[400px] bottom-20 -left-20" />
      <div className="orb orb-green w-[300px] h-[300px] top-1/2 left-1/2 opacity-10" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-sm text-surface-300 font-medium">{BRAND.name} · reservas deportivas</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Reserva tu</span>
              <br />
              <span className="text-gradient">cancha</span>
              <span className="text-white"> ahora</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-surface-400 max-w-lg mb-8 leading-relaxed">
              Elegí zona y explorá canchas con fotos, mapa y filtros. Pensado para desktop y para reservar rápido desde el
              celular.
            </p>

            <div className="max-w-xl mb-10">
              <label className="sr-only" htmlFor="zona-hero">
                Zona
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  id="zona-hero"
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  className="flex-1 rounded-xl bg-surface-900/80 border border-surface-700 text-white text-sm px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                >
                  {ZONAS.map((z) => (
                    <option key={z.value || "all"} value={z.value}>
                      {z.label}
                    </option>
                  ))}
                </select>
                <button type="button" className="btn-primary text-sm sm:text-base py-3.5 px-8 rounded-xl" onClick={buscar}>
                  Buscar canchas
                </button>
              </div>
              <p className="text-surface-500 text-xs mt-3">
                Tip: dejá la zona en “¿Dónde…?” para ver todo el catálogo.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                className="btn-primary text-base py-4 px-8 rounded-xl"
                onClick={() => navigate(user ? "/explorar" : "/registrar")}
              >
                <span className="flex items-center gap-2">
                  {user ? "Ir al explorador" : "Crear cuenta gratis"}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              <button
                className="btn-secondary text-base py-4 px-8 rounded-xl"
                onClick={() => {
                  document.getElementById('pasos')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                ¿Cómo funciona?
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 mt-14">
              {[
                { value: "500+", label: "Canchas" },
                { value: "1K+", label: "Reservas" },
                { value: "99%", label: "Satisfacción" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-surface-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right - Visual */}
          <div className="hidden lg:flex justify-center items-center animate-float">
            <div className="relative">
              {/* Glowing card */}
              <div className="glass-card p-8 w-80 relative">
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-brand-500 animate-pulse" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-2xl">⚽</div>
                  <div>
                    <p className="text-white font-semibold">Cancha Fútbol 5</p>
                    <p className="text-surface-400 text-sm">Complejo El Gol</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs text-surface-500 uppercase tracking-wider">Buscador rápido</label>
                  <select
                    value={zona}
                    onChange={(e) => setZona(e.target.value)}
                    className="w-full rounded-lg bg-surface-950/60 border border-surface-700 text-white text-sm px-3 py-2"
                  >
                    {ZONAS.map((z) => (
                      <option key={z.value || "all"} value={z.value}>
                        {z.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Vista</span>
                    <span className="text-white font-medium">Lista + mapa</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Próximo paso</span>
                    <span className="text-brand-400 font-medium">Elegir horario</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Desde</span>
                    <span className="text-white font-medium">$40.00</span>
                  </div>
                </div>
                <button type="button" className="btn-primary w-full mt-6 py-3 text-sm" onClick={buscar}>
                  <span>Explorar en esta zona</span>
                </button>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 glass-card px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">¡Reserva confirmada!</p>
                  <p className="text-surface-500 text-xs">hace 2 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}