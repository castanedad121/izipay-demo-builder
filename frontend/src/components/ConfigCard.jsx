export default function ConfigCard({
  cfg,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <div
        className="h-24 flex items-center justify-center"
        style={{ background: cfg.primaryColor || "#111" }}
      >
        {cfg.logoUrl ? (
          <img
            src={cfg.logoUrl}
            alt="logo"
            className="h-12 object-contain bg-white/90 px-3 py-2 rounded"
          />
        ) : (
          <div className="text-white text-sm font-semibold">LOGO</div>
        )}
      </div>

      <div className="p-4">
        <div className="font-semibold">{cfg.clientName}</div>
        <div className="text-xs text-zinc-500">{cfg.storeName}</div>

        <div className="mt-3 text-xs text-zinc-600 space-y-1">
          <div className="flex justify-between">
            <span>Productos:</span>
            <span>{(cfg.products || []).length}</span>
          </div>
          <div className="flex justify-between">
            <span>Creado:</span>
            <span>{new Date(cfg.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onView}
            className="bg-black text-white px-3 py-2 rounded-lg text-sm"
          >
            Ver Demo
          </button>
          <button
            onClick={onEdit}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            Editar
          </button>
          <button
            onClick={onDuplicate}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            Duplicar
          </button>
          <button
            onClick={onDelete}
            className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
