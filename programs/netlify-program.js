const NetlifyAPI = require('netlify');
const BaseProgram = require('./base-program');

class NetlifyProgram extends BaseProgram {
  constructor() {
    super();

    /**
     * Netlify API client
     * @type {NetlifyAPI|null}
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

    if (!this.validateClient()) throw '';
    this.checkProjectDir();
  }

  /**
    * Initialise, set argument variables
    */
   init() {
     const { accessToken, siteId, dir, folder } = this.argv;
     this._client = accessToken ? new NetlifyAPI(accessToken) : null;
     this._siteId = siteId || '';
     this.projectDir = dir || process.cwd();
     this.projectFolder = folder || '';
   }

  /**
   * Check if Netlify API client is successfully initiated
   */
  validateClient() {
    console.log('Checking for Netlify client...');
    if (!this._client) {
      console.log(this.logSymbols.error, this.colors.red('Missing `--accessToken` argument...'));
      return false;
    } else {
      console.log(this.logSymbols.success, 'Netlify client successfully initiated...');
      return true;
    }
  }

  async deploy() {
    try {
      const result = await this._client.deploy(this._siteId, this.deployDir);
      console.log(result);
    } catch (error) {

    }
  }
}

module.exports = NetlifyProgram;