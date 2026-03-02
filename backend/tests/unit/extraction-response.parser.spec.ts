import { BadGatewayException } from '@nestjs/common';
import { parseInvoiceExtractionFromText } from '../../src/modules/llm/application/extraction-response.parser';

describe('parseInvoiceExtractionFromText', () => {
  it('deve parsear JSON válido dentro de markdown', () => {
    const parsed = parseInvoiceExtractionFromText(`
\`\`\`json
{
  "Nº DO CLIENTE": "7204076116",
  "Mês de referência": "JAN/2024",
  "Energia Elétrica": { "Quantidade (kWh)": 50, "Valor (R$)": 47.75 },
  "Energia SCEEE s/ICMS": { "Quantidade (kWh)": 456, "Valor (R$)": 232.42 },
  "Energia compensada GD I": { "Quantidade (kWh)": 456, "Valor (R$)": -222.22 },
  "Contrib Ilum Publica Municipal": { "Valor (R$)": 49.43 }
}
\`\`\`
`);

    expect(parsed['Nº DO CLIENTE']).toBe('7204076116');
    expect(parsed['Mês de referência']).toBe('JAN/2024');
    expect(parsed['Energia Elétrica']['Quantidade (kWh)']).toBe(50);
  });

  it('deve lançar BadGatewayException para payload inválido', () => {
    expect(() => parseInvoiceExtractionFromText('{"invalid":true}')).toThrow(
      BadGatewayException,
    );
  });
});
