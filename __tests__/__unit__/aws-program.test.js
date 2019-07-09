const AWSProgram = require('../../programs/aws-program');
const pmock = require('pmock');
const awsUtil = require('../../util/aws');

/**
 * 1. AWSProgram
 */
describe('AWSProgram', () => {
  let program;

  beforeEach(() => {
    program = new AWSProgram();
  });

  /**
   * 2. verifyOS
   */
  describe('verifyOS', () => {
    let platform;

    beforeEach(() => {
      platform = pmock.platform(process.platform);
    });

    afterEach(() => {
      platform.reset();
    });

    it('should set `os` as per current platform OS (OSX)', () => {
      const os = 'darwin';
      platform = pmock.platform(os);
      expect(program.verifyOS()).toEqual(true);
      expect(program.os).toEqual(program.platformOS[os]);
    });

    it('should set `os` as per current platform OS (WIN)', () => {
      const os = 'win32';
      platform = pmock.platform(os);
      expect(program.verifyOS()).toEqual(true);
      expect(program.os).toEqual(program.platformOS[os]);
    });

    it('should return error if `os` is not supported', () => {
      const os = 'freebsd';
      platform = pmock.platform(os);
      expect(program.verifyOS()).toEqual(false);
      expect(program.os).toBeUndefined();

    });
  });

  /**
   * 3. deploy
   */
  describe('deploy', () => {
    beforeEach(() => {
      program.files = [
        '/build/test1.html',
        '/build/test2.html',
      ];
    });

    it('should return `true` if all files are successfully uploaded', async () => {
      awsUtil.uploadFileToBucket = jest.fn(() => Promise.resolve(true));
      const result = await program.deploy();
      expect(result).toBe(true);
    });

    it('should return `false` if > 1 file(s) is not successfully uploaded', async () => {
      awsUtil.uploadFileToBucket = jest.fn(() => Promise.resolve(false));
      const result = await program.deploy();
      expect(result).toBe(false);
    });
  });

  /**
   * 4. checkBucketName
   */
  describe('checkBucketName', () => {
    beforeEach(() => {
      program.bucket = 'random-test-bucket';
    });

    it('should should create a new bucket since bucket doesn\'t exists', async () => {
      program.checkBucketExist = jest.fn(() => Promise.resolve(false));
      program.createBucketFlow = jest.fn(() => {
        return { 
          location: 'random', 
          indexDoc: 'index.html',
          errDoc: 'error.html'
         };
      });
      program.createWebHostBucket = jest.fn(() => Promise.resolve(true));
      const result = await program.checkBucketName();
      expect(result).toBe(true);
    });

    it('should skip creating bucket if bucket exists', async () => {
      program.checkBucketExist = jest.fn(() => Promise.resolve(true));
      const result = await program.checkBucketName();
      expect(result).toBe(true);
    });
  });
});