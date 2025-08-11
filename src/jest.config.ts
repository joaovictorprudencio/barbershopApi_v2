import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Onde ficam seus testes
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.spec.ts'],

  // Para limpar mocks automaticamente entre os testes
  clearMocks: true,

  // Para melhorar a resolução de imports absolutos, se você usar paths no tsconfig.json
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;