const fs = require('fs');
const readline = require('readline');
const logSymbols = require('log-symbols');
const awsUtil = require('./util/aws');
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

    /**
     * S3 bucket name
     * @type {string} 
     */
    this.bucket = '';
  }

  /**
   * Run program storyboard
   */
  async run() {
    this.init();

    if (!this.verifyOS()) throw '';
    if (!this.verifyAWSCredential()) return '';
    this.checkProfile();
    this.checkProjectDir();
    if (!this.checkBucket()) throw '';
    this.readFiles();
    if (!await this.deploy()) throw '';
  }

  /**
   * Initialise, set process variables
   */
  init() {
    this.bucket = process.env.BUCKET || '';
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

    const credentialFile = awsUtil.CredentialsFilePath[this.os];

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
    awsUtil.updateProfile(this.profile);
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
   * Check bucket name
   */
  checkBucket() {
    console.log('Checking for AWS S3 bucket name...');
    if (!this.bucket) return false;
    console.log(logSymbols.success, `Bucket set as ${colors.cyan(`[${this.bucket}]`)}.`);
    return true;
  }

  /**
   * Get all files and folders structure of the deploy directory
   */
  readFiles() {
    console.log('Reading all files in deploy directory...');
    this.files = readDir(this.deployDir);
    console.log(logSymbols.success, `Found ${colors.cyan(`[${this.files.length}]`)} files.`);
  }

  /**
   * Deploy files in concurrency mode
   */
  async deploy() {
    console.log('Starting deployment...');

    const uploads = this.files.map(file => 
      awsUtil.uploadFileToBucket(this.bucket, file, this.deployDir, (data) => {
        console.log(colors.cyan('*'), `${data.location}`, logSymbols.success);
      }, () => {
        console.log(colors.red(`* ${file}`, logSymbols.error));
      })
    );
   
    const results = await Promise.all(uploads);
    const successCount = results.filter(r => r).length;
    const errorCount = results.filter(r => !r).length;

    if (successCount === this.files.length) {
      console.log(logSymbols.success, `All ${colors.cyan(`[${successCount}]`)} files are successfully deployed.`);
      return true;
    } else {
      console.log(colors.red(`Error uploading [${errorCount}] file(s).`));
      return false;
    }
  }
}

module.exports = Program;