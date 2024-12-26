module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
}

// jest.setup.js
process.env.MONGODB_URI = 'mongodb+srv://henry:1021@cluster0.cnx3p.mongodb.net/'
jest.setTimeout(30000)