jest.mock('jose', () => ({
  CompactEncrypt: class {
    setProtectedHeader() {
      return this;
    }
    encrypt() {
      return Promise.resolve('mock-jwe-token');
    }
  },
  compactDecrypt: jest.fn(() =>
    Promise.resolve({
      plaintext: Buffer.from('mock-plaintext'),
    }),
  ),
}));
