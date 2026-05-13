
import React, { useState, useEffect } from 'react'


import { NavBar } from '../../../NavBar'
import { LayoutProfile } from '../../LayoutProfile'
import { useAppContext } from '../../../../context/userContext'

//traer las notificaciones
import { notificacionesSocio } from '../../../../Services/Socio.jsx'

export const NotificacionesSocio = () => {
    const { user } = useAppContext()

    const [notificaciones, setNotificaciones] = useState([])


   const attributesToShow = ["fecha", "nombre", "tipo"];

const filteredData = notificaciones.map((row) =>
  Object.keys(row)
    .filter((key) => attributesToShow.includes(key))
    .reduce((obj, key) => {
      if (key === 'fecha') {
        const fechaJS = new Date(row[key]);
        const opciones = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        obj[key] = fechaJS.toLocaleString('es-ES', opciones);
      } else {
        obj[key] = row[key];
      }
      return obj;
    }, {})
);


    //traer notificaciones
    const VisualizarNotificaciones = async () => {
        if (user) {

            const notificaciones = await notificacionesSocio(user.id_usuario)
            setNotificaciones(notificaciones)
        }
    }

    useEffect(() => {
        VisualizarNotificaciones()
    }, []);








    return (
        <>
            <NavBar />
            <LayoutProfile>
                <div className='w-1/2'>
                    {notificaciones && filteredData.length > 0 ? (
                        <table className="table-fixed w-full text-sm text-center mt-5 mb-5">
                            <thead>
                                <tr className="text-xl">
                                {Object.keys(notificaciones[0]).map((title, index) => {
                                        return (
                                            <th className="capitalize" key={`${title}_${index}`}>
                                                {title}
                                            </th>
                                        );
                                })}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.reverse().map((row, index) => (
                                    <React.Fragment key={index}>
                                        {row.tipo === "negativo" ? (
                                            <tr className="row   text-lg bg-red-400 hover:bg-red-700">
                                                {Object.values(row).map(
                                                    (item, index) =>
                                                    (
                                                        <td className="break-words normal-case" key={index}>
                                                            {item}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        ) : row.tipo === "positivo" ? (
                                            <tr className="row   text-lg bg-green-400 hover:bg-green-700">

                                                {Object.values(row).map(
                                                    (item, index) =>
                                                    (
                                                        <td className="break-words" key={index}>
                                                            {item}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        ) : (
                                            <tr className="row   text-lg bg-blue-400 hover:bg-blue-700">

                                                {Object.values(row).map(
                                                    (item, index) =>
                                                    (
                                                        <td className="break-words" key={index}>
                                                            {item}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    ) : (<h1>NO HAY NOTIFICACIONES</h1>)}
                </div>
            </LayoutProfile>
        </>
    )
}
