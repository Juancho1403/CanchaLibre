import { Link } from "react-router-dom"

import {useState,useEffect} from 'react'

import { obtenerCanchas } from "../../../../Services/Socio"
import {cancelarReserva, confirmarReserva, listarEmpresaPropietario} from "../../../../Services/Propietario"

import { NavBar } from "../../../NavBar"

import { useAppContext } from "../../../../context/userContext"
import { ButtonsPropietario } from "../ButtonsPropietario"
import { LayoutProfile } from "../../LayoutProfile"
import { obtenerReservas } from "../../../../Services/Reserva"
import Swal from 'sweetalert2'



export const ElegirCanchaPropietario=()=>{

    const { user } = useAppContext()
    const id_usuario= parseInt(user.id_usuario)
    const [reservas, setReservas] = useState([]);
    const [reservasFiltradas, setReservasFiltradas] = useState([]);
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [cargar, setCargar] = useState(false);

    const [empresa,Setempresa]= useState({})
    const [canchas, setCanchas] = useState([])
    const [error, setError]= useState('')
    const [loading, setLoading]= useState(false)


    useEffect(()=>{
        if(user){
            setLoading(true)
            listarEmpresaPropietario(id_usuario)
                .then(data => Setempresa(data))
                .catch(error => setError(error))
                .finally(()=>setLoading(false))
            obtenerReservas()
                .then(data => {
                    setReservas(data);
                    setCargar(true)
                })
        }
    },[cargar])

    useEffect(()=>{
        if(empresa){
            setLoading(true)
            obtenerCanchas(empresa.id_empresa)
                .then(data => setCanchas(data))
                .catch(error => setError(error))
                .finally(()=>setLoading(false))
        }   
    },[empresa])
    
    useEffect(() => {
        if (cargar) {
            let reservasFiltradasTemp = reservas; 
            if (estadoFiltro !== "") {
                reservasFiltradasTemp = reservasFiltradasTemp.filter(reserva => reserva.estado === estadoFiltro);
            }
            setReservasFiltradas(reservasFiltradasTemp); 
        }
    }, [estadoFiltro, reservas])

    if (loading) return <h1>Cargando....</h1>
    if (error) return <h1>Hubo un error</h1>
    
    const handleConfirmar = async (id) => {
        Swal.fire({
            title: 'Confirmar',
            text: '¿Estás seguro de que deseas confirmar la reserva?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await confirmarReserva(id)
                .then(
                    
                    Swal.fire(
                        'Confirmado!',
                        'La reserva ha sido confirmada.',
                        'success'
                    )
                )
                
            } else{
                Swal.fire(
                    'Cancelado',
                    'La reserva no ha sido confirmada',
                    'error'
                )
                
            }
            setCargar(false)
        });
    }
    const handleEliminar = async (id) => {
        Swal.fire({
            title: 'Eliminar',
            text: '¿Estás seguro de que deseas eliminar la reserva?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await cancelarReserva(id)
                .then(
                    
                    Swal.fire(
                        'Confirmado!',
                        'La reserva ha sido confirmada.',
                        'success'
                    )
                )
                
            } else{
                Swal.fire(
                    'Cancelado',
                    'La reserva no ha sido confirmada',
                    'error'
                )
                
            }
            setCargar(false)
        });
    }

    return(
        <>
        <NavBar />
        <LayoutProfile>
            <div className="flex flex-wrap">
                <div className="text-center w-full">
                    <p className=" text-center mt-3 mb-4  "> 
                        <strong className="text-3xl">Visualize el estado de las reservas de cada cancha </strong>
                    </p>
                </div>
                
            <div className="w-full justify-center flex">
                
                <div className="space-x-2">
                <button className="hover:bg-emerald-600 font-sans bg-emerald-500 p-2 rounded-md text-white font-bold" onClick={()=>{setEstadoFiltro("")}}>Todos</button>
                <button className="hover:bg-emerald-600 font-sans bg-emerald-500 p-2 rounded-md text-white font-bold" onClick={()=>{setEstadoFiltro("disponible")}}>Disponible</button>
                <button className="hover:bg-emerald-600 font-sans bg-emerald-500 p-2 rounded-md text-white font-bold" onClick={()=>{setEstadoFiltro("reservado")}}>Pendiente</button>
                <button className="hover:bg-emerald-600 font-sans bg-emerald-500 p-2 rounded-md text-white font-bold" onClick={()=>{setEstadoFiltro("confirmado")}}>Reservado</button>
                </div>
            </div>

            <div className="w-full flex justify-center">
                <table id="tablaReserva" className="table-fixed text-sm text-center mt-5 mb-5 border rounded-xl w-3/4">
                <thead>
                    <tr className='text-xl'>
                        <td className="capitalize">Cancha</td>
                        <td className="capitalize">Horario</td>
                        <td className="capitalize">Fecha</td>
                        <td className="capitalize">Accion</td>
                    </tr>
                </thead>
                <tbody>
                    {reservasFiltradas.length === 0 && (
                        <tr className="row text-lg bg-emerald-100 hover:bg-blue-300">
                            <td colSpan="4">No se encontraron Canchas disponibles con esos parametros</td>
                        </tr>
                    )}
                    {reservasFiltradas?.map(reserva => (
                    <tr  className="row text-lg bg-emerald-100 hover:bg-blue-300">
                        <td className="break-words">{reserva.id_cancha}</td>
                        <td className="break-words">{reserva.horario}</td>
                        <td className="break-words">{reserva.fecha} </td>
                        {reserva.estado === "disponible" ? (
                            <td className="break-words"><button className='font-medium font-sans my-1 border-b-2 border-blue-700' >Reservar</button> </td>
                        ) : (
                            reserva.estado === "reservado" ? (
                                <td className="break-words"><button className='font-medium font-sans my-1 border-b-2 border-blue-700' onClick={()=>handleConfirmar(reserva.id_reserva)}>Confirmar</button> </td>
                            ) : (
                                <td className="break-words"><button className='font-medium font-sans my-1 border-b-2 border-blue-700' onClick={()=>handleEliminar(reserva.id_reserva)}>Eliminar</button> </td>
                            )
                        )}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* <div className='cards m-0 p-0 box-border flex flex-wrap justify-start ml-14 gap-20 '>
                {canchas.length !==0 ? canchas.map((cancha,index)=>(
                    <div className='card p-4 border-4 shadow-lg' key={index}>
                        <img className='border-2 w-60 ' src='../../../public/icons.png' alt="mi cancha"/>
                        <h2 className='mt-8 '><strong>nombre:</strong>{cancha.nombre}</h2>
                        <h2><strong>tipo:</strong>{cancha.tipo}</h2>
                        <h2><strong>precio:</strong>{cancha.precio}</h2>

                        <Link to={`/propietario/buttonPropietario/${cancha.id_cancha}`}>
                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' value={cancha.nombre}>Visualizar canchas</button>
                        </Link>
                    </div>
                )) : <h1 className="mt-10">No hay canchas disponibles en este momento</h1>}
            </div> */}
            </div>
        </LayoutProfile>
        </>

    )

}