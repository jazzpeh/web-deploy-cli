const fs = require('fs');
const readline = require('readline');
const logSymbols = require('log-symbols');
const { CredentialsFilePath, updateProfile } = require('./util/aws');
const { readDir } = require('./util/common');
const colors = require('colors/safe');

class Program {
  constructor() {
    /**
     * Readline console
     * @type {readline}
     */
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    /**
     * Platform OS names
     * @type {Object}
     */
    this.platformOS = {
      win32: 'WINDOWS',
      darwin: 'OSX',
      linux: 'LINUX'
    };

    /**
     * OS platform
     * @type {string|null}
     */
    this.os = null;

    /**
     * AWS profile name
     * @type {string}
     */
    this.profile = '';

    /**
     * Directory of the project
     * @type {string}
     */
    this.projectDir = '';

    /**
     * Specify if there's any folder to go into
     * @type {string}
     */
    this.projectFolder = '';

    /**
     * Directory where all files are kept to deploy
     * @type {string}
     */
    this.deployDir = '';

    /**
     * Stores all files in a directory and readies it for deployment
     * @type {Array<string>}
     */
    this.files = [];
  }

  /**
   * Run program storyboard
   */
  async run() {
    this.init();

    if (!this.verifyOS()) return;
    if (!this.verifyAWSCredential()) return;
    this.checkProfile();
    this.checkProjectDir();
    this.readFiles();
  }

  /**
   * Initialise, set process variables
   */
  init() {
    this.profile = process.env.PROFILE || 'default';
    this.projectDir = process.env.DIR || process.cwd();
    this.projectFolder = process.env.FOLDER || '';
  }

  /**
   * Verify OS platform
   */
  verifyOS() {
    console.log('Verifying system OS...');
  
    this.os = this.platformOS[process.platform];
    
    if (!this.os) {
      console.log(logSymbols.error, colors.red('Unsupported OS found. Exiting program...'));
      return false;
    }
    
    console.log(logSymbols.success, `Supported OS ${colors.cyan(`[${this.os}]`)} found.`);
    return true;
  }

  /**
   * Verify if AWS credential file exists
   */
  verifyAWSCredential() {
    console.log('Checking for AWS credentials...');

    const credentialFile = CredentialsFilePath[this.os];

    if (!fs.existsSync(credentialFile)) {
      console.log(logSymbols.error, colors.red(`Credentials file for AWS not found at default location [${credentialFile}] . Exiting program...`));
      return false;
    }

    console.log(logSymbols.success, `Credential file found at ${colors.cyan(`[${credentialFile}]`)}.`);
    return true;
  }

  /**
   * Check if AWS profile name is set properly
   */
  checkProfile() {
    console.log('Checking for AWS credentials profile name...');
    updateProfile(this.profile);
    console.log(logSymbols.success, `AWS profile set as ${colors.cyan(`[${this.profile}]`)}.`);
  };  

  /**
   * Request for absolute project path
   */
  checkProjectDir() {
    console.log('Checking for project directory to deploy...');
    this.deployDir = this.projectDir + (this.projectFolder ? `/${this.projectFolder}` : '');
    console.log(logSymbols.success, `Project directory set as ${colors.cyan(`[${this.deployDir}]`)}.`);
  }

  /**
   * Get all files and folders structure of the deploy directory
   */
  readFiles() {
    console.log('Reading all files in deploy directory...');
    this.files = readDir(this.projectDir);
    console.log(logSymbols.success, `Found ${colors.cyan(`[${this.files.length}]`)} files.`);
  }
}

module.exports = Program;