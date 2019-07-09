const Netlify = require('../../util/netlify');
const commonUtil = require('../../util/common');

/**
 * 1. Netlify Utility
 */
describe('Netlify Utility', () => {
  let netlify = null;

  beforeEach(() => {
    netlify = new Netlify();
  });

  /**
   * 2. readAccessToken
   */
  describe('readAccessToken', () => {
    it('should initialise Netlify API client successsfully', () => {
      commonUtil.readYamlFile = jest.fn(() => Promise.resolve({ accessToken: '12345' }));
      expect(async () => {
        await netlify.readAccessToken();
      }).not.toThrow();
    });

    it('should throw error if credential file is not found', () => {
      commonUtil.readYamlFile = jest.fn(() => Promise.resolve());
      expect(netlify.readAccessToken()).rejects.toThrow(/credential file/);
    });

    it('should throw error if accessToken key is not found', () => {
      commonUtil.readYamlFile = jest.fn(() => Promise.resolve({ randomKey: '12345' }));
      expect(netlify.readAccessToken()).rejects.toThrow(/accessToken/);
    });
  });

});