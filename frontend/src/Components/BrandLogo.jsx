import { BRAND } from "../config/brand";

/**
 * Logo horizontal oficial (imagen).
 * @param {string} className — clases del contenedor
 * @param {string} imgClassName — clases de la imagen (altura, etc.)
 */
export function BrandLogoLockup({ className = "", imgClassName = "" }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src={BRAND.logoFull}
        alt={BRAND.name}
        className={`h-8 sm:h-9 w-auto max-w-[min(200px,52vw)] object-contain object-left ${imgClassName}`}
        decoding="async"
      />
    </span>
  );
}

/**
 * Ícono cuadrado (favicon / admin compacto).
 */
export function BrandLogoIcon({ className = "" }) {
  return (
    <img
      src={BRAND.logoIcon}
      alt=""
      width={40}
      height={40}
      className={`rounded-xl object-cover shadow-md ${className}`}
      decoding="async"
    />
  );
}

/**
 * Marca tipográfica (respaldo sin imagen).
 * @param {"dark" | "light"} variant
 */
export function BrandLogo({ variant = "dark", className = "" }) {
  if (variant === "light") {
    return (
      <span className={`font-bold tracking-tight ${className}`}>
        <span className="text-emerald-950">Cancha</span>
        <span className="text-emerald-600">Ya</span>
      </span>
    );
  }
  return (
    <span className={`font-bold ${className}`}>
      <span className="text-white">Cancha</span>
      <span className="text-gradient">Ya</span>
    </span>
  );
}
