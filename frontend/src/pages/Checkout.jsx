import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, post } from "../api/http";
import CartItem from "../components/CartItem.jsx";

export default function Checkout() {
  const nav = useNavigate();
  const { id } = useParams();
  const [cfg, setCfg] = useState(null);
  const [cart, setCart] = useState([]); // [{...product, qty}]
  const [loadingPay, setLoadingPay] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await get(`/api/configs/${id}`);
      setCfg(c);

      // carrito inicial: 1 por producto
      const initial = (c.products || []).map((p) => ({ ...p, qty: 1 }));
      setCart(initial);
    })();
  }, [id]);

  const total = useMemo(() => {
    return cart
      .reduce((s, p) => s + Number(p.price || 0) * Number(p.qty || 0), 0)
      .toFixed(2);
  }, [cart]);

  const itemsForPayment = useMemo(() => {
    // lo mínimo que necesita backend para calcular
    return cart.map((p) => ({
      id: p.id,
      qty: Number(p.qty || 0),
      price: Number(p.price || 0),
    }));
  }, [cart]);

  const setQty = (idx, val) => {
    const n = Math.max(0, parseInt(val || "0", 10) || 0);
    setCart((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: n };
      return copy;
    });
  };

  const inc = (idx) => setQty(idx, Number(cart[idx].qty || 0) + 1);
  const dec = (idx) => setQty(idx, Math.max(0, Number(cart[idx].qty || 0) - 1));

  const pay = async () => {
    try {
      if (!window.Izipay) {
        alert("SDK de Izipay no cargó. Revisa el script en index.html");
        return;
      }

      // No permitir pagar si todo está en 0
      const hasItems = itemsForPayment.some((i) => i.qty > 0);
      if (!hasItems) {
        alert("Agrega al menos 1 unidad para pagar.");
        return;
      }

      setLoadingPay(true);

      // 1) Build checkout (backend calcula amount con items)
      const built = await post("/api/payments/build-checkout", {
        configId: cfg.id,
        items: itemsForPayment,
      });

      const { iziConfig, keyRSA } = built;

      // 2) Token session
      const tok = await post("/api/payments/token-session", {
        transactionId: iziConfig.transactionId,
        orderNumber: iziConfig.order.orderNumber,
        amount: iziConfig.order.amount,
      });

      // 3) LoadForm
      const checkout = new window.Izipay({ config: iziConfig });

      checkout.LoadForm({
        authorization: tok.token,
        keyRSA,
        callbackResponse: (response) => {
          console.log("IZIPAY RESPONSE:", response);
          if (response?.code === "00") nav("/success");
          else alert(response?.messageUser || "No se completó el pago");
        },
      });
    } catch (e) {
      console.error(e);
      alert(e?.message || "Error inesperado");
    } finally {
      setLoadingPay(false);
    }
  };

  if (!cfg)
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-sm text-zinc-500">
        Cargando...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button
        className="text-sm text-zinc-600 hover:underline"
        onClick={() => nav("/")}
      >
        ← Volver
      </button>

      <div className="mt-2 flex items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Carrito</h1>

        {/* Branding mini */}
        <div className="flex items-center gap-2">
          {cfg.logoUrl ? (
            <img src={cfg.logoUrl} className="h-8 object-contain" />
          ) : null}
          <div
            className="h-3 w-3 rounded-full"
            style={{ background: cfg.primaryColor || "#ba0352" }}
          />
        </div>
      </div>

      <div className="mt-6 bg-white border rounded-2xl p-6">
        {cart.length === 0 ? (
          <div className="text-sm text-zinc-500">No hay productos.</div>
        ) : (
          <div>
            {cart.map((p, idx) => (
              <CartItem
                key={p.id}
                item={p}
                onInc={() => inc(idx)}
                onDec={() => dec(idx)}
                onSetQty={(v) => setQty(idx, v)}
              />
            ))}

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-zinc-600">Total</div>
              <div className="text-2xl font-semibold">S/ {total}</div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => nav("/")}
                className="border px-4 py-2 rounded-lg text-sm w-40"
              >
                ← Volver
              </button>

              <button
                onClick={pay}
                disabled={loadingPay}
                className="text-white px-5 py-3 rounded-xl text-sm font-medium w-56"
                style={{
                  background: cfg.primaryColor || "#ba0352",
                  opacity: loadingPay ? 0.75 : 1,
                }}
              >
                {loadingPay ? "Abriendo pago..." : `Pagar S/ ${total}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
