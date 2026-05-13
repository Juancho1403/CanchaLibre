import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BrandLogoLockup } from "../BrandLogo";
import { BRAND } from "../../config/brand";
import { USE_LOCAL_STORAGE } from "../../Services/api";
import { resetCanchaYaDemoData } from "../../localDb/resetDemo";

export function Footer() {
  const onResetDemo = () => {
    Swal.fire({
      title: "¿Restablecer datos de prueba?",
      html: `<p class="text-left text-slate-600 text-sm">Se regeneran canchas, reservas y mensajes guardados en este navegador.</p>`,
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Solo canchas y reservas",
      denyButtonText: "Todo (usuarios y sesión)",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#059669",
      denyButtonColor: "#b45309",
    }).then((r) => {
      if (!r.isConfirmed && !r.isDenied) return;
      resetCanchaYaDemoData({ clearUsers: Boolean(r.isDenied) });
      window.location.reload();
    });
  };

  return (
    <footer className="relative border-t border-surface-800/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <BrandLogoLockup imgClassName="max-w-[200px]" />
            </div>
            <p className="text-surface-400 text-sm leading-relaxed max-w-xs">
              {BRAND.tagline} Mapa, filtros y pagos digitales.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Plataforma</h4>
            <ul className="space-y-3">
              {[
                { label: 'Inicio', to: '/' },
                { label: 'Explorar canchas', to: '/explorar' },
                { label: 'Comunidad', to: '/comunidad' },
                { label: 'Registrarse', to: '/registrar' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-surface-400 hover:text-brand-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Soporte</h4>
            <ul className="space-y-3">
              {['Centro de ayuda', 'Términos de uso', 'Política de privacidad'].map((item, i) => (
                <li key={i}>
                  <span className="text-surface-400 hover:text-brand-400 text-sm transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-3">
              <li className="text-surface-400 text-sm">📧 {BRAND.supportEmail}</li>
              <li className="text-surface-400 text-sm">📱 +54 11 1234-5678</li>
              <li className="text-surface-400 text-sm">📍 Valencia, Venezuela</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-surface-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-surface-500 text-sm">
              © {new Date().getFullYear()} {BRAND.legalName}. Todos los derechos reservados.
            </p>
            {USE_LOCAL_STORAGE && (
              <button
                type="button"
                onClick={onResetDemo}
                className="text-surface-500 hover:text-amber-400 text-xs underline-offset-2 hover:underline"
              >
                Restablecer datos demo (local)
              </button>
            )}
          </div>
          <div className="flex gap-4">
            {['GitHub', 'Twitter', 'Instagram'].map((social, i) => (
              <span key={i} className="text-surface-500 hover:text-brand-400 text-sm cursor-pointer transition-colors">
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
