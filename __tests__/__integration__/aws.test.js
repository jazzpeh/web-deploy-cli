const { 
  uploadFileToBucket, 
  updateProfile, 
  bucketExist,
  deleteBucket,
  createBucket,
  setBucketHosting
} = require('../../util/aws');
const config = require('config');
const uuidv1 = require('uuid/v1');

/**
 * 1. AWS Utility
 */
describe('AWS Utility', () => {
  const awsConfig = config.tests.integration.aws;

  beforeEach(() => {
    updateProfile(awsConfig.profile);
  });

  /**
   * 2. uploadFileToBucket
   */
  describe('uploadFileToBucket', () => {
    it('should upload a file to AWS S3 bucket', async () => {
      const bucket = awsConfig.bucket.name;
      const dirPath = awsConfig.dirPath;
      const fileName = awsConfig.fileName;
      const filePath = `${dirPath}/${fileName}`;
      const bucketFileLocation = `${awsConfig.bucket.url}/${fileName}`;

      const result = await uploadFileToBucket(
        bucket, filePath, dirPath, 
        (data) => expect(data.Location).toEqual(bucketFileLocation), 
        (err) => console.log('debug', err)
      );
      expect(result).toBe(true);
    });
  });

  /**
   * 3. bucketExist
   */
  describe('bucketExist', () => {
    it('should return true if AWS S3 bucket exist', async () => {
      const bucket = awsConfig.bucket.name;

      const result = await bucketExist(bucket);
      expect(result).toBe(true);
    });

    it('should return false if AWS S3 bucket does not exist', async () => {
      const result = await bucketExist('any-bucket');
      expect(result).toBe(false)
    });
  });

  /**
   * 4. Bucket Operations
   */
  describe('Bucket Operations', () => {
    let bucketName = `temp-bucket-${uuidv1()}`;
    
    it('should create a new bucket', async () => {
      const result = await createBucket( 
        bucketName, 'ap-southeast-1',
        null, 
        (err) => console.log('debug', err)
      );
      expect(result).toBe(true);
    });

    it('should set the bucket hosting configuration successfully', async () => {
      const result = await setBucketHosting(
        bucketName, 'index.html', 'error.html',
        null,
        (err) => console.log('2. debug', err)
      );
      expect(result).toBe(true);
    });

    it('should delete the created bucket', async () => {
      const result = await deleteBucket(bucketName, 
        null,
        (err) => console.log('debug', err)
      );
      expect(result).toBe(true);
    });
  });
});