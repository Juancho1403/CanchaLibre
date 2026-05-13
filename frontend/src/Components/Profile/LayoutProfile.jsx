import React from "react";
import { useAppContext } from "../../context/userContext";
import ButtonsAdmin from "./Admin/ButtonsAdmin";
import { NavBarUser } from "./NavBarUser";
import { ButtonsPropietario } from "./Propietario/ButtonsPropietario";
import ButtonsSocio from "./Socio/ButtonsSocio";

export function LayoutProfile({ children }) {
  const { user } = useAppContext();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-surface-950 via-surface-900 to-surface-950">
      <div className="w-full border-b border-emerald-600/30 bg-gradient-to-r from-emerald-700 to-emerald-600 shadow-lg shadow-emerald-900/20">
        <div className="max-w-6xl mx-auto flex justify-center">
          {user &&
            (user.rol === "socio" ? (
              <NavBarUser>
                <ButtonsSocio />
              </NavBarUser>
            ) : user.rol === "administrador" ? (
              <NavBarUser>
                <ButtonsAdmin />
              </NavBarUser>
            ) : (
              <NavBarUser>
                <ButtonsPropietario />
              </NavBarUser>
            ))}
        </div>
      </div>
      <div className="w-full flex justify-center flex-1">{children}</div>
    </div>
  );
}
