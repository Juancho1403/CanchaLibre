import React, { useEffect, useState } from "react";
import {
  deleteEmpresa,
  modifyEmpresa,
  obtenerEmpresas,
  obtenerSocios,
} from "../../../Services/Admin";
import { registerEmpresa } from "../../../Services/Empresa";
import TableLayout from "../TableLayout";
import { FormEditEmpresa } from "./FormEditEmpresa";
import Swal from "sweetalert2";
const initialEmpresa = {
  id: "",
  nombre: "",
  direccion: "",
  telefono: "",
};

export function ListarEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [empresa, setEmpresa] = useState(initialEmpresa);
  const [modify, setModify] = useState(false);
  const [create, setCreate] = useState(false);
  const [cargar, setCargar] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [emps, users] = await Promise.all([obtenerEmpresas(), obtenerSocios()]);
        if (cancelled) return;
        const uMap = new Map((Array.isArray(users) ? users : []).map((u) => [u.id_usuario, u]));
        const enriched = (Array.isArray(emps) ? emps : []).map((e) => {
          const owner = uMap.get(e.id_usuario);
          const propietario_label = owner
            ? `${owner.nombre} · ${owner.email} · rol: ${owner.rol}`
            : `ID usuario ${e.id_usuario} (no encontrado en listado)`;
          return { ...e, propietario_label };
        });
        setEmpresas(enriched);
      } catch (error) {
        if (!cancelled) console.error(error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cargar]);

  const handleEditEmpresa = (row) => {
    setCreate(false);
    setModify(true);
    setEmpresa(row);
  };

  const handleSaveEmpresa = (values) => {
    modifyEmpresa(values).then((data) => {
      setModify(!modify);
      setCargar(!cargar);
    });
    setEmpresa(initialEmpresa);
  };

  const handleDeleteEmpresa = (value) => {
    Swal.fire({
      title: `Seguro que desea eliminar la empresa ${value.nombre}?`,
      text: "No podras revertir esta accion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEmpresa(value).then((data) => {
          setCargar(!cargar);
          Swal.fire("Eliminada!", "La empresa ah sido eliminada.", "success");
        });
      }
    });
  };

  async function handleCreateEmpresa(values) {
    const response = await registerEmpresa(values);
    console.log("Empresa Creada", response);
    setCreate(false);
    setCargar(!cargar);
  }

  

  const handleCancel = () => {
    if (modify) {
      setModify(false);
    }
    if (create) {
      setCreate(false);
    }
  };

  return (
    <>
      <ScrollButton />
      <div className="flex flex-col ">
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 text-center w-full mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Lista de empresas</h1>
          <button
            className="font-medium font-sans rounded-xl px-5 py-3 bg-gradient-to-tr from-emerald-500 to-blue-400 hover:from-emerald-400 hover:to-blue-500 text-white shadow-lg"
            onClick={() => {
              setCreate(true);
            }}
          >
            Agregar Empresa
          </button>
        </div>

        <TableLayout
          data={empresas}
          onEdit={handleEditEmpresa}
          onDelete={handleDeleteEmpresa}
          variant="empresas"
        />
        {modify && (
          <div className="fixed top-24 right-0 left-0 bottom-0 bg-black bg-opacity-70">
            <FormEditEmpresa
              onSave={handleSaveEmpresa}
              empresa={empresa}
              title={"Modificar Empresa"}
              cancel={handleCancel}
            />
          </div>
        )}

        {create && (
          <div className="fixed top-24 right-0 left-0 bottom-0 bg-black bg-opacity-70">
            <FormEditEmpresa
              onSave={handleCreateEmpresa}
              empresa={undefined}
              title={"Agregar Empresa"}
              cancel={handleCancel}
            />
          </div>
        )}
      </div>
    </>
  );
}


export function ScrollButton() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button className="fixed-button" onClick={handleClick}>
      Volver arriba
    </button>
  );
}