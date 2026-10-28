import { aFechaLocal, desdeFechaLocal } from './fecha-hora';

describe('fechas LocalDate', () => {
  it('serializa sin hora ni zona', () => {
    expect(aFechaLocal(new Date(2026, 8, 1, 23, 59))).toBe('2026-09-01');
  });

  it('interpreta el texto del backend como día local (sin desplazamiento por UTC)', () => {
    const fecha = desdeFechaLocal('2026-09-01');
    expect([fecha.getFullYear(), fecha.getMonth(), fecha.getDate()]).toEqual([2026, 8, 1]);
    expect(aFechaLocal(fecha)).toBe('2026-09-01');
  });
});
