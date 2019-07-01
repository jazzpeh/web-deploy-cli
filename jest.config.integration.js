const { defaults } = require('jest-config');
const logSymbols = require('log-symbols');

console.log(logSymbols.info, 'Running integration tests....');

module.exports = {
  ...defaults,
  testMatch: null,
  testRegex: './__tests__/__integration__/.*.js$'
};