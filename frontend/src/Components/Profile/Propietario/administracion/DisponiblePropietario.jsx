import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { NavBar } from '../../../Socio/NavBar';
import { CanchasDisponiblesFecha } from '../../../../Services/Canchas'


export default function DisponiblePropietario() {
    const { id } = useParams();
    const [horarios, setHorarios] = useState([])
    const [mostrarContenido, setMostrarContenido] = useState(false);
    const [diaSeleccionado, setDiaSeleccionado] = useState('');
    const [loading, setLoading] = useState(false)


    const diasDeLaSemana = {};
    const nombresDia = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    let num = 0;
    const fechaActual = new Date();

    while (num < 7) {
        const fecha = new Date(fechaActual);

        // Obtiene el día de la semana de la fecha actual y suma ese valor a num
        // para obtener el índice correcto del día de la semana en el array nombresDia
        const diaSemana = fecha.getDay();
        const indiceDia = (diaSemana + num) % 7;

        fecha.setDate(fechaActual.getDate() + num);

        const fechaHoy = fecha.toISOString().slice(0, 10);

        diasDeLaSemana[nombresDia[indiceDia]] = fechaHoy;
        num++;
    }

    const toggleContenido = (dia) => {
        if (diaSeleccionado === dia) {
            setDiaSeleccionado('');
            setMostrarContenido(false);
            cargarCanchas(dia)

        } else {
            setDiaSeleccionado(dia);
            setMostrarContenido(true);
        }

    };

    const cargarCanchas = async (dia) => {
        const mifecha = diasDeLaSemana[dia];
        setLoading(true)
        try {
            let data;
            if (dia) {
                data = await CanchasDisponiblesFecha(id, mifecha);
            } else {
                data = [];
            }
            setHorarios(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }




    return (
        <div className="flex flex-col items-center ">
            <NavBar />
            <div>
                <h1 className="text-2xl font-bold mb-10 mt-10">Selecciona un día de la semana que desea saber la cantidad de horarios disponibles</h1>
            </div>
            <div className="grid grid-cols-7 gap-4">
                {nombresDia.map((dia) => (
                    <button
                        key={dia}
                        className={`p-4 border-2 rounded ${diaSeleccionado === dia ? 'border-blue-500 bg-blue-100 ' : 'border-gray-300 bg-gray-100 hover:bg-red-500'}`}
                        onClick={() => { toggleContenido(dia); cargarCanchas(dia) }}
                    >
                        {dia}
                    </button>
                ))}
                 
            </div>
            {mostrarContenido && 
                        <label htmlFor="horario" className="block text-gray-700 font-bold text-center mt-10">
                            Dia {diaSeleccionado} de la fecha {diasDeLaSemana[diaSeleccionado]}
                        </label>}
            {mostrarContenido && (
    
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    
                    
                    <table style={{ width: "50vw" }} className="divide-gray-800 rounded-lg shadow-lg mt-10 border-10 mb-20">
                        
                        <thead className="bg-gradient-to-r from-blue-300 to-purple-400 text-white mt-20 text-center">
                            <tr>
                                <th scope="col" className="py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Horario
                                </th>
                                <th scope="col" className="px-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {horarios.map((hora, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                    <td className="px-6 py-4 align-top whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{hora.horario}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${hora.estado === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {hora.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}