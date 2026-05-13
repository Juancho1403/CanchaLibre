import React from 'react'
import { NavLink } from 'react-router-dom'

export  function ButtonsPropietario() {
  return (
    <>
      <div className="flex flex-row text-center h-10 items-center text-white text-xl p-8 font-medium font-sans">
        <NavLink to="/perfil" className="mx-5 p-1 px-2 rounded-md hover:text-emerald-700">Modificar Perfil</NavLink>
        <NavLink to="/propietario/administrar_reserva" className="mx-5 p-1 px-2 rounded-md hover:text-emerald-700">Administrar Reservas</NavLink>
        <NavLink to="/notificaciones" className="mx-5 p-1 px-2 rounded-md hover:text-emerald-700">Notificaciones</NavLink>
        <NavLink to="/propietario/crearCancha" className="mx-5 p-1 px-2 rounded-md hover:text-emerald-700">Agregar Cancha</NavLink>

      </div>
    </>
  )
}
