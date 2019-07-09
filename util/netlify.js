const NetlifyAPI = require('netlify');
const commonUtil = require('./common');

class Netlify {
  constructor(projectDir) {
    /**
     * Location of credential file
     * @type {String}
     * @private
     */
    this._credentialFilePath = `${projectDir}/.netlify.wdc.yml`;

    /**
     * Netlify API client
     * @type {NetlifyAPI|null}
     * @private
     */
    this._client = null;
  }

  /**
   * Read access token from file
   */
  async readAccessToken() {
    try {
      const result = await commonUtil.readYamlFile(this._credentialFilePath);
      if (!result) throw `Unable to find credential file at ${this._credentialFilePath}`;
      if (!result.accessToken) throw 'Unable to find `accessToken` key in credential file';
      this._client = new NetlifyAPI(result.accessToken);
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Deploy everything in a directory to Netlify
   * @param {String} siteId 
   * @param {String} dir 
   * @param {Function} successCallback 
   * @param {Function} errorCallback 
   */
  async deploy(siteId, dir, successCallback, errorCallback) {
    if (!this._client) throw 'Netlify API client not initialised. Please use `readAccessToken` method first.'
    try {
      const result = await this._client.deploy(siteId, dir);
      if (typeof successCallback === 'function') successCallback(result);
      return true;
    } catch (err) {
      if (typeof errorCallback === 'function') errorCallback(err);
      return false;
    }
  }
}

module.exports = Netlify;