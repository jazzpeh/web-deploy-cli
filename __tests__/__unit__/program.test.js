const Program = require('../../program');
const pmock = require('pmock');
const awsUtil = require('../../util/aws');
const commonUtil = require('../../util/common');

/**
 * 1. Program
 */
describe('Program', () => {
  let program;

  beforeEach(() => {
    program = new Program();
  });

   /**
   * 2. displayVersion
   */
  describe('displayVersion', () => {
    it('should output the version of the package in console', async () => {
      const packageData = { version: '1.0.0' };
      commonUtil.readJsonFile = jest.fn(() => Promise.resolve(packageData));
      console.log = jest.fn();
      await program.displayVersion();
      expect(console.log.mock.calls[0][0]).toBe(packageData.version);
    });
  });

  /**
   * 3. validateSubProgram
   */
  describe('validateSubProgram', () => {
    it('should return `true` if type is supported', () => {
      program.type = 'AWS';
      const result = program.validateSubProgram();
      expect(result).toBe(true);
    });

    it('should return `false` if type unsupported', () => {
      program.type = 'RANDOM';
      const result = program.validateSubProgram();
      expect(result).toBe(false);
    });
  });
});