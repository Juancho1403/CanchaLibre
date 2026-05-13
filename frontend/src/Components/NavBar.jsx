import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/userContext";
import { BrandLogoLockup } from "./BrandLogo";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, setUser, setIsLoggedIn } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const logoutSubmit = () => {
    localStorage.removeItem("token");
    setUser(undefined);
    setIsLoggedIn(false);
    navigate("/ingresar");
    setIsOpen(false);
  };

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="relative text-surface-300 hover:text-white font-medium text-sm transition-colors duration-200 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-400 after:transition-all after:duration-300 hover:after:w-full"
    >
      {children}
    </Link>
  );

  return (
    <>
      {/* Spacer */}
      <div style={{ height: 'var(--nav-height)' }} />
      
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-surface-700/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between" style={{ height: 'var(--nav-height)' }}>
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0 min-w-0">
              <span className="transition-opacity duration-300 group-hover:opacity-90">
                <BrandLogoLockup imgClassName="sm:max-w-[220px]" />
              </span>
            </Link>

            {/* Desktop User Welcome */}
            {user && (
              <div className="hidden md:flex items-center">
                <span className="text-surface-400 text-sm">Bienvenido,</span>
                <span className="ml-2 text-brand-400 font-semibold capitalize">{user.nombre}</span>
              </div>
            )}

            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center gap-6">
              <NavLink to="/explorar">Explorar</NavLink>
              <NavLink to="/comunidad">Comunidad</NavLink>
              {user?.rol === "socio" && <NavLink to="/reservas">Mis reservas</NavLink>}
              {user?.rol === "administrador" && (
                <NavLink to="/admin" className="text-amber-400/90 hover:text-amber-300">
                  Admin
                </NavLink>
              )}
              <NavLink to="/">Inicio</NavLink>
              
              {!user && (
                <>
                  <button
                    className="btn-secondary text-sm py-2 px-5"
                    onClick={() => navigate("/ingresar")}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    className="btn-primary text-sm py-2 px-5"
                    onClick={() => navigate("/registrar")}
                  >
                    <span>Registrarse</span>
                  </button>
                </>
              )}
              
              {user && (
                <>
                  <NavLink to="/perfil">Perfil</NavLink>
                  {user.rol === "socio" && (
                    <>
                      <NavLink to="/reserva">Reservar</NavLink>
                      <NavLink to="/socio/elegirempresa">Buscar Canchas</NavLink>
                    </>
                  )}
                  <button
                    className="text-sm py-2 px-5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200"
                    onClick={logoutSubmit}
                  >
                    Salir
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2 rounded-lg glass border-surface-600 text-surface-300 hover:text-white transition-colors"
              onClick={toggleMenu}
              aria-expanded={isOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`sm:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="glass border-t border-surface-700/50 px-4 py-4 space-y-2">
            {user && (
              <div className="pb-3 mb-3 border-b border-surface-700/50">
                <span className="text-surface-400 text-sm">Hola, </span>
                <span className="text-brand-400 font-semibold capitalize">{user.nombre}</span>
              </div>
            )}
            <Link
              to="/explorar"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 rounded-lg text-surface-300 hover:text-white hover:bg-surface-800/50 transition-all"
            >
              Explorar
            </Link>
            <Link
              to="/comunidad"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 rounded-lg text-surface-300 hover:text-white hover:bg-surface-800/50 transition-all"
            >
              Comunidad
            </Link>
            {user?.rol === "socio" && (
              <Link
                to="/reservas"
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 rounded-lg text-surface-300 hover:text-white hover:bg-surface-800/50 transition-all"
              >
                Mis reservas
              </Link>
            )}
            {user?.rol === "administrador" && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 rounded-lg text-amber-400 hover:bg-surface-800/50 transition-all"
              >
                Admin
              </Link>
            )}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 rounded-lg text-surface-300 hover:text-white hover:bg-surface-800/50 transition-all"
            >
              Inicio
            </Link>
            {!user && (
              <>
                <button
                  className="w-full text-left py-3 px-4 rounded-lg text-surface-300 hover:text-white hover:bg-surface-800/50 transition-all"
                  onClick={() => { navigate("/ingresar"); setIsOpen(false); }}
                >
                  Iniciar Sesión
                </button>
                <button
                  className="w-full text-left py-3 px-4 rounded-lg text-brand-400 hover:bg-brand-500/10 transition-all"
                  onClick={() => { navigate("/registrar"); setIsOpen(false); }}
                >
                  Registrarse
                </button>
              </>
            )}
            {user && (
              <>
                <Link
                  to="/perfil"
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 rounded-lg text-surface-300 hover:text-white hover:bg-surface-800/50 transition-all"
                >
                  Perfil
                </Link>
                {user.rol === "socio" && (
                  <>
                    <Link to="/reserva" onClick={() => setIsOpen(false)} className="block py-3 px-4 rounded-lg text-surface-300 hover:text-white hover:bg-surface-800/50 transition-all">
                      Nueva reserva
                    </Link>
                    <Link to="/socio/elegirempresa" onClick={() => setIsOpen(false)} className="block py-3 px-4 rounded-lg text-surface-300 hover:text-white hover:bg-surface-800/50 transition-all">
                      Buscar canchas
                    </Link>
                    <Link to="/reservas" onClick={() => setIsOpen(false)} className="block py-3 px-4 rounded-lg text-surface-300 hover:text-white hover:bg-surface-800/50 transition-all">
                      Mis reservas
                    </Link>
                  </>
                )}
                <button
                  className="w-full text-left py-3 px-4 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                  onClick={logoutSubmit}
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
