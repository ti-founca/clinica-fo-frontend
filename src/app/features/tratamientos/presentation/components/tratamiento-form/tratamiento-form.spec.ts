import { FormControl, FormGroup } from '@angular/forms';
import { finNoAnteriorAInicio } from './tratamiento-form';

const grupo = (fechaInicio: Date | null, fechaFin: Date | null) =>
  new FormGroup({ fechaInicio: new FormControl(fechaInicio), fechaFin: new FormControl(fechaFin) });

describe('finNoAnteriorAInicio', () => {
  it('acepta tratamientos en curso y fechas coherentes', () => {
    expect(finNoAnteriorAInicio(grupo(new Date(2026, 8, 1), null))).toBeNull();
    // Mismo día aunque la hora de fin sea anterior: se compara solo la fecha.
    expect(
      finNoAnteriorAInicio(grupo(new Date(2026, 8, 1, 18), new Date(2026, 8, 1, 9))),
    ).toBeNull();
  });

  it('rechaza una fecha de finalización anterior a la de inicio', () => {
    expect(finNoAnteriorAInicio(grupo(new Date(2026, 8, 10), new Date(2026, 8, 9)))).toEqual({
      fechas: true,
    });
  });
});
