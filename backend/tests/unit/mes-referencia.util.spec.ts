import { toMonthKey } from '../../src/modules/invoices/application/mes-referencia.util';

describe('mes-referencia.util', () => {
  it('deve converter formatos comuns para chave numerica', () => {
    expect(toMonthKey('JAN/2024')).toBe(202401);
    expect(toMonthKey('set/2024')).toBe(202409);
    expect(toMonthKey('02/2025')).toBe(202502);
    expect(toMonthKey('2026-03')).toBe(202603);
  });

  it('deve retornar null para formatos invalidos', () => {
    expect(toMonthKey(undefined)).toBeNull();
    expect(toMonthKey('')).toBeNull();
    expect(toMonthKey('foo')).toBeNull();
    expect(toMonthKey('2024/01')).toBeNull();
    expect(toMonthKey('13/2024')).toBeNull();
  });
});
