const { uploadFileToBucket, updateProfile } = require('../../util/aws');

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
      const bucket = 'kiatlee-integration-test-bucket';
      const filePath = '/Users/jazzpeh/Documents/Workspaces/kiatlee/erp/webapp/build/_redirects';
      const dirPath = '/Users/jazzpeh/Documents/Workspaces/kiatlee/erp/webapp/build';
      const result = await uploadFileToBucket(
        bucket, filePath, dirPath, 
        (data) => expect(data.Location).toEqual(`https://${bucket}.s3-ap-southeast-1.amazonaws.com/_redirects`), 
        (err) => console.log('debug', err)
      );
      expect(result).toBe(true);
    });
  });
});