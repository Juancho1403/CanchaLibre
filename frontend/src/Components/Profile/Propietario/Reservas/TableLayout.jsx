import React from "react";



export function TableLayout({ data }) {
  const attributesToShow = ["fecha","nombre", "tipo"];


  console.log(data)
  if (!data || data.length === 0) {
    return <p>no tiene ninguna reserva realizada</p>;
  } 
  else{
  // Filtrar los atributos que deseas mostrar
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
    
  return (
    <>

       
        <table className="table-fixed w-full text-sm text-center mb-10">
           {console.log(data)}
          <thead>
            <tr className="text-xl">
              {data && attributesToShow.map((title, index) => (
                <th className="capitalize" key={`${title}_${index}`}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          {data && filteredData.reverse().map((row, index) => {
              // Crear un nuevo objeto con los atributos que deseas pasar a OnDelete
              const onDeleteData = {
                id_usuario: data[data.length - index - 1].id_usuario,
                id_cancha: data[data.length - index - 1].id_cancha,
                id_reserva: data[data.length - index - 1].id_reserva,
              };
              return (
                <React.Fragment key={index}>
                  <tr className="row text-lg bg-emerald-100 hover:bg-blue-300">
                    {Object.values(row).map((item, index) => (
                      <td className="break-words" key={index}>
                        {item}
                      </td>
                    ))}
                    
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
    </>
  )}
}
