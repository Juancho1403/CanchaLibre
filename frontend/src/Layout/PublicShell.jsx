import { Outlet } from "react-router-dom";
import { NavBar } from "../Components/NavBar";
import { Footer } from "../Components/HomePage/Footer";

export default function PublicShell() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}
