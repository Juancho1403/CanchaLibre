import React from "react";
import { NavBar } from "../Components/NavBar";
import { DatosPersonales } from "../Components/Profile/DatosPersonales";
import { ImagenYrecursos } from "../Components/Profile/ImagenYrecursos";
import { LayoutProfile } from "../Components/Profile/LayoutProfile";

export function IndexProfile() {
  return (
    <>
      <NavBar />
      <LayoutProfile>
        <div className="w-full max-w-6xl mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-14 items-start mt-6 lg:mt-10">
            <DatosPersonales />
            <div className="lg:sticky lg:top-28">
              <ImagenYrecursos />
            </div>
          </div>
        </div>
      </LayoutProfile>
    </>
  );
}
