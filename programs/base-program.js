const colors = require('colors/safe');
const logSymbols = require('log-symbols');
const argv = require('yargs').argv;

class BaseProgram {
  constructor() {
    /**
     * Directory of the project
     * @type {String}
     */
    this.projectDir = '';

    /**
     * Specify if there's any folder to go into
     * @type {String}
     */
    this.projectFolder = '';

    /**
     * Directory where all files are kept to deploy
     * @type {String}
     */
    this.deployDir = '';

    /**
     * Extend logSymbol library
     * @type {logSymbols}
     */
    this.logSymbols = logSymbols;

    /**
     * Extend colors library
     * @type {colors}
     */
    this.colors = colors;

    /**
     * Extend console arguments library
     * @type {argv}
     */
    this.argv = argv;
  }

  /**
   * Request for absolute project path
   */
  checkProjectDir() {
    console.log('Checking for project directory to deploy...');
    this.deployDir = this.projectDir + (this.projectFolder ? `/${this.projectFolder}` : '');
    console.log(logSymbols.success, `Project directory set as ${colors.cyan(`[${this.deployDir}]`)}.`);
  }
}

module.exports = BaseProgram;