
const { convertToBucketKey } = require('../../util/aws');

/**
 * AWS Utilities
 */
describe('AWS Utilites', () => {
  let dirPath = '';

  beforeEach(() => {
    dirPath = '/Users/jazzpeh/Documents/Workspaces/project/build';
    filePath = `${dirPath}/assets/image.jpg`;
  });

  /**
   * convertToBucketKey
   */
  describe('convertToBucketKey', () => {
    it('converts the absolute directory value to relative value', () => {
      expect(convertToBucketKey(dirPath, filePath)).toEqual('assets/image.jpg');
    });
  });
});