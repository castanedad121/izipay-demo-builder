export default function CartItem({ item, onInc, onDec, onSetQty }) {
  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="h-20 w-20 rounded-lg bg-zinc-100 overflow-hidden flex items-center justify-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs text-zinc-400">Sin imagen</span>
        )}
      </div>

      <div className="flex-1">
        <div className="flex justify-between gap-3">
          <div>
            <div className="font-semibold">{item.name}</div>
            <div className="text-xs text-zinc-500">
              {item.size ? `Talla: ${item.size}` : ""}{" "}
              {item.color ? `• Color: ${item.color}` : ""}
            </div>
          </div>
          <div className="font-semibold">
            S/ {Number(item.price || 0).toFixed(2)}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onDec} className="h-9 w-9 border rounded-lg">
              −
            </button>
            <input
              value={item.qty}
              onChange={(e) => onSetQty(e.target.value)}
              className="h-9 w-14 border rounded-lg text-center"
              inputMode="numeric"
            />
            <button onClick={onInc} className="h-9 w-9 border rounded-lg">
              +
            </button>
          </div>

          <div className="text-sm text-zinc-700">
            Subtotal:{" "}
            <span className="font-semibold">
              S/ {(Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
