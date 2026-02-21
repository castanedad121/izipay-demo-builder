import { useNavigate } from "react-router-dom";

export default function Success() {
  const nav = useNavigate();
  const order = `ORD-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="bg-white border rounded-2xl p-8 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-600 text-2xl">✓</span>
        </div>

        <h1 className="text-2xl font-semibold mt-4">¡Gracias por tu compra!</h1>
        <p className="text-sm text-zinc-500 mt-2">
          Tu pedido ha sido confirmado y está siendo procesado
        </p>

        <div className="mt-6 border rounded-xl p-4 bg-zinc-50">
          <div className="text-xs text-zinc-500">Número de Pedido</div>
          <div className="font-semibold">{order}</div>
        </div>

        <button
          onClick={() => nav("/")}
          className="mt-6 w-full bg-black text-white px-4 py-3 rounded-xl text-sm font-medium"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}
