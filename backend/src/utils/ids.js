export function makeOrderNumber() {
  return `ORD${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export function makeTransactionId() {
  // Recomendación simple para demo (5-40 alfanumérico)
  return Date.now().toString();
}

// dateTimeTransaction requiere 16 dígitos numéricos
export function makeDateTimeTransaction16() {
  const s = Date.now().toString(); // 13 dígitos
  return (s + "0000000000000000").slice(0, 16);
}
