import React from 'react'
import { NavBar } from '../Components/NavBar'
import { ListarSocios } from '../Components/Profile/Admin/ListarSocios'
import { LayoutProfile } from '../Components/Profile/LayoutProfile'

export default function ListarSociosPage() {
    return (
        <>
            <NavBar/>
            <LayoutProfile>
                <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
                  <ListarSocios />
                </div>
            </LayoutProfile>
        </>
  )
}
