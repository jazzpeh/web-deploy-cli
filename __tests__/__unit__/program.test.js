const Program = require('../../program');
const pmock = require('pmock');

/**
 * 1. Program
 */
describe('Program', () => {
  let program;

  beforeEach(() => {
    program = new Program();
  });

  /**
   * 2. init()
   */
  describe('init', () => {
    let env, cwd;
    const projectDir = `${__dirname}/hello_world`;

    beforeEach(() => {
      env = pmock.env({});
      cwd = pmock.cwd(projectDir);
    });

    afterEach(() => {
      env.reset();
      cwd.reset();
    });

    it('should set profile based on environment variable `PROFILE`', () => {
      const profile = 'HelloWorld';
      restore = pmock.env({ PROFILE: profile });
      program.init();
      expect(program.profile).toEqual(profile);
    });

    it('should set profile to `default` if environment variable `PROFILE` is not available', () => {
      program.init();
      expect(program.profile).toEqual('default');
    });

    it('should set projectDir based on environment variable `DIR`', () => {
      const dir = `${projectDir}_env_var`;
      restore = pmock.env({ DIR: dir });
      program.init();
      expect(program.projectDir).toEqual(dir);
    });

    it('should set projectDir automatically based on process if environment variable `DIR` is not available', () => {
      program.init();
      expect(program.projectDir).toEqual(projectDir);
    });

    it('should set projectFolder based on environment variable `FOLDER`', () => {
      const folder = 'build'
      restore = pmock.env({ FOLDER: folder });
      program.init();
      expect(program.projectFolder).toEqual(folder);
    });

    it('should set projectFolder to empty string if environment variable `FOLDER` is not available', () => {
      program.init();
      expect(program.projectFolder).toEqual('');
    });
  });

  /**
   * 3. verifyOS
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
   * 4. checkProjectDir
   */
  describe('checkProjectDir', () => {
    let env;
    const projectDir = `${__dirname}/hello_world`;
    const projectFolder = 'build'

    beforeEach(() => {
      env = pmock.env({
        DIR: projectDir,
        FOLDER: projectFolder
      });
    });

    afterEach(() => {
      env.reset();
    });

    it('should show `deployDir` by appending `projectDir` and `projectFolder`', () => {
      program.init();
      program.checkProjectDir();
      expect(program.deployDir).toEqual(`${projectDir}/${projectFolder}`);
    });

    it('show show `deployDir` with same value as `projectDir` if `projectFolder` is empty', () => {
      env = pmock.env({
        DIR: projectDir
      });
      program.init();
      program.checkProjectDir();
      expect(program.deployDir).toEqual(projectDir);
    });
  });
});