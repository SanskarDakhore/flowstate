module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        diagnostics: {
          ignoreCodes: [1343],
        },
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@babylonjs/core)/)',
  ],
  moduleNameMapper: {
    '^@flowstate/shared$': '<rootDir>/../shared/src/index.ts',
    '^@flowstate/shared/(.*)$': '<rootDir>/../shared/src/$1',
  },
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
