import React from 'react'
import { NavBar } from '../Components/NavBar'
import ListarCanchas from '../Components/Profile/Admin/ListarCanchas'
import { LayoutProfile } from '../Components/Profile/LayoutProfile'

export default function ListarCanchasPage() {
  return (
    <>
            <NavBar/>
            <LayoutProfile>
                <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
                  <ListarCanchas />
                </div>
            </LayoutProfile>
        </>
  )
}
