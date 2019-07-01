
const { convertToBucketKey } = require('../../util/aws');

/**
 * AWS Utilities
 */
describe('AWS Utilites', () => {
  let dirPath = '';

  beforeEach(() => {
    dirPath = '/Users/johndoe/Documents/Workspaces/project/build';
    filePath = `${dirPath}/assets/image.jpg`;
  });

  /**
   * convertToBucketKey
   */
  describe('convertToBucketKey', () => {
    it('converts the absolute directory value to relative value', () => {
      expect(convertToBucketKey(filePath, dirPath)).toEqual('assets/image.jpg');
    });
  });
});