const { defaults } = require('jest-config');
const logSymbols = require('log-symbols');

console.log(logSymbols.info, 'Running unit tests....');

module.exports = {
  ...defaults,
  testMatch: null,
  testRegex: './__tests__/__unit__/.*.js$'
};