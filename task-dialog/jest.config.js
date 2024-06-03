module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['./src/setupTests.tsx'],
    testMatch: ['./src/**/*.{test,spec}.{ts,tsx}'],
  };
  