const { uploadFileToBucket, updateProfile } = require('../../util/aws');
const config = require('config');

/**
 * 1. AWS Utility
 */
describe('AWS Utility', () => {
  /**
   * 2. uploadFileToBucket
   */
  describe('uploadFileToBucket', () => {
    const profile = 'kldevelopment';

    beforeEach(() => {
      updateProfile(profile);
    });

    it('should upload a file to AWS S3 bucket', async () => {
      const { aws } = config.tests.integration;
      const bucket = aws.bucket.name;
      const dirPath = aws.dirPath;
      const fileName = aws.fileName;
      const filePath = `${dirPath}/${fileName}`;
      const bucketFileLocation = `${aws.bucket.url}/${fileName}`;

      const result = await uploadFileToBucket(
        bucket, filePath, dirPath, 
        (data) => expect(data.Location).toEqual(bucketFileLocation), 
        (err) => console.log('debug', err)
      );
      expect(result).toBe(true);
    });
  });
});