// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '**/src/**.js'
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // The root directory that Jest should scan for tests and modules within
  rootDir: 'test',

  // The test environment that will be used for testing
  testEnvironment: 'node'
};
