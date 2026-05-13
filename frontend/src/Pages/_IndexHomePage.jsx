import { Contacto } from "../Components/HomePage/Contacto";
import { FeaturedCanchas } from "../Components/HomePage/FeaturedCanchas";
import { Footer } from "../Components/HomePage/Footer";
import { Hero } from "../Components/HomePage/Hero";
import { Pasos } from "../Components/HomePage/Pasos";
import { NavBar } from "../Components/NavBar";

export function HomePage() {
  return (
  <>
    <NavBar />
    <Hero />
    <Pasos />
    <FeaturedCanchas />
    <Contacto />
    <Footer />
  </>
  );
}
