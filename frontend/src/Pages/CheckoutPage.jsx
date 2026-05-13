import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchCatalogoCancha } from "../Services/catalogo";
import {
  createMercadoPagoPreference,
  createPayPalOrder,
  createStripeCheckoutSession,
} from "../Services/payments";
import { parseMetodosPago, acceptsMethod, PAYMENT_LABELS } from "../utils/paymentMethods";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const canchaId = searchParams.get("canchaId");

  const [cancha, setCancha] = useState(null);
  const [banco, setBanco] = useState("");
  const [telefonoPago, setTelefonoPago] = useState("");
  const [referencia, setReferencia] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [tab, setTab] = useState("digital");
  const [payMsg, setPayMsg] = useState(null);
  const [payLoading, setPayLoading] = useState(null);

  useEffect(() => {
    if (!canchaId) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchCatalogoCancha(canchaId);
        if (!cancelled) setCancha(data);
      } catch {
        if (!cancelled) setCancha(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canchaId]);

  const emp = cancha?.Empresa;
  const allowed = parseMetodosPago(emp);
  const hasDigital = ["stripe", "paypal", "mercadopago"].some((m) => allowed.includes(m));
  const hasMovil = allowed.includes("pago_movil");

  useEffect(() => {
    if (!cancha) return;
    const a = parseMetodosPago(cancha.Empresa);
    const d = ["stripe", "paypal", "mercadopago"].some((m) => a.includes(m));
    const m = a.includes("pago_movil");
    if (d && !m) setTab("digital");
    if (!d && m) setTab("movil");
  }, [cancha]);

  const amountUsd = cancha ? Number(cancha.precio) || 25 : 25;

  const onStripe = async () => {
    setPayMsg(null);
    setPayLoading("stripe");
    try {
      const { url } = await createStripeCheckoutSession({
        amountUsd,
        canchaId: canchaId || "",
      });
      if (url) window.location.href = url;
      else setPayMsg("No se recibió URL de Stripe.");
    } catch (e) {
      setPayMsg(e.message || "Error con Stripe");
    } finally {
      setPayLoading(null);
    }
  };

  const onPayPal = async () => {
    setPayMsg(null);
    setPayLoading("paypal");
    try {
      const { approveUrl } = await createPayPalOrder({
        amountUsd,
        canchaId: canchaId || "",
      });
      if (approveUrl) window.location.href = approveUrl;
      else setPayMsg("No se recibió enlace de aprobación PayPal.");
    } catch (e) {
      setPayMsg(e.message || "Error con PayPal");
    } finally {
      setPayLoading(null);
    }
  };

  const onMercadoPago = async () => {
    setPayMsg(null);
    setPayLoading("mp");
    try {
      const { init_point } = await createMercadoPagoPreference({
        unit_price: amountUsd,
        title: `CanchaYa — ${cancha?.nombre || "Reserva"}`,
        currency_id: "USD",
      });
      if (init_point) window.location.href = init_point;
      else setPayMsg("Mercado Pago no devolvió enlace de pago.");
    } catch (e) {
      setPayMsg(e.message || "Error con Mercado Pago");
    } finally {
      setPayLoading(null);
    }
  };

  const onSubmitMovil = (e) => {
    e.preventDefault();
    const ref = referencia.trim() || `RTC-${Date.now()}`;
    navigate(`/reserva/confirmacion?ref=${encodeURIComponent(ref)}&canchaId=${canchaId || ""}`);
  };

  const showDigitalPanel = hasDigital && (!hasMovil || tab === "digital");
  const showMovilPanel = hasMovil && (!hasDigital || tab === "movil");

  return (
    <main className="min-h-screen bg-[#f0faf4] text-slate-900 pt-10 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <Link
          to={canchaId ? `/cancha/${canchaId}` : "/explorar"}
          className="text-sm font-medium text-emerald-800 hover:underline inline-flex items-center gap-1 mb-6"
        >
          ← Volver a la cancha
        </Link>

        <h1 className="text-3xl font-bold text-emerald-950 mb-1">Confirmar reserva</h1>
        <p className="text-slate-600 mb-4">
          Pagá con Stripe (API), PayPal (API) o reportá pago móvil / transferencia con comprobante.
        </p>

        {cancha && (
          <div className="flex flex-wrap gap-2 mb-8">
            {allowed.map((id) => (
              <span
                key={id}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200"
              >
                {PAYMENT_LABELS[id] || id}
              </span>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <section className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-semibold text-emerald-950 mb-4">Resumen</h2>
            {cancha ? (
              <>
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-4">
                  <img
                    src={
                      cancha.imagen_url ||
                      "https://images.unsplash.com/photo-1529900740404-1e2b32b87c48?w=800&q=80"
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-bold text-lg text-slate-900">{cancha.nombre}</p>
                <p className="text-slate-500 text-sm">{cancha.Empresa?.nombre}</p>
                <p className="text-slate-500 text-sm mt-1">{cancha.Empresa?.direccion}</p>
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-sm">
                  <span className="text-slate-600">Total estimado (1 h)</span>
                  <span className="text-2xl font-bold text-emerald-800">
                    {amountUsd.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Cancelación gratuita hasta 24 h antes (política demo).
                </p>
              </>
            ) : (
              <p className="text-slate-500 text-sm">
                Pasá desde el detalle de una cancha con el botón de checkout para ver el resumen.
              </p>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sm:p-8">
            {hasDigital && hasMovil && (
              <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setTab("digital")}
                  className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${
                    tab === "digital" ? "bg-white text-emerald-900 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Pagos digitales
                </button>
                <button
                  type="button"
                  onClick={() => setTab("movil")}
                  className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${
                    tab === "movil" ? "bg-white text-emerald-900 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Reportar pago
                </button>
              </div>
            )}

            {payMsg && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {payMsg}
              </div>
            )}

            {showDigitalPanel && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Configurá <code className="text-xs bg-slate-100 px-1 rounded">STRIPE_SECRET_KEY</code>, PayPal y{" "}
                  <code className="text-xs bg-slate-100 px-1 rounded">MERCADOPAGO_KEY</code> en{" "}
                  <code className="text-xs bg-slate-100 px-1 rounded">backend/.env</code>.
                </p>
                {acceptsMethod(emp, "stripe") && (
                  <button
                    type="button"
                    disabled={payLoading !== null}
                    onClick={onStripe}
                    className="w-full rounded-xl bg-[#635BFF] hover:bg-[#5449e6] text-white font-semibold py-3.5 text-sm disabled:opacity-50"
                  >
                    {payLoading === "stripe" ? "Redirigiendo…" : "Pagar con Stripe (tarjeta)"}
                  </button>
                )}
                {acceptsMethod(emp, "paypal") && (
                  <button
                    type="button"
                    disabled={payLoading !== null}
                    onClick={onPayPal}
                    className="w-full rounded-xl bg-[#0070ba] hover:bg-[#005ea2] text-white font-semibold py-3.5 text-sm disabled:opacity-50"
                  >
                    {payLoading === "paypal" ? "Abriendo PayPal…" : "Pagar con PayPal"}
                  </button>
                )}
                {acceptsMethod(emp, "mercadopago") && (
                  <button
                    type="button"
                    disabled={payLoading !== null}
                    onClick={onMercadoPago}
                    className="w-full rounded-xl bg-[#009ee3] hover:bg-[#0086c3] text-white font-semibold py-3.5 text-sm disabled:opacity-50"
                  >
                    {payLoading === "mp" ? "Abriendo Mercado Pago…" : "Pagar con Mercado Pago"}
                  </button>
                )}
              </div>
            )}

            {showMovilPanel && (
              <form onSubmit={onSubmitMovil} className="space-y-4">
                <h3 className="font-semibold text-emerald-950 text-sm">Reportar pago móvil</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Banco</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={banco}
                      onChange={(e) => setBanco(e.target.value)}
                      placeholder="Banesco"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Teléfono</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={telefonoPago}
                      onChange={(e) => setTelefonoPago(e.target.value)}
                      placeholder="+58 412-0000000"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Referencia</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Fecha</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={fechaPago}
                      onChange={(e) => setFechaPago(e.target.value)}
                    />
                  </div>
                </div>
                <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                  />
                  <span className="text-slate-500 text-sm px-4 text-center">
                    {archivo ? archivo.name : "Adjuntá captura del pago (PNG, JPG o PDF)"}
                  </span>
                </label>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-800 text-white font-semibold py-3 text-sm hover:bg-emerald-900"
                >
                  Registrar comprobante (demo)
                </button>
              </form>
            )}

            {!hasDigital && !hasMovil && (
              <p className="text-sm text-slate-500">No hay métodos de pago configurados para este complejo.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
