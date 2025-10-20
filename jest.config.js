module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/backend'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'backend/**/*.ts',
    '!backend/**/*.spec.ts',
    '!backend/**/*.test.ts',
    '!backend/main.ts',
    '!backend/test/**',
    '!backend/data-source.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@backend/(.*)$': '<rootDir>/backend/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@migrations/(.*)$': '<rootDir>/migrations/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageThreshold: {
    global: {
      branches: 35,
      functions: 45,
      lines: 35,
      statements: 40,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/backend/test/setup.ts'],
};
