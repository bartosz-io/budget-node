/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter',

  collectCoverage: true,
  collectCoverageFrom: [ "src/**/*.{js,ts}" ],
  coverageReporters: ["lcov", "text-summary"],
};