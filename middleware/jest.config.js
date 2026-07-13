module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
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
