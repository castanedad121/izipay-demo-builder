export default function ProductEditor({ product, onChange, onRemove, index }) {
  const set = (k, v) => onChange({ ...product, [k]: v });

  return (
    <div className="border rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Producto {index + 1}</div>
        <button
          onClick={onRemove}
          className="text-red-600 text-sm hover:underline"
        >
          Eliminar
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-zinc-600">Nombre *</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            value={product.name || ""}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-zinc-600">Precio *</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            type="number"
            value={product.price ?? 0}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-xs text-zinc-600">Talla</label>
          <select
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-white"
            value={product.size || "NO_APLICA"}
            onChange={(e) => set("size", e.target.value)}
          >
            <option value="NO_APLICA">No Aplica</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-600">Color</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            value={product.color || ""}
            onChange={(e) => set("color", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs text-zinc-600">URL de Imagen</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="https://..."
            value={product.imageUrl || ""}
            onChange={(e) => set("imageUrl", e.target.value)}
          />
        </div>
      </div>

      {product.imageUrl ? (
        <div className="mt-3 border rounded-lg p-3 bg-zinc-50">
          <img
            src={product.imageUrl}
            alt="preview"
            className="h-24 object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}
