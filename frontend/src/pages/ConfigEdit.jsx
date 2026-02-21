import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, post, put } from "../api/http";
import ProductEditor from "../components/ProductEditor.jsx";

const emptyConfig = {
  clientName: "",
  storeName: "",
  logoUrl: "",
  primaryColor: "#ba0352",
  products: [],
};

export default function ConfigEdit({ mode }) {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";
  const [form, setForm] = useState(emptyConfig);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      setLoading(true);
      const data = await get(`/api/configs/${id}`);
      setForm(data);
      setLoading(false);
    })();
  }, [id, isEdit]);

  const total = useMemo(() => {
    const t = (form.products || []).reduce(
      (s, p) => s + Number(p.price || 0),
      0,
    );
    return t.toFixed(2);
  }, [form.products]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    const payload = { ...form };

    // opcional: no permitir guardar publicKey vacío si usarás token session
    // aquí lo dejamos libre, pero para que funcione el pago debes llenarlo.
    if (!payload.clientName || !payload.storeName) {
      alert("Completa Nombre del Cliente y Nombre de la Tienda.");
      return;
    }

    if (isEdit) await put(`/api/configs/${id}`, payload);
    else {
      const created = await post("/api/configs", payload);
      return nav(`/configs/${created.id}`);
    }

    alert("Guardado ✅");
  };

  if (loading)
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 text-sm text-zinc-500">
        Cargando...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            className="text-sm text-zinc-600 hover:underline"
            onClick={() => nav("/")}
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-semibold mt-2">
            {isEdit ? "Editar Configuración" : "Nueva Configuración"}
          </h1>
          <p className="text-sm text-zinc-500">
            Personaliza la demo para tu cliente
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => nav("/")}
            className="border px-4 py-2 rounded-lg text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            Guardar Configuración
          </button>
        </div>
      </div>

      {/* Información básica */}
      <div className="mt-6 bg-white border rounded-xl p-5">
        <h2 className="font-semibold">Información Básica</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-600">
              Nombre del Cliente *
            </label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={form.clientName}
              onChange={(e) => setField("clientName", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-600">
              Nombre de la Tienda *
            </label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              value={form.storeName}
              onChange={(e) => setField("storeName", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="mt-4 bg-white border rounded-xl p-5">
        <h2 className="font-semibold">Branding</h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <div>
            <label className="text-xs text-zinc-600">
              Logo de la Tienda (URL)
            </label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="https://..."
              value={form.logoUrl || ""}
              onChange={(e) => setField("logoUrl", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-600">Color Principal</label>
            <div className="mt-1 flex gap-2 items-center">
              <input
                type="color"
                value={form.primaryColor || "#ba0352"}
                onChange={(e) => setField("primaryColor", e.target.value)}
                className="h-10 w-12 border rounded-lg"
              />
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.primaryColor || ""}
                onChange={(e) => setField("primaryColor", e.target.value)}
              />
            </div>
          </div>
        </div>

        {form.logoUrl ? (
          <div className="mt-4 border rounded-lg p-4 flex justify-center bg-zinc-50">
            <img
              src={form.logoUrl}
              alt="preview"
              className="h-14 object-contain"
            />
          </div>
        ) : null}
      </div>

      {/* Productos */}
      <div className="mt-4 bg-white border rounded-xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Productos</h2>
          <button
            onClick={() =>
              setField("products", [
                ...(form.products || []),
                {
                  id: crypto.randomUUID(),
                  name: "",
                  price: 0,
                  size: "",
                  color: "",
                  imageUrl: "",
                },
              ])
            }
            className="bg-black text-white px-3 py-2 rounded-lg text-sm"
          >
            + Agregar Producto
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {(form.products || []).map((p, idx) => (
            <ProductEditor
              key={p.id}
              index={idx}
              product={p}
              onChange={(next) => {
                const copy = [...form.products];
                copy[idx] = next;
                setField("products", copy);
              }}
              onRemove={() => {
                const copy = [...form.products];
                copy.splice(idx, 1);
                setField("products", copy);
              }}
            />
          ))}
        </div>

        <div className="mt-4 text-sm text-zinc-700">
          <span className="font-semibold">Total:</span> S/ {total}
        </div>
      </div>
    </div>
  );
}
