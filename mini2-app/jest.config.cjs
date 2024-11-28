module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'esbuild-jest', // Usa esbuild para transformar JSX/TSX
  },
  extensionsToTreatAsEsm: ['.jsx'], // Se o seu JSX é tratado como ESM
  moduleFileExtensions: ['js', 'jsx', 'mjs'], // Certifique-se de que .jsx está aqui
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library)/)', // Certifique-se de não ignorar pacotes necessários
  ],
};
