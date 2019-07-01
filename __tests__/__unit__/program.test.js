const Program = require('../../program');
const pmock = require('pmock');
const awsUtil = require('../../util/aws');

/**
 * 1. Program
 */
describe('Program', () => {
  let program;

  beforeEach(() => {
    program = new Program();
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
   * 3. checkProjectDir
   */
  describe('checkProjectDir', () => {
    const projectDir = `${__dirname}/hello_world`;
    const projectFolder = 'build'

    beforeEach(() => {
      program.projectDir = projectDir;
      program.projectFolder = projectFolder
    });

    it('should show `deployDir` by appending `projectDir` and `projectFolder`', () => {
      program.checkProjectDir();
      expect(program.deployDir).toEqual(`${projectDir}/${projectFolder}`);
    });

    it('show show `deployDir` with same value as `projectDir` if `projectFolder` is empty', () => {
      program.projectFolder = '';
      program.checkProjectDir();
      expect(program.deployDir).toEqual(projectDir);
    });
  });

  /**
   * 4. deploy
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
});