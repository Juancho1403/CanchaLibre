import { HomePage } from "../src/Pages/_IndexHomePage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "../src/context/userContext";
import { IndexLogin } from "../src/Pages/_IndexLogin";
import { IndexRegister } from "../src/Pages/_IndexRegister";
import { IndexDashboard } from "./RouteProfile";
import { IndexProfile } from "../src/Pages/_IndexProfile";
import { PaginaDeError } from "../src/Pages/PaginaDeError";
import { PaginaDeCarga } from "../src/Pages/PaginaDeCarga";
import { IndexReserva } from "../src/Components/Profile/Socio/Reservas/_IndexReserva";
import PublicShell from "../src/Layout/PublicShell";
import ExplorePage from "../src/Pages/ExplorePage";
import FieldDetailPage from "../src/Pages/FieldDetailPage";
import CheckoutPage from "../src/Pages/CheckoutPage";
import SuccessPage from "../src/Pages/SuccessPage";
import CommunityPage from "../src/Pages/CommunityPage";
import AdminDashboardPage from "../src/Pages/AdminDashboardPage";
import { NavBar } from "../src/Components/NavBar";

//verificar disponibilidad de canchas y reservar
import { VisualizarHorarios } from "../src/Components/Socio/VisualizarHorarios";
import CalendarioReservasSocio from "../src/Components/Socio/CalendarioReservasSocio";
import { VisualizarEmpresas } from "../src/Components/Socio/VisualizarEmpresas";
import { VisualizarCanchas } from "../src/Components/Socio/VisualizarCanchas";
import ListarSociosPage from "../src/Pages/_ListarSocios";
import ListarEmpresasPage from "../src/Pages/_ListarEmpresas";
import ListarCanchasPage from "../src/Pages/_ListarCanchas";


import  {ElegirCanchaPropietario} from "../src/Components/Profile/Propietario/administracion/ElegirCanchaPropietario";
import ButtonsPropietario from "../src/Components/Profile/Propietario/administracion/ButtonsPropietario";
import { CrearCancha } from "../src/Components/Profile/Propietario/administracion/CrearCancha";



//Dia de la semana
import SelectorDeDias from "../src/Components/Socio/VisualizarDiasSemana";


//notificaciones
import { NotificacionesSocio } from "../src/Components/Profile/Socio/Notificaciones/Notificaciones";

//reservas de cancha
import { ReservasPropietarios } from "../src/Components/Profile/Propietario/Reservas/ReservasPropietario";
import { Reservas } from "../src/Pages/_Reservas";

//import { RegistrarReserva } from './Pages/Socio/RegistrarReserva'

export default function AppRoutes() {
  const { user, isLoggedIn } = useAppContext();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route element={<PublicShell />}>
            <Route path="/explorar" element={<ExplorePage />} />
            <Route path="/cancha/:id" element={<FieldDetailPage />} />
            <Route path="/comunidad" element={<CommunityPage />} />
          </Route>

          <Route
            path="/checkout"
            element={
              <>
                <NavBar />
                <CheckoutPage />
              </>
            }
          />
          <Route
            path="/reserva/confirmacion"
            element={
              <>
                <NavBar />
                <SuccessPage />
              </>
            }
          />

          <Route path="/dashboard" element={<IndexDashboard />} />

          <Route
            path="/admin"
            element={
              isLoggedIn && user?.rol === "administrador" ? (
                <AdminDashboardPage />
              ) : isLoggedIn ? (
                <Navigate to="/perfil" replace />
              ) : (
                <Navigate to="/ingresar" replace />
              )
            }
          />

          <Route
            path="/perfil"
            element={isLoggedIn && user ? (<IndexProfile />) : (<Navigate to="/ingresar" />)}
          />

          <Route
            path="/ingresar"
            element={!user ? <IndexLogin /> : <Navigate to="/" />}
          />
          <Route
            path="/registrar"
            element={
              !isLoggedIn ? <IndexRegister /> : <Navigate to="/perfil" />
            }
          />
          <Route path="/reservas" element={<IndexReserva />} />
          <Route path="/reserva" element={<Reservas />} />

          <Route path="/listar-socios" element={<ListarSociosPage />} />
          <Route path="/listar-empresas" element={<ListarEmpresasPage />} />
          <Route path="/listar-canchas" element={<ListarCanchasPage />} />
          <Route path="/socio/elegirempresa" element={<VisualizarEmpresas />} />
          <Route
            path="/socio/calendario/:idEmpresa/:fecha"
            element={<CalendarioReservasSocio />}
          />
          <Route
            path="/socio/elegircancha/:id/"
            element={<VisualizarCanchas />}
          />
          <Route
            path="/socio/elegirhorario/:id/"
            element={
              <>
                <NavBar />
                <div className="min-h-screen bg-surface-950">
                  <SelectorDeDias />
                </div>
              </>
            }
          />

          <Route
            path="/socio/elegirhorario/:id/:dia"
            element={<VisualizarHorarios/>} 
          />

          


          
          <Route path="/propietario/crearCancha" element={<CrearCancha/>} />
          <Route path="/socio/diasemana" element={
            <>
              <NavBar />
              <div className="min-h-screen bg-surface-950">
                <SelectorDeDias />
              </div>
            </>
          }/>
          <Route path="/notificaciones" element={<NotificacionesSocio/>} />
          
          <Route path="/propietario/administrar_reserva" element={<ElegirCanchaPropietario/>} />
          <Route path='/propietario/buttonPropietario/:id'  element={<ButtonsPropietario/>}/>



          {isLoggedIn && <Route path="*" element={<PaginaDeError />} />}
        </Routes>
      </BrowserRouter>
    </>
  );
}
