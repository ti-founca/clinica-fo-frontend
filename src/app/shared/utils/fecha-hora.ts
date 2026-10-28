const dosDigitos = (n: number) => String(n).padStart(2, '0');

/**
 * Serializa una fecha como `LocalDateTime` (hora local, sin zona), el formato que espera el
 * backend: `2026-09-30T09:15:00`.
 */
export function aFechaHoraLocal(fecha: Date): string {
  return (
    `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}` +
    `T${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}:${dosDigitos(fecha.getSeconds())}`
  );
}

/** Interpreta un `LocalDateTime` del backend como hora local. */
export function desdeFechaHoraLocal(valor: string): Date {
  // Sin sufijo de zona, `Date` interpreta el texto ISO como hora local.
  return new Date(valor);
}

/** Serializa una fecha como `LocalDate` (sin hora), el formato que espera el backend: `2026-09-30`. */
export function aFechaLocal(fecha: Date): string {
  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;
}

/**
 * Interpreta un `LocalDate` del backend como fecha local. No se usa `new Date(valor)` porque
 * un texto `yyyy-MM-dd` se interpreta en UTC y podría mostrarse como el día anterior.
 */
export function desdeFechaLocal(valor: string): Date {
  const [anio, mes, dia] = valor.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}
