import React from "react";
import { Link } from "react-router-dom";

const linkClass =
  "px-3 py-2 rounded-lg text-white/95 text-sm sm:text-base font-medium hover:bg-white/10 transition-colors whitespace-nowrap";

export default function ButtonsSocio() {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 py-3 px-2 sm:px-6 max-w-full">
      <Link to="/perfil" className={linkClass}>
        Modificar perfil
      </Link>
      <Link to="/reservas" className={linkClass}>
        Mis reservas
      </Link>
      <Link to="/socio/elegirempresa" className={linkClass}>
        Buscar canchas
      </Link>
      <Link to="/reserva" className={linkClass}>
        Nueva reserva
      </Link>
      <Link to="/notificaciones" className={linkClass}>
        Notificaciones
      </Link>
    </nav>
  );
}
