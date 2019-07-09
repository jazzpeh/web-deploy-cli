const NetlifyAPI = require('netlify');
const Netlify = require('../../util/netlify');
const config = require('config');

/**
 * 1. Netlify Utility
 */
describe('Netlify Utility', () => {
  const netlifyConfig = config.tests.integration.netlify;
  let dir, siteId;
  let netlify;

  beforeEach(() => {
    dir = netlifyConfig.dirPath; 
    siteId = netlifyConfig.siteId;
    netlify = new Netlify(netlifyConfig.credentialDirPath);
  });
  
  /**
   * 2. deploy
   */
  it('should read `accessToken` from yml file and deploy successfully', async () => {
    await netlify.readAccessToken();
    const result = await netlify.deploy(siteId, dir);
    expect(result).toBe(true);
  }, 300000);
});