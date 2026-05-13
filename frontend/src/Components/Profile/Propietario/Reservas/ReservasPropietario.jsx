import { useState, useEffect } from "react"
import { NavBar } from "../../../NavBar"
import { LayoutProfile } from "../../LayoutProfile"
import { useAppContext } from "../../../../context/userContext"

//importar ruta de reservas pendientes
import { reservasPendiente } from "../../../../Services/Propietario"

//tabla de cargas de mis reservas
import {TableLayout} from './TableLayout'



export const ReservasPropietarios = () => {

    const { user } = useAppContext()

    //Agregar reservas
    const [reservas, setReservas] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const reservasPendientes = async () => {
        if (user) {
            setLoading(true)
            const response = await reservasPendiente(user.id_usuario)
                .then(
                    (data) => {
                        setReservas(data)
                        setLoading(false)
                    }
                )
                .catch(
                    (error) => {
                        setError(error)
                        setLoading(false)
                    }
                )
        }
    }

    useEffect(() => {
        reservasPendientes()
    }, []);



    return (
        <>
            <NavBar />
            
                {loading ?
                    (<p>Cargando reservas...</p>)
                    : (
                        <div className="flex flex-col ">
                            <div className="flex justify-center items-center text-center w-full mb-8">
                                <h1 className="text-5xl font-bold">Reservas en sus canchas</h1>
                            </div>
                            {!error ? (
                                <TableLayout
                                    data={reservas}
                                    //OnDelete={handleDelete}
                                />
                                ) : (<p>El servidor no esta disponible</p>)}
                        </div>
                    )}
        </>
    )
}