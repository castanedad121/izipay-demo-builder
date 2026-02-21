import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, post, del } from "../api/http";
import ConfigCard from "../components/ConfigCard.jsx";

export default function AdminList() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await get("/api/configs");
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDuplicate = async (id) => {
    await post(`/api/configs/${id}/duplicate`, {});
    await load();
  };

  const onDelete = async (id) => {
    // simple confirm por ahora (si quieres tu ToastDialog luego lo integramos)
    if (!confirm("¿Eliminar configuración?")) return;
    await del(`/api/configs/${id}`);
    await load();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Panel de Configuración</h1>
          <p className="text-sm text-zinc-500">
            Gestiona las demos personalizadas para tus clientes
          </p>
        </div>

        <button
          onClick={() => nav("/configs/new")}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
        >
          + Nueva Configuración
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-sm text-zinc-500">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-zinc-500">No hay configuraciones.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((cfg) => (
              <ConfigCard
                key={cfg.id}
                cfg={cfg}
                onView={() => nav(`/checkout/${cfg.id}`)}
                onEdit={() => nav(`/configs/${cfg.id}`)}
                onDuplicate={() => onDuplicate(cfg.id)}
                onDelete={() => onDelete(cfg.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
