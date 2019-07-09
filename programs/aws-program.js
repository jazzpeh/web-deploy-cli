const fs = require('fs');
const BaseProgram = require('./base-program');
const awsUtil = require('../util/aws');
const commonUtil = require('../util/common');

class AWSProgram extends BaseProgram {
  constructor() {
    super();
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
     * Config
     * @type {Object|null}
     */
    this.config = null;

    /**
     * OS platform
     * @type {String|null}
     */
    this.os = null;

    /**
     * AWS profile name
     * @type {String}
     */
    this.profile = '';

    /**
     * Stores all files in a directory and readies it for deployment
     * @type {Array<String>}
     */
    this.files = [];

    /**
     * S3 bucket name
     * @type {String}
     */
    this.bucket = '';
  }

  /**
   * Run program storyboard
   */
  async run() {
    this.init();

    if (!this.readConfig()) throw '';
    if (!this.verifyOS()) throw '';
    if (!this.verifyAWSCredential()) return '';
    this.checkProfile();
    this.checkProjectDir();
    if (!await this.checkBucketName()) throw '';
    this.readFiles();
    if (!await this.deploy()) throw '';
  }

  /**
   * Initialise, set argument variables
   */
  init() {
    const { bucket, profile, dir, folder } = this.argv;
    this.bucket = bucket || '';
    this.profile = profile || 'default';
    this.projectDir = dir || process.cwd();
    this.projectFolder = folder || '';
  }

  /**
   * Verify OS platform
   */
  verifyOS() {
    console.log('Verifying system OS...');

    this.os = this.platformOS[process.platform];

    if (!this.os) {
      console.log(this.logSymbols.error, this.colors.red('Unsupported OS found. Exiting program...'));
      return false;
    }

    console.log(this.logSymbols.success, `Supported OS ${this.colors.cyan(`[${this.os}]`)} found.`);
    return true;
  }

  /**
   * Verify if AWS credential file exists
   */
  verifyAWSCredential() {
    console.log('Checking for AWS credentials...');

    const credentialFile = awsUtil.CredentialsFilePath[this.os];

    if (!fs.existsSync(credentialFile)) {
      console.log(this.logSymbols.error, this.colors.red(`Credentials file for AWS not found at default location [${credentialFile}] . Exiting program...`));
      return false;
    }

    console.log(this.logSymbols.success, `Credential file found at ${this.colors.cyan(`[${credentialFile}]`)}.`);
    return true;
  }

  /**
   * Check if AWS profile name is set properly
   */
  checkProfile() {
    console.log('Checking for AWS credentials profile name...');
    awsUtil.updateProfile(this.profile);
    console.log(this.logSymbols.success, `AWS profile set as ${this.colors.cyan(`[${this.profile}]`)}.`);
  };

  /**
   * Read default config
   */
  async readConfig() {
    try {
      this.config = await commonUtil.readJsonFile(`${__dirname}/../config/default.json`);
      return true;
    } catch (error) {
      console.log(this.logSymbols.error, this.colors.red('Unable to read configurations...'));
      return false;
    }
  }

  /**
   * Check bucket name
   */
  async checkBucketName() {
    console.log('Checking for AWS S3 bucket name...');
    if (!this.bucket) {
      console.log(this.logSymbols.error, this.colors.red('No AWS S3 bucket name found...'));
      console.log(this.logSymbols.info, `Please use ${this.colors.cyan('--bucket')} to set the bucket name`);
      return false;
    }

    console.log(this.logSymbols.success, `Bucket name ${this.colors.cyan(`[${this.bucket}]`)} found.`);

    if (!await this.checkBucketExist()) {
      const data = await this.createBucketFlow();
      if (!data) return false;
      if (!await this.createWebHostBucket(data)) return false;
    }

    console.log(this.logSymbols.success, `Bucket set as ${this.colors.cyan(`[${this.bucket}]`)}.`);
    return true;
  }

  /**
   * Check if bucket exists in AWS
   */
  async checkBucketExist() {
    console.log('Validating AWS S3 bucket...');
    if (await awsUtil.bucketExist(this.bucket)) return true;
    else {
      console.log(this.logSymbols.warning, `Bucket ${this.colors.yellow(`[${this.bucket}]`)} not found in AWS.`);
      return false;
    }
  }

  /**
   * Create bucket flow
   */
  async createBucketFlow() {
    let answers = null;

    const confirm = await inquirer.prompt({
      type: 'confirm',
      name: 'create',
      message: 'Create a new AWS S3 web hosting bucket?',
      default: false
    });

    if (!confirm.create) return answers;

    answers = await inquirer.prompt([
      {
        name: 'location',
        type: 'list',
        message: 'Select region:',
        choices: this.config.aws.regions.map(r => `${r.name} [${r.value}]`)
      },
      {
        name: 'indexDoc',
        default: 'index.html',
        message: 'Enter index document:'
      },
      {
        name: 'errDoc',
        default: 'error.html',
        message: 'Enter error document:'
      }
    ]);

    return answers;
  }

  /**
   * Create bucket with web hosting settings
   */
  async createWebHostBucket(data) {
    const { location, indexDoc, errDoc } = data;
    let result = await awsUtil.createBucket(this.bucket, commonUtil.inbetweenSquareBrackets(location),
      null,
      (err) => console.log(this.logSymbols.error, this.colors.red(`Unable to create bucket. Failed at creating bucket...${err}`))
    );

    if (!result) return false;

    result = await awsUtil.setBucketHosting(this.bucket, indexDoc, errDoc,
      null,
      (err) => console.log(this.logSymbols.error, this.colors.red(`Unable to create bucket. Failed at setting hosting configurations...${err}`))
    );

    if (result) {
      console.log(this.logSymbols.success, `Bucket ${this.colors.cyan(`[${this.bucket}]`)} successfully created.`);
    }

    return result;
  }

  /**
   * Get all files and folders structure of the deploy directory
   */
  readFiles() {
    console.log('Reading all files in deploy directory...');
    this.files = commonUtil.readDir(this.deployDir);
    console.log(this.logSymbols.success, `Found ${this.colors.cyan(`[${this.files.length}]`)} files.`);
  }

  /**
   * Deploy files in concurrency mode
   */
  async deploy() {
    console.log('Starting deployment...');

    const uploads = this.files.map(file =>
      awsUtil.uploadFileToBucket(this.bucket, file, this.deployDir,
        (data) => console.log(this.colors.cyan('*'), `${data.location}`, this.logSymbols.success),
        () => console.log(this.colors.red(`* ${file}`, this.logSymbols.error))
      )
    );

    const results = await Promise.all(uploads);
    const successCount = results.filter(r => r).length;
    const errorCount = results.filter(r => !r).length;

    if (successCount === this.files.length) {
      console.log(this.logSymbols.success, `All ${this.colors.cyan(`[${successCount}]`)} files are successfully deployed.`);
      return true;
    } else {
      console.log(this.logSymbols.error, this.colors.red(`Error uploading [${errorCount}] file(s).`));
      return false;
    }
  }
}

module.exports = AWSProgram;