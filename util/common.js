const { ConsoleFontColors } = require('./constants');

/**
 * Make error message appear red in console
 * @param {string} msg 
 */
const errorConsoleMsg = msg => {
  return `${ConsoleFontColors.RED}${msg}`;
}; 

module.exports = {
  errorConsoleMsg
};