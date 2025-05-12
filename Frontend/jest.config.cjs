module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom', 
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'cjs'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/?(*.)+(spec|test).(ts|tsx|js|cjs)'],
};