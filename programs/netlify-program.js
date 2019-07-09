const Netlify = require('../util/netlify');
const BaseProgram = require('./base-program');

class NetlifyProgram extends BaseProgram {
  constructor() {
    super();

    /**
     * Netlify API client
     * @type {Netlify|null}
     * @private
     */
    this._client = null;

    /**
     * Target site
     * @type {String}
     * @private
     */
    this._siteId = '';
  }

  /**
   * Run program storyboard
   */
  async run() {
    this.init();

    this.checkProjectDir();
    if (!await this.validateClient()) throw '';
    if (!await this.deploy()) throw '';
  }

  /**
    * Initialise, set argument variables
    */
   init() {
     const { siteId, dir, folder } = this.argv;
     this._siteId = siteId || '';
     this.projectDir = dir || process.cwd();
     this.projectFolder = folder || '';
     this._client = this.projectDir ? new Netlify(this.projectDir) : null;
   }

  /**
   * Check if Netlify API client is successfully initiated
   */
  async validateClient() {
    console.log('Checking for Netlify client...');
    if (!this._client) {
      console.log(this.logSymbols.error, this.colors.red('Missing `--accessToken` argument...'));
      return false;
    } else return await this.initClient();
  }

  /**
   * Initialise client
   */
  async initClient() {
    try {
      await this._client.readAccessToken();
      console.log(this.logSymbols.success, 'Netlify client successfully initiated...');
      return true;
    } catch (err) {
      console.log(this.logSymbols.error, this.colors.red(`Unable to initiate Netlify client...${err}`));
      return false;
    }
  }

  /**
   * Deploy
   */
  async deploy() {
    const spinner = this.loader('Starting deployment...').start();

    const result = await this._client.deploy(this._siteId, this.deployDir, 
      () => {
        spinner.stop();
        console.log(this.logSymbols.success, 'All files are successfully deployed.');
      },
      (err) => {
        spinner.stop();
        console.log(this.logSymbols.error, this.colors.red(err));
      });

    return result;
  }
}

module.exports = NetlifyProgram;