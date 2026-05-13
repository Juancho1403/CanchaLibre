import React, { useEffect, useState } from "react";

const steps = [
  {
    icon: "🔍",
    titulo: "Busca",
    descripcion: "Filtrá por zona, deporte y precio. Compará complejos y abrí la ubicación en Google Maps.",
    color: "from-brand-500/20 to-brand-600/10",
    borderColor: "border-brand-500/30",
  },
  {
    icon: "💳",
    titulo: "Paga",
    descripcion: "Reservá tu bloque y registrá pago móvil con referencia y comprobante para validación rápida.",
    color: "from-sky-500/20 to-sky-600/10",
    borderColor: "border-sky-500/30",
  },
  {
    icon: "⚽",
    titulo: "Jugá",
    descripcion: "Recibí la confirmación, compartí el acceso con tu equipo y disfrutá la cancha sin estrés.",
    color: "from-violet-500/20 to-violet-600/10",
    borderColor: "border-violet-500/30",
  },
];

export function Pasos() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="pasos" className="py-24 px-4 relative overflow-hidden">
      <div className="orb orb-green w-[400px] h-[400px] top-0 right-0 opacity-5" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-400 font-semibold text-sm uppercase tracking-wider">Tres pasos</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
            Busca, paga y <span className="text-gradient">jugá</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            Flujo pensado para quien reserva desde la compu y para el jugador que agenda desde el celular camino a la
            cancha.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative glass-card p-8 text-center transition-all duration-500 ${
                activeIndex === index
                  ? `bg-gradient-to-b ${step.color} border ${step.borderColor} scale-[1.02] shadow-glow`
                  : "hover:border-surface-600"
              }`}
            >
              <div
                className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  activeIndex === index
                    ? "bg-brand-500 text-white shadow-glow"
                    : "bg-surface-800 text-surface-400 border border-surface-700"
                }`}
              >
                {index + 1}
              </div>

              <div className={`text-4xl mb-5 transition-transform duration-500 ${activeIndex === index ? "scale-110" : ""}`}>
                {step.icon}
              </div>

              <h3 className="text-white font-bold text-xl mb-3">{step.titulo}</h3>
              <p className="text-surface-400 text-sm leading-relaxed">{step.descripcion}</p>

              {activeIndex === index && (
                <div className="mt-6 h-0.5 bg-surface-700 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full animate-[progress_2.8s_linear]" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-8 bg-brand-500" : "w-2 bg-surface-700 hover:bg-surface-600"
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
