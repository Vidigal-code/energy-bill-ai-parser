import { BadGatewayException } from '@nestjs/common';
import { parseInvoiceExtractionFromText } from '../../src/modules/llm/application/extraction-response.parser';

describe('parseInvoiceExtractionFromText', () => {
  it('deve parsear JSON válido dentro de markdown', () => {
    const parsed = parseInvoiceExtractionFromText(`
\`\`\`json
{
  "numeroCliente": "7204076116",
  "mesReferencia": "JAN/2024",
  "itensFatura": {
    "energiaEletrica": { "quantidadeKwh": 50, "valorRs": 47.75 },
    "energiaSceeSemIcms": { "quantidadeKwh": 456, "valorRs": 232.42 },
    "energiaCompensadaGdi": { "quantidadeKwh": 456, "valorRs": -222.22 },
    "contribIlumPublicaMunicipal": { "valorRs": 49.43 }
  }
}
\`\`\`
`);

    expect(parsed.numeroCliente).toBe('7204076116');
    expect(parsed.mesReferencia).toBe('JAN/2024');
    expect(parsed.itensFatura.energiaEletrica.quantidadeKwh).toBe(50);
  });

  it('deve lançar BadGatewayException para payload inválido', () => {
    expect(() => parseInvoiceExtractionFromText('{"invalid":true}')).toThrow(
      BadGatewayException,
    );
  });
});
