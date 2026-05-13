import { Link, useSearchParams } from "react-router-dom";

export default function SuccessPage() {
  const [params] = useSearchParams();
  const ref = params.get("ref") || params.get("session_id") || "—";
  const canchaId = params.get("canchaId");
  const stripe = params.get("stripe");
  const paypal = params.get("paypal");

  const viaStripe = stripe === "1";
  const viaPaypal = paypal === "1";

  return (
    <main className="min-h-screen bg-[#f0faf4] text-slate-900 pt-16 pb-24 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-700 text-white mb-6 shadow-lg">
          <span className="text-3xl" aria-hidden>
            ✓
          </span>
        </div>
        <h1 className="text-3xl font-bold text-emerald-950 mb-3">
          {viaStripe || viaPaypal ? "¡Pago iniciado / en proceso!" : "Solicitud registrada"}
        </h1>
        <p className="text-slate-600 mb-8">
          {viaStripe && (
            <>
              Stripe procesó el checkout. El identificador de sesión quedó registrado. En producción confirmarías el
              pago vía webhook y crearías la reserva en SQLite.
            </>
          )}
          {viaPaypal && !viaStripe && (
            <>
              Si completaste el flujo en PayPal, el cobro quedará en tu cuenta sandbox. Conectá la captura del webhook
              <code className="mx-1 text-xs bg-white px-1 rounded border">CHECKOUT.ORDER.APPROVED</code> para cerrar la
              reserva.
            </>
          )}
          {!viaStripe && !viaPaypal && (
            <>
              Guardamos tu referencia <span className="text-emerald-900 font-mono font-semibold">{ref}</span>. El
              administrador puede validar el pago móvil desde el panel.
            </>
          )}
        </p>
        <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm p-6 mb-8 text-left space-y-2 text-sm text-slate-600">
          <p>
            <span className="text-slate-500">Referencia / ID:</span>{" "}
            <span className="text-slate-900 font-mono break-all">{ref}</span>
          </p>
          {canchaId && (
            <p>
              <span className="text-slate-500">Cancha ID:</span>{" "}
              <span className="text-slate-900">{canchaId}</span>
            </p>
          )}
          <p className="pt-2 text-xs text-slate-500">
            QR de acceso: enlazalo a la reserva confirmada cuando persistas el pago en base de datos.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/explorar"
            className="rounded-xl bg-emerald-800 text-white font-semibold py-3 px-6 text-center hover:bg-emerald-900"
          >
            Seguir explorando
          </Link>
          <Link
            to="/perfil"
            className="rounded-xl border border-emerald-800 text-emerald-900 font-semibold py-3 px-6 text-center hover:bg-white"
          >
            Ir a mi perfil
          </Link>
        </div>
      </div>
    </main>
  );
}
