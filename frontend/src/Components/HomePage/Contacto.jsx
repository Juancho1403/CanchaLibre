import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { BRAND } from '../../config/brand';
import { enviarContacto } from '../../Services/Contacto';

export function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    titulo: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nombre === '' || formData.email === '' || formData.titulo === '' || formData.descripcion === '') {
      Swal.fire({
        title: 'Campos incompletos',
        text: "Debe completar todos los campos",
        icon: "warning",
        confirmButtonText: "Entendido",
        timer: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await enviarContacto(formData);

      setFormData({ nombre: '', email: '', titulo: '', descripcion: '' });
      Swal.fire({
        title: '¡Mensaje enviado!',
        text: "Nos comunicaremos contigo pronto",
        icon: "success",
        confirmButtonText: "Perfecto",
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: "Hubo un error al enviar el mensaje",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="py-24 px-4 relative">
      <div className="orb orb-blue w-[400px] h-[400px] -bottom-40 -right-40 opacity-5" />
      
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <span className="text-brand-400 font-semibold text-sm uppercase tracking-wider">Contacto</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-6">
              ¿Tenés alguna <span className="text-gradient">consulta</span>?
            </h2>
            <p className="text-surface-400 text-lg leading-relaxed mb-4">
              ¿Querés que tu complejo esté en {BRAND.name}?
            </p>
            <p className="text-surface-400 text-lg leading-relaxed mb-8">
              ¿Tuviste algún inconveniente? Escribinos y te respondemos a la brevedad.
            </p>
            
            {/* Contact info cards */}
            <div className="space-y-4">
              {[
                { icon: "📧", label: "Email", value: BRAND.supportEmail },
                { icon: "📱", label: "WhatsApp", value: "+54 11 1234-5678" },
                { icon: "🕐", label: "Horario", value: "Lun - Vie, 9:00 - 18:00" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 glass-card p-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-surface-500 text-xs uppercase tracking-wider">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-white mb-6">Envíanos un mensaje</h3>
            <form onSubmit={handleSubmit} id="formularioContacto" className="space-y-5">
              <div>
                <label className="block text-surface-300 font-medium text-sm mb-2">
                  Nombre completo
                </label>
                <input
                  className="input-premium"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-surface-300 font-medium text-sm mb-2">
                  Correo electrónico
                </label>
                <input
                  className="input-premium"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-surface-300 font-medium text-sm mb-2">
                  Asunto
                </label>
                <input
                  className="input-premium"
                  name="titulo"
                  type="text"
                  placeholder="¿En qué podemos ayudarte?"
                  value={formData.titulo}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-surface-300 font-medium text-sm mb-2">
                  Mensaje
                </label>
                <textarea
                  className="input-premium min-h-[120px] resize-none"
                  name="descripcion"
                  placeholder="Escribe tu mensaje aquí..."
                  rows="4"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </div>
              <button
                className={`btn-primary w-full py-4 text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={loading}
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="loading-spinner w-5 h-5 border-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar mensaje
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
