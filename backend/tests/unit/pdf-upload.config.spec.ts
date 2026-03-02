import {
  resolvePdfMaxFileSizeBytes,
  resolvePdfMaxFileSizeMb,
} from '../../src/shared/config/pdf-upload.config';

describe('pdf-upload.config', () => {
  it('deve resolver MB corretamente com fallback default', () => {
    expect(resolvePdfMaxFileSizeMb(undefined)).toBe(50);
    expect(resolvePdfMaxFileSizeMb('80')).toBe(80);
  });

  it('deve resolver bytes corretamente', () => {
    expect(resolvePdfMaxFileSizeBytes('1')).toBe(1024 * 1024);
    expect(resolvePdfMaxFileSizeBytes(2)).toBe(2 * 1024 * 1024);
  });
});
