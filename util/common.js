const { ConsoleFontColors } = require('./constants');

/**
 * Make error message appear red in console
 * @param {string} msg 
 */
const errorConsoleMsg = msg => {
  return `${ConsoleFontColors.RED}${msg}`;
}; 

/**
 * Make info message appear cyan in console
 * @param {string} msg 
 */
const infoConsoleMsg = msg => {
  return `${ConsoleFontColors.CYAN}${msg}`;
}; 

module.exports = {
  errorConsoleMsg,
  infoConsoleMsg
};