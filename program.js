const logSymbols = require('log-symbols');
const commonUtil = require('./util/common');
const colors = require('colors/safe');
const argv = require('yargs').argv;
const SubPrograms = require('./programs');

class Program {
  constructor() {
    /**
     * Type of sub program to run (case insensitive)
     * @type {String} - AWS, Netlify
     */
    this.type = '';

    /**
     * Sub program to run for deployment
     * @type {AWSProgram|NetlifyProgram} 
     */
    this.subProgram = null;
  }

  /**
   * Run program storyboard
   */
  async run() {
    this.init();

    if (argv.version) {
      await this.displayVersion();
      return;
    }

    if (!this.validateSubProgram()) throw '';

    await this.subProgram.run();
  }

  /**
   * Initialise, set argument variables
   */
  init() {
    const { type } = argv;
    this.type = type || '';
  }

  /**
   * Show current package version
   */
  async displayVersion() {
    try {
      const packageData = await commonUtil.readJsonFile(`${__dirname}/package.json`);
      console.log(packageData.version);
    } catch (error) {
      console.log(logSymbols.error, colors.red('Unable to retrieve package version...'));
    }
  }
  
  /**
   * Check type of deployment program to run
   */
  validateSubProgram() {
    console.log('Checking deployment type...');
    
    for(const key in SubPrograms) {
      if (key.toUpperCase().replace('PROGRAM', '') !== this.type.toUpperCase()) continue;
      this.subProgram = new SubPrograms[key];
      break;
    }

    if (this.subProgram) {
      console.log(logSymbols.success, `Deployment type set as ${colors.cyan(`[${this.subProgram.constructor.name.replace('Program', '')}]`)}`);
      return true;
    } else {
      console.log(logSymbols.error, colors.red('Unsupported deployment type found...'));
      return false;
    }
  }
}

module.exports = Program;