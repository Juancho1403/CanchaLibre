import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export function PaginaDeError() {
    const location = useLocation();
    return (
        <>
            <div className='flex flex-col space-y-6 justify-center font-bold items-center text-center text-5xl h-screen'>
                <h1 className=''>PAGINA NO ENCONTRADA</h1>
                <h2 className='text-8xl'>ERROR 404</h2>
                <h3 className='text-2xl'>La siguiente direccion:   {location.pathname + location?.search } , no se encontro</h3>
                 <Link to="/"><button className='text-2xl uppercase bg-slate-500 py-3 px-5 rounded-lg'>Volver al home</button></Link> 
            </div>
        </>
    )
}
