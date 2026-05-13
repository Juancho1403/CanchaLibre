import React from "react";
import { NavLink } from "react-router-dom";

export default function ButtonsAdmin() {
  return (
    <>
      <div className="flex flex-row text-center h-10 items-center  text-xl p-6 font-medium font-sans">
        <NavLink
          to="/perfil"
          className="mx-5 p-1 px-2 rounded-md hover:text-emerald-700"
        >
          Perfil
        </NavLink>
        <NavLink
          to="/admin"
          className="mx-5 p-1 px-2 rounded-md hover:text-emerald-700"
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/listar-socios"
          className="mx-5 p-1 px-2 rounded-md hover:text-emerald-700"
        >
          Socios
        </NavLink>
        <NavLink
          to="/listar-empresas"
          className="mx-5 p-1 px-2 rounded-md hover:text-emerald-700"
        >
          Empresas
        </NavLink>
        <NavLink
          to="/listar-canchas"
          className="mx-5 p-1 px-2 rounded-md hover:text-emerald-700"
        >
          Canchas
        </NavLink>
      </div>
    </>
  );
}
