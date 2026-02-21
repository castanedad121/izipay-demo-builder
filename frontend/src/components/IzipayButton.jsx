import { useState } from "react";
import { post } from "../api/http";
import { useNavigate } from "react-router-dom";

export default function IzipayButton({ configId, email, label, primaryColor }) {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    setLoading(true);
    try {
      if (!window.Izipay) {
        alert("SDK de Izipay no cargó. Revisa el script en index.html");
        return;
      }

      // 1) Backend arma iziConfig
      const built = await post("/api/payments/build-checkout", {
        configId,
        email,
      });
      const { iziConfig, keyRSA } = built;

      // 2) Token session desde backend
      const tok = await post("/api/payments/token-session", {
        configId,
        transactionId: iziConfig.transactionId,
        orderNumber: iziConfig.order.orderNumber,
        amount: iziConfig.order.amount,
      });

      // 3) Instancia + LoadForm
      const checkout = new window.Izipay({ config: iziConfig });

      checkout.LoadForm({
        authorization: tok.token,
        keyRSA,
        callbackResponse: (response) => {
          console.log("IZIPAY RESPONSE:", response);

          // Para demo: si code === "00" => success
          if (response?.code === "00") nav("/success");
          else alert(response?.messageUser || "No se completó el pago");
        },
      });
    } catch (e) {
      console.error(e);
      alert(e?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={pay}
      className="text-white px-4 py-2 rounded-lg text-sm w-52 flex items-center justify-center gap-2"
      style={{
        background: primaryColor || "#ba0352",
        opacity: loading ? 0.75 : 1,
      }}
    >
      {loading ? "Cargando..." : label}
    </button>
  );
}
